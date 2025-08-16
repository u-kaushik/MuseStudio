
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
  commercialObjective: z.string().describe('The commercial objective of the campaign.'),
  gender: z.string().describe("The model's gender."),
  ethnicity: z.string().describe("The model's ethnicity."),
  clothingType: z.string().describe("The type of clothing the model is wearing."),
  brandPalette: z.array(z.string()).describe('The brand palette to use.'),
  style: z.string().describe('The brand style.'),
  mood: z.string().describe('The brand mood.'),
  lighting: z.string().describe('The lighting of the scene.'),
  intensity: z.number().describe('How closely to adhere to the prompt.'),
  brandGuidelinesText: z.string().optional().describe('Textual brand guidelines.'),
  pose: z.string().describe("The model's pose."),
});

export type GenerateBasicPromptInput = z.infer<typeof GenerateBasicPromptInputSchema>;

const GenerateBasicPromptOutputSchema = z.object({
  title: z.string().describe('A short, catchy title for the generated prompt.'),
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
  prompt: `Generate a prompt and a short, catchy title for an image generation model based on the following criteria:

Commercial Objective: {{{commercialObjective}}}
Model Gender: {{{gender}}}
Model Ethnicity (Complexion): {{{ethnicity}}}
Clothing Type: {{{clothingType}}}
Brand Palette: {{{brandPalette}}}
Style: {{{style}}}
Mood: {{{mood}}}
Lighting: {{{lighting}}}
Pose: {{{pose}}}
Intensity: {{{intensity}}}
{{#if brandGuidelinesText}}
Brand Vibe: {{{brandGuidelinesText}}}
{{/if}}

The prompt should be detailed and specific, suitable for use with a generative AI model like Google Gemini. Focus on descriptive language that captures the essence of the desired image. The prompt should be less than 200 words.`,
});

const generateBasicPromptFlow = ai.defineFlow(
  {
    name: 'generateBasicPromptFlow',
    inputSchema: GenerateBasicPromptInputSchema,
    outputSchema: GenerateBasicPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      brandPalette: input.brandPalette.join(', '),
    });
    return output!;
  }
);
