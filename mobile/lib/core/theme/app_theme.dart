import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// MediFlow AI - Emerald Teal & Sage Modern Medical Design System
/// Inspired by modern clinical aesthetics:
///  - Vibrant Emerald/Teal (#00A389) as the signature medical hero color
///  - Soft Sage-tinted canvas (#F3F8F7) for calming contrast
///  - Pure crisp white cards with delicate borders and soft floating shadows
///  - Elegant rounded geometry (20–32 px)
///  - Warm amber-gold ratings, organic badge pills, and clean typography (Outfit)
class AppTheme {
  AppTheme._();

  // ── Core Palette ──────────────────────────────────────────────────────────
  static const Color primaryTeal   = Color(0xFF00A389);   // Signature Emerald Teal
  static const Color primaryDeep   = Color(0xFF008975);   // Deep Emerald
  static const Color primaryMid    = Color(0xFF00A389);   // Mid Teal
  static const Color primaryLight  = Color(0xFF14B89A);   // Light Vibrant Teal
  static const Color primaryDark   = Color(0xFF0E3831);   // Deep Forest Slate

  static const Color accentMint    = Color(0xFFE6F7F4);   // Soft Mint Tint
  static const Color accentMintSub = Color(0xFFCCF2EB);   // Secondary Mint
  static const Color accentSage    = Color(0xFFD1FAE5);   // Sage green
  static const Color accentGreen   = Color(0xFF00A389);   // Primary Accent
  static const Color accentBlue    = Color(0xFF0284C7);   // Info Sky Blue
  static const Color starGold      = Color(0xFFF59E0B);   // Rating Amber Gold

  static const Color bgCanvas      = Color(0xFFF3F8F7);   // Soft Sage/Mint Canvas
  static const Color bgDark        = Color(0xFF082621);   // Dark Emerald Forest (Splash)
  static const Color bgPurple      = Color(0xFF0E3831);   // Dark slate teal
  static const Color surface       = Color(0xFFFFFFFF);   // Pure White Card
  static const Color surfaceDim    = Color(0xFFF3F8F7);   // Dim surface / canvas
  static const Color surfaceGlass  = Color(0x1AFFFFFF);   // Glass-morphic

  static const Color textPrimary   = Color(0xFF1E293B);   // Slate dark text
  static const Color textSecondary = Color(0xFF64748B);   // Slate muted text
  static const Color textMuted     = Color(0xFF94A3B8);   // Light muted slate
  static const Color textOnDark    = Color(0xFFFFFFFF);   // White on dark
  static const Color textOnDarkSub = Color(0xCCFFFFFF);   // 80% white
  static const Color divider       = Color(0xFFE2EBE9);   // Soft Sage Divider
  static const Color cardBorder    = Color(0xFFE6EFEF);   // Clean Card Outline

  // Status Colors
  static const Color statusPending    = Color(0xFFB45309);
  static const Color statusPendingBg  = Color(0xFFFFFBEB);
  static const Color statusConfirmed  = Color(0xFF059669);
  static const Color statusConfBg     = Color(0xFFECFDF5);
  static const Color statusInConsult  = Color(0xFFE11D48);
  static const Color statusInConsBg   = Color(0xFFFFF1F2);
  static const Color statusCompleted  = Color(0xFF0D9488);
  static const Color statusCompBg     = Color(0xFFF0FDFA);
  static const Color statusCancelled  = Color(0xFF64748B);
  static const Color statusCancelBg   = Color(0xFFF1F5F9);
  static const Color statusPaySent    = Color(0xFF0284C7);
  static const Color statusPayBg      = Color(0xFFF0F9FF);

  // Gradient backgrounds
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00A389), Color(0xFF007A68)],
  );

  static const LinearGradient darkNavyGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF092420), Color(0xFF004D40)],
  );

  static const LinearGradient cardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00A389), Color(0xFF02B89B)],
  );

  static const LinearGradient emeraldHeroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00A389), Color(0xFF008F79)],
  );

  // Border radius constants
  static const double radiusSm  = 10.0;
  static const double radiusMd  = 14.0;
  static const double radiusLg  = 20.0;
  static const double radiusXl  = 28.0;
  static const double radiusXxl = 32.0;
  static const double radiusFull = 999.0;

  // Elevation / Shadow
  static List<BoxShadow> get cardShadow => [
    BoxShadow(
      color: const Color(0xFF1E293B).withValues(alpha: 0.04),
      blurRadius: 16,
      spreadRadius: 0,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> get tealCardShadow => [
    BoxShadow(
      color: primaryTeal.withValues(alpha: 0.25),
      blurRadius: 20,
      spreadRadius: 0,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> get elevatedShadow => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.08),
      blurRadius: 24,
      spreadRadius: 0,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> get navBarShadow => [
    BoxShadow(
      color: primaryTeal.withValues(alpha: 0.3),
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
        seedColor: primaryTeal,
        primary: primaryTeal,
        secondary: accentMint,
        surface: surface,
        onSurface: textPrimary,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: bgCanvas,
      textTheme: GoogleFonts.outfitTextTheme(base.textTheme).copyWith(
        displayLarge: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w800, color: textPrimary),
        displayMedium: GoogleFonts.outfit(fontSize: 26, fontWeight: FontWeight.w700, color: textPrimary),
        headlineLarge: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800, color: textPrimary),
        headlineMedium: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w700, color: textPrimary),
        titleLarge: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700, color: textPrimary),
        titleMedium: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600, color: textPrimary),
        bodyLarge: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w400, color: textPrimary),
        bodyMedium: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w400, color: textSecondary),
        bodySmall: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w400, color: textMuted),
        labelLarge: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: textPrimary),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: bgCanvas,
        foregroundColor: textPrimary,
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: GoogleFonts.outfit(
          fontSize: 18, fontWeight: FontWeight.w700, color: textPrimary,
        ),
        iconTheme: const IconThemeData(color: textPrimary),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusLg),
          side: const BorderSide(color: cardBorder, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryTeal,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusFull),
          ),
          textStyle: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryTeal,
          side: const BorderSide(color: primaryTeal, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusFull),
          ),
          textStyle: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusFull),
          borderSide: const BorderSide(color: cardBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusFull),
          borderSide: const BorderSide(color: cardBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusFull),
          borderSide: const BorderSide(color: primaryTeal, width: 1.8),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusFull),
          borderSide: const BorderSide(color: statusInConsult),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
        hintStyle: GoogleFonts.outfit(fontSize: 14, color: textMuted),
        labelStyle: GoogleFonts.outfit(fontSize: 14, color: textSecondary),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: surface,
        labelStyle: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w500),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusFull),
          side: const BorderSide(color: cardBorder),
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: primaryTeal,
        unselectedItemColor: textMuted,
        selectedLabelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600),
        unselectedLabelStyle: GoogleFonts.outfit(fontSize: 11),
        type: BottomNavigationBarType.fixed,
        elevation: 0,
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
