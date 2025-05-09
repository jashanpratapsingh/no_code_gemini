// src/app/app-actions.ts
'use server';

import { generateCodeFromPrompt, type GenerateCodeFromPromptInput } from '@/ai/flows/generate-code-from-prompt';

export async function handleGenerateCodeAction(prompt: string, codeContext?: string) {
  try {
    const input: GenerateCodeFromPromptInput = { prompt };
    if (codeContext && codeContext.trim() !== "") {
      input.codeContext = codeContext;
    }
    const result = await generateCodeFromPrompt(input);
    return { success: true, code: result.code };
  } catch (error) {
    console.error("Error generating code:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during code generation.";
    return { success: false, error: errorMessage };
  }
}
