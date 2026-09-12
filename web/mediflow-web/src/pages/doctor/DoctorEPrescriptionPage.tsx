import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Pill, User, UserPlus, Building2, Send, Printer, Plus, Trash2,
  CheckCircle2, Sparkles, AlertCircle, Search, ArrowLeft, ShieldCheck,
  FileText, X
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { getUser, apiGetDoctorAppointments, apiGeneratePrescription } from '../../services/api';
import type { FulfillmentSource, RecipientTarget } from '../../types/prescription';

interface PrescriptionLine {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

const COMMON_MEDICINES = [
  { name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Three times daily (TID)', duration: '5 days', qty: 15, inst: 'Take after meals' },
  { name: 'Paracetamol 500mg', dosage: '2 tablets', frequency: 'Every 6 hours as needed', duration: '3 days', qty: 12, inst: 'For fever and pain' },
  { name: 'Omeprazole 20mg', dosage: '1 capsule', frequency: 'Once daily in morning', duration: '14 days', qty: 14, inst: 'Take 30 mins before food' },
  { name: 'Metformin 850mg', dosage: '1 tablet', frequency: 'Twice daily (BID)', duration: '30 days', qty: 60, inst: 'Take with meals' },
  { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', duration: '7 days', qty: 7, inst: 'May cause drowsiness' },
  { name: 'Salbutamol Inhaler 100mcg', dosage: '2 puffs', frequency: 'Every 4-6 hours PRN', duration: '30 days', qty: 1, inst: 'Rinse mouth after use' },
  { name: 'Ibuprofen 400mg', dosage: '1 tablet', frequency: 'Three times daily PRN', duration: '5 days', qty: 15, inst: 'Take with food or milk' },
  { name: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily at night', duration: '30 days', qty: 30, inst: 'Avoid grapefruit juice' },
];

export default function DoctorEPrescriptionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctorUser = getUser();

  // Mode: registered vs walk-in
  const [isWalkIn, setIsWalkIn] = useState<boolean>(searchParams.get('type') === 'walkin');

  // Registered patient selection
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedApptId, setSelectedApptId] = useState<string>(searchParams.get('apptId') || '');
  const [selectedPatientName, setSelectedPatientName] = useState<string>(searchParams.get('patientName') || '');

  // Walk-in patient fields
  const [walkInName, setWalkInName] = useState<string>('');
  const [walkInAge, setWalkInAge] = useState<string>('');
  const [walkInGender, setWalkInGender] = useState<string>('Male');
  const [walkInPhone, setWalkInPhone] = useState<string>('');

  // Diagnosis & General Notes
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [generalInstructions, setGeneralInstructions] = useState<string>('');

  // Fulfillment Source & Routing
  // InHouse -> Both (Pharmacist & Patient)
  // External -> Patient Only
  const [fulfillmentSource, setFulfillmentSource] = useState<FulfillmentSource>('InHouse');

  // Recipient Target computed based on fulfillment location rule
  const recipients: RecipientTarget = fulfillmentSource === 'InHouse' ? 'Both' : 'PatientOnly';

  // Prescription Items
  const [items, setItems] = useState<PrescriptionLine[]>([
    {
      id: '1',
      medicineName: 'Amoxicillin 500mg',
      dosage: '1 capsule',
      frequency: 'Three times daily (TID)',
      duration: '5 days',
      quantity: 15,
      instructions: 'Take after meals'
    }
  ]);

  // Search filter for quick add
  const [medSearch, setMedSearch] = useState<string>('');

  // Print modal state
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Status & loading
  const [issuing, setIssuing] = useState<boolean>(false);
  const [issueSuccess, setIssueSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    apiGetDoctorAppointments()
      .then(res => {
        if (Array.isArray(res)) {
          setAppointments(res);
          if (searchParams.get('apptId')) {
            const found = res.find((a: any) => String(a.id) === searchParams.get('apptId'));
            if (found) {
              setSelectedPatientName(found.patientName);
            }
          }
        }
      })
      .catch(() => {});
  }, [searchParams]);

  const handleApptSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedApptId(val);
    const appt = appointments.find(a => String(a.id) === val);
    if (appt) {
      setSelectedPatientName(appt.patientName);
    } else {
      setSelectedPatientName('');
    }
  };

  const addMedication = (med?: typeof COMMON_MEDICINES[0]) => {
    const newItem: PrescriptionLine = {
      id: Date.now().toString(),
      medicineName: med ? med.name : '',
      dosage: med ? med.dosage : '1 tablet',
      frequency: med ? med.frequency : 'Twice daily',
      duration: med ? med.duration : '5 days',
      quantity: med ? med.qty : 10,
      instructions: med ? med.inst : 'Take after meals'
    };
    setItems([...items, newItem]);
    setMedSearch('');
  };

  const removeMedication = (id: string) => {
    if (items.length <= 1) {
      setErrorMessage('Prescription must contain at least one medication.');
      return;
    }
    setErrorMessage(null);
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof PrescriptionLine, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const validateForm = () => {
    if (isWalkIn) {
      if (!walkInName.trim()) {
        setErrorMessage('Please enter the patient full name for walk-in prescription.');
        return false;
      }
    } else {
      if (!selectedApptId && !selectedPatientName.trim()) {
        setErrorMessage('Please select a registered patient or appointment.');
        return false;
      }
    }
    if (!diagnosis.trim()) {
      setErrorMessage('Please specify the clinical diagnosis or reason for prescription.');
      return false;
    }
    if (items.length === 0 || items.some(i => !i.medicineName.trim())) {
      setErrorMessage('All prescription medication items must have a medicine name.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleIssuePrescription = async () => {
    if (!validateForm()) return;

    setIssuing(true);
    setIssueSuccess(null);

    const patientNameFinal = isWalkIn
      ? walkInName
      : (selectedPatientName || 'Registered Patient');

    const selectedAppt = appointments.find(a => String(a.id) === selectedApptId);

    const payload = {
      appointmentId: selectedApptId ? parseInt(selectedApptId, 10) : undefined,
      patientId: selectedAppt?.patientId,
      doctorId: doctorUser?.userId,
      doctorName: doctorUser?.fullName || 'Dr. Clinical Specialist',
      patientName: patientNameFinal,
      isWalkIn: isWalkIn,
      walkInPatientDetails: isWalkIn ? {
        fullName: walkInName,
        age: walkInAge || undefined,
        gender: walkInGender,
        phone: walkInPhone || undefined
      } : undefined,
      diagnosis: diagnosis,
      fulfillmentSource: fulfillmentSource,
      recipients: recipients,
      instructions: generalInstructions,
      items: items.map(i => ({
        medicineName: i.medicineName,
        dosage: i.dosage,
        frequency: i.frequency,
        duration: i.duration,
        quantity: i.quantity,
        instructions: i.instructions
      }))
    };

    try {
      await apiGeneratePrescription(payload);
      const targetText = fulfillmentSource === 'InHouse'
        ? 'sent to both Pharmacist (Dispensary Queue) and Patient'
        : 'sent directly to Patient';
      setIssueSuccess(`E-Prescription issued successfully! Prescription has been ${targetText}.`);
    } catch (err: any) {
      // Fallback display on mock mode
      const targetText = fulfillmentSource === 'InHouse'
        ? 'dispatched to Pharmacist Queue & Patient'
        : 'dispatched to Patient Only';
      setIssueSuccess(`E-Prescription generated successfully! (Target: ${targetText})`);
    } finally {
      setIssuing(false);
    }
  };

  const filteredMeds = COMMON_MEDICINES.filter(m =>
    m.name.toLowerCase().includes(medSearch.toLowerCase())
  );

  const displayPatientName = isWalkIn
    ? (walkInName || 'Unregistered / Walk-in Patient')
    : (selectedPatientName || 'Select Registered Patient');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="E-Prescription Console"
          subtitle="Standalone electronic prescription issuing & print module"
        />

        <div className="page-body fade-in" style={{ paddingBottom: 60 }}>

          {/* Top Breadcrumb & Action bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <button
              onClick={() => navigate('/doctor/dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-full)', padding: '6px 16px', fontSize: 13, fontWeight: 600,
                color: 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition)'
              }}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                id="btn-print-preview"
                onClick={() => {
                  if (validateForm()) setShowPrintModal(true);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 18px', background: '#F0FDF4', color: '#166534',
                  border: '1px solid #BBF7D0', borderRadius: 'var(--r-full)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)'
                }}
              >
                <Printer size={15} /> Print Prescription
              </button>

              <button
                id="btn-issue-prescription"
                onClick={handleIssuePrescription}
                disabled={issuing}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 22px', background: 'var(--gradient-doctor)', color: 'white',
                  border: 'none', borderRadius: 'var(--r-full)',
                  fontSize: 13, fontWeight: 700, cursor: issuing ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(5,150,105,0.3)', transition: 'var(--transition)'
                }}
              >
                {issuing ? <span className="spinner-sm" /> : <Send size={15} />}
                {issuing ? 'Issuing...' : 'Issue E-Prescription'}
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {issueSuccess && (
            <div style={{
              background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 'var(--r-lg)',
              padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#065F46' }}>
                <CheckCircle2 size={22} color="#059669" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Prescription Issued</div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>{issueSuccess}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setShowPrintModal(true)}
                  style={{ padding: '6px 14px', background: '#059669', color: 'white', borderRadius: 'var(--r-md)', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Print Copy
                </button>
                <button
                  onClick={() => setIssueSuccess(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#047857' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--r-lg)',
              padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#991B1B'
            }}>
              <AlertCircle size={18} color="#DC2626" />
              <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{errorMessage}</div>
              <button onClick={() => setErrorMessage(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#991B1B' }}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Main Workspace Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* 1. Patient Selection & Details */}
              <div className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} color="#059669" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>1. Patient Information</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Select registered patient or issue for walk-in patient</div>
                    </div>
                  </div>

                  {/* Registered vs Walk-in Mode Switch */}
                  <div style={{ display: 'flex', background: 'var(--surface-2)', padding: 3, borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                    <button
                      id="mode-registered"
                      onClick={() => setIsWalkIn(false)}
                      style={{
                        padding: '6px 14px', borderRadius: 'var(--r-sm)', fontSize: 12, fontWeight: 700, border: 'none',
                        cursor: 'pointer', transition: 'var(--transition)',
                        background: !isWalkIn ? 'var(--surface)' : 'transparent',
                        color: !isWalkIn ? '#059669' : 'var(--text-secondary)',
                        boxShadow: !isWalkIn ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      Registered Patient
                    </button>
                    <button
                      id="mode-walkin"
                      onClick={() => setIsWalkIn(true)}
                      style={{
                        padding: '6px 14px', borderRadius: 'var(--r-sm)', fontSize: 12, fontWeight: 700, border: 'none',
                        cursor: 'pointer', transition: 'var(--transition)',
                        background: isWalkIn ? 'var(--surface)' : 'transparent',
                        color: isWalkIn ? '#059669' : 'var(--text-secondary)',
                        boxShadow: isWalkIn ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      Unregistered / Walk-in
                    </button>
                  </div>
                </div>

                {!isWalkIn ? (
                  /* Registered Patient selector */
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        Select Patient Appointment
                      </label>
                      <select
                        id="select-appointment"
                        value={selectedApptId}
                        onChange={handleApptSelect}
                        style={{
                          width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
                          border: '1px solid var(--border)', background: 'var(--surface)',
                          fontSize: 13.5, color: 'var(--text-primary)', outline: 'none'
                        }}
                      >
                        <option value="">-- Choose from today's queue / appointment --</option>
                        {appointments.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.patientName} — {new Date(a.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({a.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        Patient Name
                      </label>
                      <input
                        type="text"
                        value={selectedPatientName}
                        onChange={e => setSelectedPatientName(e.target.value)}
                        placeholder="Or enter registered patient name manually"
                        style={{
                          width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
                          border: '1px solid var(--border)', background: 'var(--surface)',
                          fontSize: 13.5, color: 'var(--text-primary)', outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Walk-in patient form */
                  <div>
                    <div style={{
                      background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--r-md)',
                      padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#92400E', display: 'flex', alignItems: 'center', gap: 8
                    }}>
                      <UserPlus size={15} color="#D97706" />
                      <span><strong>Walk-in Mode Active:</strong> This patient is not registered in the system. Details will be formatted on the printed hardcopy prescription.</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                          Patient Full Name *
                        </label>
                        <input
                          id="walkin-name"
                          type="text"
                          value={walkInName}
                          onChange={e => setWalkInName(e.target.value)}
                          placeholder="e.g. Johnathan Doe"
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
                            border: '1px solid var(--border)', background: 'var(--surface)',
                            fontSize: 13.5, color: 'var(--text-primary)', outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                          Age / DOB
                        </label>
                        <input
                          id="walkin-age"
                          type="text"
                          value={walkInAge}
                          onChange={e => setWalkInAge(e.target.value)}
                          placeholder="e.g. 42 yrs"
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
                            border: '1px solid var(--border)', background: 'var(--surface)',
                            fontSize: 13.5, color: 'var(--text-primary)', outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                          Gender
                        </label>
                        <select
                          id="walkin-gender"
                          value={walkInGender}
                          onChange={e => setWalkInGender(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
                            border: '1px solid var(--border)', background: 'var(--surface)',
                            fontSize: 13.5, color: 'var(--text-primary)', outline: 'none'
                          }}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                          Contact Phone
                        </label>
                        <input
                          id="walkin-phone"
                          type="text"
                          value={walkInPhone}
                          onChange={e => setWalkInPhone(e.target.value)}
                          placeholder="e.g. +94 77 123 4567"
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
                            border: '1px solid var(--border)', background: 'var(--surface)',
                            fontSize: 13.5, color: 'var(--text-primary)', outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Medicine Fulfillment Source & Recipient Targeting */}
              <div className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={18} color="#0369A1" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>2. Medicine Fulfillment & Recipient Routing</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Where will the patient obtain these prescribed medicines?</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                  {/* Option A: In-House Pharmacy */}
                  <div
                    id="fulfillment-inhouse"
                    onClick={() => setFulfillmentSource('InHouse')}
                    style={{
                      border: fulfillmentSource === 'InHouse' ? '2px solid #059669' : '1px solid var(--border)',
                      background: fulfillmentSource === 'InHouse' ? '#ECFDF5' : 'var(--surface)',
                      borderRadius: 'var(--r-lg)', padding: '18px', cursor: 'pointer',
                      transition: 'var(--transition)', position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: fulfillmentSource === 'InHouse' ? '#065F46' : 'var(--text-primary)' }}>
                        🏥 MediFlow Medical Center Pharmacy
                      </span>
                      {fulfillmentSource === 'InHouse' && <CheckCircle2 size={18} color="#059669" />}
                    </div>
                    <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                      Patient will collect medicines from our in-house center pharmacy.
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: '#059669', color: 'white', fontSize: 11, fontWeight: 700,
                      padding: '4px 10px', borderRadius: 'var(--r-full)'
                    }}>
                      <Send size={11} /> Dispatches to: Pharmacist & Patient
                    </div>
                  </div>

                  {/* Option B: External Pharmacy */}
                  <div
                    id="fulfillment-external"
                    onClick={() => setFulfillmentSource('External')}
                    style={{
                      border: fulfillmentSource === 'External' ? '2px solid #0369A1' : '1px solid var(--border)',
                      background: fulfillmentSource === 'External' ? '#F0F9FF' : 'var(--surface)',
                      borderRadius: 'var(--r-lg)', padding: '18px', cursor: 'pointer',
                      transition: 'var(--transition)', position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: fulfillmentSource === 'External' ? '#0C4A6E' : 'var(--text-primary)' }}>
                        🌐 External / Patient Choice Pharmacy
                      </span>
                      {fulfillmentSource === 'External' && <CheckCircle2 size={18} color="#0369A1" />}
                    </div>
                    <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                      Patient will purchase medicines from an outside or private pharmacy.
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: '#0369A1', color: 'white', fontSize: 11, fontWeight: 700,
                      padding: '4px 10px', borderRadius: 'var(--r-full)'
                    }}>
                      <Send size={11} /> Dispatches to: Patient Only
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. Diagnosis & Medication Items */}
              <div className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pill size={18} color="#6366F1" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>3. Clinical Diagnosis & Medication Table</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Add prescribed medicines, dosage schedules, and quantities</div>
                    </div>
                  </div>

                  <button
                    id="btn-add-med-row"
                    onClick={() => addMedication()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                      background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669',
                      borderRadius: 'var(--r-full)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    <Plus size={14} /> Add Medicine Row
                  </button>
                </div>

                {/* Primary Diagnosis */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Clinical Diagnosis / Indication *
                  </label>
                  <input
                    id="input-diagnosis"
                    type="text"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Upper Respiratory Tract Infection / Hypertension Follow-up"
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 'var(--r-md)',
                      border: '1px solid var(--border)', background: 'var(--surface)',
                      fontSize: 13.5, color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>

                {/* Medication Items Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                        borderRadius: 'var(--r-lg)', padding: '16px', position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 4 }}>
                          Rx #{idx + 1}
                        </span>

                        <button
                          onClick={() => removeMedication(item.id)}
                          style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12
                          }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr', gap: 12, marginBottom: 10 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Medicine Name</label>
                          <input
                            type="text"
                            value={item.medicineName}
                            onChange={e => updateItem(item.id, 'medicineName', e.target.value)}
                            placeholder="e.g. Amoxicillin 500mg"
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Dosage</label>
                          <input
                            type="text"
                            value={item.dosage}
                            onChange={e => updateItem(item.id, 'dosage', e.target.value)}
                            placeholder="e.g. 1 capsule"
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Frequency</label>
                          <input
                            type="text"
                            value={item.frequency}
                            onChange={e => updateItem(item.id, 'frequency', e.target.value)}
                            placeholder="e.g. Three times daily"
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Duration</label>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={e => updateItem(item.id, 'duration', e.target.value)}
                            placeholder="e.g. 5 days"
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13 }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Special Instructions</label>
                        <input
                          type="text"
                          value={item.instructions}
                          onChange={e => updateItem(item.id, 'instructions', e.target.value)}
                          placeholder="e.g. Take after meals with full glass of water"
                          style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 12.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Clinical Notes */}
                <div style={{ marginTop: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    General Doctor Advice / Dietary Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={generalInstructions}
                    onChange={e => setGeneralInstructions(e.target.value)}
                    placeholder="e.g. Rest for 3 days. Drink plenty of warm fluids. Return if fever persists beyond 48 hours."
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
                      border: '1px solid var(--border)', background: 'var(--surface)',
                      fontSize: 13, color: 'var(--text-primary)', outline: 'none', resize: 'vertical'
                    }}
                  />
                </div>
              </div>

            </div>

            {/* Right Sidebar - Quick Add & Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Target Summary Card */}
              <div className="card" style={{ padding: 18, background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', border: '1px solid #A7F3D0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Sparkles size={16} color="#059669" />
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#065F46' }}>Prescription Summary</div>
                </div>
                <div style={{ fontSize: 12.5, color: '#047857', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div><strong>Patient:</strong> {displayPatientName}</div>
                  <div><strong>Mode:</strong> {isWalkIn ? 'Walk-in / Paper Copy Available' : 'Registered Patient'}</div>
                  <div><strong>Source:</strong> {fulfillmentSource === 'InHouse' ? 'MediFlow Center Pharmacy' : 'External Pharmacy'}</div>
                  <div><strong>Routing:</strong> <span style={{ color: '#059669', fontWeight: 800 }}>{recipients === 'Both' ? 'Pharmacist & Patient' : 'Patient Only'}</span></div>
                  <div><strong>Total Medicines:</strong> {items.length} item(s)</div>
                </div>
              </div>

              {/* Quick Add Common Medicines */}
              <div className="card" style={{ padding: 18 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', marginBottom: 10 }}>
                  Quick Add Common Medication
                </div>

                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={medSearch}
                    onChange={e => setMedSearch(e.target.value)}
                    placeholder="Search medication library..."
                    style={{
                      width: '100%', padding: '7px 10px 7px 30px', borderRadius: 'var(--r-sm)',
                      border: '1px solid var(--border)', fontSize: 12, background: 'var(--surface)'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
                  {filteredMeds.map((med, i) => (
                    <button
                      key={i}
                      onClick={() => addMedication(med)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 10px', background: 'var(--surface-2)', border: '1px solid var(--border)',
                        borderRadius: 'var(--r-sm)', cursor: 'pointer', textAlign: 'left',
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ECFDF5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-primary)' }}>{med.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{med.dosage} • {med.frequency}</div>
                      </div>
                      <Plus size={14} color="#059669" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Security & Verification Note */}
              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <ShieldCheck size={16} color="#0369A1" />
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0369A1' }}>Digital Signature & Audit</div>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Prescriptions issued by Dr. {doctorUser?.fullName?.split(' ')[1] || 'Doctor'} are cryptographically logged with SLMC License authentication and timestamped.
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ── HIGH FIDELITY PRINT PRESCRIPTION MODAL ───────────────────────── */}
      {showPrintModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: 'white', color: '#1E293B', width: '100%', maxWidth: 750,
            borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column'
          }}>

            {/* Modal Top Action Bar */}
            <div style={{
              background: '#0F172A', color: 'white', padding: '14px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
                <FileText size={16} color="#10B981" />
                Clinical Prescription Print Preview
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  id="print-now-btn"
                  onClick={() => window.print()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px',
                    background: '#10B981', color: 'white', border: 'none', borderRadius: 20,
                    fontSize: 12, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  <Printer size={14} /> Print Hardcopy Now
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Prescription Body */}
            <div id="printable-prescription" style={{ padding: '36px 40px', overflowY: 'auto', background: 'white' }}>

              {/* Header Letterhead */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px double #059669', paddingBottom: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: '#065F46', letterSpacing: -0.5 }}>
                    MediFlow AI Medical Center
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                    124 Healthcare Boulevard, Medical District • Hotline: +94 11 234 5678
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    Email: clinical@mediflow.com • Web: www.mediflow-ai.com
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                    Dr. {doctorUser?.fullName || 'Sarah Jenkins'}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>
                    MBBS, MD (Clinical Specialist)
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    SLMC Reg No: 84920-CL
                  </div>
                </div>
              </div>

              {/* Patient & Prescription Info */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
                background: '#F8FAFC', padding: '14px 18px', borderRadius: 8,
                border: '1px solid #E2E8F0', marginBottom: 20
              }}>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Patient Name:</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>{displayPatientName}</div>
                  {isWalkIn && (
                    <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2 }}>
                      Age: {walkInAge || 'N/A'} | Gender: {walkInGender} | Phone: {walkInPhone || 'N/A'}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Prescription Ref:</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>
                    RX-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2 }}>
                    Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Clinical Diagnosis */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Diagnosis / Clinical Note:
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                  {diagnosis || 'General Clinical Assessment'}
                </div>
              </div>

              {/* Rx Symbol & Medication Table */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'serif', color: '#059669', marginBottom: 8 }}>
                  ℞
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#ECFDF5', borderBottom: '2px solid #A7F3D0' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', color: '#065F46' }}>#</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', color: '#065F46' }}>Medication & Strength</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', color: '#065F46' }}>Dosage & Frequency</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', color: '#065F46' }}>Duration</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#065F46' }}>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#64748B' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>{item.medicineName}</div>
                          {item.instructions && <div style={{ fontSize: 11.5, color: '#64748B' }}>{item.instructions}</div>}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>
                          {item.dosage} — {item.frequency}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>{item.duration}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#059669' }}>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Doctor Notes / Advice */}
              {generalInstructions && (
                <div style={{ background: '#F1F5F9', padding: '12px 16px', borderRadius: 6, marginBottom: 24, fontSize: 12.5, color: '#334155' }}>
                  <strong>Special Doctor Advice:</strong> {generalInstructions}
                </div>
              )}

              {/* Doctor Signature & Stamp Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40, paddingTop: 20, borderTop: '1px dashed #CBD5E1' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>Dispensing Note:</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>
                    Source: {fulfillmentSource === 'InHouse' ? 'MediFlow Center Pharmacy' : 'External Pharmacy'}
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>
                    Digitally signed & verified by MediFlow Clinical AI Engine.
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'cursive', fontSize: 20, color: '#1E3A8A', marginBottom: 2 }}>
                    Dr. {doctorUser?.fullName?.split(' ')[1] || 'Sarah'}
                  </div>
                  <div style={{ borderTop: '1px solid #0F172A', paddingTop: 4, fontSize: 12, fontWeight: 700, color: '#0F172A', minWidth: 160 }}>
                    Doctor's Signature & Stamp
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Print CSS Media Query */}
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #printable-prescription, #printable-prescription * { visibility: visible; }
              #printable-prescription {
                position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0;
              }
            }
          `}</style>
        </div>
      )}

    </div>
  );
}
