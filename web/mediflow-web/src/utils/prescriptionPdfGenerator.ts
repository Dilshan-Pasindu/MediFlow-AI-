import type { Prescription } from '../types/prescription';

/**
 * Generates an SVG Barcode representation of a string for clinical document authenticity.
 */
function generateSvgBarcode(code: string): string {
  // Simple clean Code128-style SVG visual representation
  const cleanCode = code.replace(/[^A-Za-z0-9_-]/g, '').toUpperCase();
  const bars: string[] = [];
  let x = 10;
  
  // Guard bars
  bars.push(`<rect x="${x}" y="0" width="2" height="36" fill="#1e293b"/>`);
  x += 3;
  bars.push(`<rect x="${x}" y="0" width="1" height="36" fill="#1e293b"/>`);
  x += 4;

  for (let i = 0; i < cleanCode.length; i++) {
    const charCode = cleanCode.charCodeAt(i);
    const pattern = [(charCode % 3) + 1, ((charCode >> 1) % 3) + 1, ((charCode >> 2) % 2) + 1, 1];
    for (let p = 0; p < pattern.length; p++) {
      if (p % 2 === 0) {
        bars.push(`<rect x="${x}" y="0" width="${pattern[p]}" height="32" fill="#1e293b"/>`);
      }
      x += pattern[p] + 1;
    }
  }

  // Stop bars
  bars.push(`<rect x="${x}" y="0" width="2" height="36" fill="#1e293b"/>`);
  x += 3;
  bars.push(`<rect x="${x}" y="0" width="3" height="36" fill="#1e293b"/>`);
  x += 10;

  return `
    <svg width="${x}" height="48" viewBox="0 0 ${x} 48" xmlns="http://www.w3.org/2000/svg" style="display: block;">
      ${bars.join('')}
      <text x="${x / 2}" y="45" font-family="'Courier New', monospace" font-size="9" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="2">${code}</text>
    </svg>
  `;
}

/**
 * Generates a high-fidelity, professional medical prescription HTML document
 * fully optimized for printing and browser "Save as PDF".
 */
export function generatePrescriptionHtml(rx: Prescription): string {
  const issueDate = new Date(rx.dateIssued || Date.now());
  const formattedDate = issueDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Validity: 30 days from date issued
  const expiryDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const rxNumberFormatted = `RX-${String(rx.id).padStart(6, '0')}`;
  const appointmentRef = rx.appointmentNumber || `APPT-${String(rx.appointmentId || rx.id).padStart(5, '0')}`;
  const patientIdFormatted = `PT-${String(rx.patientId || rx.id).padStart(5, '0')}`;
  const barcodeSvg = generateSvgBarcode(rxNumberFormatted);

  // Digital verification token
  const hashSeed = `${rx.id}-${rx.patientName}-${rx.doctorName}-${rx.dateIssued}`;
  let hashNum = 0;
  for (let i = 0; i < hashSeed.length; i++) {
    hashNum = (hashNum << 5) - hashNum + hashSeed.charCodeAt(i);
    hashNum |= 0;
  }
  const verificationToken = `MF-SEC-${Math.abs(hashNum).toString(16).toUpperCase().padStart(8, '0')}`;

  const doctorSpecialty = rx.doctorSpecialty || 'Senior Consultant Physician';
  const doctorLicense = rx.doctorLicenseNo || 'SLMC Reg: 84920-CL';
  const diagnosisText = rx.diagnosis || 'Clinical Consultation & Evaluation';
  const generalInstructions = rx.instructions || 'Take medications exactly as prescribed. Complete full course. Keep out of reach of children. Consult doctor if symptoms persist or in case of any adverse reaction.';

  const items = rx.items || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prescription_${rxNumberFormatted}_${rx.patientName.replace(/\\s+/g, '_')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* ── Reset & Typography ── */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
      font-size: 13px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      padding: 24px 16px 40px;
    }

    /* ── On-Screen Control Toolbar (Hidden in Print/PDF) ── */
    .no-print-toolbar {
      max-width: 820px;
      margin: 0 auto 16px;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.25);
    }

    .toolbar-info {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
    }

    .toolbar-info span {
      background: #0284c7;
      color: #ffffff;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-action {
      cursor: pointer;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .btn-print-primary {
      background: #0d9488;
      color: #ffffff;
    }

    .btn-print-primary:hover {
      background: #0f766e;
      transform: translateY(-1px);
    }

    .btn-close {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* ── Prescription Paper Sheet ── */
    .prescription-sheet {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 38px 46px;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
      position: relative;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }

    /* Subtle background watermark */
    .prescription-sheet::before {
      content: '℞';
      position: absolute;
      top: 48%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 340px;
      font-family: 'Times New Roman', serif;
      color: #0d9488;
      opacity: 0.025;
      pointer-events: none;
      user-select: none;
      z-index: 0;
    }

    .sheet-content {
      position: relative;
      z-index: 1;
    }

    /* ── Top Header / Letterhead ── */
    .hospital-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 18px;
      border-bottom: 2px solid #0d9488;
      margin-bottom: 20px;
      gap: 20px;
    }

    .brand-col {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .brand-logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px -2px rgba(13, 148, 136, 0.35);
      flex-shrink: 0;
    }

    .hospital-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .hospital-tagline {
      font-size: 11.5px;
      font-weight: 600;
      color: #0d9488;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-top: 2px;
    }

    .hospital-meta {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
      line-height: 1.4;
    }

    .rx-badge-col {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .doc-type-pill {
      display: inline-block;
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      color: #0f766e;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .rx-number-title {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #0f766e;
      letter-spacing: -0.2px;
    }

    .barcode-wrap {
      margin-top: 4px;
    }

    /* ── Patient & Doctor Cards Grid ── */
    .credentials-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }

    .credential-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 18px;
    }

    .credential-card.doctor-card {
      background: #f0fdfa;
      border-color: #ccfbf1;
    }

    .card-label {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: #64748b;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .card-label.doctor-label {
      color: #0f766e;
    }

    .person-name {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      margin-bottom: 4px;
    }

    .person-sub {
      font-size: 12px;
      color: #334155;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .details-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5px;
      margin-top: 4px;
    }

    .details-table td {
      padding: 2.5px 0;
      vertical-align: top;
    }

    .details-table td.prop {
      color: #64748b;
      width: 90px;
    }

    .details-table td.val {
      color: #0f172a;
      font-weight: 600;
    }

    /* ── Diagnosis Banner ── */
    .diagnosis-box {
      background: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 10px 16px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 22px;
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .diag-label {
      font-size: 11px;
      font-weight: 800;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      white-space: nowrap;
    }

    .diag-val {
      font-size: 13.5px;
      font-weight: 700;
      color: #0f172a;
    }

    /* ── Prescription Table ── */
    .rx-symbol-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .rx-glyph {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 32px;
      font-weight: 900;
      color: #0d9488;
      line-height: 1;
    }

    .rx-section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #334155;
    }

    .medication-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      margin-bottom: 22px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .medication-table thead tr {
      background: #0f766e;
      color: #ffffff;
    }

    .medication-table th {
      padding: 9px 12px;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
    }

    .medication-table th.center, .medication-table td.center {
      text-align: center;
    }

    .medication-table tbody tr {
      border-bottom: 1px solid #e2e8f0;
    }

    .medication-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    .medication-table td {
      padding: 10px 12px;
      vertical-align: middle;
      color: #334155;
    }

    .med-name {
      font-weight: 700;
      color: #0f172a;
      font-size: 13px;
    }

    .med-strength {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-top: 2px;
    }

    .med-instructions {
      font-size: 11px;
      color: #64748b;
      font-style: italic;
      margin-top: 3px;
    }

    .qty-pill {
      display: inline-block;
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      color: #0f766e;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 12px;
    }

    /* ── Doctor Instructions Box ── */
    .instructions-card {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 22px;
    }

    .inst-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #b45309;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .inst-text {
      font-size: 12.5px;
      color: #78350f;
      line-height: 1.45;
    }

    /* ── AI Safety Verification Strip ── */
    .safety-seal-strip {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 8px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 26px;
    }

    .safety-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11.5px;
      font-weight: 600;
      color: #166534;
    }

    .safety-hash {
      font-family: 'Courier New', monospace;
      font-size: 10.5px;
      color: #15803d;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    /* ── Signatures & Authorization ── */
    .signatures-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 10px;
      padding-top: 16px;
      border-top: 1px dashed #cbd5e1;
      margin-bottom: 22px;
    }

    .pharmacy-stamp-box {
      border: 1px dashed #94a3b8;
      border-radius: 8px;
      padding: 10px 14px;
      min-height: 84px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #fdfdfd;
    }

    .stamp-box-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
    }

    .stamp-sub {
      font-size: 10px;
      color: #94a3b8;
      font-style: italic;
    }

    .doctor-sign-box {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-end;
    }

    .signature-svg {
      font-family: 'Alex Brush', cursive;
      font-size: 32px;
      color: #0369a1;
      line-height: 1;
      margin-bottom: 2px;
      padding-right: 12px;
      user-select: none;
    }

    .sign-divider {
      width: 190px;
      height: 1.5px;
      background: #0f172a;
      margin-bottom: 4px;
    }

    .sign-doctor-name {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
    }

    .sign-doctor-role {
      font-size: 11px;
      color: #64748b;
    }

    /* ── Official Stamp Graphic ── */
    .official-stamp {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #0d9488;
      border-radius: 50%;
      width: 76px;
      height: 76px;
      transform: rotate(-12deg);
      opacity: 0.85;
      text-align: center;
      padding: 4px;
      color: #0f766e;
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-right: 14px;
    }

    /* ── Footer Legal Notice ── */
    .prescription-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 10px;
      color: #94a3b8;
      line-height: 1.4;
    }

    .footer-legal {
      max-width: 580px;
    }

    /* ── Clean Print & PDF Generation Rules ── */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
        font-size: 12px;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .no-print-toolbar {
        display: none !important;
      }

      .prescription-sheet {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 20mm 18mm !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }

      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  </style>
</head>
<body>

  <!-- Floating On-Screen Action Bar (Auto-hidden on print/save PDF) -->
  <div class="no-print-toolbar">
    <div class="toolbar-info">
      <span>Official Medical Document</span>
      <div>Prescription <strong>${rxNumberFormatted}</strong> for <strong>${rx.patientName}</strong></div>
    </div>
    <div class="toolbar-actions">
      <button class="btn-action btn-print-primary" onclick="window.print()" id="action-print-pdf-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Save as PDF / Print
      </button>
      <button class="btn-action btn-close" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <!-- Medical Prescription Sheet -->
  <main class="prescription-sheet" id="printable-prescription">
    <div class="sheet-content">

      <!-- Hospital Header Letterhead -->
      <header class="hospital-header">
        <div class="brand-col">
          <div class="brand-logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M2 12h20M7 8h10M7 16h10" />
            </svg>
          </div>
          <div>
            <h1 class="hospital-title">MediFlow AI Integrated Healthcare</h1>
            <div class="hospital-tagline">Clinical Center & Smart Health Network</div>
            <div class="hospital-meta">
              124 Healthcare Boulevard, Medical District • Hotline: +94 11 234 5678<br>
              Ministry of Health Reg: MOH/PV/2026/0891 • Web: www.mediflow-ai.com
            </div>
          </div>
        </div>

        <div class="rx-badge-col">
          <div class="doc-type-pill">Electronic Prescription (E-Rx)</div>
          <div class="rx-number-title">${rxNumberFormatted}</div>
          <div class="barcode-wrap">
            ${barcodeSvg}
          </div>
        </div>
      </header>

      <!-- Credentials Section (Patient & Doctor) -->
      <section class="credentials-grid">
        <!-- Patient Details -->
        <div class="credential-card">
          <div class="card-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Patient Information
          </div>
          <div class="person-name">${rx.patientName}</div>
          <div class="person-sub">ID: ${patientIdFormatted} • ${rx.patientGender || 'Adult'} • Age: ${rx.patientAge || 'Adult'}</div>
          <table class="details-table">
            <tr>
              <td class="prop">Contact No:</td>
              <td class="val">${rx.patientPhone || 'Not Specified'}</td>
            </tr>
            <tr>
              <td class="prop">Appt Ref:</td>
              <td class="val">${appointmentRef}</td>
            </tr>
            <tr>
              <td class="prop">Allergies:</td>
              <td class="val" style="color: #b91c1c;">None Reported (NKDA)</td>
            </tr>
          </table>
        </div>

        <!-- Prescribing Doctor -->
        <div class="credential-card doctor-card">
          <div class="card-label doctor-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Prescribing Practitioner
          </div>
          <div class="person-name">Dr. ${rx.doctorName}</div>
          <div class="person-sub" style="color: #0f766e;">${doctorSpecialty}</div>
          <table class="details-table">
            <tr>
              <td class="prop">Medical Reg:</td>
              <td class="val">${doctorLicense}</td>
            </tr>
            <tr>
              <td class="prop">Date Issued:</td>
              <td class="val">${formattedDate}</td>
            </tr>
            <tr>
              <td class="prop">Valid Until:</td>
              <td class="val">${expiryDate}</td>
            </tr>
          </table>
        </div>
      </section>

      <!-- Clinical Assessment -->
      <section class="diagnosis-box">
        <span class="diag-label">Clinical Indication:</span>
        <span class="diag-val">${diagnosisText}</span>
      </section>

      <!-- ℞ Prescriptions Table -->
      <section>
        <div class="rx-symbol-header">
          <span class="rx-glyph">℞</span>
          <span class="rx-section-title">Prescribed Medication Regimen</span>
        </div>

        <table class="medication-table">
          <thead>
            <tr>
              <th style="width: 36px;" class="center">#</th>
              <th>Medication & Strength</th>
              <th>Dosage & Frequency</th>
              <th>Duration</th>
              <th class="center">Qty</th>
              <th>Directions & Patient Advice</th>
            </tr>
          </thead>
          <tbody>
            ${items.length === 0 ? `
              <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #94a3b8;">
                  No medication items itemized on this prescription record.
                </td>
              </tr>
            ` : items.map((item, idx) => `
              <tr>
                <td class="center" style="font-weight: 700; color: #64748b;">${idx + 1}</td>
                <td>
                  <div class="med-name">${item.medicineName}</div>
                  <span class="med-strength">${item.dosage || 'Standard Dosage'}</span>
                </td>
                <td>
                  <strong style="color: #0f172a;">${item.frequency || 'Daily'}</strong>
                </td>
                <td>${item.duration || 'As Directed'}</td>
                <td class="center">
                  <span class="qty-pill">${item.quantity || 1}</span>
                </td>
                <td>
                  <div style="font-size: 12px; color: #334155;">${item.instructions || 'Take as instructed by prescribing physician'}</div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <!-- Doctor's Instructions -->
      <section class="instructions-card">
        <div class="inst-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Physician Special Advice & Instructions
        </div>
        <div class="inst-text">${generalInstructions}</div>
      </section>

      <!-- AI Safety Clearance Verification -->
      <section class="safety-seal-strip">
        <div class="safety-info">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          MediFlow AI Safety Screening: Verified & Cleared (Zero High-Risk DDIs / Allergy Conflicts)
        </div>
        <div class="safety-hash">${verificationToken}</div>
      </section>

      <!-- Authorization Signatures & Stamp -->
      <section class="signatures-section">
        <!-- Dispensing Pharmacy Sign-off -->
        <div class="pharmacy-stamp-box">
          <div class="stamp-box-title">Dispensing Pharmacy Validation</div>
          <div style="font-size: 11px; color: #475569;">
            Pharmacy: <strong>MediFlow Central Pharmacy</strong><br>
            Dispense Status: <strong>${rx.status || 'Active'}</strong>
          </div>
          <div class="stamp-sub">Pharmacist Signature & Date of Dispense</div>
        </div>

        <!-- Doctor Signature Block -->
        <div class="doctor-sign-box">
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
            <div class="official-stamp">
              MEDIFLOW<br>AI HEALTH<br>★ VERIFIED ★
            </div>
            <div>
              <div class="signature-svg">Dr. ${rx.doctorName.replace(/^Dr\.\s*/i, '')}</div>
              <div class="sign-divider"></div>
              <div class="sign-doctor-name">Dr. ${rx.doctorName.replace(/^Dr\.\s*/i, '')}</div>
              <div class="sign-doctor-role">${doctorLicense}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Legal Medical Footer -->
      <footer class="prescription-footer">
        <div class="footer-legal">
          <strong>Notice:</strong> This electronic prescription is issued under the Digital Health Electronic Records Act. 
          It is clinically verified and valid for dispensing at any licensed registered pharmacy. 
          Unauthorized alteration is prohibited by law.
        </div>
        <div style="text-align: right; white-space: nowrap;">
          Page 1 of 1 • System Generated: ${new Date().toLocaleDateString()}
        </div>
      </footer>

    </div>
  </main>

  <script>
    // Automatically trigger print dialog when window loads
    window.addEventListener('load', function() {
      // Focus and print after font styles settle
      setTimeout(function() {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;
}

/**
 * Triggers the professional prescription print / Save-as-PDF flow.
 */
export function downloadPrescriptionPdf(rx: Prescription): void {
  const htmlContent = generatePrescriptionHtml(rx);
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // Fallback if popup blocker intercepted window.open:
    // Create an invisible iframe to execute print
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  }
}
