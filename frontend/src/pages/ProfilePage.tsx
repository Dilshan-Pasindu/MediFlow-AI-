import React, { useState, useEffect, useMemo } from 'react';
import {
  Save, User, Phone, Mail, Droplets, AlertTriangle, Loader,
  CheckCircle, Calendar, UserCheck, AlertCircle, Stethoscope,
  Building, GraduationCap, DollarSign, Star, ShieldCheck,
  MessageSquare, Globe, CheckCircle2,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { getUser } from '../services/api';
import { useProfile, useUpdateProfile, useMyDoctorProfile, useUpdateMyDoctorProfile } from '../hooks';
import { useAuthStore } from '../stores/authStore';
import type { ProfileForm } from '../types/profile';
import type { DoctorProfileUpdatePayload } from '../types/doctor';

const VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const VALID_GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

/**
 * Sanitizes image URLs to prevent DOM XSS vulnerabilities from unvalidated user inputs.
 */
function sanitizeImageUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^(https?:\/\/|\/|data:image\/(?:png|jpeg|jpg|gif|webp|svg\+xml);base64,)/i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed, window.location.origin);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || trimmed.startsWith('data:') || trimmed.startsWith('/')) {
        return trimmed;
      }
    } catch {
      if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
        return trimmed;
      }
    }
  }
  return '';
}

export default function ProfilePage() {
  const currentUser = getUser();
  const { user, setUser } = useAuthStore();
  const isDoctor = user?.role === 'Doctor';

  // ── Patient Profile Hooks (only enabled for non-doctors)
  const { data: profileData, isLoading: patientLoading } = useProfile({ enabled: !isDoctor });
  const updateProfile = useUpdateProfile();

  // ── Doctor Profile Hooks (only enabled for doctors)
  const { data: doctorData, isLoading: doctorLoading, refetch: refetchDoctor } = useMyDoctorProfile({ enabled: isDoctor });
  const updateDoctorProfile = useUpdateMyDoctorProfile();

  // ── Patient Form State
  const [patientForm, setPatientForm] = useState<ProfileForm>({
    fullName: '',
    email: '',
    phoneNumber: '',
    bloodGroup: '',
    allergies: '',
    address: '',
    dateOfBirth: '',
    gender: '',
  });
  const [patientTouched, setPatientTouched] = useState<Record<string, boolean>>({});
  const [patientSuccess, setPatientSuccess] = useState(false);
  const [patientSubmitAttempted, setPatientSubmitAttempted] = useState(false);

  useEffect(() => {
    if (profileData && !isDoctor) {
      setPatientForm({
        fullName: profileData.fullName || currentUser?.fullName || '',
        email: profileData.email || currentUser?.email || '',
        phoneNumber: profileData.phoneNumber || '',
        bloodGroup: profileData.bloodGroup || '',
        allergies: profileData.allergies || '',
        address: profileData.address || '',
        dateOfBirth: profileData.dateOfBirth ? String(profileData.dateOfBirth).slice(0, 10) : '',
        gender: profileData.gender || '',
      });
    }
  }, [profileData, isDoctor, currentUser]);

  // ── Doctor Form State
  const [docForm, setDocForm] = useState<DoctorProfileUpdatePayload>({
    fullName: '',
    phoneNumber: '',
    bio: '',
    qualifications: '',
    subSpecialty: '',
    hospitalClinic: '',
    languages: '',
    location: '',
    mbbsUniversity: '',
    phdUniversity: '',
    otherQualifications: '',
    certifications: '',
    experienceYears: 5,
    age: 38,
    consultationFee: 2500,
    profilePhoto: '',
    registrationNumber: '',
  });
  const [docTouched, setDocTouched] = useState<Record<string, boolean>>({});
  const [docSuccess, setDocSuccess] = useState<string | null>(null);
  const [docError, setDocError] = useState<string | null>(null);
  const [docSubmitAttempted, setDocSubmitAttempted] = useState(false);

  useEffect(() => {
    if (doctorData && isDoctor) {
      setDocForm({
        fullName: doctorData.fullName || user?.fullName || currentUser?.fullName || '',
        phoneNumber: doctorData.phoneNumber || '',
        bio: doctorData.bio || '',
        qualifications: doctorData.qualifications || '',
        subSpecialty: doctorData.subSpecialty || '',
        hospitalClinic: doctorData.hospitalClinic || '',
        languages: doctorData.languages || 'English, Sinhala',
        location: doctorData.location || 'Colombo, Sri Lanka',
        mbbsUniversity: doctorData.mbbsUniversity || '',
        phdUniversity: doctorData.phdUniversity || '',
        otherQualifications: doctorData.otherQualifications || '',
        certifications: doctorData.certifications || '',
        experienceYears: doctorData.experienceYears ?? 5,
        age: doctorData.age ?? 38,
        consultationFee: doctorData.consultationFee ?? 2500,
        profilePhoto: doctorData.profilePhoto || '',
        registrationNumber: doctorData.registrationNumber || '',
      });
    } else if (isDoctor && user) {
      setDocForm(prev => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
      }));
    }
  }, [doctorData, isDoctor, user, currentUser]);

  // ── Validation for Patient Form
  const patientErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    const trimmedName = patientForm.fullName.trim();
    if (!trimmedName) errs.fullName = 'Full name is required.';
    else if (trimmedName.length < 2) errs.fullName = 'Full name must be at least 2 characters.';
    else if (trimmedName.length > 100) errs.fullName = 'Full name cannot exceed 100 characters.';

    const trimmedPhone = patientForm.phoneNumber.trim();
    if (trimmedPhone) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(trimmedPhone)) errs.phoneNumber = 'Enter a valid phone number (e.g. +94 77 123 4567).';
    }
    if (patientForm.dateOfBirth) {
      const dob = new Date(patientForm.dateOfBirth);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (dob > today) errs.dateOfBirth = 'Date of birth cannot be in the future.';
      else if (dob.getFullYear() < 1900) errs.dateOfBirth = 'Date of birth must be after year 1900.';
    }
    if (patientForm.bloodGroup && !VALID_BLOOD_GROUPS.includes(patientForm.bloodGroup)) errs.bloodGroup = 'Please select a valid blood group.';
    if (patientForm.gender && !VALID_GENDERS.includes(patientForm.gender)) errs.gender = 'Please select a valid gender option.';
    if (patientForm.address && patientForm.address.length > 250) errs.address = 'Address cannot exceed 250 characters.';
    if (patientForm.allergies && patientForm.allergies.length > 500) errs.allergies = 'Allergies cannot exceed 500 characters.';
    return errs;
  }, [patientForm]);

  // ── Validation for Doctor Form
  const docErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    const trimmedName = (docForm.fullName || '').trim();
    if (!trimmedName) errs.fullName = 'Full name is required.';
    else if (trimmedName.length < 2) errs.fullName = 'Full name must be at least 2 characters.';
    else if (trimmedName.length > 100) errs.fullName = 'Full name cannot exceed 100 characters.';

    const trimmedPhone = (docForm.phoneNumber || '').trim();
    if (trimmedPhone) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(trimmedPhone)) errs.phoneNumber = 'Enter a valid phone number (e.g. +94 77 123 4567).';
    }

    if (docForm.experienceYears !== undefined && (docForm.experienceYears < 0 || docForm.experienceYears > 60)) {
      errs.experienceYears = 'Experience must be between 0 and 60 years.';
    }
    if (docForm.consultationFee !== undefined && (docForm.consultationFee < 0 || docForm.consultationFee > 50000)) {
      errs.consultationFee = 'Consultation fee must be between LKR 0 and 50,000.';
    }
    if (docForm.age !== undefined && (docForm.age < 20 || docForm.age > 100)) {
      errs.age = 'Age must be between 20 and 100.';
    }
    return errs;
  }, [docForm]);

  const isPatientValid = Object.keys(patientErrors).length === 0;
  const isDocValid = Object.keys(docErrors).length === 0;

  // ── Patient Handlers
  const handlePatientChange = (key: keyof ProfileForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setPatientForm(f => ({ ...f, [key]: e.target.value }));
    setPatientSuccess(false);
  };

  const handlePatientBlur = (field: string) => setPatientTouched(t => ({ ...t, [field]: true }));

  async function handlePatientSave(e: React.FormEvent) {
    e.preventDefault();
    setPatientSubmitAttempted(true);
    if (!isPatientValid) return;
    setPatientSuccess(false);
    updateProfile.mutate(
      {
        ...patientForm,
        fullName: patientForm.fullName.trim(),
        phoneNumber: patientForm.phoneNumber.trim(),
        address: patientForm.address.trim(),
        allergies: patientForm.allergies.trim(),
      },
      {
        onSuccess: () => {
          setPatientSuccess(true);
          setTimeout(() => setPatientSuccess(false), 4000);
        },
      }
    );
  }

  // ── Doctor Handlers
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setDocForm(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value,
    }));
    setDocSuccess(null);
  };

  const handleDocBlur = (field: string) => setDocTouched(t => ({ ...t, [field]: true }));

  async function handleDocSave(e: React.FormEvent) {
    e.preventDefault();
    setDocSubmitAttempted(true);
    if (!isDocValid) return;

    setDocSuccess(null);
    setDocError(null);

    try {
      await updateDoctorProfile.mutateAsync({
        ...docForm,
        fullName: docForm.fullName?.trim(),
        phoneNumber: docForm.phoneNumber?.trim(),
        bio: docForm.bio?.trim(),
        qualifications: docForm.qualifications?.trim(),
        subSpecialty: docForm.subSpecialty?.trim(),
        hospitalClinic: docForm.hospitalClinic?.trim(),
        languages: docForm.languages?.trim(),
        location: docForm.location?.trim(),
        mbbsUniversity: docForm.mbbsUniversity?.trim(),
        phdUniversity: docForm.phdUniversity?.trim(),
        otherQualifications: docForm.otherQualifications?.trim(),
        certifications: docForm.certifications?.trim(),
        registrationNumber: docForm.registrationNumber?.trim(),
        profilePhoto: docForm.profilePhoto?.trim(),
      });

      // Update auth store user if name changed
      if (user && docForm.fullName && docForm.fullName.trim() !== user.fullName) {
        setUser({ ...user, fullName: docForm.fullName.trim() });
      }

      setDocSuccess('Profile updated successfully.');
      refetchDoctor();
      setTimeout(() => setDocSuccess(null), 5000);
    } catch (err: any) {
      setDocError(err?.message || 'Failed to update profile. Please try again.');
    }
  }

  const displayName = isDoctor
    ? (docForm.fullName || doctorData?.fullName || user?.fullName || 'Doctor')
    : (patientForm.fullName || user?.fullName || 'Patient');

  const initials = displayName
    .trim()
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="User Profile"
          subtitle={isDoctor ? 'Manage your personal account details, clinical practice, credentials, and consultation settings' : 'Manage your personal information and health details'}
        />
        <div className="page-body fade-in">

          {/* ========================================================================= */}
          {/* DOCTOR UNIFIED PROFILE VIEW                                               */}
          {/* ========================================================================= */}
          {isDoctor ? (
            doctorLoading ? (
              <div className="card" style={{ padding: 60, textAlign: 'center' }}>
                <Loader size={32} className="spin" style={{ color: '#059669', margin: '0 auto 16px' }} />
                <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading doctor profile...</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1040, margin: '0 auto' }}>

                {/* Doctor Hero Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)',
                  borderRadius: 'var(--r-xl)',
                  padding: '24px 28px',
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(6, 78, 59, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 20,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {(() => {
                      const safePhotoUrl = sanitizeImageUrl(docForm.profilePhoto || doctorData?.profilePhoto);
                      return safePhotoUrl ? (
                        <img
                          src={safePhotoUrl}
                          alt={displayName}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 'var(--r-xl)',
                            objectFit: 'cover',
                            border: '3px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                            background: 'rgba(255,255,255,0.1)',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: 80,
                          height: 80,
                          borderRadius: 'var(--r-xl)',
                          background: 'rgba(255,255,255,0.2)',
                          border: '3px solid rgba(255,255,255,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 28,
                          fontWeight: 800,
                          fontFamily: 'Outfit, sans-serif',
                          color: 'white',
                        }}>
                          {initials}
                        </div>
                      );
                    })()}

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                          {displayName}
                        </h2>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          background: 'rgba(255,255,255,0.2)',
                          color: '#A7F3D0',
                          padding: '2px 10px',
                          borderRadius: 99,
                        }}>
                          {doctorData?.specialties?.[0]?.name || 'Specialist'}
                        </span>
                        {(docForm.registrationNumber || doctorData?.registrationNumber) && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            background: 'rgba(16,185,129,0.25)',
                            color: '#D1FAE5',
                            padding: '2px 10px',
                            borderRadius: 99,
                          }}>
                            <ShieldCheck size={12} /> SLMC #{docForm.registrationNumber || doctorData?.registrationNumber}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>
                        {docForm.qualifications || doctorData?.qualifications || 'Consultant Specialist'}
                      </div>

                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span>{docForm.hospitalClinic || doctorData?.hospitalClinic || 'Colombo Central Hospital'}</span>
                        <span>•</span>
                        <span>{docForm.location || doctorData?.location || 'Colombo, Sri Lanka'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#FCD34D' }}>
                        <Star size={18} fill="#FCD34D" />
                        <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'white' }}>
                          {doctorData?.averageRating ? Number(doctorData.averageRating).toFixed(1) : '5.0'}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                        {doctorData?.reviewCount || 0} Patient Reviews
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 24 }}>
                      <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'white' }}>
                        LKR {(docForm.consultationFee ?? doctorData?.consultationFee ?? 2500).toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                        Consultation Fee
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {docSuccess && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 18px',
                    background: '#ECFDF5',
                    border: '1.5px solid #A7F3D0',
                    borderRadius: 'var(--r-lg)',
                    color: '#065F46',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <span>{docSuccess}</span>
                  </div>
                )}
                {docError && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 18px',
                    background: '#FEF2F2',
                    border: '1.5px solid #FECACA',
                    borderRadius: 'var(--r-lg)',
                    color: '#991B1B',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    <AlertCircle size={18} color="#DC2626" />
                    <span>{docError}</span>
                  </div>
                )}

                {/* Unified Form */}
                <form onSubmit={handleDocSave} id="doctor-profile-form" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Card 1: Account & Personal Info */}
                  <div className="card">
                    <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 'var(--r-md)',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <User size={15} color="white" />
                      </div>
                      <div>
                        <div className="section-title" style={{ margin: 0, fontSize: 14 }}>Personal &amp; Account Information</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Personal identity and primary account credentials</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                        {/* Full Name */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-fullname">
                            Full Name <span style={{ color: 'var(--danger)' }}>*</span>
                          </label>
                          <div className="form-input-wrap">
                            <User size={15} className="form-icon" />
                            <input
                              type="text"
                              id="doc-fullname"
                              name="fullName"
                              value={docForm.fullName || ''}
                              onChange={handleDocChange}
                              onBlur={() => handleDocBlur('fullName')}
                              placeholder="e.g. Dr. Nimal Perera"
                              className={`form-input has-icon ${(docTouched.fullName || docSubmitAttempted) && docErrors.fullName ? 'input-error' : ''}`}
                              maxLength={100}
                            />
                          </div>
                          {(docTouched.fullName || docSubmitAttempted) && docErrors.fullName && (
                            <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertCircle size={12} /> {docErrors.fullName}
                            </div>
                          )}
                        </div>

                        {/* Email (Read-Only) */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-email">
                            Account Email <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(Linked to login)</span>
                          </label>
                          <div className="form-input-wrap">
                            <Mail size={15} className="form-icon" />
                            <input
                              type="email"
                              id="doc-email"
                              value={doctorData?.email || user?.email || currentUser?.email || ''}
                              disabled
                              className="form-input has-icon"
                              style={{ background: 'var(--surface-3)', cursor: 'not-allowed', opacity: 0.8 }}
                            />
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-phone">Phone Number</label>
                          <div className="form-input-wrap">
                            <Phone size={15} className="form-icon" />
                            <input
                              type="tel"
                              id="doc-phone"
                              name="phoneNumber"
                              value={docForm.phoneNumber || ''}
                              onChange={handleDocChange}
                              onBlur={() => handleDocBlur('phoneNumber')}
                              placeholder="+94 77 123 4567"
                              className={`form-input has-icon ${(docTouched.phoneNumber || docSubmitAttempted) && docErrors.phoneNumber ? 'input-error' : ''}`}
                              maxLength={20}
                            />
                          </div>
                          {(docTouched.phoneNumber || docSubmitAttempted) && docErrors.phoneNumber && (
                            <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertCircle size={12} /> {docErrors.phoneNumber}
                            </div>
                          )}
                        </div>

                        {/* Profile Photo URL */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-photo">Profile Photo URL</label>
                          <div className="form-input-wrap">
                            <Globe size={15} className="form-icon" />
                            <input
                              type="url"
                              id="doc-photo"
                              name="profilePhoto"
                              value={docForm.profilePhoto || ''}
                              onChange={handleDocChange}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="form-input has-icon"
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Card 2: Clinical Practice & Affiliations */}
                  <div className="card">
                    <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 'var(--r-md)',
                        background: 'linear-gradient(135deg,#065F46,#059669)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Building size={15} color="white" />
                      </div>
                      <div>
                        <div className="section-title" style={{ margin: 0, fontSize: 14 }}>Clinical Practice &amp; Affiliations</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Hospital appointments, sub-specialty focus, and practice location</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                        {/* Primary Specialty (Read-only badge) */}
                        <div className="form-group">
                          <label className="form-label">Primary Medical Specialty</label>
                          <div style={{
                            padding: '9px 14px',
                            background: 'var(--surface-3)',
                            borderRadius: 'var(--r-md)',
                            border: '1px solid var(--border)',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#065F46',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}>
                            <Stethoscope size={14} color="#059669" />
                            <span>{doctorData?.specialties?.[0]?.name || 'Specialist'}</span>
                          </div>
                        </div>

                        {/* Sub-Specialty */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-subspecialty">Sub-Specialty / Clinical Focus</label>
                          <input
                            type="text"
                            id="doc-subspecialty"
                            name="subSpecialty"
                            value={docForm.subSpecialty || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. Interventional Cardiology, Joint Replacement"
                            className="form-input"
                          />
                        </div>

                        {/* Primary Hospital */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-hospital">Primary Hospital / Clinic</label>
                          <input
                            type="text"
                            id="doc-hospital"
                            name="hospitalClinic"
                            value={docForm.hospitalClinic || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. National Hospital of Sri Lanka, Colombo"
                            className="form-input"
                          />
                        </div>

                        {/* Location */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-location">Practice Location / City</label>
                          <input
                            type="text"
                            id="doc-location"
                            name="location"
                            value={docForm.location || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. Colombo 07, Sri Lanka"
                            className="form-input"
                          />
                        </div>

                        {/* Languages */}
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label className="form-label" htmlFor="doc-languages">Languages Spoken (comma-separated)</label>
                          <input
                            type="text"
                            id="doc-languages"
                            name="languages"
                            value={docForm.languages || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. English, Sinhala, Tamil"
                            className="form-input"
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Card 3: Education & Credentials */}
                  <div className="card">
                    <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 'var(--r-md)',
                        background: 'linear-gradient(135deg,#4F46E5,#6366F1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <GraduationCap size={15} color="white" />
                      </div>
                      <div>
                        <div className="section-title" style={{ margin: 0, fontSize: 14 }}>Education &amp; Professional Credentials</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Academic degrees, medical school, registrations, and fellowships</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                        {/* Degrees / Qualifications */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-qualifications">Degrees &amp; Qualifications</label>
                          <input
                            type="text"
                            id="doc-qualifications"
                            name="qualifications"
                            value={docForm.qualifications || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. MBBS, MD (Cardiology), FCCP"
                            className="form-input"
                          />
                        </div>

                        {/* SLMC Registration */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-regno">Medical Council Registration (SLMC)</label>
                          <input
                            type="text"
                            id="doc-regno"
                            name="registrationNumber"
                            value={docForm.registrationNumber || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. SLMC-11024"
                            className="form-input"
                          />
                        </div>

                        {/* MBBS University */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-mbbs">MBBS University / Medical School</label>
                          <input
                            type="text"
                            id="doc-mbbs"
                            name="mbbsUniversity"
                            value={docForm.mbbsUniversity || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. Faculty of Medicine, University of Colombo"
                            className="form-input"
                          />
                        </div>

                        {/* Postgraduate University */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-phd">Postgraduate / Fellowship University</label>
                          <input
                            type="text"
                            id="doc-phd"
                            name="phdUniversity"
                            value={docForm.phdUniversity || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. Royal College of Physicians (UK)"
                            className="form-input"
                          />
                        </div>

                        {/* Other Qualifications */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-otherqual">Other Qualifications &amp; Fellowships</label>
                          <input
                            type="text"
                            id="doc-otherqual"
                            name="otherQualifications"
                            value={docForm.otherQualifications || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. Fellow of the American College of Cardiology (FACC)"
                            className="form-input"
                          />
                        </div>

                        {/* Certifications */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-certifications">Board Certifications</label>
                          <input
                            type="text"
                            id="doc-certifications"
                            name="certifications"
                            value={docForm.certifications || ''}
                            onChange={handleDocChange}
                            placeholder="e.g. Board Certified in Interventional Cardiology"
                            className="form-input"
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Card 4: Fee, Experience & Bio */}
                  <div className="card">
                    <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 'var(--r-md)',
                        background: 'linear-gradient(135deg,#059669,#10B981)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <DollarSign size={15} color="white" />
                      </div>
                      <div>
                        <div className="section-title" style={{ margin: 0, fontSize: 14 }}>Practice Details, Fees &amp; Clinical Bio</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Consultation pricing, clinical experience, and patient-facing summary</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>

                        {/* Consultation Fee */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-fee">Consultation Fee (LKR)</label>
                          <input
                            type="number"
                            id="doc-fee"
                            name="consultationFee"
                            value={docForm.consultationFee ?? ''}
                            onChange={handleDocChange}
                            onBlur={() => handleDocBlur('consultationFee')}
                            min="0"
                            max="50000"
                            step="100"
                            className={`form-input ${(docTouched.consultationFee || docSubmitAttempted) && docErrors.consultationFee ? 'input-error' : ''}`}
                          />
                          {(docTouched.consultationFee || docSubmitAttempted) && docErrors.consultationFee && (
                            <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>
                              {docErrors.consultationFee}
                            </div>
                          )}
                        </div>

                        {/* Years of Experience */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-exp">Years of Experience</label>
                          <input
                            type="number"
                            id="doc-exp"
                            name="experienceYears"
                            value={docForm.experienceYears ?? ''}
                            onChange={handleDocChange}
                            onBlur={() => handleDocBlur('experienceYears')}
                            min="0"
                            max="60"
                            className={`form-input ${(docTouched.experienceYears || docSubmitAttempted) && docErrors.experienceYears ? 'input-error' : ''}`}
                          />
                          {(docTouched.experienceYears || docSubmitAttempted) && docErrors.experienceYears && (
                            <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>
                              {docErrors.experienceYears}
                            </div>
                          )}
                        </div>

                        {/* Age */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="doc-age">Age</label>
                          <input
                            type="number"
                            id="doc-age"
                            name="age"
                            value={docForm.age ?? ''}
                            onChange={handleDocChange}
                            onBlur={() => handleDocBlur('age')}
                            min="20"
                            max="100"
                            className={`form-input ${(docTouched.age || docSubmitAttempted) && docErrors.age ? 'input-error' : ''}`}
                          />
                          {(docTouched.age || docSubmitAttempted) && docErrors.age && (
                            <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>
                              {docErrors.age}
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Bio */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="doc-bio">Professional Clinical Bio</label>
                        <textarea
                          id="doc-bio"
                          name="bio"
                          rows={4}
                          value={docForm.bio || ''}
                          onChange={handleDocChange}
                          placeholder="Summarize your clinical expertise, surgical experience, specialized treatments, and patient care philosophy..."
                          className="form-textarea"
                          maxLength={1000}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
                    <button
                      type="submit"
                      disabled={updateDoctorProfile.isPending}
                      className="btn btn-lg"
                      id="save-doctor-profile-btn"
                      style={{
                        background: 'linear-gradient(135deg,#065F46,#059669)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 28px',
                        fontSize: 14,
                        fontWeight: 700,
                        borderRadius: 'var(--r-lg)',
                        boxShadow: '0 4px 16px rgba(5,150,105,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: updateDoctorProfile.isPending ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {updateDoctorProfile.isPending ? (
                        <><Loader size={16} className="spin" /> Saving Changes...</>
                      ) : (
                        <><Save size={16} /> Save Profile Changes</>
                      )}
                    </button>
                  </div>
                </form>

                {/* Patient Reviews Section */}
                {doctorData?.reviews && doctorData.reviews.length > 0 && (
                  <div className="card" style={{ marginTop: 8 }}>
                    <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 'var(--r-md)',
                        background: 'linear-gradient(135deg,#0284C7,#0EA5E9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <MessageSquare size={15} color="white" />
                      </div>
                      <div>
                        <div className="section-title" style={{ margin: 0, fontSize: 14 }}>
                          Patient Reviews &amp; Feedback
                          <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>
                            ({doctorData.reviews.length} reviews)
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Verified ratings submitted by patients following consultations</div>
                      </div>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {doctorData.reviews.map((rev) => (
                        <div key={rev.id} style={{
                          padding: '14px 18px',
                          background: 'var(--surface-2)',
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--border)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{rev.patientName}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  fill={i < (rev.stars ?? rev.rating ?? 5) ? '#F59E0B' : 'none'}
                                  color={i < (rev.stars ?? rev.rating ?? 5) ? '#F59E0B' : '#CBD5E1'}
                                />
                              ))}
                            </div>
                          </div>
                          {rev.review && (
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', margin: '4px 0 6px' }}>
                              "{rev.review}"
                            </p>
                          )}
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )
          ) : (
            /* ========================================================================= */
            /* PATIENT PROFILE VIEW                                                      */
            /* ========================================================================= */
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, maxWidth: 1040, margin: '0 auto' }}>

              {/* Patient Avatar & Health Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card">
                  <div className="card-body" style={{ textAlign: 'center', padding: 24 }}>
                    <div style={{
                      width: 80, height: 80,
                      background: 'var(--gradient-primary)',
                      borderRadius: 'var(--r-xl)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 14px', fontSize: 28, fontWeight: 800,
                      color: 'white', fontFamily: 'Outfit, sans-serif',
                      boxShadow: '0 8px 24px rgba(3,105,161,0.3)',
                    }}>
                      {initials}
                    </div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
                      {patientForm.fullName.trim() || 'Your Name'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{patientForm.email}</div>
                    <span className="badge badge-blue">
                      {user?.role || 'Patient'}
                    </span>
                  </div>
                </div>

                {/* Health Summary */}
                <div className="card" style={{ background: 'var(--med-blue-50)', border: '1.5px solid var(--med-blue-200)' }}>
                  <div className="card-body">
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--med-blue)', marginBottom: 10 }}>Health Summary</div>
                    <div className="info-row" style={{ fontSize: 13 }}>
                      <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>Blood Group</span>
                      <strong style={{ color: patientForm.bloodGroup ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {patientForm.bloodGroup || 'Not specified'}
                      </strong>
                    </div>
                    <div className="info-row" style={{ fontSize: 13 }}>
                      <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>Gender</span>
                      <span>{patientForm.gender || 'Not specified'}</span>
                    </div>
                    <div className="info-row" style={{ fontSize: 13, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>Allergies</span>
                      <span>{patientForm.allergies || 'None recorded'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="card">
                <div className="card-header">
                  <div className="section-title">Edit Personal Information</div>
                </div>
                <div className="card-body">
                  {patientLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                      <Loader size={28} className="spin" style={{ color: 'var(--med-blue)' }} />
                    </div>
                  ) : (
                    <form onSubmit={handlePatientSave} id="patient-profile-form">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        {/* Full Name */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="patient-fullname">
                            Full Name <span style={{ color: 'var(--danger)' }}>*</span>
                          </label>
                          <div className="form-input-wrap">
                            <User size={15} className="form-icon" />
                            <input
                              type="text"
                              className={`form-input has-icon ${(patientTouched.fullName || patientSubmitAttempted) && patientErrors.fullName ? 'input-error' : ''}`}
                              id="patient-fullname"
                              value={patientForm.fullName}
                              onChange={handlePatientChange('fullName')}
                              onBlur={() => handlePatientBlur('fullName')}
                              placeholder="Your full name"
                              maxLength={100}
                            />
                          </div>
                          {(patientTouched.fullName || patientSubmitAttempted) && patientErrors.fullName && (
                            <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertCircle size={12} /> {patientErrors.fullName}
                            </div>
                          )}
                        </div>

                        {/* Email (Read-Only) */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="patient-email">
                            Email Address <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(Linked to account)</span>
                          </label>
                          <div className="form-input-wrap">
                            <Mail size={15} className="form-icon" />
                            <input
                              type="email"
                              className="form-input has-icon"
                              id="patient-email"
                              value={patientForm.email}
                              disabled
                              style={{ background: 'var(--surface-3)', cursor: 'not-allowed', opacity: 0.8 }}
                            />
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="patient-phone">Phone Number</label>
                          <div className="form-input-wrap">
                            <Phone size={15} className="form-icon" />
                            <input
                              type="tel"
                              className={`form-input has-icon ${(patientTouched.phoneNumber || patientSubmitAttempted) && patientErrors.phoneNumber ? 'input-error' : ''}`}
                              id="patient-phone"
                              value={patientForm.phoneNumber}
                              onChange={handlePatientChange('phoneNumber')}
                              onBlur={() => handlePatientBlur('phoneNumber')}
                              placeholder="+94 77 123 4567"
                              maxLength={20}
                            />
                          </div>
                          {(patientTouched.phoneNumber || patientSubmitAttempted) && patientErrors.phoneNumber && (
                            <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertCircle size={12} /> {patientErrors.phoneNumber}
                            </div>
                          )}
                        </div>

                        {/* Date of Birth */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="patient-dob">Date of Birth</label>
                          <div className="form-input-wrap">
                            <Calendar size={15} className="form-icon" />
                            <input
                              type="date"
                              className={`form-input has-icon ${(patientTouched.dateOfBirth || patientSubmitAttempted) && patientErrors.dateOfBirth ? 'input-error' : ''}`}
                              id="patient-dob"
                              value={patientForm.dateOfBirth || ''}
                              onChange={handlePatientChange('dateOfBirth')}
                              onBlur={() => handlePatientBlur('dateOfBirth')}
                              max={todayIso}
                              min="1900-01-01"
                            />
                          </div>
                          {(patientTouched.dateOfBirth || patientSubmitAttempted) && patientErrors.dateOfBirth && (
                            <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertCircle size={12} /> {patientErrors.dateOfBirth}
                            </div>
                          )}
                        </div>

                        {/* Gender */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="patient-gender">Gender</label>
                          <div className="form-input-wrap">
                            <UserCheck size={15} className="form-icon" />
                            <select
                              className="form-select has-icon"
                              id="patient-gender"
                              value={patientForm.gender || ''}
                              onChange={handlePatientChange('gender')}
                              onBlur={() => handlePatientBlur('gender')}
                              style={{ paddingLeft: 40 }}
                            >
                              <option value="">Select gender</option>
                              {VALID_GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Blood Group */}
                        <div className="form-group">
                          <label className="form-label" htmlFor="patient-blood-group">Blood Group</label>
                          <div className="form-input-wrap">
                            <Droplets size={15} className="form-icon" />
                            <select
                              className="form-select has-icon"
                              id="patient-blood-group"
                              value={patientForm.bloodGroup}
                              onChange={handlePatientChange('bloodGroup')}
                              onBlur={() => handlePatientBlur('bloodGroup')}
                              style={{ paddingLeft: 40 }}
                            >
                              <option value="">Select blood group</option>
                              {VALID_BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" htmlFor="patient-address" style={{ marginBottom: 0 }}>
                            Residential Address
                          </label>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(patientForm.address || '').length} / 250</span>
                        </div>
                        <input
                          type="text"
                          className="form-input"
                          id="patient-address"
                          value={patientForm.address}
                          onChange={handlePatientChange('address')}
                          placeholder="Your residential address"
                          maxLength={250}
                        />
                      </div>

                      {/* Allergies */}
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" htmlFor="patient-allergies" style={{ marginBottom: 0 }}>
                            <AlertTriangle size={13} style={{ color: 'var(--warning)', marginRight: 4 }} />
                            Known Allergies &amp; Medical Conditions <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(critical for prescription safety)</span>
                          </label>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(patientForm.allergies || '').length} / 500</span>
                        </div>
                        <textarea
                          className="form-textarea"
                          id="patient-allergies"
                          value={patientForm.allergies}
                          onChange={handlePatientChange('allergies')}
                          placeholder="e.g. Penicillin, Amoxicillin, Peanuts, Sulfa drugs..."
                          maxLength={500}
                          rows={3}
                        />
                      </div>

                      {updateProfile.isError && (
                        <div className="form-error" style={{ marginBottom: 14 }}>
                          <AlertTriangle size={14} />
                          {(updateProfile.error as Error)?.message || 'Failed to update profile. Please try again.'}
                        </div>
                      )}
                      {patientSuccess && (
                        <div className="form-success" style={{ marginBottom: 14 }}>
                          <CheckCircle size={14} /> Profile updated successfully!
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={updateProfile.isPending || (patientSubmitAttempted && !isPatientValid)}
                        id="save-patient-profile-btn"
                      >
                        {updateProfile.isPending ? (
                          <><Loader size={16} className="spin" /> Saving Changes...</>
                        ) : (
                          <><Save size={16} /> Save Changes</>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
