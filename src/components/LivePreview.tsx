// src/components/LivePreview.tsx
"use client";

import { useEffect, useRef } from 'react';

interface LivePreviewProps {
  htmlContent: string;
  cssContent?: string;
  jsContent?: string;
}

export default function LivePreview({ htmlContent, cssContent = '', jsContent = '' }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const document = iframe.contentWindow.document;
      const fullHtml = `
        <html>
          <head>
            <style>
              body { margin: 0; padding: 8px; font-family: sans-serif; color: var(--foreground); background-color: var(--background); }
              ${cssContent}
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              try {
                ${jsContent}
              } catch (e) {
                console.error("Error in preview script:", e);
                const errorDiv = document.createElement('div');
                errorDiv.style.color = 'red';
                errorDiv.style.position = 'fixed';
                errorDiv.style.top = '10px';
                errorDiv.style.left = '10px';
                errorDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
                errorDiv.style.padding = '10px';
                errorDiv.style.borderRadius = '5px';
                errorDiv.textContent = 'Error in preview: ' + e.message;
                document.body.appendChild(errorDiv);
              }
            </script>
          </body>
        </html>
      `;
      // Use srcDoc for security and to avoid cross-origin issues
      iframe.srcdoc = fullHtml;
    }
  }, [htmlContent, cssContent, jsContent]);

  return (
    <iframe
      ref={iframeRef}
      title="Live Preview"
      className="h-full w-full border border-border bg-background rounded-md"
      sandbox="allow-scripts allow-same-origin" // allow-same-origin is needed for scripts to interact with the iframe's DOM easily
    />
  );
}
