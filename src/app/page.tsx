// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Eye, Loader2, Sparkles, FileText, Tv } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateCodeAction } from './app-actions';

export default function PromptCoderPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [prompt, setPrompt] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('editor');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Prompt is empty', description: 'Please enter a prompt to generate code.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      // Pass current editor content as context if user wants to iterate
      const result = await handleGenerateCodeAction(prompt, editorContent);
      if (result.success && result.code) {
        setGeneratedCode(result.code);
        setEditorContent(result.code); // Also update editor with new code
        toast({ title: 'Code Generated!', description: 'The AI has generated new code based on your prompt.' });
      } else {
        toast({ title: 'Error Generating Code', description: result.error || 'An unknown error occurred.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Generation Failed', description: (error as Error).message || 'Could not connect to AI service.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCode = () => {
    if (!editorContent.trim()) {
      toast({ title: 'Nothing to download', description: 'The editor is empty.', variant: 'destructive' });
      return;
    }
    const element = document.createElement('a');
    // Assuming the generated code is HTML. If not, this needs adjustment.
    // For a "project", this is simplified. Typically you'd zip files.
    const file = new Blob([editorContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'promptcoder_project.html'; // Or index.html
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: 'Code Downloaded', description: 'Check your downloads folder.' });
  };
  
  // Debounce for live preview update
  const [debouncedEditorContent, setDebouncedEditorContent] = useState(editorContent);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEditorContent(editorContent);
    }, 500); // 500ms debounce
    return () => {
      clearTimeout(handler);
    };
  }, [editorContent]);


  if (authLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,56px))] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] p-4 gap-4 md:flex-row">
      {/* Left Panel: Prompt and Controls */}
      <Card className="w-full md:w-1/3 flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary h-6 w-6" /> AI Prompt</CardTitle>
          <CardDescription>Describe the UI or component you want to build.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow gap-4">
          <Textarea
            placeholder="e.g., A responsive hero section with a title, subtitle, and a call-to-action button..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow resize-none text-sm min-h-[200px]"
          />
          <Button onClick={handleGenerateCode} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Code
          </Button>
          <Button onClick={handleDownloadCode} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Project
          </Button>
        </CardContent>
      </Card>

      {/* Right Panel: Editor and Preview */}
      <div className="w-full md:w-2/3 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col shadow-lg rounded-lg border bg-card">
          <TabsList className="grid w-full grid-cols-2 rounded-t-lg rounded-b-none">
            <TabsTrigger value="editor" className="py-3 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
              <FileText className="mr-2 h-4 w-4" /> Code Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="py-3 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
              <Tv className="mr-2 h-4 w-4" /> Live Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="flex-grow p-0 m-0 rounded-b-lg overflow-hidden">
            <CodeEditor
              value={editorContent}
              onChange={setEditorContent}
            />
          </TabsContent>
          <TabsContent value="preview" className="flex-grow p-0 m-0 rounded-b-lg overflow-hidden">
            <LivePreview htmlContent={debouncedEditorContent} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
