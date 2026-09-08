import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,15}$/, 'Please enter a valid phone number')
    .or(z.literal('')),
  bloodGroup: z
    .enum(['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .optional(),
  allergies: z
    .string()
    .max(500, 'Allergies description must be at most 500 characters')
    .optional()
    .default(''),
  address: z
    .string()
    .max(300, 'Address must be at most 300 characters')
    .optional()
    .default(''),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
