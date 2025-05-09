// src/components/CodeEditor.tsx
"use client";

import { Textarea } from '@/components/ui/textarea';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, placeholder = "Generated code will appear here...", readOnly = false }: CodeEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className="h-full w-full flex-1 resize-none font-mono text-sm bg-background border border-border rounded-md p-4 focus:ring-2 focus:ring-ring focus-visible:ring-primary"
      spellCheck="false"
    />
  );
}
