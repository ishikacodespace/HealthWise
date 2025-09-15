
'use server';

import { z } from 'zod';
import { RegisterSchema, LoginSchema } from '@/lib/definitions';

export async function registerUser(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  console.log('Registering user with:', validatedFields.data);

  // In a real application, you would handle database user creation, hashing passwords, etc.
  
  return { success: 'Registration data received!' };
}

export async function loginUser(values: z.infer<typeof LoginSchema>) {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    console.log('Logging in user with:', validatedFields.data);

    // In a real application, you would handle user authentication against a database.

    return { success: 'Login data received!' };
}
