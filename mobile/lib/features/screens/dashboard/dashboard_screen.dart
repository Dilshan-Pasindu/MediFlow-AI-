import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/auth/auth_provider.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';
import '../appointments/appointment_detail_screen.dart';
import '../doctors/doctor_profile_screen.dart';
import '../ai/symptom_ai_screen.dart';
import '../notifications/notifications_screen.dart';
import '../main_shell.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _selectedDayIndex = 3; // Defaults to Thu 15 like in reference design
  bool _isFavorite = false;

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final apptsAsync = ref.watch(myAppointmentsProvider);
    final rxsAsync = ref.watch(myPrescriptionsProvider);
    final doctorsAsync = ref.watch(doctorsProvider);

    final rawName = auth.user?.fullName.trim();
    final firstName = (rawName != null && rawName.isNotEmpty) ? rawName.split(' ').first : 'Martin';
    final formattedDate = DateFormat('d MMMM, yyyy').format(DateTime.now());

    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          color: AppTheme.primaryTeal,
          onRefresh: () async {
            ref.invalidate(myAppointmentsProvider);
            ref.invalidate(myPrescriptionsProvider);
            ref.invalidate(doctorsProvider);
          },
          child: CustomScrollView(
            slivers: [
              // ── Top Header ──────────────────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                  child: Row(
                    children: [
                      // User Avatar
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.06),
                              blurRadius: 10,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: Container(
                            color: AppTheme.primaryTeal.withValues(alpha: 0.15),
                            child: Center(
                              child: Text(
                                firstName.isNotEmpty ? firstName[0].toUpperCase() : 'M',
                                style: GoogleFonts.outfit(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: AppTheme.primaryTeal,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Greeting & Date
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Hello, $firstName',
                              style: GoogleFonts.outfit(
                                fontSize: 17,
                                fontWeight: FontWeight.w800,
                                color: AppTheme.textPrimary,
                                letterSpacing: -0.2,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              formattedDate,
                              style: GoogleFonts.outfit(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Circular Search button
                      _CircularActionButton(
                        icon: Icons.search_rounded,
                        onTap: () => ref.read(shellTabProvider.notifier).state = 1,
                      ),
                      const SizedBox(width: 10),
                      // Circular Notification button with red dot
                      _CircularActionButton(
                        icon: Icons.notifications_outlined,
                        hasBadge: true,
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // ── Main Content ────────────────────────────────────────────
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 110),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    // ── "Top Doctors" Section ─────────────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Top Doctors',
                          style: GoogleFonts.outfit(
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textPrimary,
                            letterSpacing: -0.2,
                          ),
                        ),
                        GestureDetector(
                          onTap: () => ref.read(shellTabProvider.notifier).state = 1,
                          child: Text(
                            'See all',
                            style: GoogleFonts.outfit(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primaryTeal,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // ── Featured Emerald Teal Doctor Card ──────────────────
                    doctorsAsync.when(
                      loading: () => const ShimmerCard(height: 260),
                      error: (_, __) => _buildFeaturedDoctorCard(null),
                      data: (doctors) => _buildFeaturedDoctorCard(
                        doctors.isNotEmpty ? doctors.first : null,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // ── "Disease Monitoring" Section ───────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Disease\nmonitoring',
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            height: 1.15,
                            color: AppTheme.textPrimary,
                            letterSpacing: -0.2,
                          ),
                        ),
                        Row(
                          children: [
                            _SmallToolButton(
                              icon: Icons.tune_rounded,
                              onTap: () => Navigator.of(context).push(
                                MaterialPageRoute(builder: (_) => const SymptomAiScreen()),
                              ),
                            ),
                            const SizedBox(width: 8),
                            _SmallToolButton(
                              icon: Icons.more_horiz_rounded,
                              onTap: () => ref.read(shellTabProvider.notifier).state = 1,
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Disease Monitoring Horizontal Cards
                    SizedBox(
                      height: 142,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        clipBehavior: Clip.none,
                        children: [
                          _DiseaseMonitoringCard(
                            title: "Bechterew's\ndisease",
                            icon: Icons.accessibility_new_rounded,
                            iconColor: const Color(0xFFE11D48),
                            iconBg: const Color(0xFFFFE4E6),
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SymptomAiScreen()),
                            ),
                          ),
                          const SizedBox(width: 14),
                          _DiseaseMonitoringCard(
                            title: "Migraine\ncare",
                            icon: Icons.psychology_rounded,
                            iconColor: const Color(0xFF7C3AED),
                            iconBg: const Color(0xFFEDE9FE),
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SymptomAiScreen()),
                            ),
                          ),
                          const SizedBox(width: 14),
                          _DiseaseMonitoringCard(
                            title: "Hypertension\ntracking",
                            icon: Icons.favorite_rounded,
                            iconColor: const Color(0xFF0D9488),
                            iconBg: const Color(0xFFCCFBF1),
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SymptomAiScreen()),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // ── AI Symptom Banner CTA ──────────────────────────────
                    GestureDetector(
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const SymptomAiScreen()),
                      ),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: AppTheme.cardBorder),
                          boxShadow: AppTheme.cardShadow,
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: AppTheme.primaryTeal.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Icon(
                                Icons.auto_awesome_rounded,
                                color: AppTheme.primaryTeal,
                                size: 22,
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'MediFlow Clinical AI Triage',
                                    style: GoogleFonts.outfit(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Check symptoms & get specialist match',
                                    style: GoogleFonts.outfit(
                                      fontSize: 12,
                                      color: AppTheme.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              width: 32,
                              height: 32,
                              decoration: const BoxDecoration(
                                color: AppTheme.bgCanvas,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.arrow_outward_rounded,
                                color: AppTheme.primaryTeal,
                                size: 18,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // ── Upcoming Appointments ──────────────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Upcoming Appointments',
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textPrimary,
                            letterSpacing: -0.2,
                          ),
                        ),
                        GestureDetector(
                          onTap: () => ref.read(shellTabProvider.notifier).state = 2,
                          child: Text(
                            'See all',
                            style: GoogleFonts.outfit(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primaryTeal,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    apptsAsync.when(
                      loading: () => Column(
                        children: List.generate(2, (_) => const ShimmerCard(height: 80)),
                      ),
                      error: (e, _) => ErrorState(
                        message: e.toString(),
                        onRetry: () => ref.invalidate(myAppointmentsProvider),
                      ),
                      data: (appts) {
                        final upcoming = appts.where((a) => a.isUpcoming).take(2).toList();
                        if (upcoming.isEmpty) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(color: AppTheme.cardBorder),
                              boxShadow: AppTheme.cardShadow,
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: AppTheme.primaryTeal.withValues(alpha: 0.1),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.calendar_month_outlined,
                                    color: AppTheme.primaryTeal,
                                    size: 24,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'No appointments booked',
                                        style: GoogleFonts.outfit(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w700,
                                          color: AppTheme.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        'Schedule a visit with our top specialists',
                                        style: GoogleFonts.outfit(
                                          fontSize: 12,
                                          color: AppTheme.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: () => ref.read(shellTabProvider.notifier).state = 1,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.primaryTeal,
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                  ),
                                  child: Text(
                                    'Book',
                                    style: GoogleFonts.outfit(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }
                        return Column(
                          children: upcoming
                              .map((a) => _AppointmentCard(
                                    appt: a,
                                    onTap: () {
                                      Navigator.of(context).push(
                                        MaterialPageRoute(
                                          builder: (_) => AppointmentDetailScreen(id: a.id),
                                        ),
                                      );
                                    },
                                  ))
                              .toList(),
                        );
                      },
                    ),
                    const SizedBox(height: 24),

                    // ── Recent Prescriptions ───────────────────────────────
                    rxsAsync.when(
                      loading: () => const SizedBox(),
                      error: (_, __) => const SizedBox(),
                      data: (rxs) {
                        if (rxs.isEmpty) return const SizedBox();
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Recent Prescriptions',
                                  style: GoogleFonts.outfit(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: AppTheme.textPrimary,
                                    letterSpacing: -0.2,
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () => ref.read(shellTabProvider.notifier).state = 3,
                                  child: Text(
                                    'See all',
                                    style: GoogleFonts.outfit(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.primaryTeal,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            ...rxs.take(2).map((rx) => _PrescriptionCard(rx: rx)),
                          ],
                        );
                      },
                    ),
                  ]),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Featured Doctor Card (Emerald Teal Hero) ─────────────────────────────
  Widget _buildFeaturedDoctorCard(DoctorModel? doc) {
    final doctorName = doc?.fullName ?? 'Dr. Johan Janson';
    final specialty = doc?.primarySpecialty ?? 'Arthropathic';
    final rating = (doc?.averageRating != null && doc!.averageRating > 0) ? doc.averageRating : 4.8;
    final fee = doc?.consultationFee != null ? '\$${doc!.consultationFee!.toInt()}' : '\$95';

    final days = [
      {'day': 'Mon', 'num': '12'},
      {'day': 'Tue', 'num': '13'},
      {'day': 'Wed', 'num': '14'},
      {'day': 'Thu', 'num': '15'},
      {'day': 'Fri', 'num': '16'},
      {'day': 'Sat', 'num': '17'},
      {'day': 'Sun', 'num': '18'},
    ];

    return GestureDetector(
      onTap: () {
        if (doc != null) {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => DoctorProfileScreen(id: doc.id)),
          );
        } else {
          ref.read(shellTabProvider.notifier).state = 1;
        }
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.primaryTeal,
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: AppTheme.primaryTeal.withValues(alpha: 0.35),
              blurRadius: 24,
              spreadRadius: 0,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top row: Rating Pill & Favorite Heart
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // White Rating Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.star_rounded, color: AppTheme.starGold, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        rating.toStringAsFixed(1),
                        style: GoogleFonts.outfit(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
                // Favorite Heart Button
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _isFavorite = !_isFavorite;
                    });
                  },
                  child: Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      _isFavorite ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                      color: Colors.white,
                      size: 18,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Middle row: Doctor details and Avatar illustration
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        specialty,
                        style: GoogleFonts.outfit(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFFA7F3D0),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        doctorName,
                        style: GoogleFonts.outfit(
                          fontSize: 21,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            fee,
                            style: GoogleFonts.outfit(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                          Text(
                            '/session',
                            style: GoogleFonts.outfit(
                              fontSize: 12,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Doctor Photo / Avatar with Stethoscope representation
                Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 90,
                      height: 90,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.3),
                          width: 2,
                        ),
                      ),
                    ),
                    if (doc?.profilePhoto != null && doc!.profilePhoto!.isNotEmpty)
                      ClipOval(
                        child: Image.network(
                          doc.profilePhoto!,
                          width: 82,
                          height: 82,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.medical_services_rounded,
                            size: 40,
                            color: Colors.white,
                          ),
                        ),
                      )
                    else
                      const Icon(
                        Icons.medical_services_rounded,
                        size: 44,
                        color: Colors.white,
                      ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Embedded Availability & Day Selector
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(22),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Availability • 8 slots',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      Row(
                        children: [
                          Text(
                            'February 2025',
                            style: GoogleFonts.outfit(
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              color: Colors.white.withValues(alpha: 0.9),
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.chevron_right_rounded,
                            size: 16,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Horizontal 7-Day Selector
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: List.generate(days.length, (i) {
                      final item = days[i];
                      final isSelected = i == _selectedDayIndex;
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedDayIndex = i;
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
                          decoration: BoxDecoration(
                            color: isSelected ? Colors.white : Colors.transparent,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            children: [
                              Text(
                                item['day']!,
                                style: GoogleFonts.outfit(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500,
                                  color: isSelected ? AppTheme.primaryTeal : Colors.white70,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                item['num']!,
                                style: GoogleFonts.outfit(
                                  fontSize: 12,
                                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                  color: isSelected ? AppTheme.primaryTeal : Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Circular Header Action Button ─────────────────────────────────────────────
class _CircularActionButton extends StatelessWidget {
  const _CircularActionButton({
    required this.icon,
    required this.onTap,
    this.hasBadge = false,
  });

  final IconData icon;
  final VoidCallback onTap;
  final bool hasBadge;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: AppTheme.cardBorder),
          boxShadow: AppTheme.cardShadow,
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Icon(icon, color: AppTheme.textPrimary, size: 20),
            if (hasBadge)
              Positioned(
                top: 11,
                right: 12,
                child: Container(
                  width: 7,
                  height: 7,
                  decoration: const BoxDecoration(
                    color: Color(0xFFEF4444),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ── Small Filter / Option Button ──────────────────────────────────────────────
class _SmallToolButton extends StatelessWidget {
  const _SmallToolButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: AppTheme.cardBorder),
          boxShadow: AppTheme.cardShadow,
        ),
        child: Icon(icon, color: AppTheme.textSecondary, size: 18),
      ),
    );
  }
}

// ── Disease Monitoring Card (from Reference Design) ───────────────────────────
class _DiseaseMonitoringCard extends StatelessWidget {
  const _DiseaseMonitoringCard({
    required this.title,
    required this.icon,
    required this.iconColor,
    required this.iconBg,
    required this.onTap,
  });

  final String title;
  final IconData icon;
  final Color iconColor;
  final Color iconBg;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 146,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppTheme.cardBorder),
          boxShadow: AppTheme.cardShadow,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: GoogleFonts.outfit(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary,
                height: 1.25,
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: iconBg,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: iconColor, size: 18),
                ),
                Container(
                  width: 34,
                  height: 34,
                  decoration: const BoxDecoration(
                    color: AppTheme.bgCanvas,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.arrow_outward_rounded,
                    color: AppTheme.textPrimary,
                    size: 16,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ── Clean White Appointment Card ─────────────────────────────────────────────
class _AppointmentCard extends StatelessWidget {
  const _AppointmentCard({required this.appt, required this.onTap});

  final AppointmentModel appt;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final statusInfo = AppTheme.appointmentStatus(appt.status);
    final dt = appt.appointmentDateTime;
    final dateStr = DateFormat('EEE, MMM d').format(dt);
    final timeStr = DateFormat('h:mm a').format(dt);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppTheme.cardBorder),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(22),
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                DoctorAvatar(
                  photoUrl: appt.doctorProfilePhoto,
                  name: appt.doctorName,
                  radius: 26,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        appt.doctorName,
                        style: GoogleFonts.outfit(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        appt.specialtyName,
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(
                            Icons.access_time_rounded,
                            size: 13,
                            color: AppTheme.primaryTeal,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '$dateStr • $timeStr',
                            style: GoogleFonts.outfit(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.primaryTeal,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: statusInfo.bg,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    statusInfo.label,
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: statusInfo.text,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Clean Prescription Card ──────────────────────────────────────────────────
class _PrescriptionCard extends StatelessWidget {
  const _PrescriptionCard({required this.rx});

  final PrescriptionModel rx;

  @override
  Widget build(BuildContext context) {
    DateTime? dt;
    if (rx.dateIssued != null) {
      try {
        dt = DateTime.parse(rx.dateIssued!);
      } catch (_) {}
    }
    final dateStr = dt != null ? DateFormat('MMM d, yyyy').format(dt) : (rx.dateIssued ?? 'Recent');
    final diagnosisTitle = (rx.diagnosis != null && rx.diagnosis!.isNotEmpty)
        ? rx.diagnosis!
        : 'Clinical Prescription';

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppTheme.cardBorder),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppTheme.primaryTeal.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(
              Icons.medication_rounded,
              color: AppTheme.primaryTeal,
              size: 22,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  diagnosisTitle,
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${rx.doctorName} • $dateStr',
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.accentMint,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Text(
              '${rx.items.length} meds',
              style: GoogleFonts.outfit(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppTheme.primaryDeep,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
