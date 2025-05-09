'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating code snippets or components based on a prompt.
 *
 * - generateCodeFromPrompt - A function that takes a prompt and returns generated code.
 * - GenerateCodeFromPromptInput - The input type for the generateCodeFromPrompt function.
 * - GenerateCodeFromPromptOutput - The return type for the generateCodeFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeFromPromptInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the desired code snippet or component.'),
  codeContext: z.string().optional().describe('Additional code context to inform generation.'),
});
export type GenerateCodeFromPromptInput = z.infer<typeof GenerateCodeFromPromptInputSchema>;

const GenerateCodeFromPromptOutputSchema = z.object({
  code: z.string().describe('The generated code snippet or component.'),
});
export type GenerateCodeFromPromptOutput = z.infer<typeof GenerateCodeFromPromptOutputSchema>;

export async function generateCodeFromPrompt(input: GenerateCodeFromPromptInput): Promise<GenerateCodeFromPromptOutput> {
  return generateCodeFromPromptFlow(input);
}

const generateCodePrompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeFromPromptInputSchema},
  output: {schema: GenerateCodeFromPromptOutputSchema},
  prompt: `You are an expert code generator. You take a prompt describing a code snippet or component and generate the corresponding code. The generated code will be displayed in a code editor with live preview.

  Prompt: {{{prompt}}}

  {{~#if codeContext}}Context: {{{codeContext}}}{{/if}}`,
});

const generateCodeFromPromptFlow = ai.defineFlow(
  {
    name: 'generateCodeFromPromptFlow',
    inputSchema: GenerateCodeFromPromptInputSchema,
    outputSchema: GenerateCodeFromPromptOutputSchema,
  },
  async input => {
    const {output} = await generateCodePrompt(input);
    return output!;
  }
);
