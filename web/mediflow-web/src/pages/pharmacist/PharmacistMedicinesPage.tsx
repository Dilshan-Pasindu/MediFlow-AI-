import { useState, useEffect } from 'react';
import { Pill, Search, Filter, Sparkles, AlertTriangle, CheckCircle, ShieldAlert, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { apiGetPharmacistMedicines, apiRunMedicationCheck, type MedicationCheckResult } from '../../services/api';

export default function PharmacistMedicinesPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // AI Drug Checker Sandbox
  const [selectedForCheck, setSelectedForCheck] = useState<string[]>([]);
  const [patientAllergyInput, setPatientAllergyInput] = useState('');
  const [aiChecking, setAiChecking] = useState(false);
  const [aiResult, setAiResult] = useState<MedicationCheckResult | null>(null);

  useEffect(() => {
    loadMedicines();
  }, [selectedCategory]);

  async function loadMedicines() {
    setLoading(true);
    try {
      const data = await apiGetPharmacistMedicines(
        searchTerm || undefined,
        selectedCategory === 'ALL' ? undefined : selectedCategory
      );
      setMedicines(data || []);
    } catch (err) {
      console.error('Failed to load medicines', err);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelectDrug(name: string) {
    if (selectedForCheck.includes(name)) {
      setSelectedForCheck(selectedForCheck.filter(n => n !== name));
    } else {
      if (selectedForCheck.length >= 4) return;
      setSelectedForCheck([...selectedForCheck, name]);
    }
  }

  async function runSafetyCheck() {
    if (selectedForCheck.length === 0) return;
    setAiChecking(true);
    try {
      const res = await apiRunMedicationCheck({
        medications: selectedForCheck,
        patient_allergies: patientAllergyInput || undefined,
      });
      setAiResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAiChecking(false);
    }
  }

  const categories = ['ALL', 'Antibiotic', 'Analgesic', 'Cardiovascular', 'Gastrointestinal', 'Respiratory', 'Antihistamine'];

  const filteredMedicines = medicines.filter(m =>
    m.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Medicine Formulary & Catalog"
          subtitle="Explore formulary items, check unit inventory, and screen clinical drug combinations"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={loadMedicines} id="refresh-medicines-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="pharma"
            title="Formulary & Medication Intelligence"
            subtitle="Verified pharmaceutical catalog with automated Drug-Drug Interaction (DDI) & allergy cross-checker"
            loading={loading}
            stats={[
              { label: 'Catalog Items', value: medicines.length, icon: '💊' },
              { label: 'Categories', value: '7 Active', icon: '🏷️' },
              { label: 'DDI Intelligence', value: 'Level 2 Active', icon: '🤖' },
            ]}
          />

          {/* AI Clinical Sandbox Card */}
          <div className="card" style={{ marginBottom: 24, border: '1.5px solid rgba(14, 165, 233, 0.3)', background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.95))' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0369A1' }}>Agent 3: Medication Intelligence Sandbox</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Select medicines below to test multi-drug interactions & patient allergy safety</div>
                </div>
              </div>
              {selectedForCheck.length > 0 && (
                <button className="btn btn-ghost btn-xs" onClick={() => { setSelectedForCheck([]); setAiResult(null); }}>
                  Clear Selected
                </button>
              )}
            </div>

            <div className="card-body" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Selected Drugs ({selectedForCheck.length}/4):</span>
                {selectedForCheck.length === 0 ? (
                  <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontStyle: 'italic' }}>Click any drug in the catalog below to add to screening</span>
                ) : (
                  selectedForCheck.map(drug => (
                    <span key={drug} className="badge badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px' }}>
                      <Pill size={12} /> {drug}
                      <button onClick={() => toggleSelectDrug(drug)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 4, color: 'inherit' }}>×</button>
                    </span>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Optional patient allergies (e.g. Penicillin, Aspirin)..."
                  value={patientAllergyInput}
                  onChange={e => setPatientAllergyInput(e.target.value)}
                  style={{ flex: 1, minWidth: 260, height: 38, padding: '0 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-color)', fontSize: 13 }}
                />
                <button
                  className="btn btn-primary"
                  onClick={runSafetyCheck}
                  disabled={selectedForCheck.length === 0 || aiChecking}
                  style={{ height: 38, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Sparkles size={15} />
                  {aiChecking ? 'Evaluating Safety...' : 'Run Medication Intelligence Check'}
                </button>
              </div>

              {/* AI Check Result Display */}
              {aiResult && (
                <div style={{ marginTop: 16, padding: 16, borderRadius: 'var(--r-md)', background: aiResult.safe_to_dispense ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${aiResult.safe_to_dispense ? '#10B981' : '#EF4444'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {aiResult.safe_to_dispense ? <CheckCircle size={20} color="#059669" /> : <ShieldAlert size={20} color="#DC2626" />}
                      <span style={{ fontWeight: 800, fontSize: 14.5, color: aiResult.safe_to_dispense ? '#065F46' : '#991B1B' }}>
                        {aiResult.safe_to_dispense ? 'Safe to Dispense' : 'Clinical Caution / High-Risk Flagged'}
                      </span>
                    </div>
                    <span className={`badge ${aiResult.safety_score >= 80 ? 'badge-green' : 'badge-danger'}`}>
                      Safety Score: {aiResult.safety_score}/100
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: '6px 0 10px' }}>{aiResult.summary}</p>

                  {/* Allergy Warnings */}
                  {aiResult.allergy_warnings.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {aiResult.allergy_warnings.map((w, i) => (
                        <div key={i} style={{ fontSize: 12.5, color: '#B91C1C', fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                          <AlertTriangle size={14} /> {w}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DDI Interactions */}
                  {aiResult.interactions.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Detected Drug Interactions:</div>
                      {aiResult.interactions.map((inter, i) => (
                        <div key={i} style={{ marginTop: 6, padding: '8px 12px', background: 'white', borderRadius: 6, border: '1px solid rgba(0,0,0,0.06)' }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: inter.severity === 'High' ? '#DC2626' : '#D97706' }}>
                            [{inter.severity} Risk] {inter.drug_pair.join(' + ')}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{inter.description}</div>
                          <div style={{ fontSize: 11.5, color: '#0369A1', marginTop: 4, fontWeight: 600 }}>💡 Rationale: {inter.recommendation}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Alternatives */}
                  {aiResult.alternatives.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bioequivalent Alternative Recommendations:</div>
                      {aiResult.alternatives.map((alt, i) => (
                        <div key={i} style={{ marginTop: 6, padding: '8px 12px', background: 'white', borderRadius: 6, border: '1px solid rgba(0,0,0,0.06)' }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#059669' }}>
                            Substitute {alt.original_drug} → {alt.alternative_drug}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{alt.reason} ({alt.dosage_guidance})</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search & Categories Filter */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body" style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search medicines by brand or generic name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--r-md)', border: '1px solid var(--border-color)', fontSize: 13.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 12, height: 34, borderRadius: 'var(--r-md)' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Medicines Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--r-lg)' }} />
              ))}
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <Pill size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <div className="empty-title">No medicines found</div>
              <div className="empty-sub">Try searching with a different brand or generic keyword.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filteredMedicines.map(med => {
                const isSelected = selectedForCheck.includes(med.medicineName);
                return (
                  <div
                    key={med.id}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--med-teal)' : '1px solid var(--border-color)',
                      boxShadow: isSelected ? '0 0 0 3px rgba(14, 165, 233, 0.15)' : undefined,
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => toggleSelectDrug(med.medicineName)}
                  >
                    <div className="card-body" style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(14, 165, 233, 0.1)', color: 'var(--med-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Pill size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--text-primary)' }}>{med.medicineName}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{med.genericName}</div>
                          </div>
                        </div>
                        <span className="badge badge-teal" style={{ fontSize: 11 }}>{med.category}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Unit: {med.unitOfMeasure}</span>
                        <button
                          className={`btn btn-xs ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                          style={{ fontSize: 11.5 }}
                          onClick={e => {
                            e.stopPropagation();
                            toggleSelectDrug(med.medicineName);
                          }}
                        >
                          {isSelected ? '✓ Added to Check' : '+ Check Interactions'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
