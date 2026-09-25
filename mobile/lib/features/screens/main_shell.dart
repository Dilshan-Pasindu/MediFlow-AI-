import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../features/patient/patient_providers.dart';
import 'dashboard/dashboard_screen.dart';
import 'appointments/appointments_screen.dart';
import 'doctors/find_doctor_screen.dart';
import 'prescriptions/prescriptions_screen.dart';
import 'profile/profile_screen.dart';

/// Global tab index provider so children can navigate tabs without
/// accessing private state directly.
final shellTabProvider = StateProvider<int>((_) => 0);

/// Main shell with bottom navigation bar.
class MainShell extends ConsumerWidget {
  const MainShell({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndex = ref.watch(shellTabProvider);
    final unread = ref.watch(unreadCountProvider);

    const screens = [
      DashboardScreen(),
      AppointmentsScreen(),
      FindDoctorScreen(),
      PrescriptionsScreen(),
      ProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: selectedIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppTheme.surface,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavItem(
                  icon: Icons.home_outlined, activeIcon: Icons.home_rounded,
                  label: 'Home', index: 0, selected: selectedIndex,
                  onTap: (i) => ref.read(shellTabProvider.notifier).state = i,
                ),
                _NavItem(
                  icon: Icons.calendar_today_outlined, activeIcon: Icons.calendar_today_rounded,
                  label: 'Appointments', index: 1, selected: selectedIndex,
                  onTap: (i) => ref.read(shellTabProvider.notifier).state = i,
                ),
                _NavItemCenterFAB(
                  onTap: () => ref.read(shellTabProvider.notifier).state = 2,
                  isSelected: selectedIndex == 2,
                ),
                _NavItem(
                  icon: Icons.medication_outlined, activeIcon: Icons.medication_rounded,
                  label: 'Prescriptions', index: 3, selected: selectedIndex,
                  onTap: (i) => ref.read(shellTabProvider.notifier).state = i,
                ),
                _NavItem(
                  icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded,
                  label: 'Profile', index: 4, selected: selectedIndex,
                  badge: unread > 0 ? unread : null,
                  onTap: (i) => ref.read(shellTabProvider.notifier).state = i,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.icon, required this.activeIcon, required this.label,
    required this.index, required this.selected, required this.onTap, this.badge,
  });
  final IconData icon, activeIcon;
  final String label;
  final int index, selected;
  final void Function(int) onTap;
  final int? badge;

  @override
  Widget build(BuildContext context) {
    final isSelected = index == selected;
    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 64,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppTheme.primaryDeep.withValues(alpha: 0.1)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                  ),
                  child: Icon(
                    isSelected ? activeIcon : icon,
                    color: isSelected ? AppTheme.primaryDeep : AppTheme.textMuted,
                    size: 22,
                  ),
                ),
                if (badge != null)
                  Positioned(
                    right: 4, top: 2,
                    child: Container(
                      width: 16, height: 16,
                      decoration: const BoxDecoration(
                        color: AppTheme.statusInConsult,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(badge! > 9 ? '9+' : '$badge',
                          style: GoogleFonts.outfit(
                              fontSize: 9, fontWeight: FontWeight.w700, color: Colors.white),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 3),
            Text(label,
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? AppTheme.primaryDeep : AppTheme.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItemCenterFAB extends StatelessWidget {
  const _NavItemCenterFAB({required this.onTap, required this.isSelected});
  final VoidCallback onTap;
  final bool isSelected;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: 52, height: 52,
            decoration: BoxDecoration(
              gradient: isSelected
                  ? const LinearGradient(colors: [Color(0xFF2D2BE8), Color(0xFF6C3AE0)])
                  : const LinearGradient(colors: [Color(0xFF4F46E5), Color(0xFF6366F1)]),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: AppTheme.primaryDeep.withValues(alpha: 0.4),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Icon(Icons.search_rounded, color: Colors.white, size: 26),
          ),
          const SizedBox(height: 3),
          Text('Find Doctor',
            style: GoogleFonts.outfit(
              fontSize: 10, fontWeight: FontWeight.w600,
              color: isSelected ? AppTheme.primaryDeep : AppTheme.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}
