import React, { useState, useEffect } from 'react';
import {
  User, Award, Building, GraduationCap, Globe,
  Calendar, DollarSign, Star, ShieldCheck, Save,
  CheckCircle2, AlertCircle, FileCheck, MessageSquare
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useMyDoctorProfile, useUpdateMyDoctorProfile } from '../hooks/useDoctors';
import type { DoctorProfileUpdatePayload } from '../types/doctor';

export const DoctorProfileManagementPage: React.FC = () => {
  const { data: doctor, isLoading, error, refetch } = useMyDoctorProfile();
  const updateMutation = useUpdateMyDoctorProfile();

  const [formData, setFormData] = useState<DoctorProfileUpdatePayload>({
    bio: '',
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
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (doctor) {
      setFormData({
        bio: doctor.bio || '',
        subSpecialty: doctor.subSpecialty || '',
        hospitalClinic: doctor.hospitalClinic || '',
        languages: doctor.languages || 'English, Sinhala',
        location: doctor.location || 'Colombo, Sri Lanka',
        mbbsUniversity: doctor.mbbsUniversity || '',
        phdUniversity: doctor.phdUniversity || '',
        otherQualifications: doctor.otherQualifications || '',
        certifications: doctor.certifications || '',
        experienceYears: doctor.experienceYears || 5,
        age: doctor.age || 38,
        consultationFee: doctor.consultationFee || 2500,
        profilePhoto: doctor.profilePhoto || '',
      });
    }
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync(formData);
      setSuccessMessage('Your professional profile has been successfully updated.');
      refetch();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopBar
          title="Doctor Professional Profile"
          subtitle="Manage credentials, hospital affiliations, consultation fees, and practice details"
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <User className="w-6 h-6 text-sky-600" />
                Doctor Professional Profile
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your clinical qualifications, affiliations, consultation fee, and practice credentials.
              </p>
            </div>
            {doctor && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Specialist (SLMC #{doctor.registrationNumber || 'SLMC-REG'})</span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Loading professional profile...</div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
              Failed to load profile. Please verify you are logged in with an active Doctor account.
            </div>
          ) : (
            <>
              {/* Rating & Stats Summary Card */}
              {doctor && (
                <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md shadow-blue-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {doctor.profilePhoto ? (
                      <img
                        src={doctor.profilePhoto}
                        alt={doctor.fullName}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl font-bold">
                        {doctor.fullName?.charAt(0) || 'D'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{doctor.fullName}</h2>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                          {doctor.specialties?.[0]?.name || 'Specialist'}
                        </span>
                      </div>
                      <p className="text-white/80 text-xs mt-0.5">{doctor.qualifications}</p>
                      <p className="text-sky-200 text-xs mt-1">
                        {doctor.hospitalClinic || 'Colombo Central Hospital'} • {doctor.location || 'Colombo, Sri Lanka'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 divide-x divide-white/20 text-center">
                    <div className="pr-6">
                      <div className="flex items-center justify-center gap-1 text-amber-300">
                        <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                        <span className="text-2xl font-black">{doctor.averageRating?.toFixed(1) || '5.0'}</span>
                      </div>
                      <span className="text-[11px] text-white/70 block mt-0.5">
                        {doctor.reviewCount || doctor.reviews?.length || 0} Patient Reviews
                      </span>
                    </div>

                    <div className="pl-6">
                      <p className="text-2xl font-black">
                        LKR {doctor.consultationFee?.toLocaleString() ?? '2,500'}
                      </p>
                      <span className="text-[11px] text-white/70 block mt-0.5">Consultation Fee</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Notifications */}
              {successMessage && (
                <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  {errorMessage}
                </div>
              )}

              {/* Edit Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Practice Affiliation & Sub-Specialty */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold pb-2 border-b border-slate-100">
                    <Building className="w-5 h-5 text-sky-600" />
                    <span>Clinical Practice & Affiliations</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sub-Specialty / Clinical Focus
                      </label>
                      <input
                        type="text"
                        name="subSpecialty"
                        value={formData.subSpecialty || ''}
                        onChange={handleChange}
                        placeholder="e.g. Interventional Cardiology, Joint Replacement"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Primary Hospital / Clinic
                      </label>
                      <input
                        type="text"
                        name="hospitalClinic"
                        value={formData.hospitalClinic || ''}
                        onChange={handleChange}
                        placeholder="e.g. National Hospital of Sri Lanka"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Practice Location / City
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location || ''}
                        onChange={handleChange}
                        placeholder="e.g. Colombo, Sri Lanka"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Languages Spoken (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages || ''}
                        onChange={handleChange}
                        placeholder="e.g. English, Sinhala, Tamil"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Education & Academic Qualifications */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold pb-2 border-b border-slate-100">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>Education & Qualifications</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        MBBS University / Medical School
                      </label>
                      <input
                        type="text"
                        name="mbbsUniversity"
                        value={formData.mbbsUniversity || ''}
                        onChange={handleChange}
                        placeholder="e.g. Faculty of Medicine, University of Colombo"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Postgraduate / Fellowship University
                      </label>
                      <input
                        type="text"
                        name="phdUniversity"
                        value={formData.phdUniversity || ''}
                        onChange={handleChange}
                        placeholder="e.g. Royal College of Physicians, London"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Other Qualifications & Fellowships
                      </label>
                      <input
                        type="text"
                        name="otherQualifications"
                        value={formData.otherQualifications || ''}
                        onChange={handleChange}
                        placeholder="e.g. Fellowship in Cardiac Electrophysiology (USA)"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Certifications & Registrations
                      </label>
                      <input
                        type="text"
                        name="certifications"
                        value={formData.certifications || ''}
                        onChange={handleChange}
                        placeholder="e.g. Board Certified Consultant Cardiologist"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Professional Fees, Experience & Bio */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold pb-2 border-b border-slate-100">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span>Fees, Experience & Profile Summary</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Consultation Fee (LKR)
                      </label>
                      <input
                        type="number"
                        name="consultationFee"
                        min="500"
                        max="20000"
                        step="100"
                        value={formData.consultationFee ?? 2500}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="experienceYears"
                        min="0"
                        max="60"
                        value={formData.experienceYears ?? 5}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        min="25"
                        max="90"
                        value={formData.age ?? 38}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Profile Photo URL
                    </label>
                    <input
                      type="url"
                      name="profilePhoto"
                      value={formData.profilePhoto || ''}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Professional Clinical Bio / Overview
                    </label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={formData.bio || ''}
                      onChange={handleChange}
                      placeholder="Summarize your clinical expertise, surgical background, sub-specialty interests, and patient care philosophy..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-sky-500/20 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {updateMutation.isPending ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>

              {/* Patient Reviews Section */}
              {doctor?.reviews && doctor.reviews.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-600" />
                    Patient Reviews & Feedback ({doctor.reviews.length})
                  </h3>
                  <div className="space-y-3">
                    {doctor.reviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{rev.patientName}</span>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < (rev.stars ?? rev.rating ?? 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {rev.review && <p className="text-slate-600 italic">"{rev.review}"</p>}
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorProfileManagementPage;
