import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Eye, EyeOff, ArrowRight, Loader, ShieldCheck, Mail, Lock,
  User, Phone, Stethoscope, Brain, Activity, HeartPulse,
  Briefcase, FileCheck2, HelpCircle, PhoneCall, AlertCircle,
  ChevronDown, Plus, Shield, KeyRound, Pill, Check
} from 'lucide-react';
import { apiLogin, apiRegister, apiRegisterStaff, apiGoogleAuth } from '../services/api';
import { MediFlowLogo } from '../components/MediFlowLogo';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */
const CSS = `
@keyframes lp-fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
@keyframes lp-scaleIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
@keyframes lp-spin    { to{transform:rotate(360deg)} }
@keyframes lp-ecg     { to{stroke-dashoffset:0} }

/* ── Root Light Theme ── */
.lp-root {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #F8FAFC;
  background-image: 
    radial-gradient(#CBD5E1 1.25px, transparent 1.25px),
    radial-gradient(circle at 10% 15%, rgba(219, 234, 254, 0.6) 0%, transparent 40%),
    radial-gradient(circle at 90% 75%, rgba(224, 242, 254, 0.65) 0%, transparent 45%),
    radial-gradient(circle at 50% 95%, rgba(240, 253, 250, 0.75) 0%, transparent 50%);
  background-size: 24px 24px, 100% 100%, 100% 100%, 100% 100%;
  position: relative;
  overflow-x: hidden;
  color: #0F172A;
}

/* Subtle background accent glow */
.lp-bg-glow-1 {
  position: absolute;
  top: -80px;
  left: 4%;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(186, 230, 253, 0.45) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  z-index: 1;
}

.lp-bg-glow-2 {
  position: absolute;
  bottom: -60px;
  right: 6%;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(204, 251, 241, 0.4) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  z-index: 1;
}

/* Main Container Layout: aligned to top so left column stays topper & fixed */
.lp-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 36px 32px 48px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

/* ══════════════ LEFT COLUMN — FIXED TO TOP ══════════════ */
.lp-left {
  flex: 1.1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-start;
  position: sticky;
  top: 32px;
  animation: lp-fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.lp-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0284C7;
  padding: 5px 12px;
  border-radius: 9999px;
  background: #EFF6FF;
  border: 1px solid #DBEAFE;
  box-shadow: 0 1px 3px rgba(2, 132, 199, 0.08);
  width: fit-content;
}

.lp-left-h {
  font-family: 'Outfit', sans-serif;
  font-size: 40px;
  font-weight: 900;
  line-height: 1.12;
  color: #0F172A;
  letter-spacing: -0.035em;
  margin: 0 0 12px;
}

.lp-left-h em {
  font-style: normal;
  color: #0284C7;
  background: linear-gradient(135deg, #0284C7 0%, #0D9488 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lp-left-p {
  font-size: 14.5px;
  color: #475569;
  line-height: 1.62;
  margin: 0 0 22px;
  max-width: 500px;
}

/* Stats Row */
.lp-stats {
  display: flex;
  gap: 14px;
  margin-bottom: 22px;
}

.lp-stat-box {
  flex: 1;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 2px 5px -1px rgba(15, 23, 42, 0.04);
}

.lp-stat-val {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 900;
  color: #0F172A;
  line-height: 1.1;
}

.lp-stat-val span {
  color: #0284C7;
  font-size: 16px;
}

.lp-stat-lbl {
  font-size: 10.5px;
  color: #64748B;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-top: 2px;
}

/* ── 4 Feature Cards (exact as user image) ── */
.lp-features-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 22px;
}

.lp-feature-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 11px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.03), 0 1px 2px rgba(15, 23, 42, 0.02);
  transition: all 0.2s ease;
}

.lp-feature-card:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 6px 18px -4px rgba(15, 23, 42, 0.07);
  border-color: #CBD5E1;
}

.lp-feat-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lp-feat-icon-blue   { background: #EFF6FF; border: 1px solid #DBEAFE; color: #2563EB; }
.lp-feat-icon-purple { background: #FAF5FF; border: 1px solid #F3E8FF; color: #9333EA; }
.lp-feat-icon-green  { background: #ECFDF5; border: 1px solid #D1FAE5; color: #059669; }
.lp-feat-icon-amber  { background: #FFFBEB; border: 1px solid #FEF3C7; color: #D97706; }

.lp-feat-title {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 2px;
  letter-spacing: -0.01em;
}

.lp-feat-desc {
  font-size: 12px;
  color: #64748B;
  margin: 0;
  line-height: 1.4;
}

/* Security Badges Row */
.lp-badges-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.lp-pill-badge {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 9999px;
  padding: 5px 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: #334155;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.lp-badge-icon-green  { color: #10B981; }
.lp-badge-icon-blue   { color: #2563EB; }
.lp-badge-icon-purple { color: #8B5CF6; }


/* ══════════════ RIGHT COLUMN — AUTH CARD ══════════════ */
.lp-right {
  flex: 0.95;
  max-width: 490px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-self: flex-start;
}

.lp-card {
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 22px;
  box-shadow: 
    0 20px 50px -12px rgba(15, 23, 42, 0.09),
    0 1px 3px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  position: relative;
}

/* Top colored accent line */
.lp-card-top-bar {
  height: 3.5px;
  background: linear-gradient(90deg, #0284C7 0%, #0D9488 50%, #2563EB 100%);
  width: 100%;
}

/* Tabs */
.lp-tabs {
  display: flex;
  background: #F1F5F9;
  padding: 5px;
  margin: 16px 24px 0;
  border-radius: 12px;
  gap: 5px;
}

.lp-tab {
  flex: 1;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 700;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  color: #64748B;
  border-radius: 9px;
}

.lp-tab.on {
  background: #FFFFFF;
  color: #0284C7;
  box-shadow: 0 2px 7px rgba(15, 23, 42, 0.07);
}

.lp-tab:hover:not(.on) {
  color: #0F172A;
}

/* Card Body */
.lp-body {
  padding: 20px 24px 22px;
}

/* Header & Logo */
.lp-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.lp-card-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lp-card-wm {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -0.03em;
}

.lp-card-wm span {
  color: #0284C7;
}

.lp-h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 900;
  color: #0F172A;
  margin: 0 0 4px;
  letter-spacing: -0.025em;
}

.lp-sub {
  font-size: 12.5px;
  color: #64748B;
  margin: 0 0 16px;
  line-height: 1.45;
}

/* Portal row (Patient vs Staff) */
.lp-portal-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.lp-portal-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1.5px solid #E2E8F0;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 700;
  color: #64748B;
  background: #F8FAFC;
  transition: all 0.2s ease;
}

.lp-portal-btn:hover {
  border-color: #CBD5E1;
  color: #0F172A;
  background: #F1F5F9;
}

.lp-portal-btn.ap {
  border-color: #0284C7;
  color: #0284C7;
  background: #EFF6FF;
}

.lp-portal-btn.as {
  border-color: #059669;
  color: #059669;
  background: #ECFDF5;
}

/* Role Badges */
.lp-role-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 15px;
}

.lp-role-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
  background: #F1F5F9;
  color: #334155;
  border: 1px solid #E2E8F0;
}

/* Fields & Inputs */
.lp-field {
  margin-bottom: 13px;
}

.lp-lbl {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}

.lp-lbl .req {
  color: #DC2626;
  margin-left: 2px;
}

.lp-iw {
  position: relative;
}

.lp-ico {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
  pointer-events: none;
  display: flex;
  align-items: center;
  transition: color 0.18s;
}

.lp-inp {
  width: 100%;
  height: 42px;
  padding: 0 12px 0 38px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  background: #F8FAFC;
  font-size: 13px;
  color: #0F172A;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  box-sizing: border-box;
}

.lp-inp:focus {
  border-color: #0284C7;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.12);
}

.lp-inp::placeholder {
  color: #94A3B8;
}

/* Validation States */
.lp-inp.is-invalid {
  border-color: #EF4444 !important;
  background: #FEF2F2 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
}

.lp-inp.is-valid {
  border-color: #10B981;
}

.lp-inp-r {
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: color 0.18s;
}

.lp-inp-r:hover {
  color: #0F172A;
}

.lp-field-err {
  font-size: 11px;
  color: #DC2626;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 3px;
}

.lp-sel {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 34px !important;
  cursor: pointer;
}

/* 2-col grid */
.lp-g2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 13px;
}

/* Password strength and requirements */
.lp-str-wrap {
  height: 4px;
  border-radius: 9999px;
  background: #E2E8F0;
  overflow: hidden;
  margin-top: 5px;
}

.lp-str-bar {
  height: 100%;
  border-radius: 9999px;
  transition: all 0.3s;
}

.lp-str-row {
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: #64748B;
  margin-top: 3px;
}

.lp-pwd-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
  margin-bottom: 11px;
}

.lp-pwd-chip {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  transition: all 0.2s;
}

.lp-pwd-chip.met {
  background: #ECFDF5;
  color: #059669;
  border: 1px solid #A7F3D0;
  font-weight: 600;
}

.lp-pwd-chip.unmet {
  background: #F8FAFC;
  color: #94A3B8;
  border: 1px solid #E2E8F0;
}

/* Doctor registration note */
.lp-doc-reg {
  margin-bottom: 13px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #ECFDF5;
  border: 1.5px solid #A7F3D0;
}

.lp-doc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  color: #065F46;
  margin-bottom: 5px;
}

.lp-doc-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
  background: #059669;
  color: #FFFFFF;
}

.lp-doc-hint {
  font-size: 10.5px;
  color: #047857;
  margin-top: 3px;
  line-height: 1.4;
}

/* Terms Checkbox */
.lp-terms {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 15px;
}

.lp-terms input[type=checkbox] {
  margin-top: 2px;
  accent-color: #0284C7;
  cursor: pointer;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.lp-terms-lbl {
  font-size: 11.5px;
  color: #475569;
  cursor: pointer;
  line-height: 1.45;
}

.lp-terms-lbl a {
  color: #0284C7;
  text-decoration: underline;
  font-weight: 600;
}

/* Submit Action Button */
.lp-btn {
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 11px;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 14.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  letter-spacing: -0.01em;
}

.lp-btn-p {
  background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.22);
}

.lp-btn-p:hover:not(:disabled) {
  transform: translateY(-1.5px);
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.32);
}

.lp-btn-s {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.22);
}

.lp-btn-s:hover:not(:disabled) {
  transform: translateY(-1.5px);
  box-shadow: 0 6px 18px rgba(5, 150, 105, 0.32);
}

.lp-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Or divider */
.lp-div {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 0;
}

.lp-div-l {
  flex: 1;
  height: 1px;
  background: #E2E8F0;
}

.lp-div-t {
  font-size: 10.5px;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 0.04em;
}

/* Google Button */
.lp-g-btn {
  width: 100%;
  height: 42px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 700;
  color: #1E293B;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.lp-g-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
}

.lp-g-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error Banner */
.lp-err {
  padding: 11px 13px;
  border-radius: 10px;
  margin-bottom: 14px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 12px;
  line-height: 1.45;
  animation: lp-fadeUp 0.25s ease;
}

.lp-err.danger {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #991B1B;
}

.lp-err.warn {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  color: #92400E;
}

.lp-err-ttl {
  font-weight: 800;
  margin-bottom: 2px;
}

/* Staff Success */
.lp-success {
  text-align: center;
  padding: 20px 0 10px;
  animation: lp-scaleIn 0.3s ease;
}

.lp-success-ico {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ECFDF5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  border: 1px solid #A7F3D0;
}

.lp-success-msg {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 11px;
  padding: 12px 16px;
  color: #166534;
  font-size: 12.5px;
  line-height: 1.55;
  margin-bottom: 18px;
  text-align: left;
}

/* Help Center Section */
.lp-help {
  margin-top: 18px;
  padding: 11px 14px;
  border-radius: 11px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.lp-help-ico {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #EFF6FF;
  border: 1px solid #DBEAFE;
  color: #0284C7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lp-help-ttl {
  font-size: 12px;
  font-weight: 700;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 5px;
}

.lp-help-bdg {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: #ECFDF5;
  color: #059669;
  border: 1px solid #A7F3D0;
}

.lp-help-sub {
  font-size: 10.5px;
  color: #64748B;
}

.lp-help-links {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.lp-help-lnk {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 7px;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.lp-help-lnk.em {
  color: #0284C7;
  background: #EFF6FF;
  border: 1px solid #DBEAFE;
}

.lp-help-lnk.em:hover {
  background: #DBEAFE;
}

.lp-help-lnk.ph {
  color: #059669;
  background: #ECFDF5;
  border: 1px solid #D1FAE5;
}

.lp-help-lnk.ph:hover {
  background: #D1FAE5;
}

/* ECG Bottom Strip */
.lp-ecg-strip {
  margin-top: 16px;
  opacity: 0.55;
  width: 100%;
}

.lp-spin {
  animation: lp-spin 0.7s linear infinite;
}

/* Responsive */
@media (max-width: 1080px) {
  .lp-container {
    flex-direction: column;
    padding: 28px 18px;
    gap: 28px;
    align-items: center;
  }
  .lp-left {
    position: static;
    max-width: 540px;
    width: 100%;
    text-align: center;
    align-items: center;
  }
  .lp-eyebrow {
    margin: 0 auto 12px;
  }
  .lp-left-p {
    margin: 0 auto 18px;
  }
  .lp-stats {
    width: 100%;
    max-width: 500px;
  }
  .lp-features-list {
    width: 100%;
    max-width: 500px;
  }
  .lp-badges-row {
    justify-content: center;
  }
  .lp-right {
    max-width: 500px;
  }
}

@media (max-width: 520px) {
  .lp-body {
    padding: 18px 16px 18px;
  }
  .lp-g2 {
    grid-template-columns: 1fr;
  }
  .lp-tabs {
    margin: 12px 16px 0;
  }
  .lp-left-h {
    font-size: 30px;
  }
}
`;

/* ─── Google Icon ──────────────────────────────────────────────────────────── */
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"/>
      <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" fill="#34A853"/>
      <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z" fill="#FBBC05"/>
      <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"/>
    </svg>
  );
}

/* ─── ECG Strip ────────────────────────────────────────────────────────────── */
function EcgStrip() {
  return (
    <svg viewBox="0 0 600 32" style={{ width: '100%', height: 32, display: 'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(2,132,199,0)" />
          <stop offset="25%"  stopColor="#0284C7" stopOpacity="0.8" />
          <stop offset="55%"  stopColor="#0D9488" stopOpacity="0.9" />
          <stop offset="80%"  stopColor="#0284C7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgba(2,132,199,0)" />
        </linearGradient>
      </defs>
      <line x1="0" y1="16" x2="600" y2="16" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5 7"/>
      <path
        d="M0,16 L60,16 L78,16 L94,4 L110,28 L126,4 L142,28 L158,16 L230,16 L258,16 L274,8 L290,24 L306,16 L380,16 L404,16 L422,2 L440,30 L458,2 L476,30 L494,16 L560,16 L578,16 L600,16"
        fill="none" stroke="url(#ecgGrad)" strokeWidth="2" strokeLinecap="round"
        style={{ strokeDasharray: 1400, strokeDashoffset: 1400, animation: 'lp-ecg 2.5s ease forwards' }}
      />
    </svg>
  );
}

/* ─── Staff Roles ──────────────────────────────────────────────────────────── */
const STAFF_ROLES = [
  { id: 'Doctor',        label: 'Doctor / Medical Specialist',    desc: 'Licensed practitioner (Reg No. required)' },
  { id: 'Pharmacist',    label: 'Pharmacist',                     desc: 'Dispensing and medication verification'   },
  { id: 'Supplier',      label: 'Pharmaceutical Supplier',        desc: 'Wholesale inventory and delivery supply'  },
  { id: 'Receptionist',  label: 'Receptionist / Front Desk',      desc: 'Patient intake, scheduling & payments'   },
  { id: 'PharmacyOwner', label: 'Pharmacy Owner / Manager',       desc: 'Pharmacy operations and stock reordering' },
];

function getRoleHome(role: string) {
  switch (role) {
    case 'Doctor':        return '/doctor/dashboard';
    case 'Receptionist':  return '/receptionist/dashboard';
    case 'Pharmacist':    return '/pharmacist/dashboard';
    case 'PharmacyOwner': return '/owner/dashboard';
    case 'Supplier':      return '/supplier/dashboard';
    case 'Administrator': return '/admin/dashboard';
    default:              return '/dashboard';
  }
}

/* ─── Help Center Component ────────────────────────────────────────────────── */
function HelpCenter() {
  return (
    <div className="lp-help" id="help-center-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="lp-help-ico"><HelpCircle size={15}/></div>
        <div>
          <div className="lp-help-ttl">Help Center <span className="lp-help-bdg">24/7</span></div>
          <div className="lp-help-sub">Staff verification & technical support</div>
        </div>
      </div>
      <div className="lp-help-links">
        <a href="mailto:support@mediflow.ai" className="lp-help-lnk em" id="help-center-email-link">
          <Mail size={11}/> support@mediflow.ai
        </a>
        <a href="tel:+94112345678" className="lp-help-lnk ph" id="help-center-phone-link">
          <PhoneCall size={11}/> 011 234 5678
        </a>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [authMode, setAuthMode] = useState<'login'|'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [portalType, setPortalType] = useState<'Patient'|'Staff'>('Patient');
  const [staffRole, setStaffRole] = useState<'Doctor'|'Pharmacist'|'Supplier'|'Receptionist'|'PharmacyOwner'>('Doctor');
  const [staffSubmitted, setStaffSubmitted] = useState<null|{role:string;message:string;isDoctor:boolean}>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Field validation & touch state
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Password criteria computation
  const pCrit = useMemo(() => {
    const p = form.password;
    return {
      len: p.length >= 8,
      up: /[A-Z]/.test(p),
      lo: /[a-z]/.test(p),
      num: /[0-9]/.test(p),
      sym: /[^A-Za-z0-9]/.test(p),
    };
  }, [form.password]);

  const pScore = useMemo(() => {
    let s = 0;
    if (pCrit.len) s++;
    if (pCrit.up && pCrit.lo) s++;
    if (pCrit.num) s++;
    if (pCrit.sym) s++;
    return s;
  }, [pCrit]);

  const pLabel = ({ 0: 'Weak', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' } as Record<number, string>)[pScore];
  const pColor = ({ 0: '#EF4444', 1: '#EF4444', 2: '#F59E0B', 3: '#3B82F6', 4: '#10B981' } as Record<number, string>)[pScore];

  // Real-time Field Errors
  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    // Name
    if (!form.name.trim()) {
      errs.name = 'Full name is required';
    } else if (form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(form.name.trim())) {
      errs.name = 'Name should only contain letters and spaces';
    }

    // Email
    if (!form.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // Phone
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else {
      const cleanPhone = form.phone.replace(/[\s\-()]/g, '');
      if (!/^\+?[0-9]{9,15}$/.test(cleanPhone)) {
        errs.phone = 'Please enter a valid phone number (min 9 digits)';
      }
    }

    // Password
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    // Confirm Password
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    // Doctor registration number
    if (portalType === 'Staff' && staffRole === 'Doctor') {
      if (!form.registrationNumber.trim()) {
        errs.registrationNumber = 'Professional registration number (SLMC) is required';
      } else if (form.registrationNumber.trim().length < 3) {
        errs.registrationNumber = 'Registration number must be at least 3 characters';
      }
    }

    return errs;
  }, [form, portalType, staffRole]);

  useEffect(() => {
    const p = searchParams.get('portal');
    if (p === 'staff') setPortalType('Staff');
    else if (p === 'patient') setPortalType('Patient');
  }, [searchParams]);

  const reset = () => {
    setError('');
    setStaffSubmitted(null);
    setForm({ name: '', email: '', password: '', confirmPassword: '', phone: '', registrationNumber: '' });
    setAgreeTerms(false);
    setShowPass(false);
    setShowConf(false);
    setTouched({});
  };

  const switchMode = (m: 'login' | 'register') => {
    setAuthMode(m);
    reset();
  };

  const switchPortal = (p: 'Patient' | 'Staff') => {
    setPortalType(p);
    setError('');
    setStaffSubmitted(null);
  };

  /* ── Submit Handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiLogin(form.email, form.password, portalType);
      navigate(getRoleHome(res.role));
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });

    if (fieldErrors.name) { setError(fieldErrors.name); return; }
    if (fieldErrors.email) { setError(fieldErrors.email); return; }
    if (fieldErrors.phone) { setError(fieldErrors.phone); return; }
    if (fieldErrors.password) { setError(fieldErrors.password); return; }
    if (fieldErrors.confirmPassword) { setError(fieldErrors.confirmPassword); return; }

    if (pScore < 2) {
      setError('Please choose a stronger password with a mix of letters, numbers, or symbols.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the MediFlow AI Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await apiRegister(form.name, form.email, form.password, form.phone, 'Patient');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      registrationNumber: true,
    });

    if (staffRole === 'Doctor' && fieldErrors.registrationNumber) {
      setError(fieldErrors.registrationNumber);
      return;
    }
    if (fieldErrors.name) { setError(fieldErrors.name); return; }
    if (fieldErrors.email) { setError(fieldErrors.email); return; }
    if (fieldErrors.phone) { setError(fieldErrors.phone); return; }
    if (fieldErrors.password) { setError(fieldErrors.password); return; }
    if (fieldErrors.confirmPassword) { setError(fieldErrors.confirmPassword); return; }

    if (pScore < 2) {
      setError('Please choose a stronger password.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to healthcare compliance & professional verification terms.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRegisterStaff({
        fullName: form.name,
        email: form.email,
        password: form.password,
        phoneNumber: form.phone,
        role: staffRole,
        registrationNumber: staffRole === 'Doctor' ? form.registrationNumber.trim() : undefined,
      });
      setStaffSubmitted({ role: staffRole, message: res.message, isDoctor: staffRole === 'Doctor' });
    } catch (err: any) {
      setError(err?.message || 'Staff registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setError('');
    const cid = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (!cid) {
      setError('Google Sign-In is not configured. Set VITE_GOOGLE_CLIENT_ID in your frontend .env file.');
      return;
    }
    if (!(window as any).google?.accounts?.oauth2) {
      setError('Google Identity Services is loading. Please try again in a moment.');
      return;
    }
    try {
      setLoading(true);
      const tc = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: cid.trim(),
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
        callback: async (r: any) => {
          if (r?.access_token) {
            try {
              const ui = await (await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${r.access_token}` },
              })).json();
              if (!ui?.email) throw new Error('Could not retrieve email from Google account.');
              const res = await apiGoogleAuth({
                email: ui.email,
                fullName: ui.name || ui.email.split('@')[0],
                photoUrl: ui.picture,
                role: 'Patient',
              });
              navigate(getRoleHome(res.role));
            } catch (err: any) {
              setError(err?.message || 'Google authentication failed.');
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        },
        error_callback: () => {
          setLoading(false);
          setError('Google authentication was cancelled.');
        },
      });
      tc.requestAccessToken();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Google auth initialization failed.');
    }
  };

  const isStaff = portalType === 'Staff';
  const btnCls = `lp-btn ${isStaff ? 'lp-btn-s' : 'lp-btn-p'}`;

  return (
    <>
      <style>{CSS}</style>
      <div className="lp-root">
        {/* Soft background ambient glows */}
        <div className="lp-bg-glow-1" />
        <div className="lp-bg-glow-2" />

        <div className="lp-container">

          {/* ══════════════ LEFT COLUMN — FIXED TO TOP ══════════════ */}
          <div className="lp-left">
            <div className="lp-eyebrow">
              <HeartPulse size={13} style={{ color: '#0284C7' }} /> Sri Lanka's Premier Healthcare AI
            </div>

            <h1 className="lp-left-h">
              Smart Healthcare<br />
              <em>At Your Fingertips</em>
            </h1>

            <p className="lp-left-p">
              Connect with certified specialists, manage appointments, and receive digital prescriptions — all in one secure AI-powered platform.
            </p>

            {/* Quick Metrics */}
            <div className="lp-stats">
              <div className="lp-stat-box">
                <div className="lp-stat-val">50<span>K+</span></div>
                <div className="lp-stat-lbl">Active Patients</div>
              </div>
              <div className="lp-stat-box">
                <div className="lp-stat-val">1<span>K+</span></div>
                <div className="lp-stat-lbl">Specialists</div>
              </div>
              <div className="lp-stat-box">
                <div className="lp-stat-val">99<span>%</span></div>
                <div className="lp-stat-lbl">Platform Uptime</div>
              </div>
            </div>

            {/* ── 4 Feature Cards (exact as user image) ── */}
            <div className="lp-features-list">
              {/* Feature 1 */}
              <div className="lp-feature-card">
                <div className="lp-feat-icon-wrap lp-feat-icon-blue">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <div className="lp-feat-title">Smart Doctor Matching</div>
                  <div className="lp-feat-desc">AI finds the best specialist instantly</div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="lp-feature-card">
                <div className="lp-feat-icon-wrap lp-feat-icon-purple">
                  <Brain size={20} />
                </div>
                <div>
                  <div className="lp-feat-title">AI Clinical Support</div>
                  <div className="lp-feat-desc">Evidence-based decision support</div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="lp-feature-card">
                <div className="lp-feat-icon-wrap lp-feat-icon-green">
                  <Pill size={20} />
                </div>
                <div>
                  <div className="lp-feat-title">Digital Prescriptions</div>
                  <div className="lp-feat-desc">Secure e-prescriptions & pharmacy sync</div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="lp-feature-card">
                <div className="lp-feat-icon-wrap lp-feat-icon-amber">
                  <Activity size={20} />
                </div>
                <div>
                  <div className="lp-feat-title">Real-time Monitoring</div>
                  <div className="lp-feat-desc">Track appointments & health metrics</div>
                </div>
              </div>
            </div>

            {/* Security Badges Row */}
            <div className="lp-badges-row">
              <div className="lp-pill-badge">
                <ShieldCheck size={14} className="lp-badge-icon-green" /> 256-bit JWT
              </div>
              <div className="lp-pill-badge">
                <Shield size={14} className="lp-badge-icon-blue" /> RBAC Secured
              </div>
              <div className="lp-pill-badge">
                <ShieldCheck size={14} className="lp-badge-icon-purple" /> HIPAA Aligned
              </div>
            </div>
          </div>

          {/* ══════════════ RIGHT COLUMN — AUTH CARD ══════════════ */}
          <div className="lp-right">
            <div className="lp-card">
              <div className="lp-card-top-bar" />

              {/* Mode Tabs */}
              <div className="lp-tabs">
                <button
                  type="button"
                  className={`lp-tab ${authMode === 'login' ? 'on' : ''}`}
                  onClick={() => switchMode('login')}
                  id="tab-login"
                >
                  <KeyRound size={13} /> Sign In
                </button>
                <button
                  type="button"
                  className={`lp-tab ${authMode === 'register' ? 'on' : ''}`}
                  onClick={() => switchMode('register')}
                  id="tab-register"
                >
                  <Plus size={13} /> Sign Up
                </button>
              </div>

              <div className="lp-body">
                {/* Header Logo */}
                <div className="lp-card-header">
                  <div className="lp-card-logo">
                    <MediFlowLogo variant="mark" height={26} />
                    <div className="lp-card-wm">MediFlow<span>AI</span></div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0284C7', background: '#EFF6FF', padding: '3px 8px', borderRadius: 6, border: '1px solid #DBEAFE' }}>
                    v2.4
                  </span>
                </div>

                {/* Heading */}
                <h2 className="lp-h1">
                  {authMode === 'login' && portalType === 'Patient' && 'Welcome Back'}
                  {authMode === 'login' && portalType === 'Staff' && 'Staff Portal'}
                  {authMode === 'register' && portalType === 'Patient' && 'Create Patient Account'}
                  {authMode === 'register' && portalType === 'Staff' && 'Staff Registration'}
                </h2>
                <p className="lp-sub">
                  {authMode === 'login' && portalType === 'Patient' && 'Sign in to access appointments, prescriptions & AI health services.'}
                  {authMode === 'login' && portalType === 'Staff' && 'Secure portal for Doctors, Pharmacists, Suppliers, & Admins.'}
                  {authMode === 'register' && portalType === 'Patient' && 'Fast registration for immediate specialist channeling.'}
                  {authMode === 'register' && portalType === 'Staff' && 'Staff accounts require administrative verification before activation.'}
                </p>

                {/* Portal Selector */}
                <div className="lp-portal-row">
                  <button
                    type="button"
                    className={`lp-portal-btn ${portalType === 'Patient' ? 'ap' : ''}`}
                    onClick={() => switchPortal('Patient')}
                    id="portal-select-patient"
                  >
                    <User size={13} /> {authMode === 'login' ? 'Patient Login' : 'Patient Sign Up'}
                  </button>
                  <button
                    type="button"
                    className={`lp-portal-btn ${portalType === 'Staff' ? 'as' : ''}`}
                    onClick={() => switchPortal('Staff')}
                    id="portal-select-staff"
                  >
                    <Stethoscope size={13} /> {authMode === 'login' ? 'Staff Login' : 'Staff Sign Up'}
                  </button>
                </div>

                {/* Staff Roles Strip */}
                {isStaff && authMode === 'login' && (
                  <div className="lp-role-strip">
                    {['Doctor', 'Pharmacist', 'Supplier', 'Receptionist', 'Pharmacy Owner', 'Admin'].map(r => (
                      <span key={r} className="lp-role-badge">{r}</span>
                    ))}
                  </div>
                )}

                {/* Global Error Banner */}
                {error && (
                  <div className={`lp-err ${error.includes('awaiting administrator') ? 'warn' : 'danger'}`} id="auth-error-banner">
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div className="lp-err-ttl">
                        {error.includes('awaiting administrator') ? 'Verification Pending' : error.includes('portal') ? 'Portal Restriction' : 'Authentication Notice'}
                      </div>
                      {error}
                    </div>
                  </div>
                )}

                {/* ══ STAFF SUBMITTED SUCCESS VIEW ══ */}
                {staffSubmitted ? (
                  <div className="lp-success" id="staff-registration-success-card">
                    <div className="lp-success-ico"><FileCheck2 size={28} /></div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Registration Submitted</h3>
                    <div className="lp-success-msg">
                      <p style={{ margin: 0, fontWeight: 600 }}>{staffSubmitted.message}</p>
                      {staffSubmitted.isDoctor && (
                        <p style={{ margin: '6px 0 0', fontSize: 11.5 }}>
                          Your SLMC / Professional Registration Number has been routed to the medical administrator verification queue.
                        </p>
                      )}
                    </div>
                    <button
                      className="lp-btn lp-btn-s"
                      onClick={() => { setAuthMode('login'); setPortalType('Staff'); setStaffSubmitted(null); setError(''); }}
                      id="return-to-staff-login-btn"
                    >
                      Return to Staff Login <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* ══ LOGIN FORM ══ */}
                    {authMode === 'login' && (
                      <form onSubmit={handleLogin} id="login-form" style={{ animation: 'lp-fadeUp .25s ease' }}>
                        <div className="lp-field">
                          <label className="lp-lbl">Email Address <span className="req">*</span></label>
                          <div className="lp-iw">
                            <span className="lp-ico"><Mail size={14} /></span>
                            <input
                              type="email"
                              className="lp-inp"
                              value={form.email}
                              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                              placeholder="you@example.com"
                              required
                              id="login-email-input"
                            />
                          </div>
                        </div>

                        <div className="lp-field">
                          <label className="lp-lbl">Password <span className="req">*</span></label>
                          <div className="lp-iw">
                            <span className="lp-ico"><Lock size={14} /></span>
                            <input
                              type={showPass ? 'text' : 'password'}
                              className="lp-inp"
                              value={form.password}
                              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                              placeholder="Enter your password"
                              required
                              style={{ paddingRight: 38 }}
                              id="login-password-input"
                            />
                            <button
                              type="button"
                              className="lp-inp-r"
                              onClick={() => setShowPass(!showPass)}
                              id="toggle-pass-btn"
                              title={showPass ? 'Hide password' : 'Show password'}
                            >
                              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className={btnCls}
                          disabled={loading}
                          style={{ marginTop: 6 }}
                          id="submit-login-btn"
                        >
                          {loading ? <Loader size={16} className="lp-spin" /> : `${isStaff ? 'Staff' : 'Patient'} Sign In`}
                          {!loading && <ArrowRight size={14} />}
                        </button>

                        {!isStaff && (
                          <>
                            <div className="lp-div">
                              <div className="lp-div-l" />
                              <span className="lp-div-t">OR CONTINUE WITH</span>
                              <div className="lp-div-l" />
                            </div>
                            <button
                              type="button"
                              className="lp-g-btn"
                              onClick={handleGoogleAuth}
                              disabled={loading}
                              id="google-signin-btn"
                            >
                              <GoogleIcon size={17} /> Continue with Google
                            </button>
                          </>
                        )}
                      </form>
                    )}

                    {/* ══ PATIENT REGISTER FORM ══ */}
                    {authMode === 'register' && portalType === 'Patient' && (
                      <form onSubmit={handlePatientRegister} id="patient-register-form" style={{ animation: 'lp-fadeUp .25s ease' }} noValidate>
                        {/* Name */}
                        <div className="lp-field">
                          <label className="lp-lbl">Full Name <span className="req">*</span></label>
                          <div className="lp-iw">
                            <span className="lp-ico"><User size={14} /></span>
                            <input
                              type="text"
                              className={`lp-inp ${touched.name && fieldErrors.name ? 'is-invalid' : touched.name && !fieldErrors.name ? 'is-valid' : ''}`}
                              value={form.name}
                              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                              onBlur={() => handleBlur('name')}
                              placeholder="e.g. Ruwan Silva"
                              required
                              id="patient-name-input"
                            />
                          </div>
                          {touched.name && fieldErrors.name && (
                            <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.name}</div>
                          )}
                        </div>

                        {/* Email */}
                        <div className="lp-field">
                          <label className="lp-lbl">Email Address <span className="req">*</span></label>
                          <div className="lp-iw">
                            <span className="lp-ico"><Mail size={14} /></span>
                            <input
                              type="email"
                              className={`lp-inp ${touched.email && fieldErrors.email ? 'is-invalid' : touched.email && !fieldErrors.email ? 'is-valid' : ''}`}
                              value={form.email}
                              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                              onBlur={() => handleBlur('email')}
                              placeholder="patient@example.com"
                              required
                              id="patient-email-input"
                            />
                          </div>
                          {touched.email && fieldErrors.email && (
                            <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.email}</div>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="lp-field">
                          <label className="lp-lbl">Phone Number <span className="req">*</span></label>
                          <div className="lp-iw">
                            <span className="lp-ico"><Phone size={14} /></span>
                            <input
                              type="tel"
                              className={`lp-inp ${touched.phone && fieldErrors.phone ? 'is-invalid' : touched.phone && !fieldErrors.phone ? 'is-valid' : ''}`}
                              value={form.phone}
                              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                              onBlur={() => handleBlur('phone')}
                              placeholder="+94 77 123 4567"
                              required
                              id="patient-phone-input"
                            />
                          </div>
                          {touched.phone && fieldErrors.phone && (
                            <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.phone}</div>
                          )}
                        </div>

                        {/* Passwords 2-col */}
                        <div className="lp-g2">
                          <div>
                            <label className="lp-lbl">Password <span className="req">*</span></label>
                            <div className="lp-iw">
                              <span className="lp-ico"><Lock size={13} /></span>
                              <input
                                type={showPass ? 'text' : 'password'}
                                className={`lp-inp ${touched.password && fieldErrors.password ? 'is-invalid' : touched.password && !fieldErrors.password ? 'is-valid' : ''}`}
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                onBlur={() => handleBlur('password')}
                                placeholder="8+ chars"
                                required
                                style={{ paddingRight: 34 }}
                                id="patient-pass-input"
                              />
                              <button
                                type="button"
                                className="lp-inp-r"
                                onClick={() => setShowPass(!showPass)}
                              >
                                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                            </div>
                            {touched.password && fieldErrors.password && (
                              <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.password}</div>
                            )}
                          </div>

                          <div>
                            <label className="lp-lbl">Confirm <span className="req">*</span></label>
                            <div className="lp-iw">
                              <span className="lp-ico"><Lock size={13} /></span>
                              <input
                                type={showConf ? 'text' : 'password'}
                                className={`lp-inp ${touched.confirmPassword && fieldErrors.confirmPassword ? 'is-invalid' : touched.confirmPassword && !fieldErrors.confirmPassword ? 'is-valid' : ''}`}
                                value={form.confirmPassword}
                                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                onBlur={() => handleBlur('confirmPassword')}
                                placeholder="Repeat"
                                required
                                style={{ paddingRight: 34 }}
                                id="patient-conf-pass-input"
                              />
                              <button
                                type="button"
                                className="lp-inp-r"
                                onClick={() => setShowConf(!showConf)}
                              >
                                {showConf ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                            </div>
                            {touched.confirmPassword && fieldErrors.confirmPassword && (
                              <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.confirmPassword}</div>
                            )}
                          </div>
                        </div>

                        {/* Password Strength Meter */}
                        {form.password && (
                          <div style={{ marginBottom: 12 }}>
                            <div className="lp-str-wrap">
                              <div className="lp-str-bar" style={{ width: `${(pScore / 4) * 100}%`, background: pColor }} />
                            </div>
                            <div className="lp-str-row">
                              <span>Password Strength</span>
                              <strong style={{ color: pColor }}>{pLabel}</strong>
                            </div>
                            <div className="lp-pwd-hints">
                              <span className={`lp-pwd-chip ${pCrit.len ? 'met' : 'unmet'}`}>
                                {pCrit.len ? <Check size={9} /> : '•'} 8+ chars
                              </span>
                              <span className={`lp-pwd-chip ${pCrit.up && pCrit.lo ? 'met' : 'unmet'}`}>
                                {pCrit.up && pCrit.lo ? <Check size={9} /> : '•'} Upper & Lower
                              </span>
                              <span className={`lp-pwd-chip ${pCrit.num || pCrit.sym ? 'met' : 'unmet'}`}>
                                {pCrit.num || pCrit.sym ? <Check size={9} /> : '•'} Number/Symbol
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Terms */}
                        <div className="lp-terms">
                          <input
                            type="checkbox"
                            id="patient-agree-terms"
                            checked={agreeTerms}
                            onChange={e => setAgreeTerms(e.target.checked)}
                            required
                          />
                          <label htmlFor="patient-agree-terms" className="lp-terms-lbl">
                            I agree to the MediFlow AI <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>
                          </label>
                        </div>

                        <button
                          type="submit"
                          className={btnCls}
                          disabled={loading}
                          id="submit-patient-register-btn"
                        >
                          {loading ? <Loader size={16} className="lp-spin" /> : 'Create Account'}
                          {!loading && <ArrowRight size={14} />}
                        </button>

                        <div className="lp-div">
                          <div className="lp-div-l" />
                          <span className="lp-div-t">OR SIGN UP WITH</span>
                          <div className="lp-div-l" />
                        </div>
                        <button
                          type="button"
                          className="lp-g-btn"
                          onClick={handleGoogleAuth}
                          disabled={loading}
                          id="google-signup-btn"
                        >
                          <GoogleIcon size={17} /> Continue with Google
                        </button>
                      </form>
                    )}

                    {/* ══ STAFF REGISTER FORM ══ */}
                    {authMode === 'register' && portalType === 'Staff' && (
                      <form onSubmit={handleStaffRegister} id="staff-register-form" style={{ animation: 'lp-fadeUp .25s ease' }} noValidate>
                        {/* Role selection */}
                        <div className="lp-field">
                          <label className="lp-lbl">Professional Role <span className="req">*</span></label>
                          <div className="lp-iw">
                            <span className="lp-ico"><Briefcase size={14} /></span>
                            <select
                              className="lp-inp lp-sel"
                              value={staffRole}
                              onChange={e => setStaffRole(e.target.value as any)}
                              style={{ fontWeight: 600 }}
                              id="staff-role-select"
                              required
                            >
                              {STAFF_ROLES.map(r => (
                                <option key={r.id} value={r.id}>{r.label}</option>
                              ))}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }} />
                          </div>
                          <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 3 }}>
                            {STAFF_ROLES.find(r => r.id === staffRole)?.desc}
                          </div>
                        </div>

                        {/* Doctor Specific SLMC Reg No */}
                        {staffRole === 'Doctor' && (
                          <div className="lp-doc-reg">
                            <div className="lp-doc-top">
                              <span>Registration Number (SLMC) <span style={{ color: '#DC2626' }}>*</span></span>
                              <span className="lp-doc-badge">Mandatory</span>
                            </div>
                            <div className="lp-iw">
                              <span className="lp-ico"><ShieldCheck size={14} style={{ color: '#059669' }} /></span>
                              <input
                                type="text"
                                className={`lp-inp ${touched.registrationNumber && fieldErrors.registrationNumber ? 'is-invalid' : ''}`}
                                value={form.registrationNumber}
                                onChange={e => setForm(f => ({ ...f, registrationNumber: e.target.value }))}
                                onBlur={() => handleBlur('registrationNumber')}
                                placeholder="e.g. SLMC-12345 or GMC-78901"
                                style={{ fontWeight: 600 }}
                                required
                                id="doctor-regno-input"
                              />
                            </div>
                            {touched.registrationNumber && fieldErrors.registrationNumber ? (
                              <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.registrationNumber}</div>
                            ) : (
                              <div className="lp-doc-hint">Credentials will be validated by administrators before approval.</div>
                            )}
                          </div>
                        )}

                        {/* Name */}
                        <div className="lp-field">
                          <label className="lp-lbl">Full Name with Title <span className="req">*</span></label>
                          <div className="lp-iw">
                            <span className="lp-ico"><User size={14} /></span>
                            <input
                              type="text"
                              className={`lp-inp ${touched.name && fieldErrors.name ? 'is-invalid' : touched.name && !fieldErrors.name ? 'is-valid' : ''}`}
                              value={form.name}
                              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                              onBlur={() => handleBlur('name')}
                              placeholder={staffRole === 'Doctor' ? 'Dr. John Doe' : 'Jane Silva'}
                              required
                              id="staff-name-input"
                            />
                          </div>
                          {touched.name && fieldErrors.name && (
                            <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.name}</div>
                          )}
                        </div>

                        {/* Email & Phone 2-col */}
                        <div className="lp-g2">
                          <div>
                            <label className="lp-lbl">Official Email <span className="req">*</span></label>
                            <div className="lp-iw">
                              <span className="lp-ico"><Mail size={13} /></span>
                              <input
                                type="email"
                                className={`lp-inp ${touched.email && fieldErrors.email ? 'is-invalid' : touched.email && !fieldErrors.email ? 'is-valid' : ''}`}
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                onBlur={() => handleBlur('email')}
                                placeholder="staff@mediflow.lk"
                                required
                                id="staff-email-input"
                              />
                            </div>
                            {touched.email && fieldErrors.email && (
                              <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.email}</div>
                            )}
                          </div>

                          <div>
                            <label className="lp-lbl">Phone <span className="req">*</span></label>
                            <div className="lp-iw">
                              <span className="lp-ico"><Phone size={13} /></span>
                              <input
                                type="tel"
                                className={`lp-inp ${touched.phone && fieldErrors.phone ? 'is-invalid' : touched.phone && !fieldErrors.phone ? 'is-valid' : ''}`}
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                onBlur={() => handleBlur('phone')}
                                placeholder="+94 77 000 0000"
                                required
                                id="staff-phone-input"
                              />
                            </div>
                            {touched.phone && fieldErrors.phone && (
                              <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.phone}</div>
                            )}
                          </div>
                        </div>

                        {/* Password & Confirm 2-col */}
                        <div className="lp-g2">
                          <div>
                            <label className="lp-lbl">Password <span className="req">*</span></label>
                            <div className="lp-iw">
                              <span className="lp-ico"><Lock size={13} /></span>
                              <input
                                type={showPass ? 'text' : 'password'}
                                className={`lp-inp ${touched.password && fieldErrors.password ? 'is-invalid' : touched.password && !fieldErrors.password ? 'is-valid' : ''}`}
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                onBlur={() => handleBlur('password')}
                                placeholder="8+ chars"
                                required
                                style={{ paddingRight: 34 }}
                                id="staff-pass-input"
                              />
                              <button
                                type="button"
                                className="lp-inp-r"
                                onClick={() => setShowPass(!showPass)}
                              >
                                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                            </div>
                            {touched.password && fieldErrors.password && (
                              <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.password}</div>
                            )}
                          </div>

                          <div>
                            <label className="lp-lbl">Confirm <span className="req">*</span></label>
                            <div className="lp-iw">
                              <span className="lp-ico"><Lock size={13} /></span>
                              <input
                                type={showConf ? 'text' : 'password'}
                                className={`lp-inp ${touched.confirmPassword && fieldErrors.confirmPassword ? 'is-invalid' : touched.confirmPassword && !fieldErrors.confirmPassword ? 'is-valid' : ''}`}
                                value={form.confirmPassword}
                                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                onBlur={() => handleBlur('confirmPassword')}
                                placeholder="Repeat"
                                required
                                style={{ paddingRight: 34 }}
                                id="staff-conf-pass-input"
                              />
                              <button
                                type="button"
                                className="lp-inp-r"
                                onClick={() => setShowConf(!showConf)}
                              >
                                {showConf ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                            </div>
                            {touched.confirmPassword && fieldErrors.confirmPassword && (
                              <div className="lp-field-err"><AlertCircle size={11} /> {fieldErrors.confirmPassword}</div>
                            )}
                          </div>
                        </div>

                        {/* Password strength */}
                        {form.password && (
                          <div style={{ marginBottom: 12 }}>
                            <div className="lp-str-wrap">
                              <div className="lp-str-bar" style={{ width: `${(pScore / 4) * 100}%`, background: pColor }} />
                            </div>
                            <div className="lp-str-row">
                              <span>Password Strength</span>
                              <strong style={{ color: pColor }}>{pLabel}</strong>
                            </div>
                          </div>
                        )}

                        {/* Terms */}
                        <div className="lp-terms">
                          <input
                            type="checkbox"
                            id="staff-agree-terms"
                            checked={agreeTerms}
                            onChange={e => setAgreeTerms(e.target.checked)}
                            required
                          />
                          <label htmlFor="staff-agree-terms" className="lp-terms-lbl">
                            I agree to healthcare compliance, verification vetting & professional code of conduct
                          </label>
                        </div>

                        <button
                          type="submit"
                          className={btnCls}
                          disabled={loading}
                          id="submit-staff-register-btn"
                        >
                          {loading ? <Loader size={16} className="lp-spin" /> : `Submit ${staffRole} Registration`}
                          {!loading && <ArrowRight size={14} />}
                        </button>
                      </form>
                    )}
                  </>
                )}

                {/* 24/7 Help center */}
                <HelpCenter />

                {/* ECG Wave line */}
                <div className="lp-ecg-strip">
                  <EcgStrip />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
