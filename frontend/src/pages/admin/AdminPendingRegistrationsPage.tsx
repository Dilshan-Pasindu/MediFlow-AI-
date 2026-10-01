import { useState, useEffect } from 'react';
import {
  UserCheck, Search, Filter, CheckCircle2, XCircle, AlertCircle,
  Eye, RefreshCw, Stethoscope, Briefcase, Pill, Building2, Truck,
  Clock, Shield, ArrowUpDown, ChevronRight, X, Calendar, Mail, Phone,
  FileCheck2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import PortalHeader from '../../components/PortalHeader';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import {
  apiGetPendingRegistrations,
  apiGetPendingRegistrationDetails,
  apiApproveRegistration,
  apiRejectRegistration
} from '../../services/api';
import type { PendingRegistration } from '../../types/auth';

const ROLE_BADGES: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  Doctor: { label: 'Doctor', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', icon: Stethoscope },
  Pharmacist: { label: 'Pharmacist', color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)', icon: Pill },
  Supplier: { label: 'Supplier', color: '#0891B2', bg: 'rgba(8, 145, 178, 0.1)', icon: Truck },
  Receptionist: { label: 'Receptionist', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', icon: Briefcase },
  PharmacyOwner: { label: 'Pharmacy Owner', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)', icon: Building2 },
};

export default function AdminPendingRegistrationsPage() {
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Modals & Action States
  const [selectedReg, setSelectedReg] = useState<PendingRegistration | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Confirmation dialogs
  const [confirmApprove, setConfirmApprove] = useState<PendingRegistration | null>(null);
  const [confirmReject, setConfirmReject] = useState<PendingRegistration | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);

  useEffect(() => {
    loadRegistrations();
  }, [selectedRole, statusFilter]);

  async function loadRegistrations() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetPendingRegistrations({
        role: selectedRole,
        search: searchTerm,
        status: statusFilter,
      });
      setRegistrations(data.registrations || []);
      setPendingCount(data.pendingCount || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to load staff registrations.');
    } finally {
      setLoading(false);
    }
  }

  // Handle Search on Submit or Enter
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadRegistrations();
  }

  // Open Details Modal
  async function handleOpenDetails(reg: PendingRegistration) {
    setSelectedReg(reg);
    setDetailLoading(true);
    try {
      const details = await apiGetPendingRegistrationDetails(reg.id);
      setSelectedReg(details);
    } catch {
      // Fallback to existing item
    } finally {
      setDetailLoading(false);
    }
  }

  // Handle Approve
  async function handleApproveConfirmed() {
    if (!confirmApprove) return;
    setActionProcessing(true);
    try {
      await apiApproveRegistration(confirmApprove.id);
      setSuccessToast(`Registration for ${confirmApprove.fullName} (${confirmApprove.role}) has been Approved successfully.`);
      setConfirmApprove(null);
      if (selectedReg?.id === confirmApprove.id) {
        setSelectedReg(null);
      }
      // Refresh list seamlessly
      loadRegistrations();
    } catch (err: any) {
      setError(err?.message || 'Failed to approve registration.');
    } finally {
      setActionProcessing(false);
    }
  }

  // Handle Reject
  async function handleRejectConfirmed() {
    if (!confirmReject) return;
    setActionProcessing(true);
    try {
      await apiRejectRegistration(confirmReject.id, rejectionReason);
      setSuccessToast(`Registration for ${confirmReject.fullName} has been Rejected.`);
      setConfirmReject(null);
      setRejectionReason('');
      if (selectedReg?.id === confirmReject.id) {
        setSelectedReg(null);
      }
      // Refresh list seamlessly
      loadRegistrations();
    } catch (err: any) {
      setError(err?.message || 'Failed to reject registration.');
    } finally {
      setActionProcessing(false);
    }
  }

  // Sorted and filtered items
  const displayRegistrations = [...registrations]
    .filter(r => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        r.fullName.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        (r.registrationNumber && r.registrationNumber.toLowerCase().includes(s))
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Staff Registration Approvals"
          subtitle="Verification queue for doctors, pharmacists, suppliers, receptionists & pharmacy owners"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={loadRegistrations} id="refresh-registrations-btn">
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Queue
            </button>
          }
        />

        <div className="page-body fade-in">
          <PortalHeader
            role="admin"
            title="Pending Registrations & Credential Verification"
            subtitle="Review professional registration certificates, SLMC registration numbers, and identity credentials"
            loading={loading}
            stats={[
              { label: 'Pending Approvals', value: pendingCount, icon: <Clock size={16} /> },
              { label: 'Current Display', value: displayRegistrations.length, icon: <UserCheck size={16} /> },
              { label: 'Vetting Standard', value: 'Level 3 Healthcare', icon: <ShieldCheck size={16} /> },
            ]}
          />

          {/* Success Toast */}
          {successToast && (
            <div
              style={{
                marginBottom: 20,
                padding: '14px 18px',
                borderRadius: 12,
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'fadeIn 0.2s ease',
              }}
              id="success-toast-banner"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 13.5 }}>
                <CheckCircle2 size={18} /> {successToast}
              </div>
              <button
                type="button"
                onClick={() => setSuccessToast(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065F46' }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: '14px 18px',
                borderRadius: 12,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              id="error-banner"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 13.5 }}>
                <AlertCircle size={18} /> {error}
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C' }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Control Bar: Search & Filters */}
          <div
            className="card"
            style={{ marginBottom: 20, padding: '16px 20px', border: '1px solid var(--border-color)' }}
          >
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, flex: '1 1 280px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input input-sm"
                    placeholder="Search by name, email, or Doctor Reg No..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: 36, width: '100%' }}
                    id="search-registrations-input"
                  />
                </div>
              </form>

              {/* Role Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Role:</span>
                <select
                  className="input input-sm"
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  style={{ width: 'auto', fontWeight: 600 }}
                  id="filter-role-select"
                >
                  <option value="All">All Roles</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="PharmacyOwner">Pharmacy Owner</option>
                </select>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Status:</span>
                <select
                  className="input input-sm"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{ width: 'auto', fontWeight: 600 }}
                  id="filter-status-select"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="All">All Statuses</option>
                </select>
              </div>

              {/* Sort Order */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Sort:</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSortBy(s => s === 'newest' ? 'oldest' : 'newest')}
                  style={{ fontSize: 12 }}
                >
                  <ArrowUpDown size={13} /> {sortBy === 'newest' ? 'Newest First' : 'Oldest First'}
                </button>
              </div>
            </div>
          </div>

          {/* Registrations Table / List Card */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="section-title">
                Staff Applications ({displayRegistrations.length})
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {statusFilter === 'Pending' ? 'Awaiting verification before granting login' : `Filter: ${statusFilter}`}
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <RefreshCw size={28} className="spin" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 600 }}>Loading registration applications...</div>
              </div>
            ) : displayRegistrations.length === 0 ? (
              <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }} id="empty-registrations-state">
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(42,125,225,0.08)',
                    color: '#2A7DE1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <UserCheck size={28} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                  No Registrations Found
                </div>
                <div style={{ fontSize: 13, maxWidth: 360, margin: '0 auto' }}>
                  {statusFilter === 'Pending'
                    ? 'All staff applications have been reviewed! There are currently no pending registrations awaiting administrator decision.'
                    : 'No registration records match the current filter criteria.'}
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      <th>Staff Applicant</th>
                      <th>Applied Role</th>
                      <th>Professional Reg No.</th>
                      <th>Submission Date</th>
                      <th>Verification Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRegistrations.map(reg => {
                      const badge = ROLE_BADGES[reg.role] || { label: reg.role, color: '#1E293B', bg: '#F1F5F9', icon: Shield };
                      const RoleIcon = badge.icon;
                      const isPending = reg.verificationStatus === 'Pending';
                      const isApproved = reg.verificationStatus === 'Approved';
                      const isRejected = reg.verificationStatus === 'Rejected';

                      return (
                        <tr key={reg.id} id={`registration-row-${reg.id}`}>
                          {/* Name & Email */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 10,
                                  background: badge.bg,
                                  color: badge.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: 12,
                                  flexShrink: 0,
                                }}
                              >
                                {reg.fullName?.substring(0, 2).toUpperCase() || 'ST'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{reg.fullName}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{reg.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td>
                            <span
                              className="badge"
                              style={{
                                color: badge.color,
                                background: badge.bg,
                                borderColor: `${badge.color}30`,
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                              }}
                            >
                              <RoleIcon size={12} /> {badge.label}
                            </span>
                          </td>

                          {/* Professional Reg No (Doctors only) */}
                          <td>
                            {reg.registrationNumber ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  fontFamily: 'monospace',
                                  fontWeight: 700,
                                  fontSize: 12.5,
                                  color: '#065F46',
                                  background: 'rgba(5, 150, 105, 0.08)',
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  border: '1px solid rgba(5, 150, 105, 0.2)',
                                }}
                              >
                                <ShieldCheck size={12} /> {reg.registrationNumber}
                              </span>
                            ) : (
                              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>— Not Required</span>
                            )}
                          </td>

                          {/* Submitted Timestamp */}
                          <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                            {new Date(reg.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>

                          {/* Status */}
                          <td>
                            <span
                              className="badge"
                              style={{
                                fontWeight: 800,
                                fontSize: 11.5,
                                color: isApproved ? '#059669' : isRejected ? '#DC2626' : '#D97706',
                                background: isApproved ? '#ECFDF5' : isRejected ? '#FEF2F2' : '#FFFBEB',
                                borderColor: isApproved ? '#A7F3D0' : isRejected ? '#FECACA' : '#FDE68A',
                              }}
                            >
                              {isPending && 'Pending Verification'}
                              {isApproved && 'Approved'}
                              {isRejected && 'Rejected'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: 6 }}>
                              {/* Details button */}
                              <button
                                className="btn btn-ghost btn-xs"
                                onClick={() => handleOpenDetails(reg)}
                                title="View Registration Details"
                                id={`view-btn-${reg.id}`}
                              >
                                <Eye size={13} /> Details
                              </button>

                              {/* Quick Approve button if pending */}
                              {isPending && (
                                <button
                                  className="btn btn-sm"
                                  style={{
                                    background: '#059669',
                                    color: '#fff',
                                    padding: '4px 10px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    borderRadius: 6,
                                    border: 'none',
                                  }}
                                  onClick={() => setConfirmApprove(reg)}
                                  title="Approve Staff Registration"
                                  id={`approve-btn-${reg.id}`}
                                >
                                  <CheckCircle2 size={13} /> Approve
                                </button>
                              )}

                              {/* Quick Reject button if pending */}
                              {isPending && (
                                <button
                                  className="btn btn-sm btn-ghost"
                                  style={{
                                    color: '#DC2626',
                                    padding: '4px 8px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                  }}
                                  onClick={() => {
                                    setConfirmReject(reg);
                                    setRejectionReason('');
                                  }}
                                  title="Reject Staff Registration"
                                  id={`reject-btn-${reg.id}`}
                                >
                                  <XCircle size={13} /> Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          MODAL: Registration Details View
          ───────────────────────────────────────────────────────────────── */}
      {selectedReg && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setSelectedReg(null)}
          id="details-modal-backdrop"
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 580,
              background: '#FFFFFF',
              borderRadius: 18,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
            id="details-modal-content"
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8FAFC',
              }}
            >
              <div>
                <div style={{ fontWeight: 900, fontSize: 17, color: '#0F172A' }}>
                  Staff Registration Details
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Applicant ID #{selectedReg.id} · Applied for {selectedReg.role}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Applicant Summary */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 20,
                  padding: '16px',
                  borderRadius: 12,
                  background: '#F1F5F9',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: '#2A7DE1',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 16,
                  }}
                >
                  {selectedReg.fullName?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{selectedReg.fullName}</div>
                  <div style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={13} /> {selectedReg.email}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={13} /> {selectedReg.phoneNumber || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Status and Submission Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#FAFAFA' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Current Verification Status</div>
                  <div style={{ marginTop: 4, fontWeight: 800, fontSize: 14, color: selectedReg.verificationStatus === 'Approved' ? '#059669' : selectedReg.verificationStatus === 'Rejected' ? '#DC2626' : '#D97706' }}>
                    {selectedReg.verificationStatus}
                  </div>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#FAFAFA' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Submission Date</div>
                  <div style={{ marginTop: 4, fontWeight: 800, fontSize: 14, color: '#0F172A' }}>
                    {new Date(selectedReg.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Doctor Registration Number Card */}
              {selectedReg.role === 'Doctor' && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 12,
                    background: 'rgba(5, 150, 105, 0.08)',
                    border: '1.5px solid rgba(5, 150, 105, 0.3)',
                    marginBottom: 20,
                  }}
                  id="modal-doctor-regno-section"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#065F46' }}>
                      Sri Lanka Medical Council (SLMC) Reg No.
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: 6 }}>
                      Verified Credential Field
                    </span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 900, color: '#065F46' }}>
                    {selectedReg.registrationNumber || 'Not Provided (Flagged)'}
                  </div>
                  <div style={{ fontSize: 12, color: '#047857', marginTop: 4 }}>
                    Please verify this number in the national registry before granting clinical access.
                  </div>
                </div>
              )}

              {/* Doctor Extended Profile if present */}
              {selectedReg.profile && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>
                    Clinical Profile Details
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: '#334155' }}>
                    {selectedReg.profile.qualifications && (
                      <div><strong>Qualifications:</strong> {selectedReg.profile.qualifications}</div>
                    )}
                    {selectedReg.profile.hospitalClinic && (
                      <div><strong>Hospital / Practice:</strong> {selectedReg.profile.hospitalClinic}</div>
                    )}
                    {selectedReg.profile.bio && (
                      <div style={{ marginTop: 6, fontStyle: 'italic', color: '#64748B' }}>"{selectedReg.profile.bio}"</div>
                    )}
                  </div>
                </div>
              )}

              {/* Rejection Reason if present */}
              {selectedReg.rejectionReason && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#991B1B',
                    fontSize: 13,
                    marginBottom: 20,
                  }}
                >
                  <strong>Rejection Reason:</strong> {selectedReg.rejectionReason}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-color)',
                background: '#F8FAFC',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedReg(null)}
              >
                Close
              </button>

              {selectedReg.verificationStatus === 'Pending' && (
                <>
                  <button
                    className="btn btn-outline"
                    style={{ color: '#DC2626', borderColor: '#DC2626' }}
                    onClick={() => {
                      setConfirmReject(selectedReg);
                      setRejectionReason('');
                    }}
                    id="modal-reject-btn"
                  >
                    <XCircle size={15} /> Reject
                  </button>

                  <button
                    className="btn btn-primary"
                    style={{ background: '#059669', borderColor: '#059669' }}
                    onClick={() => setConfirmApprove(selectedReg)}
                    id="modal-approve-btn"
                  >
                    <CheckCircle2 size={15} /> Approve Registration
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          CONFIRMATION DIALOG: Approve Registration
          Requirement 6: "Confirmation dialogs for approval and rejection"
          ───────────────────────────────────────────────────────────────── */}
      {confirmApprove && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            padding: 20,
          }}
          id="approve-confirmation-modal"
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 460,
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={28} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>
              Approve {confirmApprove.role} Registration?
            </h3>

            <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.5, marginBottom: 20 }}>
              Are you sure you want to approve <strong>{confirmApprove.fullName}</strong>?
              {confirmApprove.registrationNumber && (
                <span style={{ display: 'block', marginTop: 6, color: '#065F46', fontWeight: 600 }}>
                  SLMC Reg No: {confirmApprove.registrationNumber}
                </span>
              )}
              Once approved, this user will immediately be permitted to sign in via the Staff Login portal.
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmApprove(null)}
                disabled={actionProcessing}
                id="cancel-approve-btn"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: '#059669', borderColor: '#059669' }}
                onClick={handleApproveConfirmed}
                disabled={actionProcessing}
                id="confirm-approve-action-btn"
              >
                {actionProcessing ? <RefreshCw size={14} className="spin" /> : <CheckCircle2 size={14} />} Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          CONFIRMATION DIALOG: Reject Registration
          Requirement 6: "Rejection: Allow administrators to reject a pending registration and optionally provide a rejection reason"
          ───────────────────────────────────────────────────────────────── */}
      {confirmReject && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            padding: 20,
          }}
          id="reject-confirmation-modal"
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(220, 38, 38, 0.1)',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Reject {confirmReject.role} Application
                </h3>
                <div style={{ fontSize: 12.5, color: '#64748B' }}>
                  Applicant: {confirmReject.fullName} ({confirmReject.email})
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginBottom: 14 }}>
              The account will be marked as Rejected and prevented from accessing staff routes. You may optionally specify the reason for the decision:
            </p>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Reason for Rejection (Optional)
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="e.g. Unverified professional registration certificate, mismatch in clinic address..."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                style={{ fontSize: 13, resize: 'vertical' }}
                id="reject-reason-textarea"
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmReject(null)}
                disabled={actionProcessing}
                id="cancel-reject-btn"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: '#DC2626', borderColor: '#DC2626' }}
                onClick={handleRejectConfirmed}
                disabled={actionProcessing}
                id="confirm-reject-action-btn"
              >
                {actionProcessing ? <RefreshCw size={14} className="spin" /> : <XCircle size={14} />} Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
