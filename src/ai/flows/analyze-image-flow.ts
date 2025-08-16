
'use server';
/**
 * @fileOverview Analyzes an image using the MUSE framework to generate a prompt.
 *
 * - analyzeImageForPrompt - A function that handles the image analysis process.
 * - AnalyzeImageInput - The input type for the analyzeImageForPrompt function.
 * - AnalyzeImageOutput - The return type for the analyzeImageForPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a fashion subject, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  title: z.string().describe('A short, catchy title for the generated prompt.'),
  prompt: z.string().describe('The generated prompt with editable variables in double curly brackets.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImageForPrompt(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `You are an expert fashion prompt engineer. Analyze the provided image based on the MUSE framework (Morphology, Uniformity, Style, Essence).
  Based on your analysis, generate a detailed prompt to recreate a similar image.
  Identify specific attributes in the image that can be modified and wrap them in double curly brackets. For example, if the model has blue eyes, the prompt should contain '{{blue eyes}}'. Other examples could be '{{red silk dress}}' or '{{Parisian cafe}}'.

  Image: {{media url=imageDataUri}}

  Generate a title and a prompt.`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {model: 'googleai/gemini-pro-vision'});
    return output!;
  }
);
