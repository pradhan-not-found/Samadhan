"""
Gemma 4 E2B inference engine for Samadhan.

Loads the multimodal Gemma 4 (edge) checkpoint downloaded via kagglehub and
exposes three capabilities used by the triage pipeline:

  - triage(text)          -> structured category / severity / keywords / priority
  - route(issue, category)-> department routing decision (function-calling style)
  - describe_image(path)  -> hazard analysis of an uploaded photo

The model is loaded in a background thread so the API server starts instantly.
Every public function returns None on failure so callers can fall back to a
deterministic heuristic — the demo must never 500 because of the model.

Loading strategy (constrained hardware: 4GB VRAM laptop GPU, 16GB RAM):
  1. 4-bit NF4 quantization with device_map="auto" — fits ~3GB of weights on
     the GPU and offloads overflow layers to CPU RAM automatically.
  2. If CUDA/bitsandbytes is unavailable, fall back to bfloat16 on CPU.
"""

import json
import re
import threading

MODEL_HANDLE = "google/gemma-4/transformers/gemma-4-e2b"

CATEGORIES = [
    "Road Infrastructure",
    "Sanitation & Water",
    "Electrical & Streetlights",
    "Waste Management",
    "Public Safety",
    "Parks & Environment",
]

DEPARTMENTS = [
    "PWD (Public Works Department)",
    "Water Board (Jal Board)",
    "Electrical Department",
    "Sanitation Department",
    "Parks & Horticulture",
    "Emergency Response / PWD",
]

PRIORITY_COLORS = {
    "High": "#ef4444",
    "Medium": "#f59e0b",
    "Low": "#10b981",
}

# ---------------------------------------------------------------------------
# Model lifecycle
# ---------------------------------------------------------------------------

status = "not_started"   # not_started | loading | ready | failed
status_detail = ""
_model = None
_processor = None
_lock = threading.Lock()


def _load():
    global status, status_detail, _model, _processor
    try:
        import kagglehub
        import torch
        from transformers import AutoProcessor, AutoModelForImageTextToText

        status = "loading"
        model_path = kagglehub.model_download(MODEL_HANDLE)
        print(f"[gemma] Checkpoint at {model_path}")

        _processor = AutoProcessor.from_pretrained(model_path)

        loaded = False
        if torch.cuda.is_available():
            try:
                from transformers import BitsAndBytesConfig

                bnb = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_quant_type="nf4",
                    bnb_4bit_compute_dtype=torch.bfloat16,
                    llm_int8_enable_fp32_cpu_offload=True,
                )
                _model = AutoModelForImageTextToText.from_pretrained(
                    model_path,
                    quantization_config=bnb,
                    device_map="auto",
                    low_cpu_mem_usage=True,
                )
                status_detail = "4-bit NF4, GPU + CPU offload"
                loaded = True
            except Exception as e:
                print(f"[gemma] GPU 4-bit load failed ({e}); falling back to CPU")

        if not loaded:
            _model = AutoModelForImageTextToText.from_pretrained(
                model_path,
                dtype=torch.bfloat16,
                device_map="cpu",
                low_cpu_mem_usage=True,
            )
            status_detail = "bfloat16, CPU"

        _model.eval()
        status = "ready"
        print(f"[gemma] Model ready ({status_detail})")
    except Exception as e:
        status = "failed"
        status_detail = str(e)
        print(f"[gemma] Model load failed: {e}")


def start_loading():
    """Kick off model loading in a daemon thread (idempotent)."""
    global status
    with _lock:
        if status == "not_started":
            status = "loading"
            threading.Thread(target=_load, daemon=True).start()


def is_ready():
    return status == "ready"


# ---------------------------------------------------------------------------
# Generation helpers
# ---------------------------------------------------------------------------

def _generate(messages, max_new_tokens=200):
    """Run one chat turn through Gemma. Returns decoded text or None."""
    if not is_ready():
        return None
    import torch

    with _lock:  # single 4GB GPU: serialize inference
        inputs = _processor.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt",
        ).to(_model.device)
        with torch.inference_mode():
            out = _model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=False,
            )
        new_tokens = out[0][inputs["input_ids"].shape[-1]:]
        return _processor.decode(new_tokens, skip_special_tokens=True).strip()


def _extract_json(text):
    """Pull the first JSON object out of a model response."""
    if not text:
        return None
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None


def _closest(value, allowed, default):
    """Snap a model-produced label onto the allowed vocabulary."""
    if not isinstance(value, str):
        return default
    for item in allowed:
        if value.strip().lower() == item.lower():
            return item
    for item in allowed:
        first = item.split()[0].lower().strip("&(),")
        if first and first in value.lower():
            return item
    return default


# ---------------------------------------------------------------------------
# Public capabilities
# ---------------------------------------------------------------------------

def triage(text):
    """Categorize a citizen report. Returns a dict or None on failure."""
    prompt = f"""You are the AI triage officer for Samadhan, an Indian municipal civic-issue platform.
Analyze the citizen report below and respond with ONLY a JSON object, no other text:

{{
  "category": one of {json.dumps(CATEGORIES)},
  "severity": "Low" | "Medium" | "High (Hazard)",
  "keywords": "3-5 comma-separated keywords from the report",
  "priority": "Low" | "Medium" | "High"
}}

Citizen report: "{text}" """

    raw = _generate(
        [{"role": "user", "content": [{"type": "text", "text": prompt}]}],
        max_new_tokens=160,
    )
    data = _extract_json(raw)
    if not data:
        return None

    priority = _closest(data.get("priority"), ["High", "Medium", "Low"], "Medium")
    return {
        "category": _closest(data.get("category"), CATEGORIES, "Public Safety"),
        "severity": _closest(
            data.get("severity"), ["Low", "Medium", "High (Hazard)"], "Medium"
        ),
        "keywords": str(data.get("keywords", ""))[:120],
        "priority": priority,
        "color": PRIORITY_COLORS[priority],
    }


def route(issue_text, category, issue_id):
    """Pick the responsible department (function-calling style). None on failure."""
    prompt = f"""You are a routing agent with one tool available:

route_issue_to_dept(department: str) — dispatches a civic issue ticket to a municipal department.
Valid departments: {json.dumps(DEPARTMENTS)}

Issue {issue_id} (category: {category}): "{issue_text}"

Choose the correct department and respond with ONLY the tool call as JSON:
{{"tool": "route_issue_to_dept", "department": "<department>"}}"""

    raw = _generate(
        [{"role": "user", "content": [{"type": "text", "text": prompt}]}],
        max_new_tokens=80,
    )
    data = _extract_json(raw)
    if not data:
        return None
    return _closest(data.get("department"), DEPARTMENTS, "Emergency Response / PWD")


def describe_image(image_path):
    """Analyze an uploaded issue photo. Returns a dict or None on failure."""
    if not is_ready():
        return None
    try:
        from PIL import Image

        image = Image.open(image_path).convert("RGB")
        prompt = """You are inspecting a photo attached to a civic-issue report in India.
Respond with ONLY a JSON object:

{
  "pothole": "<0-100 confidence that the photo shows a pothole or road damage>%",
  "water": "<0-100 confidence that the photo shows water leakage or flooding>%",
  "faded": "<0-100 confidence that the photo shows faded road markings or signage>%",
  "description": "one sentence describing the visible civic hazard"
}"""

        raw = _generate(
            [{
                "role": "user",
                "content": [
                    {"type": "image", "image": image},
                    {"type": "text", "text": prompt},
                ],
            }],
            max_new_tokens=160,
        )
        data = _extract_json(raw)
        if not data or "description" not in data:
            return None

        def pct(v):
            m = re.search(r"\d{1,3}(\.\d+)?", str(v))
            return f"{m.group(0)}%" if m else "0%"

        return {
            "pothole": pct(data.get("pothole")),
            "water": pct(data.get("water")),
            "faded": pct(data.get("faded")),
            "description": str(data.get("description"))[:300],
        }
    except Exception as e:
        print(f"[gemma] Image analysis failed: {e}")
        return None
