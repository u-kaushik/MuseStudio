
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
  prompt: z.string().describe('The final, generated prompt.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImageForPrompt(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: [
            { text: `You are an expert fashion prompt engineer. Analyze the provided image based on the MUSE framework (Morphology, Uniformity, Style, Essence).
  Based on your analysis, generate a detailed, ready-to-use prompt to recreate a similar image.
  The prompt should be a complete and polished sentence.
  Specifically analyze and include the model's face shape, complexion, body shape, and pose in the prompt.

  Generate a title and a prompt.` },
            { media: { url: input.imageDataUri } },
        ],
        output: {
            schema: AnalyzeImageOutputSchema,
        },
    });
    return output!;
  }
);
