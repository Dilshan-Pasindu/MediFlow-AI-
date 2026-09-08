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
}

export interface DoctorSpecialtyInfo {
  id: number;
  name: string;
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
