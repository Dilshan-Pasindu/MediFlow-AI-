import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// MediFlow AI Design System
/// Inspired by the attached reference image:
///  - Deep blue/violet gradient backgrounds
///  - Neon green (#BFFF00 / #C1FF1C) accent for CTAs
///  - White cards with soft shadows
///  - Rounded corners (16–24 px)
///  - Bold, modern typography (Outfit / Poppins)
class AppTheme {
  AppTheme._();

  // ── Core Palette ──────────────────────────────────────────────────────────
  static const Color primaryDeep   = Color(0xFF2D2BE8);   // Deep blue
  static const Color primaryMid    = Color(0xFF3B41E0);   // Mid blue-violet
  static const Color primaryLight  = Color(0xFF5B64F5);   // Light blue-violet
  static const Color accentGreen   = Color(0xFFC1FF1C);   // Neon lime (CTA)
  static const Color accentBlue    = Color(0xFF2563EB);   // Action blue
  static const Color bgDark        = Color(0xFF1A1B4B);   // Dark navy (splash)
  static const Color bgPurple      = Color(0xFF3730A3);   // Purple-blue body
  static const Color surface       = Color(0xFFFFFFFF);   // Card surface
  static const Color surfaceDim    = Color(0xFFF5F6FF);   // Dim surface
  static const Color surfaceGlass  = Color(0x1AFFFFFF);   // Glass-morphic
  static const Color textPrimary   = Color(0xFF0F172A);   // Near-black text
  static const Color textSecondary = Color(0xFF475569);   // Muted text
  static const Color textMuted     = Color(0xFF94A3B8);   // Light muted
  static const Color textOnDark    = Color(0xFFFFFFFF);   // Text on dark bg
  static const Color textOnDarkSub = Color(0xCCFFFFFF);   // 80% white
  static const Color divider       = Color(0xFFE2E8F0);   // Divider

  // Status Colors
  static const Color statusPending    = Color(0xFFB45309);
  static const Color statusPendingBg  = Color(0xFFFFFBEB);
  static const Color statusConfirmed  = Color(0xFF059669);
  static const Color statusConfBg     = Color(0xFFECFDF5);
  static const Color statusInConsult  = Color(0xFFDC2626);
  static const Color statusInConsBg   = Color(0xFFFEF2F2);
  static const Color statusCompleted  = Color(0xFF6366F1);
  static const Color statusCompBg     = Color(0xFFEEF2FF);
  static const Color statusCancelled  = Color(0xFF64748B);
  static const Color statusCancelBg   = Color(0xFFF1F5F9);
  static const Color statusPaySent    = Color(0xFF0369A1);
  static const Color statusPayBg      = Color(0xFFEFF6FF);

  // Gradient backgrounds
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF2D2BE8), Color(0xFF6C3AE0)],
  );

  static const LinearGradient darkNavyGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF1A1B4B), Color(0xFF2D2BE8)],
  );

  static const LinearGradient cardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF3B41E0), Color(0xFF5B64F5)],
  );

  // Border radius constants
  static const double radiusSm  = 8.0;
  static const double radiusMd  = 12.0;
  static const double radiusLg  = 16.0;
  static const double radiusXl  = 20.0;
  static const double radiusXxl = 24.0;
  static const double radiusFull = 100.0;

  // Elevation / Shadow
  static List<BoxShadow> get cardShadow => [
    BoxShadow(
      color: primaryDeep.withOpacity(0.08),
      blurRadius: 20,
      spreadRadius: 0,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> get elevatedShadow => [
    BoxShadow(
      color: Colors.black.withOpacity(0.12),
      blurRadius: 24,
      spreadRadius: 0,
      offset: const Offset(0, 8),
    ),
  ];

  // ── ThemeData ─────────────────────────────────────────────────────────────
  static ThemeData get light {
    final base = ThemeData.light(useMaterial3: true);
    return base.copyWith(
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryDeep,
        primary: primaryDeep,
        secondary: accentGreen,
        surface: surface,
        onSurface: textPrimary,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: surfaceDim,
      textTheme: GoogleFonts.outfitTextTheme(base.textTheme).copyWith(
        displayLarge: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w800, color: textPrimary),
        displayMedium: GoogleFonts.outfit(fontSize: 26, fontWeight: FontWeight.w700, color: textPrimary),
        headlineLarge: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w700, color: textPrimary),
        headlineMedium: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w600, color: textPrimary),
        titleLarge: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600, color: textPrimary),
        titleMedium: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600, color: textPrimary),
        bodyLarge: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w400, color: textPrimary),
        bodyMedium: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w400, color: textSecondary),
        bodySmall: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w400, color: textMuted),
        labelLarge: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600, color: textPrimary),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: surface,
        foregroundColor: textPrimary,
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: GoogleFonts.outfit(
          fontSize: 17, fontWeight: FontWeight.w700, color: textPrimary,
        ),
        iconTheme: const IconThemeData(color: textPrimary),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusLg),
        ),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryDeep,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusFull),
          ),
          textStyle: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryDeep,
          side: const BorderSide(color: primaryDeep, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusFull),
          ),
          textStyle: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: divider),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: divider),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: primaryDeep, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: statusInConsult),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: GoogleFonts.outfit(fontSize: 14, color: textMuted),
        labelStyle: GoogleFonts.outfit(fontSize: 14, color: textSecondary),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: surfaceDim,
        labelStyle: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w500),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusFull),
        ),
        side: BorderSide.none,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: primaryDeep,
        unselectedItemColor: textMuted,
        selectedLabelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600),
        unselectedLabelStyle: GoogleFonts.outfit(fontSize: 11),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      dividerTheme: const DividerThemeData(
        color: divider,
        thickness: 1,
        space: 1,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: textPrimary,
        contentTextStyle: GoogleFonts.outfit(fontSize: 13, color: Colors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusMd),
        ),
      ),
    );
  }

  // ── Status Badge Colors ───────────────────────────────────────────────────
  static ({Color bg, Color text, String label}) appointmentStatus(String status) {
    return switch (status) {
      'Pending'          => (bg: statusPendingBg, text: statusPending, label: 'Pending'),
      'PaymentSubmitted' => (bg: statusPayBg, text: statusPaySent, label: 'Payment Sent'),
      'Confirmed'        => (bg: statusConfBg, text: statusConfirmed, label: 'Confirmed'),
      'InConsultation'   => (bg: statusInConsBg, text: statusInConsult, label: '🔴 In Consultation'),
      'Completed'        => (bg: statusCompBg, text: statusCompleted, label: 'Completed'),
      'Cancelled'        => (bg: statusCancelBg, text: statusCancelled, label: 'Cancelled'),
      'NoShow'           => (bg: statusCancelBg, text: statusCancelled, label: 'No Show'),
      _                  => (bg: statusCancelBg, text: statusCancelled, label: status),
    };
  }

  static ({Color bg, Color text}) prescriptionStatus(String status) {
    return switch (status) {
      'Active'    => (bg: statusConfBg, text: statusConfirmed),
      'Fulfilled' => (bg: statusPayBg, text: statusPaySent),
      'Expired'   => (bg: statusCancelBg, text: statusCancelled),
      _           => (bg: surfaceDim, text: textMuted),
    };
  }

  static ({Color bg, Color text}) orderStatus(String status) {
    return switch (status) {
      'Pending'    => (bg: statusPendingBg, text: statusPending),
      'Processing' => (bg: statusPayBg, text: statusPaySent),
      'Ready'      => (bg: statusConfBg, text: statusConfirmed),
      'Dispensed'  => (bg: statusCompBg, text: statusCompleted),
      'Cancelled'  => (bg: statusCancelBg, text: statusCancelled),
      _            => (bg: surfaceDim, text: textMuted),
    };
  }
}
