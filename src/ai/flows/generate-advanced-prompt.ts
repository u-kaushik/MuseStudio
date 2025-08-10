'use server';

/**
 * @fileOverview Generates advanced prompts based on the MUSE framework and photography settings.
 *
 * - generateAdvancedPrompt - A function that generates a prompt based on the input.
 * - GenerateAdvancedPromptInput - The input type for the generateAdvancedPrompt function.
 * - GenerateAdvancedPromptOutput - The return type for the generateAdvancedPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdvancedPromptInputSchema = z.object({
  morphology: z.string().describe('Details about the morphology of the subject.'),
  uniformity: z.string().describe('Information about the uniformity of the subject.'),
  style: z.string().describe('The desired style of the subject.'),
  essence: z.string().describe('The essence or core concept of the subject.'),
  photography: z.string().describe('Details about the photography settings.'),
  lighting: z.string().describe('Details about the lighting settings.'),
});

export type GenerateAdvancedPromptInput = z.infer<typeof GenerateAdvancedPromptInputSchema>;

const GenerateAdvancedPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated prompt based on the inputs.'),
});

export type GenerateAdvancedPromptOutput = z.infer<typeof GenerateAdvancedPromptOutputSchema>;

export async function generateAdvancedPrompt(input: GenerateAdvancedPromptInput): Promise<GenerateAdvancedPromptOutput> {
  return generateAdvancedPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdvancedPromptPrompt',
  input: {schema: GenerateAdvancedPromptInputSchema},
  output: {schema: GenerateAdvancedPromptOutputSchema},
  prompt: `You are an expert prompt generator for image generation models. Based on the user input, generate a detailed prompt. Use the following information to craft the perfect prompt. 

Morphology: {{{morphology}}}
Uniformity: {{{uniformity}}}
Style: {{{style}}}
Essence: {{{essence}}}
Photography: {{{photography}}}
Lighting: {{{lighting}}}

Generated Prompt: `,
});

const generateAdvancedPromptFlow = ai.defineFlow(
  {
    name: 'generateAdvancedPromptFlow',
    inputSchema: GenerateAdvancedPromptInputSchema,
    outputSchema: GenerateAdvancedPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
