import { z } from 'zod';

export const bookingSchema = z.object({
  doctorId: z
    .union([z.string(), z.number()])
    .refine((v) => v !== '' && v !== 0, 'Doctor is required'),
  dateTime: z
    .string()
    .min(1, 'Please select a date and time'),
  notes: z
    .string()
    .max(500, 'Notes must be at most 500 characters')
    .optional()
    .default(''),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
