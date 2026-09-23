export interface DoctorSpecialtyInfo {
  id: number;
  name: string;
}

export interface DoctorReviewDto {
  id: number;
  appointmentId: number;
  patientName: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface DoctorDetail {
  id: number;
  userId: number;
  fullName: string;
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
  bio?: string;
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
}
