import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/auth/auth_provider.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/widgets/widgets.dart';
import '../auth/login_screen.dart';
import '../notifications/notifications_screen.dart';
import '../orders/orders_screen.dart';
import 'edit_profile_screen.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final profileAsync = ref.watch(patientProfileProvider);

    return Scaffold(
      backgroundColor: AppTheme.surfaceDim,
      body: CustomScrollView(
        slivers: [
          // Header with gradient
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(28),
                  bottomRight: Radius.circular(28),
                ),
              ),
              child: SafeArea(
                bottom: false,
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Profile',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w700, color: Colors.white)),
                          IconButton(
                            icon: const Icon(Icons.edit_outlined, color: Colors.white, size: 20),
                            onPressed: () => Navigator.of(context).push(
                                MaterialPageRoute(builder: (_) => const EditProfileScreen())),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
                      child: Column(
                        children: [
                          // Avatar
                          PatientAvatar(name: auth.user?.fullName ?? 'P', radius: 44),
                          const SizedBox(height: 12),
                          Text(auth.user?.fullName ?? '',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                          Text(auth.user?.email ?? '',
                            style: GoogleFonts.outfit(fontSize: 13, color: Colors.white70)),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.accentGreen.withOpacity(0.9),
                              borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                            ),
                            child: Text('Patient',
                              style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Profile details
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Health info
                profileAsync.when(
                  loading: () => const ShimmerCard(height: 140),
                  error: (_, __) => const SizedBox(),
                  data: (profile) => MedCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Health Information',
                            style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 12),
                        _ProfileRow(icon: Icons.phone_outlined, label: 'Phone',
                            value: profile.phoneNumber?.isNotEmpty == true ? profile.phoneNumber! : '—'),
                        _ProfileRow(icon: Icons.cake_outlined, label: 'Date of Birth',
                            value: profile.dateOfBirth != null
                                ? DateFormat('d MMMM yyyy').format(
                                    DateFormat('yyyy-MM-dd').parse(profile.dateOfBirth!.substring(0, 10)))
                                : '—'),
                        _ProfileRow(icon: Icons.person_outline_rounded, label: 'Gender',
                            value: profile.gender?.isNotEmpty == true ? profile.gender! : '—'),
                        _ProfileRow(icon: Icons.bloodtype_outlined, label: 'Blood Group',
                            value: profile.bloodGroup?.isNotEmpty == true ? profile.bloodGroup! : '—'),
                        _ProfileRow(icon: Icons.medical_information_outlined, label: 'Allergies',
                            value: profile.allergies?.isNotEmpty == true ? profile.allergies! : 'None listed'),
                        _ProfileRow(icon: Icons.location_on_outlined, label: 'Address',
                            value: profile.address?.isNotEmpty == true ? profile.address! : '—'),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Menu items
                MedCard(
                  padding: EdgeInsets.zero,
                  child: Column(
                    children: [
                      _MenuItem(
                        icon: Icons.calendar_month_outlined,
                        label: 'My Appointments',
                        color: AppTheme.primaryDeep,
                        onTap: () {
                          // Navigate to appointments tab
                        },
                      ),
                      const Divider(height: 0, indent: 56),
                      _MenuItem(
                        icon: Icons.medication_outlined,
                        label: 'E-Prescriptions',
                        color: const Color(0xFF0D9488),
                        onTap: () {},
                      ),
                      const Divider(height: 0, indent: 56),
                      _MenuItem(
                        icon: Icons.shopping_bag_outlined,
                        label: 'Medicine Orders',
                        color: const Color(0xFFF59E0B),
                        onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const OrdersScreen())),
                      ),
                      const Divider(height: 0, indent: 56),
                      _MenuItem(
                        icon: Icons.notifications_outlined,
                        label: 'Notifications',
                        color: const Color(0xFF6366F1),
                        onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const NotificationsScreen())),
                      ),
                      const Divider(height: 0, indent: 56),
                      _MenuItem(
                        icon: Icons.edit_outlined,
                        label: 'Edit Profile',
                        color: AppTheme.textSecondary,
                        onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const EditProfileScreen())),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Logout
                MedCard(
                  padding: EdgeInsets.zero,
                  child: _MenuItem(
                    icon: Icons.logout_rounded,
                    label: 'Sign Out',
                    color: AppTheme.statusInConsult,
                    onTap: () async {
                      final confirmed = await showDialog<bool>(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusXl)),
                          title: Text('Sign Out', style: GoogleFonts.outfit(fontWeight: FontWeight.w700)),
                          content: Text('Are you sure you want to sign out?',
                              style: GoogleFonts.outfit(fontSize: 14, color: AppTheme.textSecondary)),
                          actions: [
                            TextButton(onPressed: () => Navigator.pop(ctx, false),
                                child: Text('Cancel', style: GoogleFonts.outfit())),
                            ElevatedButton(
                              onPressed: () => Navigator.pop(ctx, true),
                              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.statusInConsult),
                              child: Text('Sign Out', style: GoogleFonts.outfit(color: Colors.white)),
                            ),
                          ],
                        ),
                      );
                      if (confirmed == true) {
                        await ref.read(authProvider.notifier).logout();
                        if (context.mounted) {
                          Navigator.of(context).pushAndRemoveUntil(
                            MaterialPageRoute(builder: (_) => const LoginScreen()),
                            (_) => false,
                          );
                        }
                      }
                    },
                  ),
                ),
                const SizedBox(height: 32),
                Center(
                  child: Text('MediFlow AI v1.0.0 • Patient Portal',
                      style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
                ),
                const SizedBox(height: 80),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileRow extends StatelessWidget {
  const _ProfileRow({required this.icon, required this.label, required this.value});
  final IconData icon;
  final String label, value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: AppTheme.textMuted),
          const SizedBox(width: 10),
          SizedBox(width: 100,
            child: Text(label, style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted))),
          Expanded(
            child: Text(value,
              style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w500, color: AppTheme.textPrimary),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  const _MenuItem({required this.icon, required this.label, required this.color, required this.onTap});
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppTheme.radiusLg),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(width: 14),
          Expanded(child: Text(label,
              style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w500, color: AppTheme.textPrimary))),
          const Icon(Icons.chevron_right_rounded, color: AppTheme.textMuted, size: 18),
        ]),
      ),
    );
  }
}
