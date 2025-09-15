'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized health tips based on user-provided health data.
 *
 * - `getPersonalizedHealthTips` -  A function that takes health data as input and returns personalized health tips.
 * - `PersonalizedHealthTipsInput` - The input type for the getPersonalizedHealthTips function.
 * - `PersonalizedHealthTipsOutput` - The return type for the getPersonalizedHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHealthTipsInputSchema = z.object({
  bloodPressure: z
    .string()
    .describe('The users blood pressure, as a string like 120/80.'),
  heartRate: z.number().describe('The user’s heart rate in BPM.'),
  bodyTemperature: z
    .number()
    .describe('The user’s body temperature in degrees Fahrenheit.'),
  bmi: z.number().describe('The user’s Body Mass Index (BMI).'),
});
export type PersonalizedHealthTipsInput = z.infer<
  typeof PersonalizedHealthTipsInputSchema
>;

const PersonalizedHealthTipsOutputSchema = z.object({
  healthTips: z
    .array(z.string())
    .describe('An array of personalized health tips for the user.'),
});
export type PersonalizedHealthTipsOutput = z.infer<
  typeof PersonalizedHealthTipsOutputSchema
>;

export async function getPersonalizedHealthTips(
  input: PersonalizedHealthTipsInput
): Promise<PersonalizedHealthTipsOutput> {
  return personalizedHealthTipsFlow(input);
}

const personalizedHealthTipsPrompt = ai.definePrompt({
  name: 'personalizedHealthTipsPrompt',
  input: {schema: PersonalizedHealthTipsInputSchema},
  output: {schema: PersonalizedHealthTipsOutputSchema},
  prompt: `You are a health and wellness expert. A user has provided the following health data:

Blood Pressure: {{{bloodPressure}}}
Heart Rate: {{{heartRate}}} BPM
Body Temperature: {{{bodyTemperature}}} °F
BMI: {{{bmi}}}

Based on this data, provide 3-5 personalized and actionable health tips for the user. These tips should be specific and tailored to the user's data to help them improve their health and lifestyle. Make sure each tip is no more than 2 sentences long.

Format your response as a JSON object with a "healthTips" array containing the tips.`,
});

const personalizedHealthTipsFlow = ai.defineFlow(
  {
    name: 'personalizedHealthTipsFlow',
    inputSchema: PersonalizedHealthTipsInputSchema,
    outputSchema: PersonalizedHealthTipsOutputSchema,
  },
  async input => {
    const {output} = await personalizedHealthTipsPrompt(input);
    return output!;
  }
);
