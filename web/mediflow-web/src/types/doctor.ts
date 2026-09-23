export interface DoctorSpecialtyInfo {
  id: number;
  name: string;
}

export interface DoctorReviewDto {
  id: number;
  appointmentId: number;
  patientName: string;
  rating?: number;
  stars?: number;
  review?: string;
  comment?: string;
  createdAt: string;
}

export interface DoctorAvailabilityDto {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface DoctorDetail {
  id: number;
  userId: number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  qualifications: string;
  bio?: string;
  consultationFee: number;
  experienceYears: number;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  specialties: DoctorSpecialtyInfo[];
  profilePhoto?: string;
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
  reviews?: DoctorReviewDto[];
  availability?: DoctorAvailabilityDto[];
}

export interface RankedDoctor extends DoctorDetail {
  rankScore: number;
}

export interface SpecialtyInfo {
  id: number;
  name: string;
  description?: string;
  iconName?: string;
}

export interface DoctorProfileUpdatePayload {
  fullName?: string;
  phoneNumber?: string;
  bio?: string;
  qualifications?: string;
  subSpecialty?: string;
  hospitalClinic?: string;
  languages?: string;
  location?: string;
  mbbsUniversity?: string;
  phdUniversity?: string;
  otherQualifications?: string;
  certifications?: string;
  experienceYears?: number;
  age?: number;
  consultationFee?: number;
  profilePhoto?: string;
  registrationNumber?: string;
}
