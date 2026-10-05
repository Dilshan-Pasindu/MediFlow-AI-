import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/auth/auth_provider.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/widgets/widgets.dart';
import '../notifications/notifications_screen.dart';
import '../orders/orders_screen.dart';
import '../ai/symptom_ai_screen.dart';
import '../get_started_screen.dart';
import '../main_shell.dart';
import 'edit_profile_screen.dart';

/// Patient Profile Screen (macOS Medical Theme)
/// Features:
///  - Personal and clinical health records (Blood group, Allergies, DOB, Address)
///  - Vitals metrics display
///  - macOS styled settings menu & direct portal navigation
///  - Sign out dialog
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final profileAsync = ref.watch(patientProfileProvider);

    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        automaticallyImplyLeading: false,
        title: Text(
          'Patient Health Profile',
          style: GoogleFonts.inter(
            fontSize: 17,
            fontWeight: FontWeight.w800,
            color: AppTheme.textPrimary,
          ),
        ),
        actions: [
          IconButton(
            icon: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppTheme.bgCanvas,
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.cardBorder),
              ),
              child: const Icon(LucideIcons.pencil, size: 18, color: AppTheme.primaryBlue),
            ),
            tooltip: 'Edit Profile',
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const EditProfileScreen()),
            ),
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: RefreshIndicator(
        color: AppTheme.primaryBlue,
        onRefresh: () async => ref.invalidate(patientProfileProvider),
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 110),
          children: [
            // ── Patient Card ──
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: AppTheme.cardBorder),
                boxShadow: AppTheme.macOSShadow,
              ),
              child: Row(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppTheme.primaryBlue.withValues(alpha: 0.12),
                      border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.3), width: 2),
                    ),
                    child: Center(
                      child: Text(
                        auth.user?.fullName.isNotEmpty == true
                            ? auth.user!.fullName[0].toUpperCase()
                            : 'P',
                        style: GoogleFonts.inter(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.primaryBlue,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          auth.user?.fullName ?? 'Verified Patient',
                          style: GoogleFonts.inter(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          auth.user?.email ?? '',
                          style: GoogleFonts.inter(
                            fontSize: 12.5,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFFECFDF5),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(LucideIcons.badgeCheck, size: 12, color: Color(0xFF059669)),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Active Patient',
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: const Color(0xFF059669),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ── Clinical & Health Metrics ──
            profileAsync.when(
              loading: () => const ShimmerCard(height: 140),
              error: (_, __) => const SizedBox(),
              data: (profile) => Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppTheme.cardBorder),
                  boxShadow: AppTheme.macOSShadow,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Clinical Health Record',
                          style: GoogleFonts.inter(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryBlue50,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            profile.bloodGroup?.isNotEmpty == true ? profile.bloodGroup! : 'Blood Type: —',
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.primaryBlue,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    _ClinicalDataRow(
                      icon: LucideIcons.phone,
                      label: 'Contact Number',
                      value: profile.phoneNumber?.isNotEmpty == true ? profile.phoneNumber! : 'Not provided',
                    ),
                    const Divider(height: 20),

                    _ClinicalDataRow(
                      icon: LucideIcons.cake,
                      label: 'Date of Birth',
                      value: profile.dateOfBirth != null && profile.dateOfBirth!.length >= 10
                          ? DateFormat('MMMM d, yyyy').format(DateTime.parse(profile.dateOfBirth!.substring(0, 10)))
                          : 'Not recorded',
                    ),
                    const Divider(height: 20),

                    _ClinicalDataRow(
                      icon: LucideIcons.user,
                      label: 'Gender',
                      value: profile.gender?.isNotEmpty == true ? profile.gender! : 'Not specified',
                    ),
                    const Divider(height: 20),

                    _ClinicalDataRow(
                      icon: LucideIcons.triangleAlert,
                      label: 'Known Allergies',
                      value: profile.allergies?.isNotEmpty == true ? profile.allergies! : 'No known drug allergies',
                      isHighlight: profile.allergies?.isNotEmpty == true,
                    ),
                    const Divider(height: 20),

                    _ClinicalDataRow(
                      icon: LucideIcons.mapPin,
                      label: 'Home Address',
                      value: profile.address?.isNotEmpty == true ? profile.address! : 'Not provided',
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // ── Patient Quick Navigation Menu ──
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: AppTheme.cardBorder),
                boxShadow: AppTheme.macOSShadow,
              ),
              child: Column(
                children: [
                  _ProfileMenuItem(
                    icon: LucideIcons.truck,
                    label: 'Medicine Dispensing Orders',
                    subtitle: 'Track real-time pharmacy queue',
                    color: const Color(0xFFD97706),
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const OrdersScreen()),
                    ),
                  ),
                  const Divider(height: 1, indent: 56),
                  _ProfileMenuItem(
                    icon: LucideIcons.sparkles,
                    label: 'AI Symptom Checker',
                    subtitle: 'Clinical specialist recommendation',
                    color: const Color(0xFF7C3AED),
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const SymptomAiScreen()),
                    ),
                  ),
                  const Divider(height: 1, indent: 56),
                  _ProfileMenuItem(
                    icon: LucideIcons.bell,
                    label: 'Notifications & Alerts',
                    subtitle: 'Consultation & prescription updates',
                    color: AppTheme.primaryBlue,
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                    ),
                  ),
                  const Divider(height: 1, indent: 56),
                  _ProfileMenuItem(
                    icon: LucideIcons.logOut,
                    label: 'Sign Out',
                    subtitle: 'Disconnect account session',
                    color: const Color(0xFFDC2626),
                    onTap: () => _handleLogout(context, ref),
                  ),
                ],
              ),
            ),
            // ── Official Brand Footer ──
            const SizedBox(height: 28),
            Center(
              child: Column(
                children: [
                  const MediFlowLogo(variant: MediFlowLogoVariant.horizontal, height: 22),
                  const SizedBox(height: 6),
                  Text(
                    'MediFlow AI Clinical Platform • v1.0.0',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: AppTheme.textMuted,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleLogout(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          'Sign Out?',
          style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        content: Text(
          'Are you sure you want to end your active MediFlow session?',
          style: GoogleFonts.inter(fontSize: 13.5, color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text('Cancel', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('Sign Out', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      // 1. Reset bottom navigation tab back to Home
      ref.read(shellTabProvider.notifier).state = 0;

      // 2. Clear patient caches
      ref.invalidate(patientProfileProvider);
      ref.invalidate(myAppointmentsProvider);
      ref.invalidate(myPrescriptionsProvider);
      ref.invalidate(myOrdersProvider);
      ref.invalidate(notificationsProvider);

      // 3. Clear auth session & stored tokens
      await ref.read(authProvider.notifier).logout();

      // 4. Redirect to home landing page (Get Started screen)
      if (context.mounted) {
        Navigator.of(context, rootNavigator: true).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const GetStartedScreen()),
          (_) => false,
        );
      }
    }
  }
}

class _ClinicalDataRow extends StatelessWidget {
  const _ClinicalDataRow({
    required this.icon,
    required this.label,
    required this.value,
    this.isHighlight = false,
  });

  final IconData icon;
  final String label;
  final String value;
  final bool isHighlight;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: isHighlight
                ? const Color(0xFFFEF2F2)
                : AppTheme.surface2,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            size: 18,
            color: isHighlight ? const Color(0xFFDC2626) : AppTheme.textSecondary,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textMuted,
                ),
              ),
              Text(
                value,
                style: GoogleFonts.inter(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w700,
                  color: isHighlight ? const Color(0xFFDC2626) : AppTheme.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ProfileMenuItem extends StatelessWidget {
  const _ProfileMenuItem({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          child: Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, size: 20, color: color),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: GoogleFonts.inter(
                        fontSize: 11.5,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(LucideIcons.chevronRight, size: 20, color: AppTheme.textMuted),
            ],
          ),
        ),
      ),
    );
  }
}
