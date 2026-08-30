import React from "react";

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Classic({ className, ...props }) {
  return (
    <>
      <style>{`
        @keyframes loading-ui-classic-fade {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
      `}</style>
      <span
        role="status"
        className={cn("box-border inline-block", className)}
        style={{ width: '1.25rem', height: '1.25rem' }}
        {...props}
      >
        <span
          aria-hidden="true"
          style={{ position: 'relative', display: 'block', width: '100%', height: '100%', top: '50%', left: '50%' }}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              style={{
                position: 'absolute',
                top: '-3.9%',
                left: '-10%',
                height: '8%',
                width: '24%',
                borderRadius: '9999px',
                backgroundColor: 'currentColor',
                transform: `rotate(${index * 30}deg) translate(146%)`,
                animation: "loading-ui-classic-fade 1.2s linear infinite",
                animationDelay: `calc(1.2s / 12 * ${index - 12})`,
              }}
            />
          ))}
        </span>
        <span className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Loading</span>
      </span>
    </>
  );
}
