'use server';

/**
 * @fileOverview Generates a prompt based on user-selected criteria in basic mode.
 *
 * - generateBasicPrompt - A function that generates a prompt based on gender, ethnicity, clothing type, and brand palette.
 * - GenerateBasicPromptInput - The input type for the generateBasicPrompt function.
 * - GenerateBasicPromptOutput - The return type for the generateBasicPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBasicPromptInputSchema = z.object({
  gender: z.string().describe("The model's gender."),
  ethnicity: z.string().describe("The model's ethnicity."),
  clothingType: z.string().describe("The type of clothing the model is wearing."),
  brandPalette: z.string().describe('The brand palette to use.'),
});

export type GenerateBasicPromptInput = z.infer<typeof GenerateBasicPromptInputSchema>;

const GenerateBasicPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated prompt.'),
});

export type GenerateBasicPromptOutput = z.infer<typeof GenerateBasicPromptOutputSchema>;

export async function generateBasicPrompt(input: GenerateBasicPromptInput): Promise<GenerateBasicPromptOutput> {
  return generateBasicPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBasicPromptPrompt',
  input: {schema: GenerateBasicPromptInputSchema},
  output: {schema: GenerateBasicPromptOutputSchema},
  prompt: `Generate a prompt for an image generation model based on the following criteria:\n\nModel Gender: {{{gender}}}\nModel Ethnicity: {{{ethnicity}}}\nClothing Type: {{{clothingType}}}\nBrand Palette: {{{brandPalette}}}\n\nThe prompt should be detailed and specific, suitable for use with a generative AI model like Google Gemini. Focus on descriptive language that captures the essence of the desired image. The prompt should be less than 200 words.`,
});

const generateBasicPromptFlow = ai.defineFlow(
  {
    name: 'generateBasicPromptFlow',
    inputSchema: GenerateBasicPromptInputSchema,
    outputSchema: GenerateBasicPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
