export type UserRole =
  | 'Patient'
  | 'Doctor'
  | 'Receptionist'
  | 'Pharmacist'
  | 'PharmacyOwner'
  | 'Supplier'
  | 'Administrator';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: UserRole;
}

export interface AuthResponse {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}
