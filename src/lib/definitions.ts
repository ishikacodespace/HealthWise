import { z } from 'zod';

// =================================================================
// FORM SCHEMAS
// =================================================================

export const RegisterSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const HealthDataSchema = z.object({
    bloodPressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, { message: "Invalid format. Use 'e.g. 120/80'"}),
    heartRate: z.string().min(1, { message: "Heart rate is required."}),
    bodyTemperature: z.string().min(1, { message: "Temperature is required."}),
    bmi: z.string().min(1, { message: "BMI is required."}),
})


// =================================================================
// DATA TYPES
// =================================================================

export type HealthEntry = {
  id: number;
  date: string;
  bloodPressure: string;
  heartRate: number;
  bodyTemperature: number;
  bmi: number;
};
