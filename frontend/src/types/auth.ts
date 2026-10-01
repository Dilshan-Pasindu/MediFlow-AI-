export type UserRole =
  | 'Patient'
  | 'Doctor'
  | 'Receptionist'
  | 'Pharmacist'
  | 'PharmacyOwner'
  | 'Supplier'
  | 'Administrator';

export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  verificationStatus?: VerificationStatus;
  registrationNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  loginType?: 'Patient' | 'Staff';
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: UserRole;
}

export interface StaffRegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'Doctor' | 'Pharmacist' | 'Supplier' | 'Receptionist' | 'PharmacyOwner';
  registrationNumber?: string;
}

export interface AuthResponse {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
  verificationStatus?: VerificationStatus;
}

export interface StaffRegistrationResponse {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  verificationStatus: string;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

export interface GoogleAuthRequest {
  idToken?: string;
  email?: string;
  fullName?: string;
  photoUrl?: string;
  role?: UserRole;
}

export interface PendingRegistration {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  verificationStatus: VerificationStatus;
  registrationNumber?: string;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedByAdminId?: number;
  isActive: boolean;
  profile?: {
    bio?: string;
    qualifications?: string;
    experienceYears?: number;
    consultationFee?: number;
    hospitalClinic?: string;
  };
}
