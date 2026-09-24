import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum([
    'Patient',
    'Doctor',
    'Receptionist',
    'Pharmacist',
    'PharmacyOwner',
    'Supplier',
    'Administrator',
  ]).default('Patient'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
