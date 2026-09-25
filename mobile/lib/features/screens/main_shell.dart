import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../features/patient/patient_providers.dart';
import 'dashboard/dashboard_screen.dart';
import 'doctors/find_doctor_screen.dart';
import 'appointments/appointments_screen.dart';
import 'prescriptions/prescriptions_screen.dart';
import 'profile/profile_screen.dart';

/// Global tab index provider:
/// 0: Home (Dashboard)
/// 1: Doctors (Find Doctor)
/// 2: Appointments (Schedule)
/// 3: Prescriptions (Records)
/// 4: Profile (Account)
final shellTabProvider = StateProvider<int>((_) => 0);

/// Main shell featuring the signature organic floating teal navigation bar
/// from the modern clinical design system.
class MainShell extends ConsumerWidget {
  const MainShell({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndex = ref.watch(shellTabProvider);
    final unread = ref.watch(unreadCountProvider);

    const screens = [
      DashboardScreen(),
      FindDoctorScreen(),
      AppointmentsScreen(),
      PrescriptionsScreen(),
      ProfileScreen(),
    ];

    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: selectedIndex.clamp(0, screens.length - 1),
        children: screens,
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: Container(
            height: 66,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.primaryTeal,
              borderRadius: BorderRadius.circular(38),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.primaryTeal.withValues(alpha: 0.35),
                  blurRadius: 22,
                  spreadRadius: 0,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _NavPillItem(
                  icon: Icons.home_outlined,
                  activeIcon: Icons.home_rounded,
                  label: 'Home',
                  index: 0,
                  selectedIndex: selectedIndex,
                  onTap: () => ref.read(shellTabProvider.notifier).state = 0,
                ),
                _NavPillItem(
                  icon: Icons.medical_services_outlined,
                  activeIcon: Icons.medical_services_rounded,
                  label: 'Doctors',
                  index: 1,
                  selectedIndex: selectedIndex,
                  onTap: () => ref.read(shellTabProvider.notifier).state = 1,
                ),
                _NavPillItem(
                  icon: Icons.calendar_today_outlined,
                  activeIcon: Icons.calendar_today_rounded,
                  label: 'Schedule',
                  index: 2,
                  selectedIndex: selectedIndex,
                  onTap: () => ref.read(shellTabProvider.notifier).state = 2,
                ),
                _NavPillItem(
                  icon: Icons.assignment_outlined,
                  activeIcon: Icons.assignment_rounded,
                  label: 'Records',
                  index: 3,
                  selectedIndex: selectedIndex,
                  onTap: () => ref.read(shellTabProvider.notifier).state = 3,
                ),
                _NavPillItem(
                  icon: Icons.person_outline_rounded,
                  activeIcon: Icons.person_rounded,
                  label: 'Profile',
                  index: 4,
                  selectedIndex: selectedIndex,
                  badge: unread > 0 ? unread : null,
                  onTap: () => ref.read(shellTabProvider.notifier).state = 4,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavPillItem extends StatelessWidget {
  const _NavPillItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.index,
    required this.selectedIndex,
    required this.onTap,
    this.badge,
  });

  final IconData icon;
  final IconData activeIcon;
  final String label;
  final int index;
  final int selectedIndex;
  final VoidCallback onTap;
  final int? badge;

  @override
  Widget build(BuildContext context) {
    final isSelected = index == selectedIndex;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOutCubic,
        padding: isSelected
            ? const EdgeInsets.symmetric(horizontal: 14, vertical: 8)
            : const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  isSelected ? activeIcon : icon,
                  color: isSelected ? AppTheme.primaryTeal : Colors.white,
                  size: 21,
                ),
                if (badge != null && !isSelected)
                  Positioned(
                    right: -4,
                    top: -4,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Color(0xFFEF4444),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            if (isSelected) ...[
              const SizedBox(width: 6),
              Text(
                label,
                style: GoogleFonts.outfit(
                  color: AppTheme.primaryTeal,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.2,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
