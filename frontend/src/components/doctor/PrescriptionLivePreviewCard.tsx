import React from 'react';
import { 
  Pill, TestTube, Sparkles, 
  ShieldCheck, ArrowRight, Activity
} from 'lucide-react';
import type { AutoFilledPrescriptionDraft } from '../../types/consultation';

interface PrescriptionLivePreviewCardProps {
  draft: AutoFilledPrescriptionDraft;
  onNavigateToDraft?: () => void;
}

export const PrescriptionLivePreviewCard: React.FC<PrescriptionLivePreviewCardProps> = ({
  draft,
  onNavigateToDraft,
}) => {
  const hasItems = draft.items.length > 0;
  const hasLabs = draft.labOrders.length > 0;
  const totalApproved = draft.items.length + draft.labOrders.length;

  if (totalApproved === 0 && !draft.diagnosis) {
    return (
      <div 
        style={{
          padding: '16px 20px',
          background: 'var(--surface-2, #F8FAFC)',
          border: '1.5px dashed var(--border, #E2E8F0)',
          borderRadius: 'var(--r-lg, 12px)',
          color: 'var(--text-muted, #64748B)',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '16px'
        }}
      >
        <Sparkles size={18} style={{ color: 'var(--med-blue, #2563EB)', flexShrink: 0 }} />
        <div>
          <span style={{ fontWeight: 600, color: 'var(--text-primary, #0F172A)' }}>
            E-Prescription Auto-Fill Co-Pilot
          </span>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.85 }}>
            Approve AI-recommended medications or lab investigations above to automatically populate your active E-Prescription draft.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card fade-in"
      style={{
        marginTop: '20px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)',
        border: '1.5px solid #10B981',
        borderRadius: 'var(--r-xl, 16px)',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.12)',
        overflow: 'hidden'
      }}
      id="prescription-live-preview-card"
    >
      {/* Top Banner Header */}
      <div 
        style={{
          padding: '14px 20px',
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '6px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.2px' }}>
              ⚡ E-Prescription Auto-Filled Draft
            </div>
            <div style={{ fontSize: '11.5px', opacity: 0.9 }}>
              Synchronized from Doctor Approved AI Recommendations ({draft.lastSyncedAt})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            padding: '4px 10px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: 700 
          }}>
            {totalApproved} Approved Item{totalApproved !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Diagnosis Header */}
        {draft.diagnosis && (
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} style={{ color: '#059669' }} />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Primary Diagnosis:</span>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#065F46', background: '#D1FAE5', padding: '3px 10px', borderRadius: '6px' }}>
              {draft.diagnosis}
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: hasLabs ? '1fr 1fr' : '1fr', gap: '16px' }}>
          {/* Approved Medications Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Pill size={16} style={{ color: '#059669' }} />
              <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary, #0F172A)' }}>
                Approved Medications ({draft.items.length})
              </span>
            </div>

            {hasItems ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {draft.items.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #A7F3D0',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#064E3B' }}>
                        {item.medicineName}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        background: '#ECFDF5', 
                        color: '#047857', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        border: '1px solid #A7F3D0'
                      }}>
                        Qty: {item.quantity}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span><strong>Dose:</strong> {item.dosage}</span>
                      <span>•</span>
                      <span><strong>Freq:</strong> {item.frequency}</span>
                      <span>•</span>
                      <span><strong>Duration:</strong> {item.duration}</span>
                    </div>

                    {item.instructions && (
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px', fontStyle: 'italic' }}>
                        💡 {item.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', padding: '10px', background: '#FFFFFF', borderRadius: '8px', border: '1px dashed #E2E8F0' }}>
                No medications approved yet. Click "Approve" on medication recommendations above.
              </div>
            )}
          </div>

          {/* Approved Diagnostic Workup / Labs Column */}
          {hasLabs && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <TestTube size={16} style={{ color: '#2563EB' }} />
                <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary, #0F172A)' }}>
                  Diagnostic Lab Workup ({draft.labOrders.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {draft.labOrders.map((lab, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#1E40AF' }}>
                        🔬 {lab.testName}
                      </span>
                      <span style={{ 
                        fontSize: '10.5px', 
                        fontWeight: 700, 
                        background: lab.urgency === 'urgent' ? '#FEF2F2' : '#EFF6FF', 
                        color: lab.urgency === 'urgent' ? '#DC2626' : '#1D4ED8', 
                        padding: '2px 8px', 
                        borderRadius: '10px',
                        textTransform: 'uppercase'
                      }}>
                        {lab.urgency}
                      </span>
                    </div>
                    {lab.indication && (
                      <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '4px' }}>
                        Indication: {lab.indication}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div style={{ 
          marginTop: '16px', 
          paddingTop: '12px', 
          borderTop: '1px solid #A7F3D0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#047857', fontWeight: 600 }}>
            <ShieldCheck size={16} /> Ready to be dispatched to Pharmacy & Patient Health Record upon finalizing.
          </div>

          {onNavigateToDraft && (
            <button
              onClick={onNavigateToDraft}
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: '#10B981',
                color: '#047857',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Review Prescription Summary <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
