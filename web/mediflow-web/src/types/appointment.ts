export type AppointmentStatus =
  | 'Pending'
  | 'PaymentSubmitted'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'NoShow';

export interface Specialty {
  id: number;
  name: string;
  description?: string;
  iconName?: string;
}

export interface DoctorSpecialty {
  doctorId: number;
  specialtyId: number;
  specialty?: Specialty;
}

export interface Doctor {
  id: number;
  userId: number;
  name?: string;
  fullName?: string;
  slmcNumber?: string;
  hospital?: string;
  consultationFee: number;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  profileImageUrl?: string;
  profilePhoto?: string;
  isAvailableToday?: boolean;
  specialties?: string[];
  doctorSpecialties?: DoctorSpecialty[];
  qualifications?: string;
  subSpecialty?: string;
  hospitalClinic?: string;
  languages?: string;
  location?: string;
  mbbsUniversity?: string;
  phdUniversity?: string;
  otherQualifications?: string;
  certifications?: string;
  age?: number;
  registrationNumber?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  status: AppointmentStatus;
  appointmentNumber?: string;
  notes?: string;
  fee?: number;
  createdAt: string;
  updatedAt: string;
  doctor?: Doctor;
  hasRated?: boolean;
}

export interface BookAppointmentRequest {
  doctorId: number;
  appointmentDateTime: string;
  notes?: string;
}

export interface RateAppointmentPayload {
  rating: number;
  review?: string;
}

export interface AppointmentRatingDto {
  id: number;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  rating: number;
  review?: string;
  createdAt: string;
}
