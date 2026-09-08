import { useState, useEffect } from 'react';
import { Save, User, Phone, Mail, Droplets, AlertTriangle, Loader, CheckCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetProfile, apiUpdateProfile, getUser } from '../services/api';

export default function ProfilePage() {
  const currentUser = getUser();
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', bloodGroup: '', allergies: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetProfile().then(d => {
      if (d) setForm({ fullName: d.fullName || currentUser?.fullName || '', email: d.email || currentUser?.email || '', phoneNumber: d.phoneNumber || '', bloodGroup: d.bloodGroup || '', allergies: d.allergies || '', address: d.address || '' });
    }).catch(() => {
      setForm({ fullName: currentUser?.fullName || '', email: currentUser?.email || '', phoneNumber: '', bloodGroup: '', allergies: '', address: '' });
    }).finally(() => setLoading(false));
  }, []);

  const set = (key: string) => (e: any) => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess(false);
    try {
      await apiUpdateProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.');
    } finally { setSaving(false); }
  }

  const initials = form.fullName ? form.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '?';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="My Profile" subtitle="Manage your personal information and health details" />
        <div className="page-body fade-in">

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>

            {/* Avatar Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: 28 }}>
                  <div style={{ width: 80, height: 80, background: 'var(--gradient-primary)', borderRadius: 'var(--r-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'Outfit, sans-serif', boxShadow: '0 8px 24px rgba(3,105,161,0.3)' }}>
                    {initials}
                  </div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{form.fullName || 'Your Name'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{form.email}</div>
                  <span className="badge badge-blue" style={{ marginTop: 10 }}>{currentUser?.role || 'Patient'}</span>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--med-blue-50)', border: '1.5px solid var(--med-blue-200)' }}>
                <div className="card-body">
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--med-blue)', marginBottom: 10 }}>Health Summary</div>
                  <div className="info-row" style={{ fontSize: 13 }}><span style={{ color: 'var(--text-muted)', minWidth: 80 }}>Blood Group</span><strong style={{ color: 'var(--danger)' }}>{form.bloodGroup || '—'}</strong></div>
                  <div className="info-row" style={{ fontSize: 13, alignItems: 'flex-start' }}><span style={{ color: 'var(--text-muted)', minWidth: 80 }}>Allergies</span><span style={{ color: 'var(--text-primary)' }}>{form.allergies || 'None recorded'}</span></div>
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
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Loader size={28} className="spin" style={{ color: 'var(--med-blue)' }} /></div>
                ) : (
                  <form onSubmit={handleSave} id="profile-form">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="form-input-wrap">
                          <User size={15} className="form-icon" />
                          <input type="text" className="form-input has-icon" id="profile-fullname" value={form.fullName} onChange={set('fullName')} placeholder="Your full name" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="form-input-wrap">
                          <Mail size={15} className="form-icon" />
                          <input type="email" className="form-input has-icon" id="profile-email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <div className="form-input-wrap">
                          <Phone size={15} className="form-icon" />
                          <input type="tel" className="form-input has-icon" id="profile-phone" value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="+94 77 xxx xxxx" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Blood Group</label>
                        <div className="form-input-wrap">
                          <Droplets size={15} className="form-icon" />
                          <select className="form-select has-icon" id="profile-blood-group" value={form.bloodGroup} onChange={set('bloodGroup')} style={{ paddingLeft: 40 }}>
                            <option value="">Select blood group</option>
                            {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input type="text" className="form-input" id="profile-address" value={form.address} onChange={set('address')} placeholder="Your address" />
                    </div>
                    <div className="form-group">
                      <label className="form-label"><AlertTriangle size={13} style={{ color: 'var(--warning)' }} /> Known Allergies <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(important for medication safety)</span></label>
                      <textarea className="form-textarea" id="profile-allergies" value={form.allergies} onChange={set('allergies')} placeholder="e.g. Penicillin, Aspirin, Peanuts..." rows={3} />
                    </div>

                    {error && <div className="form-error"><AlertTriangle size={14} />{error}</div>}
                    {success && <div className="form-success"><CheckCircle size={14} />Profile updated successfully!</div>}

                    <button type="submit" className="btn btn-primary btn-lg" disabled={saving} id="save-profile-btn">
                      {saving ? <><Loader size={16} className="spin" />Saving...</> : <><Save size={16} />Save Changes</>}
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
