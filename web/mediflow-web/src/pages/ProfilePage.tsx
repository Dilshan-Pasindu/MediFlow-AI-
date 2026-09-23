import { useState, useMemo } from 'react';
import { Save, User, Phone, Mail, Droplets, AlertTriangle, Loader, CheckCircle, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { getUser } from '../services/api';
import { useProfile, useUpdateProfile } from '../hooks';
import type { ProfileForm } from '../types/profile';

const VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const VALID_GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function ProfilePage() {
  const currentUser = getUser();
  const { data: profileData, isLoading: loading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    email: '',
    phoneNumber: '',
    bloodGroup: '',
    allergies: '',
    address: '',
    dateOfBirth: '',
    gender: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [initialized, setInitialized] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Sync TanStack Query data into local form state once
  if (profileData && !initialized) {
    setForm({
      fullName: profileData.fullName || currentUser?.fullName || '',
      email: profileData.email || currentUser?.email || '',
      phoneNumber: profileData.phoneNumber || '',
      bloodGroup: profileData.bloodGroup || '',
      allergies: profileData.allergies || '',
      address: profileData.address || '',
      dateOfBirth: profileData.dateOfBirth ? String(profileData.dateOfBirth).slice(0, 10) : '',
      gender: profileData.gender || '',
    });
    setInitialized(true);
  }

  // Field Validations
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    // Full Name
    const trimmedName = form.fullName.trim();
    if (!trimmedName) {
      errs.fullName = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    } else if (trimmedName.length > 100) {
      errs.fullName = 'Full name cannot exceed 100 characters.';
    }

    // Phone Number (optional, but if entered must be valid format)
    const trimmedPhone = form.phoneNumber.trim();
    if (trimmedPhone) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        errs.phoneNumber = 'Enter a valid phone number (e.g. +94 77 123 4567).';
      }
    }

    // Date of Birth (optional, cannot be in future or before 1900)
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (dob > today) {
        errs.dateOfBirth = 'Date of birth cannot be in the future.';
      } else if (dob.getFullYear() < 1900) {
        errs.dateOfBirth = 'Date of birth must be after year 1900.';
      }
    }

    // Blood Group (optional, must match whitelist)
    if (form.bloodGroup && !VALID_BLOOD_GROUPS.includes(form.bloodGroup)) {
      errs.bloodGroup = 'Please select a valid blood group.';
    }

    // Gender (optional, must match whitelist)
    if (form.gender && !VALID_GENDERS.includes(form.gender)) {
      errs.gender = 'Please select a valid gender option.';
    }

    // Address length
    if (form.address && form.address.length > 250) {
      errs.address = 'Address cannot exceed 250 characters.';
    }

    // Allergies length
    if (form.allergies && form.allergies.length > 500) {
      errs.allergies = 'Allergies cannot exceed 500 characters.';
    }

    return errs;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const set = (key: keyof ProfileForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setSuccess(false);
  };

  const handleBlur = (field: string) => {
    setTouched(t => ({ ...t, [field]: true }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isValid) return;

    setSuccess(false);
    updateProfile.mutate(
      {
        ...form,
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        allergies: form.allergies.trim(),
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);
        },
      }
    );
  }

  const initials = form.fullName
    ? form.fullName.trim().split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="My Profile" subtitle="Manage your personal information and health details" />
        <div className="page-body fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>

            {/* Avatar & Health Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: 28 }}>
                  <div style={{ width: 80, height: 80, background: 'var(--gradient-primary)', borderRadius: 'var(--r-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'Outfit, sans-serif', boxShadow: '0 8px 24px rgba(3,105,161,0.3)' }}>
                    {initials}
                  </div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 800, marginBottom: 4 }}>
                    {form.fullName.trim() || 'Your Name'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{form.email}</div>
                  <span className="badge badge-blue" style={{ marginTop: 10 }}>{currentUser?.role || 'Patient'}</span>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--med-blue-50)', border: '1.5px solid var(--med-blue-200)' }}>
                <div className="card-body">
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--med-blue)', marginBottom: 10 }}>Health Summary</div>
                  <div className="info-row" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>Blood Group</span>
                    <strong style={{ color: form.bloodGroup ? 'var(--danger)' : 'var(--text-muted)' }}>
                      {form.bloodGroup || 'Not specified'}
                    </strong>
                  </div>
                  <div className="info-row" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>Gender</span>
                    <span style={{ color: 'var(--text-primary)' }}>{form.gender || 'Not specified'}</span>
                  </div>
                  <div className="info-row" style={{ fontSize: 13, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>Allergies</span>
                    <span style={{ color: 'var(--text-primary)' }}>{form.allergies || 'None recorded'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="card">
              <div className="card-header">
                <div className="section-title">Edit Profile Information</div>
              </div>
              <div className="card-body">
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                    <Loader size={28} className="spin" style={{ color: 'var(--med-blue)' }} />
                  </div>
                ) : (
                  <form onSubmit={handleSave} id="profile-form">

                    {/* Personal Information */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      {/* Full Name */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="profile-fullname">
                          Full Name <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <div className="form-input-wrap">
                          <User size={15} className="form-icon" />
                          <input
                            type="text"
                            className={`form-input has-icon ${(touched.fullName || submitAttempted) && errors.fullName ? 'input-error' : ''}`}
                            id="profile-fullname"
                            value={form.fullName}
                            onChange={set('fullName')}
                            onBlur={() => handleBlur('fullName')}
                            placeholder="Your full name"
                            maxLength={100}
                          />
                        </div>
                        {(touched.fullName || submitAttempted) && errors.fullName && (
                          <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <AlertCircle size={12} /> {errors.fullName}
                          </div>
                        )}
                      </div>

                      {/* Email (Read-Only) */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="profile-email">
                          Email Address <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(Linked to account)</span>
                        </label>
                        <div className="form-input-wrap">
                          <Mail size={15} className="form-icon" />
                          <input
                            type="email"
                            className="form-input has-icon"
                            id="profile-email"
                            value={form.email}
                            disabled
                            style={{ background: 'var(--surface-3)', cursor: 'not-allowed', opacity: 0.8 }}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="profile-phone">
                          Phone Number
                        </label>
                        <div className="form-input-wrap">
                          <Phone size={15} className="form-icon" />
                          <input
                            type="tel"
                            className={`form-input has-icon ${(touched.phoneNumber || submitAttempted) && errors.phoneNumber ? 'input-error' : ''}`}
                            id="profile-phone"
                            value={form.phoneNumber}
                            onChange={set('phoneNumber')}
                            onBlur={() => handleBlur('phoneNumber')}
                            placeholder="+94 77 123 4567"
                            maxLength={20}
                          />
                        </div>
                        {(touched.phoneNumber || submitAttempted) && errors.phoneNumber && (
                          <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <AlertCircle size={12} /> {errors.phoneNumber}
                          </div>
                        )}
                      </div>

                      {/* Date of Birth */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="profile-dob">
                          Date of Birth
                        </label>
                        <div className="form-input-wrap">
                          <Calendar size={15} className="form-icon" />
                          <input
                            type="date"
                            className={`form-input has-icon ${(touched.dateOfBirth || submitAttempted) && errors.dateOfBirth ? 'input-error' : ''}`}
                            id="profile-dob"
                            value={form.dateOfBirth || ''}
                            onChange={set('dateOfBirth')}
                            onBlur={() => handleBlur('dateOfBirth')}
                            max={todayIso}
                            min="1900-01-01"
                          />
                        </div>
                        {(touched.dateOfBirth || submitAttempted) && errors.dateOfBirth && (
                          <div className="field-error" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <AlertCircle size={12} /> {errors.dateOfBirth}
                          </div>
                        )}
                      </div>

                      {/* Gender */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="profile-gender">
                          Gender
                        </label>
                        <div className="form-input-wrap">
                          <UserCheck size={15} className="form-icon" />
                          <select
                            className="form-select has-icon"
                            id="profile-gender"
                            value={form.gender || ''}
                            onChange={set('gender')}
                            onBlur={() => handleBlur('gender')}
                            style={{ paddingLeft: 40 }}
                          >
                            <option value="">Select gender</option>
                            {VALID_GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Blood Group */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="profile-blood-group">
                          Blood Group
                        </label>
                        <div className="form-input-wrap">
                          <Droplets size={15} className="form-icon" />
                          <select
                            className="form-select has-icon"
                            id="profile-blood-group"
                            value={form.bloodGroup}
                            onChange={set('bloodGroup')}
                            onBlur={() => handleBlur('bloodGroup')}
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
                        <label className="form-label" htmlFor="profile-address" style={{ marginBottom: 0 }}>
                          Residential Address
                        </label>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {(form.address || '').length} / 250
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        id="profile-address"
                        value={form.address}
                        onChange={set('address')}
                        placeholder="Your residential address"
                        maxLength={250}
                      />
                    </div>

                    {/* Allergies */}
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" htmlFor="profile-allergies" style={{ marginBottom: 0 }}>
                          <AlertTriangle size={13} style={{ color: 'var(--warning)', marginRight: 4 }} />
                          Known Allergies & Medical Conditions <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(critical for prescription safety)</span>
                        </label>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {(form.allergies || '').length} / 500
                        </span>
                      </div>
                      <textarea
                        className="form-textarea"
                        id="profile-allergies"
                        value={form.allergies}
                        onChange={set('allergies')}
                        placeholder="e.g. Penicillin, Amoxicillin, Peanuts, Sulfa drugs..."
                        maxLength={500}
                        rows={3}
                      />
                    </div>

                    {/* Form Status Messages */}
                    {updateProfile.isError && (
                      <div className="form-error" style={{ marginBottom: 14 }}>
                        <AlertTriangle size={14} />
                        {(updateProfile.error as Error)?.message || 'Failed to update profile. Please try again.'}
                      </div>
                    )}
                    {success && (
                      <div className="form-success" style={{ marginBottom: 14 }}>
                        <CheckCircle size={14} /> Profile updated successfully!
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={updateProfile.isPending || (submitAttempted && !isValid)}
                      id="save-profile-btn"
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
        </div>
      </div>
    </div>
  );
}
