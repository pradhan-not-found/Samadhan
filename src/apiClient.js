import { supabase } from './supabaseClient';

const originalFetch = window.fetch;

// Helper to use Gemini API directly
async function callGemini(prompt, base64Image = null) {
  const apiKey = localStorage.getItem('samadhan_gemini_key');
  if (!apiKey) return null;

  // Track API Usage
  let usage = parseInt(localStorage.getItem('samadhan_api_usage') || '0', 10);
  localStorage.setItem('samadhan_api_usage', (usage + 1).toString());
  // Dispatch event so profile view updates instantly
  window.dispatchEvent(new Event('storage'));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const contents = [{
    parts: [{ text: prompt }]
  }];

  if (base64Image) {
    contents[0].parts.push({
      inline_data: {
        mime_type: "image/jpeg",
        data: base64Image
      }
    });
  }

  const res = await originalFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });
  
  if (!res.ok) throw new Error("Gemini API error");
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

// Intercept fetch calls
window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.url;
  
  // Only intercept our own API calls
  if (!url.includes('/api/')) {
    return originalFetch(input, init);
  }

  try {
    // 1. GET /api/reports
    if (url.endsWith('/api/reports') && (!init || init.method === 'GET' || !init.method)) {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. POST /api/reports
    if (url.endsWith('/api/reports') && init && init.method === 'POST') {
      const body = JSON.parse(init.body);
      
      // Attempt Auto-Categorization if Gemini key exists
      let category = "Uncategorized";
      let priority = "Low";
      let keywords = "";
      
      if (localStorage.getItem('samadhan_gemini_key')) {
        try {
          const prompt = `Analyze this civic issue report. Text: "${body.text}". 
Respond ONLY with a JSON object in this exact format:
{"category": "Roads/Potholes", "priority": "High", "keywords": "pothole, danger"}`;
          const aiResponse = await callGemini(prompt);
          if (aiResponse) {
             const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
             if (jsonMatch) {
               const aiData = JSON.parse(jsonMatch[0]);
               category = aiData.category || category;
               priority = aiData.priority || priority;
               keywords = aiData.keywords || keywords;
             }
          }
        } catch (e) {
          console.error("Gemini failed during POST /reports", e);
        }
      }

      const ticket_id = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
      
      const { data, error } = await supabase.from('reports').insert([{
        ...body,
        category,
        priority,
        keywords,
        status: 'Pending Triage',
        ticket_id
      }]).select();
      
      if (error) throw error;
      return new Response(JSON.stringify(data[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. PUT /api/reports/:ticket_id
    if (url.includes('/api/reports/') && init && (init.method === 'PUT' || init.method === 'PATCH')) {
      const ticket_id = url.split('/').pop();
      const body = JSON.parse(init.body);
      const { data, error } = await supabase.from('reports').update(body).eq('ticket_id', ticket_id).select();
      if (error) throw error;
      return new Response(JSON.stringify(data[0] || {}), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. GET /api/stats
    if (url.endsWith('/api/stats')) {
      const { data } = await supabase.from('reports').select('*');
      const stats = {
        total_issues: data?.length || 0,
        avg_resolution_days: 2.4, // Mocked for now
        accuracy_pct: 98.4,
      };
      return new Response(JSON.stringify(stats), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 5. POST /api/analyze-image
    if (url.endsWith('/api/analyze-image') && init && init.method === 'POST') {
      const formData = init.body; // This is a FormData object
      const file = formData.get('file');

      // Security: validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({ error: 'Only JPG, PNG, WebP, or GIF images are allowed.' }), { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'Image must be under 10MB.' }), { status: 400 });
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `report-${Date.now()}-${Math.random().toString().substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('reports').upload(fileName, file);
      
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from('reports').getPublicUrl(fileName);
      const image_url = publicUrlData.publicUrl;

      // Analyze with Gemini
      let description = "Attached Photo Evidence";
      let pothole = "Detected";
      
      if (localStorage.getItem('samadhan_gemini_key')) {
        try {
          // Convert file to base64 for Gemini
          const buffer = await file.arrayBuffer();
          const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          
          const prompt = `Analyze this image of a civic issue. Describe what you see in 1-2 sentences. Format as JSON: {"description": "...", "pothole": "Detected/None"}`;
          const aiResponse = await callGemini(prompt, base64);
          if (aiResponse) {
             const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
             if (jsonMatch) {
               const aiData = JSON.parse(jsonMatch[0]);
               description = aiData.description || description;
               pothole = aiData.pothole || pothole;
             }
          }
        } catch(e) {
          console.error("Image analysis failed", e);
        }
      }

      return new Response(JSON.stringify({ image_url, description, pothole }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 6. Categorize & Auto-route
    if (url.includes('/api/categorize') || url.includes('/api/auto-route')) {
      const body = JSON.parse(init.body);
      const isRoute = url.includes('auto-route');
      
      let result = isRoute 
        ? { department: 'Public Works Dept', priority: 'High', confidence: 0.95 }
        : { category: 'Roads/Potholes', confidence: 0.98, keywords: 'pothole, hazard' };

      if (localStorage.getItem('samadhan_gemini_key')) {
         try {
           const prompt = isRoute 
             ? `Route this civic issue to a department (Public Works Dept, Water Board, Electrical Dept, Sanitation). Text: "${body.text}". JSON format: {"department": "...", "priority": "High/Med/Low", "confidence": 0.95}`
             : `Categorize this civic issue. Text: "${body.text}". JSON format: {"category": "Roads/Potholes", "confidence": 0.98, "keywords": "pothole, hazard"}`;
           
           const aiResponse = await callGemini(prompt);
           if (aiResponse) {
             const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
             if (jsonMatch) {
               result = JSON.parse(jsonMatch[0]);
             }
           }
         } catch(e) {}
      }

      return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Default fallback (should not hit here if all routes covered)
    return new Response(JSON.stringify({ error: 'Endpoint not implemented in serverless mode' }), { status: 404 });

  } catch (error) {
    console.error(`Mock API Error for ${url}:`, error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
