'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user-reported symptoms.
 *
 * - `getSymptomAnalysis` -  A function that takes symptoms as input and returns a preliminary analysis.
 * - `SymptomCheckerInput` - The input type for the getSymptomAnalysis function.
 * - `SymptomCheckerOutput` - The return type for the getSymptomAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Log the env variable at the very top (startup)
console.log("GOOGLE_GENERATIVEAI_API_KEY AT IMPORT:", process.env.GOOGLE_GENERATIVEAI_API_KEY);

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the user\'s symptoms.'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  possibleCauses: z
    .array(z.string())
    .describe('A list of possible, non-emergency medical causes for the described symptoms.'),
  recommendedActions: z
    .array(z.string())
    .describe('A list of recommended actions for the user to take, such as resting, hydrating, or when to see a doctor.'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function getSymptomAnalysis(
  input: SymptomCheckerInput
): Promise<SymptomCheckerOutput> {
  // Log the env variable at runtime (each request)
  console.log("GOOGLE_GENERATIVEAI_API_KEY AT RUNTIME:", process.env.GOOGLE_GENERATIVEAI_API_KEY);

  try {
    return await symptomCheckerFlow(input);
  } catch (error) {
    // Log any AI call errors
    console.error("Gemini call error:", error);
    throw error;
  }
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: { schema: SymptomCheckerInputSchema },
  output: { schema: SymptomCheckerOutputSchema },
  prompt: `You are a helpful AI medical assistant. A user has provided the following symptoms:

Symptoms: {{{symptoms}}}

Based on this information, provide a preliminary analysis. Your response should NOT be considered a diagnosis. 
Start by providing 2-3 potential, common, non-emergency causes for these symptoms.
Then, suggest 2-3 actionable recommendations, such as home care or when it might be advisable to see a doctor.

IMPORTANT: Always include a recommendation to consult a healthcare professional for a proper diagnosis. Do not provide any advice that could be considered a definitive diagnosis. Frame your response as helpful suggestions for a user to discuss with their doctor.`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const { output } = await symptomCheckerPrompt(input);
    return output!;
  }
);
