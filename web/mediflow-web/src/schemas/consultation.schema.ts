import { z } from 'zod';

export const examFormSchema = z.object({
  chiefComplaint: z
    .string()
    .min(2, 'Chief complaint is required'),
  symptoms: z
    .string()
    .min(5, 'Please describe the symptoms'),
  vitalBP: z.string().optional().default(''),
  vitalTemp: z.string().optional().default(''),
  vitalPulse: z.string().optional().default(''),
  vitalSPO2: z.string().optional().default(''),
  examination: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

export const medicineEntrySchema = z.object({
  name: z
    .string()
    .min(1, 'Medicine name is required'),
  dosage: z
    .string()
    .min(1, 'Dosage is required'),
  frequency: z
    .string()
    .min(1, 'Frequency is required'),
  duration: z
    .string()
    .min(1, 'Duration is required'),
  quantity: z
    .string()
    .min(1, 'Quantity is required'),
});

export const prescriptionFormSchema = z.object({
  medicines: z
    .array(medicineEntrySchema)
    .min(1, 'At least one medicine is required'),
  instructions: z
    .string()
    .max(1000, 'Instructions must be at most 1000 characters')
    .optional()
    .default(''),
});

export type ExamFormData = z.infer<typeof examFormSchema>;
export type MedicineEntryData = z.infer<typeof medicineEntrySchema>;
export type PrescriptionFormData = z.infer<typeof prescriptionFormSchema>;
