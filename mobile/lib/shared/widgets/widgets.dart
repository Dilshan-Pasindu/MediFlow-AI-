import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shimmer/shimmer.dart';
import '../../core/theme/app_theme.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Shared reusable widgets for MediFlow AI Flutter app
// ─────────────────────────────────────────────────────────────────────────────

/// Glassmorphic card used on dark gradient backgrounds (Splash, Onboarding).
class GlassCard extends StatelessWidget {
  const GlassCard({super.key, required this.child, this.padding, this.margin});
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      padding: padding ?? const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(AppTheme.radiusXl),
        border: Border.all(color: Colors.white.withValues(alpha: 0.18)),
      ),
      child: child,
    );
  }
}

/// Standard white card with a soft shadow.
class MedCard extends StatelessWidget {
  const MedCard({
    super.key, required this.child,
    this.padding, this.margin, this.onTap, this.borderRadius,
  });
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;
  final double? borderRadius;

  @override
  Widget build(BuildContext context) {
    final r = borderRadius ?? AppTheme.radiusLg;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: margin,
        padding: padding ?? const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(r),
          boxShadow: AppTheme.cardShadow,
        ),
        child: child,
      ),
    );
  }
}

/// Primary gradient button (neon green accent from the reference image).
class MedPrimaryButton extends StatelessWidget {
  const MedPrimaryButton({
    super.key, required this.label, required this.onPressed,
    this.isLoading = false, this.icon, this.fullWidth = true,
  });
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final bool fullWidth;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: fullWidth ? double.infinity : null,
      height: 52,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.primaryTeal,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 28),
        ),
        child: isLoading
            ? const SizedBox(
                width: 22, height: 22,
                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[Icon(icon, size: 18), const SizedBox(width: 8)],
                  Text(label, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700)),
                ],
              ),
      ),
    );
  }
}

/// Green accent CTA button (the lime/neon "Get Started" in reference image).
class MedAccentButton extends StatelessWidget {
  const MedAccentButton({
    super.key, required this.label, required this.onPressed,
    this.isLoading = false, this.icon,
  });
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 52,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.primaryTeal,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 28),
        ),
        child: isLoading
            ? const SizedBox(
                width: 22, height: 22,
                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[Icon(icon, size: 18), const SizedBox(width: 8)],
                  Text(label, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white)),
                ],
              ),
      ),
    );
  }
}

/// Status badge chip for appointments, prescriptions, orders.
class StatusBadge extends StatelessWidget {
  const StatusBadge({super.key, required this.label, required this.bg, required this.color, this.small = false});
  final String label;
  final Color bg;
  final Color color;
  final bool small;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: small ? 8 : 10, vertical: small ? 3 : 5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppTheme.radiusFull),
      ),
      child: Text(
        label,
        style: GoogleFonts.outfit(
          fontSize: small ? 10 : 11,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }
}

/// Themed empty-state widget with icon and description.
class EmptyState extends StatelessWidget {
  const EmptyState({
    super.key, required this.icon, required this.title,
    this.subtitle, this.action, this.actionLabel,
  });
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? action;
  final String? actionLabel;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 72, height: 72,
              decoration: BoxDecoration(
                color: AppTheme.primaryTeal.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppTheme.primaryTeal, size: 32),
            ),
            const SizedBox(height: 16),
            Text(title, textAlign: TextAlign.center,
                style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
            if (subtitle != null) ...[
              const SizedBox(height: 8),
              Text(subtitle!, textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary)),
            ],
            if (action != null && actionLabel != null) ...[
              const SizedBox(height: 20),
              MedPrimaryButton(label: actionLabel!, onPressed: action, fullWidth: false),
            ],
          ],
        ),
      ),
    );
  }
}

/// Error state with retry button.
class ErrorState extends StatelessWidget {
  const ErrorState({super.key, required this.message, this.onRetry});
  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 72, height: 72,
              decoration: BoxDecoration(
                color: AppTheme.statusInConsult.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.wifi_off_rounded, color: AppTheme.statusInConsult, size: 32),
            ),
            const SizedBox(height: 16),
            Text('Something went wrong', textAlign: TextAlign.center,
                style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text(message, textAlign: TextAlign.center,
                style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary)),
            if (onRetry != null) ...[
              const SizedBox(height: 20),
              MedPrimaryButton(label: 'Try Again', onPressed: onRetry, fullWidth: false),
            ],
          ],
        ),
      ),
    );
  }
}

/// Shimmer skeleton for loading states.
class ShimmerCard extends StatelessWidget {
  const ShimmerCard({super.key, this.height = 80, this.margin});
  final double height;
  final EdgeInsetsGeometry? margin;

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFEEEEF4),
      highlightColor: const Color(0xFFF8F8FF),
      child: Container(
        height: height,
        margin: margin ?? const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        ),
      ),
    );
  }
}

/// Doctor avatar with initials fallback.
class DoctorAvatar extends StatelessWidget {
  const DoctorAvatar({super.key, this.photoUrl, required this.name, this.radius = 28});
  final String? photoUrl;
  final String name;
  final double radius;

  @override
  Widget build(BuildContext context) {
    if (photoUrl != null && photoUrl!.isNotEmpty) {
      return CircleAvatar(
        radius: radius,
        backgroundImage: NetworkImage(photoUrl!),
        onBackgroundImageError: (_, __) {},
        backgroundColor: AppTheme.primaryTeal.withValues(alpha: 0.1),
        child: null,
      );
    }
    return CircleAvatar(
      radius: radius,
      backgroundColor: AppTheme.primaryTeal.withValues(alpha: 0.12),
      child: Text(
        name.isNotEmpty ? name[0].toUpperCase() : 'D',
        style: GoogleFonts.outfit(
          fontSize: radius * 0.75,
          fontWeight: FontWeight.w700,
          color: AppTheme.primaryTeal,
        ),
      ),
    );
  }
}

/// Patient initials avatar
class PatientAvatar extends StatelessWidget {
  const PatientAvatar({super.key, required this.name, this.radius = 24});
  final String name;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final initials = name.trim().split(' ')
        .where((w) => w.isNotEmpty)
        .take(2)
        .map((w) => w[0].toUpperCase())
        .join('');
    return Container(
      width: radius * 2,
      height: radius * 2,
      decoration: const BoxDecoration(
        gradient: AppTheme.primaryGradient,
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          initials.isEmpty ? 'P' : initials,
          style: GoogleFonts.outfit(
            fontSize: radius * 0.65,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}

/// Star rating display (read-only)
class StarRating extends StatelessWidget {
  const StarRating({super.key, required this.rating, this.size = 14});
  final double rating;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (i) {
        return Icon(
          i < rating.floor() ? Icons.star_rounded
              : (i < rating ? Icons.star_half_rounded : Icons.star_outline_rounded),
          color: const Color(0xFFF59E0B),
          size: size,
        );
      }),
    );
  }
}

/// Section header row with optional "See All" action
class SectionHeader extends StatelessWidget {
  const SectionHeader({
    super.key, required this.title,
    this.subtitle, this.onSeeAll, this.seeAllLabel = 'See All',
  });
  final String title;
  final String? subtitle;
  final VoidCallback? onSeeAll;
  final String seeAllLabel;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
              if (subtitle != null)
                Text(subtitle!, style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted)),
            ],
          ),
        ),
        if (onSeeAll != null)
          TextButton(
            onPressed: onSeeAll,
            style: TextButton.styleFrom(
              foregroundColor: AppTheme.primaryDeep,
              padding: const EdgeInsets.symmetric(horizontal: 4),
            ),
            child: Text(seeAllLabel,
                style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.primaryDeep)),
          ),
      ],
    );
  }
}

/// Themed text input field
class MedTextField extends StatelessWidget {
  const MedTextField({
    super.key, required this.label, this.hint,
    this.controller, this.prefixIcon, this.suffixIcon,
    this.obscureText = false, this.keyboardType, this.validator,
    this.maxLines = 1, this.onChanged, this.enabled = true, this.readOnly = false,
    this.onTap,
  });
  final String label;
  final String? hint;
  final TextEditingController? controller;
  final IconData? prefixIcon;
  final Widget? suffixIcon;
  final bool obscureText;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final int maxLines;
  final void Function(String)? onChanged;
  final bool enabled;
  final bool readOnly;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      validator: validator,
      maxLines: maxLines,
      enabled: enabled,
      readOnly: readOnly,
      onTap: onTap,
      onChanged: onChanged,
      style: GoogleFonts.outfit(fontSize: 14, color: AppTheme.textPrimary),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: prefixIcon != null ? Icon(prefixIcon, size: 20, color: AppTheme.textMuted) : null,
        suffixIcon: suffixIcon,
      ),
    );
  }
}

/// Gradient app bar for screens with branded header
class GradientAppBar extends StatelessWidget implements PreferredSizeWidget {
  const GradientAppBar({
    super.key, required this.title, this.subtitle,
    this.leading, this.actions, this.bottom,
  });
  final String title;
  final String? subtitle;
  final Widget? leading;
  final List<Widget>? actions;
  final PreferredSizeWidget? bottom;

  @override
  Size get preferredSize => Size.fromHeight(
    bottom != null ? kToolbarHeight + bottom!.preferredSize.height + (subtitle != null ? 24 : 0) : kToolbarHeight + (subtitle != null ? 24 : 0),
  );

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(gradient: AppTheme.primaryGradient),
      child: SafeArea(
        bottom: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: EdgeInsets.fromLTRB(4, 8, 4, subtitle != null ? 4 : 8),
              child: Row(
                children: [
                  if (leading != null) leading!
                  else const SizedBox(width: 48),
                  Expanded(
                    child: Column(
                      children: [
                        Text(title, textAlign: TextAlign.center,
                            style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white)),
                        if (subtitle != null)
                          Text(subtitle!, textAlign: TextAlign.center,
                              style: GoogleFonts.outfit(fontSize: 11, color: Colors.white70)),
                      ],
                    ),
                  ),
                  if (actions != null) ...actions!
                  else const SizedBox(width: 48),
                ],
              ),
            ),
            if (bottom != null) bottom!,
          ],
        ),
      ),
    );
  }
}

/// Quick-info stat tile for dashboard
class StatTile extends StatelessWidget {
  const StatTile({
    super.key, required this.icon, required this.value,
    required this.label, required this.color, required this.bgColor,
    this.onTap,
  });
  final IconData icon;
  final String value;
  final String label;
  final Color color;
  final Color bgColor;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(AppTheme.radiusSm),
              ),
              child: Icon(icon, color: color, size: 18),
            ),
            const SizedBox(height: 10),
            Text(value,
                style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
            const SizedBox(height: 2),
            Text(label,
                style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w500, color: AppTheme.textSecondary)),
          ],
        ),
      ),
    );
  }
}
