import * as React from 'react';

export interface PortalStatChip {
  label: string;
  value: number | string;
  icon: string;
  highlight?: boolean;
}

export interface PortalHeaderProps {
  /** Portal display title */
  title: string;
  /** Subtitle / description */
  subtitle: string;
  /** CSS class suffix: patient | doctor | recept | pharma | owner | supplier | admin */
  role: 'patient' | 'doctor' | 'recept' | 'pharma' | 'owner' | 'supplier' | 'admin';
  /** KPI chips shown in the right column */
  stats?: PortalStatChip[];
  /** Extra content (action buttons, etc.) */
  children?: React.ReactNode;
  /** Is loading — shows placeholder dash for stat values */
  loading?: boolean;
}

/**
 * Unified portal header banner used across all dashboards.
 * Replaces per-portal hardcoded inline gradient divs with a
 * consistent, macOS-inspired frosted-glass-chip design.
 */
export default function PortalHeader({
  title,
  subtitle,
  role,
  stats,
  children,
  loading = false,
}: PortalHeaderProps) {
  return (
    <div className={`portal-header portal-header-${role} fade-in`}>
      {/* Left: text + optional action slot */}
      <div className="portal-header-text">
        <div className="portal-header-title">{title}</div>
        <div className="portal-header-sub">{subtitle}</div>
        {children && (
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {children}
          </div>
        )}
      </div>

      {/* Right: KPI chips */}
      {stats && stats.length > 0 && (
        <div className="portal-header-stats">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`portal-stat-chip${s.highlight ? ' highlight' : ''}`}
            >
              <div className="portal-stat-icon">{s.icon}</div>
              <div className="portal-stat-value">
                {loading ? '—' : s.value}
              </div>
              <div className="portal-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
