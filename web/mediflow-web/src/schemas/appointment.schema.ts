import { z } from 'zod';

export const bookingSchema = z.object({
  doctorId: z.number().int().positive('Please select a doctor'),
  appointmentDateTime: z.string().min(1, 'Please select date and time'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
