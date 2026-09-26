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

/// Global tab index provider
final shellTabProvider = StateProvider<int>((_) => 0);

/// Main shell — blue pill-shaped bottom navigation bar
/// matching the reference design: blue background, white icons,
/// active item in a white rounded capsule
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
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 14),
          child: Container(
            height: 66,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF4A6FE3), Color(0xFF2F4FD1)],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
              borderRadius: BorderRadius.circular(AppTheme.radiusFull),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF4A6FE3).withValues(alpha: 0.40),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavItem(
                  icon: Icons.home_outlined,
                  activeIcon: Icons.home_rounded,
                  label: 'Home',
                  index: 0,
                  selectedIndex: selectedIndex,
                  onTap: () => ref.read(shellTabProvider.notifier).state = 0,
                ),
                _NavItem(
                  icon: Icons.search_rounded,
                  activeIcon: Icons.search_rounded,
                  label: 'Doctors',
                  index: 1,
                  selectedIndex: selectedIndex,
                  onTap: () => ref.read(shellTabProvider.notifier).state = 1,
                ),
                _NavItem(
                  icon: Icons.calendar_today_outlined,
                  activeIcon: Icons.calendar_today_rounded,
                  label: 'Schedule',
                  index: 2,
                  selectedIndex: selectedIndex,
                  onTap: () => ref.read(shellTabProvider.notifier).state = 2,
                ),
                _NavItem(
                  icon: Icons.favorite_border_rounded,
                  activeIcon: Icons.favorite_rounded,
                  label: 'Records',
                  index: 3,
                  selectedIndex: selectedIndex,
                  onTap: () => ref.read(shellTabProvider.notifier).state = 3,
                ),
                _NavItem(
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

class _NavItem extends StatelessWidget {
  const _NavItem({
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
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOutCubic,
        padding: isSelected
            ? const EdgeInsets.symmetric(horizontal: 16, vertical: 6)
            : const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected
              ? Colors.white.withValues(alpha: 0.22)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(AppTheme.radiusFull),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  isSelected ? activeIcon : icon,
                  color: Colors.white,
                  size: 22,
                ),
                if (badge != null && !isSelected)
                  Positioned(
                    right: -4,
                    top: -4,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Color(0xFFFF4757),
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
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
