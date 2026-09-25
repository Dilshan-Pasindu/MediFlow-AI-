import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// MediFlow AI — Modern Healthcare Design System
/// Reference: Blue-to-Indigo gradient (#4A6FE3 → #2F4FD1), white cards, #F2F4F8 bg
class AppTheme {
  AppTheme._();

  // ── Core Brand Palette ───────────────────────────────────────────────────────
  static const Color primaryBlue      = Color(0xFF4A6FE3); // Hero gradient start
  static const Color primaryBlueDark  = Color(0xFF2F4FD1); // Hero gradient end
  static const Color primaryBlueLight = Color(0xFF7B97EF); // Hover / lighter tint
  static const Color primaryBlue50    = Color(0xFFEEF2FD); // Soft blue tint bg

  // Legacy aliases kept so existing screens compile unchanged
  static const Color primaryTeal  = Color(0xFF4A6FE3);
  static const Color primaryDeep  = Color(0xFF2F4FD1);
  static const Color primaryMid   = Color(0xFF4A6FE3);
  static const Color primaryLight = Color(0xFF7B97EF);
  static const Color primaryDark  = Color(0xFF1A2F8A);

  static const Color accentMint    = Color(0xFFEEF2FD);
  static const Color accentMintSub = Color(0xFFD6DFFA);
  static const Color accentSage    = Color(0xFFE8EBF3);
  static const Color accentGreen   = Color(0xFF22C55E);
  static const Color accentBlue    = Color(0xFF4A6FE3);
  static const Color starGold      = Color(0xFFF59E0B);

  // ── Backgrounds & Surfaces ───────────────────────────────────────────────────
  static const Color bgCanvas     = Color(0xFFF2F4F8); // App background
  static const Color bgDark       = Color(0xFF1A2F8A);
  static const Color bgPurple     = Color(0xFF1E293B);
  static const Color surface      = Color(0xFFFFFFFF); // Pure white card
  static const Color surfaceDim   = Color(0xFFF2F4F8);
  static const Color surface2     = Color(0xFFF7F8FC);
  static const Color surfaceGlass = Color(0xE6FFFFFF);

  // ── Typography ───────────────────────────────────────────────────────────────
  static const Color textPrimary   = Color(0xFF1A2340);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textMuted     = Color(0xFF9CA3AF);
  static const Color textOnDark    = Color(0xFFFFFFFF);
  static const Color textOnDarkSub = Color(0xCCFFFFFF);
  static const Color divider       = Color(0xFFE8EBF3);
  static const Color cardBorder    = Color(0xFFEAEDF5);

  // ── Status Colors ────────────────────────────────────────────────────────────
  static const Color statusPending    = Color(0xFFB45309);
  static const Color statusPendingBg  = Color(0xFFFFFBEB);
  static const Color statusConfirmed  = Color(0xFF059669);
  static const Color statusConfBg     = Color(0xFFECFDF5);
  static const Color statusInConsult  = Color(0xFFE11D48);
  static const Color statusInConsBg   = Color(0xFFFFF1F2);
  static const Color statusCompleted  = Color(0xFF4A6FE3);
  static const Color statusCompBg     = Color(0xFFEEF2FD);
  static const Color statusCancelled  = Color(0xFF64748B);
  static const Color statusCancelBg   = Color(0xFFF1F5F9);
  static const Color statusPaySent    = Color(0xFF4A6FE3);
  static const Color statusPayBg      = Color(0xFFEEF2FD);

  // ── Traffic Lights (macOS legacy) ────────────────────────────────────────────
  static const Color trafficRed    = Color(0xFFFF5F56);
  static const Color trafficYellow = Color(0xFFFFBD2E);
  static const Color trafficGreen  = Color(0xFF27C93F);

  // ── Gradients ────────────────────────────────────────────────────────────────
  /// Primary hero gradient — used on headers, cards, login bg
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF4A6FE3), Color(0xFF2F4FD1)],
  );

  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF4A6FE3), Color(0xFF2F4FD1)],
  );

  static const LinearGradient tealGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF4A6FE3), Color(0xFF3B5FD9)],
  );

  static const LinearGradient darkNavyGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF2F4FD1), Color(0xFF1A2F8A)],
  );

  static const LinearGradient cardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF4A6FE3), Color(0xFF2F4FD1)],
  );

  static const LinearGradient emeraldHeroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF4A6FE3), Color(0xFF2F4FD1)],
  );

  // ── Border Radius ────────────────────────────────────────────────────────────
  static const double radiusSm   = 10.0;
  static const double radiusMd   = 14.0;
  static const double radiusLg   = 20.0;
  static const double radiusXl   = 24.0;
  static const double radiusXxl  = 32.0;
  static const double radiusFull = 999.0;

  // ── Shadows ──────────────────────────────────────────────────────────────────
  static List<BoxShadow> get cardShadow => [
    BoxShadow(
      color: const Color(0xFF4A6FE3).withValues(alpha: 0.06),
      blurRadius: 20,
      spreadRadius: 0,
      offset: const Offset(0, 6),
    ),
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.04),
      blurRadius: 8,
      spreadRadius: 0,
      offset: const Offset(0, 2),
    ),
  ];

  static List<BoxShadow> get tealCardShadow => [
    BoxShadow(
      color: primaryBlue.withValues(alpha: 0.28),
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
      color: primaryBlue.withValues(alpha: 0.3),
      blurRadius: 24,
      spreadRadius: 0,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> get macOSShadow => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.05),
      blurRadius: 10,
      offset: const Offset(0, 2),
    ),
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.03),
      blurRadius: 20,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> get blueShadow => [
    BoxShadow(
      color: primaryBlue.withValues(alpha: 0.30),
      blurRadius: 20,
      offset: const Offset(0, 6),
    ),
  ];

  static List<BoxShadow> get buttonShadow => [
    BoxShadow(
      color: primaryBlue.withValues(alpha: 0.35),
      blurRadius: 16,
      spreadRadius: 0,
      offset: const Offset(0, 6),
    ),
  ];

  // ── macOS Window Dots ────────────────────────────────────────────────────────
  static Widget macOSWindowDots({double size = 11, double spacing = 6}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _dot(trafficRed, size),
        SizedBox(width: spacing),
        _dot(trafficYellow, size),
        SizedBox(width: spacing),
        _dot(trafficGreen, size),
      ],
    );
  }

  static Widget _dot(Color color, double size) => Container(
    width: size,
    height: size,
    decoration: BoxDecoration(color: color, shape: BoxShape.circle),
  );

  // ── ThemeData ────────────────────────────────────────────────────────────────
  static ThemeData get light {
    final base = ThemeData.light(useMaterial3: true);
    return base.copyWith(
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryBlue,
        primary: primaryBlue,
        secondary: primaryBlueDark,
        surface: surface,
        onSurface: textPrimary,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: bgCanvas,
      textTheme: GoogleFonts.outfitTextTheme(base.textTheme).copyWith(
        displayLarge:  GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w800, color: textPrimary),
        displayMedium: GoogleFonts.outfit(fontSize: 26, fontWeight: FontWeight.w700, color: textPrimary),
        headlineLarge: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800, color: textPrimary),
        headlineMedium:GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w700, color: textPrimary),
        titleLarge:    GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700, color: textPrimary),
        titleMedium:   GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600, color: textPrimary),
        bodyLarge:     GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w400, color: textPrimary),
        bodyMedium:    GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w400, color: textSecondary),
        bodySmall:     GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w400, color: textMuted),
        labelLarge:    GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: textPrimary),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: bgCanvas,
        foregroundColor: textPrimary,
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w700, color: textPrimary),
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
          backgroundColor: primaryBlue,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusMd)),
          textStyle: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryBlue,
          side: const BorderSide(color: primaryBlue, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusMd)),
          textStyle: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: cardBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: cardBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: primaryBlue, width: 1.8),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: statusInConsult),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 15),
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
        selectedItemColor: primaryBlue,
        unselectedItemColor: textMuted,
        selectedLabelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600),
        unselectedLabelStyle: GoogleFonts.outfit(fontSize: 11),
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      dividerTheme: const DividerThemeData(color: divider, thickness: 1, space: 1),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: textPrimary,
        contentTextStyle: GoogleFonts.outfit(fontSize: 13, color: Colors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusMd)),
      ),
    );
  }

  // ── Status Badge Helpers ──────────────────────────────────────────────────────
  static ({Color bg, Color text, String label}) appointmentStatus(String status) {
    return switch (status) {
      'Pending'          => (bg: statusPendingBg, text: statusPending,   label: 'Pending'),
      'PaymentSubmitted' => (bg: statusPayBg,     text: statusPaySent,   label: 'Payment Sent'),
      'Confirmed'        => (bg: statusConfBg,    text: statusConfirmed, label: 'Confirmed'),
      'InConsultation'   => (bg: statusInConsBg,  text: statusInConsult, label: '🔴 In Consultation'),
      'Completed'        => (bg: statusCompBg,    text: statusCompleted, label: 'Completed'),
      'Cancelled'        => (bg: statusCancelBg,  text: statusCancelled, label: 'Cancelled'),
      'NoShow'           => (bg: statusCancelBg,  text: statusCancelled, label: 'No Show'),
      _                  => (bg: statusCancelBg,  text: statusCancelled, label: status),
    };
  }

  static ({Color bg, Color text}) prescriptionStatus(String status) {
    return switch (status) {
      'Active'    => (bg: statusConfBg,   text: statusConfirmed),
      'Fulfilled' => (bg: statusPayBg,    text: statusPaySent),
      'Expired'   => (bg: statusCancelBg, text: statusCancelled),
      _           => (bg: surfaceDim,     text: textMuted),
    };
  }

  static ({Color bg, Color text}) orderStatus(String status) {
    return switch (status) {
      'Pending'    => (bg: statusPendingBg, text: statusPending),
      'Processing' => (bg: statusPayBg,     text: statusPaySent),
      'Ready'      => (bg: statusConfBg,    text: statusConfirmed),
      'Dispensed'  => (bg: statusCompBg,    text: statusCompleted),
      'Cancelled'  => (bg: statusCancelBg,  text: statusCancelled),
      _            => (bg: surfaceDim,      text: textMuted),
    };
  }
}
