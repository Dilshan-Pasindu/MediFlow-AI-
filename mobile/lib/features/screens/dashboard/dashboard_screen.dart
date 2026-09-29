import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../features/auth/auth_provider.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';
import '../appointments/appointment_detail_screen.dart';
import '../doctors/doctor_profile_screen.dart';
import '../ai/symptom_ai_screen.dart';
import '../orders/orders_screen.dart';
import '../notifications/notifications_screen.dart';
import '../main_shell.dart';

/// Patient Dashboard — Premium Medical Theme
/// Features:
///  - Warm gradient header with avatar, greeting & real date
///  - Real-time "Now Consulting" live SignalR card (mirroring website)
///  - 3 animated stat metric cards (Upcoming, Prescriptions, Orders)
///  - 6 premium service tiles with gradient icons
///  - Upcoming appointment hero card
///  - Top Doctors showcase
///  - Disease Monitoring horizontal strip
///  - Active prescriptions preview
class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _selectedDayIndex = 3;
  bool _isFavorite = false;

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final apptsAsync = ref.watch(myAppointmentsProvider);
    final rxsAsync = ref.watch(myPrescriptionsProvider);
    final doctorsAsync = ref.watch(doctorsProvider);
    final ordersAsync = ref.watch(myOrdersProvider);

    final rawName = auth.user?.fullName.trim();
    final firstName =
        (rawName != null && rawName.isNotEmpty) ? rawName.split(' ').first : 'Patient';
    final formattedDate = DateFormat('EEEE, MMMM d').format(DateTime.now());

    final hour = DateTime.now().hour;
    final greeting =
        hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return Scaffold(
      backgroundColor: const Color(0xFFF0F3FA),
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          color: AppTheme.primaryBlue,
          onRefresh: () async {
            ref.invalidate(myAppointmentsProvider);
            ref.invalidate(myPrescriptionsProvider);
            ref.invalidate(doctorsProvider);
            ref.invalidate(myOrdersProvider);
          },
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              // ── Gradient Hero Header ──────────────────────────────────────
              SliverToBoxAdapter(
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF1565C0), Color(0xFF2A7DE1), Color(0xFF4FA3E0)],
                      stops: [0.0, 0.55, 1.0],
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 14, 20, 28),
                    child: Column(
                      children: [
                        // Top bar: Logo + actions
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Image.asset(
                              'assets/images/mediflow_logo_horizontal.png',
                              height: 32,
                              fit: BoxFit.contain,
                              filterQuality: FilterQuality.high,
                              color: Colors.black.withValues(alpha: 0.40),
                              colorBlendMode: BlendMode.srcATop,
                            ),
                            Row(
                              children: [
                                _HeaderIconButton(
                                  icon: Icons.search_rounded,
                                  onTap: () => ref.read(shellTabProvider.notifier).state = 1,
                                ),
                                const SizedBox(width: 10),
                                _HeaderIconButton(
                                  icon: Icons.notifications_outlined,
                                  hasBadge: true,
                                  onTap: () => Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => const NotificationsScreen(),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),

                        // User greeting row
                        Row(
                          children: [
                            // Avatar
                            Container(
                              width: 54,
                              height: 54,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withValues(alpha: 0.2),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.5),
                                  width: 2,
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  firstName.isNotEmpty ? firstName[0].toUpperCase() : 'P',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '$greeting, $firstName 👋',
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w800,
                                      color: Colors.white,
                                      letterSpacing: -0.3,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    formattedDate,
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 12.5,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.white.withValues(alpha: 0.75),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),

                        // 3 stat cards overlapping the gradient edge
                        Row(
                          children: [
                            _StatCard(
                              label: 'Upcoming',
                              icon: Icons.calendar_today_rounded,
                              color: Colors.white,
                              value: apptsAsync.when(
                                data: (list) =>
                                    '${list.where((a) => a.isUpcoming).length}',
                                loading: () => '–',
                                error: (_, __) => '0',
                              ),
                              onTap: () =>
                                  ref.read(shellTabProvider.notifier).state = 2,
                            ),
                            const SizedBox(width: 10),
                            _StatCard(
                              label: 'Active Rx',
                              icon: Icons.medication_liquid_rounded,
                              color: const Color(0xFF34D399),
                              value: rxsAsync.when(
                                data: (list) =>
                                    '${list.where((r) => r.status == 'Active').length}',
                                loading: () => '–',
                                error: (_, __) => '0',
                              ),
                              onTap: () =>
                                  ref.read(shellTabProvider.notifier).state = 3,
                            ),
                            const SizedBox(width: 10),
                            _StatCard(
                              label: 'Orders',
                              icon: Icons.local_pharmacy_rounded,
                              color: const Color(0xFFFBBF24),
                              value: ordersAsync.when(
                                data: (list) =>
                                    '${list.where((o) => o.status != 'Dispensed').length}',
                                loading: () => '–',
                                error: (_, __) => '0',
                              ),
                              onTap: () => Navigator.of(context).push(
                                MaterialPageRoute(builder: (_) => const OrdersScreen()),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // ── Dashboard Body ────────────────────────────────────────────
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 110),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    // ── 1. Live Consulting Banner ─────────────────────────
                    const NowConsultingWidget(),
                    const SizedBox(height: 24),

                    // ── 2. Patient Services ───────────────────────────────
                    Text(
                      'Patient Services',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                        letterSpacing: -0.3,
                      ),
                    ),
                    const SizedBox(height: 12),

                    GridView.count(
                      crossAxisCount: 3,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.92,
                      children: [
                        _ServiceTile(
                          icon: Icons.medical_services_rounded,
                          title: 'Find Doctor',
                          subtitle: 'Browse Specialists',
                          gradientColors: const [Color(0xFF2A7DE1), Color(0xFF1565C0)],
                          onTap: () => ref.read(shellTabProvider.notifier).state = 1,
                        ),
                        _ServiceTile(
                          icon: Icons.auto_awesome_rounded,
                          title: 'Symptom AI',
                          subtitle: 'Check Symptoms',
                          gradientColors: const [Color(0xFF7C3AED), Color(0xFF5B21B6)],
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const SymptomAiScreen()),
                          ),
                        ),
                        _ServiceTile(
                          icon: Icons.calendar_month_rounded,
                          title: 'Schedule',
                          subtitle: 'My Visits',
                          gradientColors: const [Color(0xFF0EA5E9), Color(0xFF0284C7)],
                          onTap: () => ref.read(shellTabProvider.notifier).state = 2,
                        ),
                        _ServiceTile(
                          icon: Icons.receipt_long_rounded,
                          title: 'Prescriptions',
                          subtitle: 'E-Prescriptions',
                          gradientColors: const [Color(0xFF10B981), Color(0xFF059669)],
                          onTap: () => ref.read(shellTabProvider.notifier).state = 3,
                        ),
                        _ServiceTile(
                          icon: Icons.local_shipping_rounded,
                          title: 'Orders',
                          subtitle: 'Track Dispense',
                          gradientColors: const [Color(0xFFF59E0B), Color(0xFFD97706)],
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const OrdersScreen()),
                          ),
                        ),
                        _ServiceTile(
                          icon: Icons.account_circle_rounded,
                          title: 'My Profile',
                          subtitle: 'Health Records',
                          gradientColors: const [Color(0xFF6366F1), Color(0xFF4F46E5)],
                          onTap: () => ref.read(shellTabProvider.notifier).state = 4,
                        ),
                      ],
                    ),
                    const SizedBox(height: 28),

                    // ── 3. Upcoming Appointment ───────────────────────────
                    apptsAsync.when(
                      loading: () => const ShimmerCard(height: 150),
                      error: (_, __) => const SizedBox(),
                      data: (appts) {
                        final upcoming =
                            appts.where((a) => a.isUpcoming).toList();
                        if (upcoming.isEmpty) return const SizedBox();
                        final next = upcoming.first;
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _SectionRow(
                              title: 'Next Appointment',
                              actionLabel: 'View all (${upcoming.length})',
                              onAction: () =>
                                  ref.read(shellTabProvider.notifier).state = 2,
                            ),
                            const SizedBox(height: 12),
                            _UpcomingAppointmentCard(
                              appointment: next,
                              onCancel: () => _handleCancelAppointment(next.id),
                            ),
                            const SizedBox(height: 28),
                          ],
                        );
                      },
                    ),

                    // ── 4. Top Doctors ────────────────────────────────────
                    _SectionRow(
                      title: 'Top Doctors',
                      actionLabel: 'See all',
                      onAction: () => ref.read(shellTabProvider.notifier).state = 1,
                    ),
                    const SizedBox(height: 12),
                    doctorsAsync.when(
                      loading: () => const ShimmerCard(height: 220),
                      error: (_, __) => _buildFeaturedDoctor(null),
                      data: (doctors) => _buildFeaturedDoctor(
                          doctors.isNotEmpty ? doctors.first : null),
                    ),
                    const SizedBox(height: 28),

                    // ── 5. Disease Monitoring ─────────────────────────────
                    _SectionRow(
                      title: 'Disease Monitoring',
                      actionLabel: '',
                      onAction: null,
                      trailing: Row(
                        children: [
                          _MiniIconButton(
                            icon: Icons.tune_rounded,
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(
                                  builder: (_) => const SymptomAiScreen()),
                            ),
                          ),
                          const SizedBox(width: 8),
                          _MiniIconButton(
                            icon: Icons.more_horiz_rounded,
                            onTap: () =>
                                ref.read(shellTabProvider.notifier).state = 1,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 140,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        clipBehavior: Clip.none,
                        children: [
                          _DiseaseCard(
                            title: "Spine\nDisorder",
                            icon: Icons.accessibility_new_rounded,
                            gradient: const [Color(0xFFE11D48), Color(0xFFFB7185)],
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(
                                  builder: (_) => const SymptomAiScreen()),
                            ),
                          ),
                          const SizedBox(width: 14),
                          _DiseaseCard(
                            title: "Migraine\nCare",
                            icon: Icons.psychology_rounded,
                            gradient: const [Color(0xFF7C3AED), Color(0xFFA855F7)],
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(
                                  builder: (_) => const SymptomAiScreen()),
                            ),
                          ),
                          const SizedBox(width: 14),
                          _DiseaseCard(
                            title: "Cardio\nRhythm",
                            icon: Icons.favorite_rounded,
                            gradient: const [Color(0xFF059669), Color(0xFF34D399)],
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(
                                  builder: (_) => const SymptomAiScreen()),
                            ),
                          ),
                          const SizedBox(width: 14),
                          _DiseaseCard(
                            title: "Diabetes\nMonitor",
                            icon: Icons.bloodtype_rounded,
                            gradient: const [Color(0xFF0EA5E9), Color(0xFF38BDF8)],
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(
                                  builder: (_) => const SymptomAiScreen()),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),

                    // ── 6. Recent Prescriptions ───────────────────────────
                    _SectionRow(
                      title: 'Recent Prescriptions',
                      actionLabel: 'View all',
                      onAction: () => ref.read(shellTabProvider.notifier).state = 3,
                    ),
                    const SizedBox(height: 12),
                    rxsAsync.when(
                      loading: () => const ShimmerCard(height: 80),
                      error: (_, __) => const SizedBox(),
                      data: (rxs) {
                        if (rxs.isEmpty) {
                          return Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppTheme.cardBorder),
                            ),
                            child: Center(
                              child: Text(
                                'No prescriptions issued yet',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 13,
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                            ),
                          );
                        }
                        return Column(
                          children: rxs
                              .take(2)
                              .map((rx) => _PrescriptionTile(rx: rx))
                              .toList(),
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

  Future<void> _handleCancelAppointment(int id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          'Cancel Appointment?',
          style: GoogleFonts.plusJakartaSans(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        content: Text(
          'Are you sure you want to cancel this scheduled consultation? This slot will be released.',
          style: GoogleFonts.plusJakartaSans(
              fontSize: 13.5, color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text('Keep',
                style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              elevation: 0,
              shape:
                  RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('Cancel Visit',
                style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await ApiClient.instance.delete('/appointments/$id');
        ref.invalidate(myAppointmentsProvider);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Appointment cancelled successfully',
                  style: GoogleFonts.plusJakartaSans()),
              backgroundColor: const Color(0xFF1E293B),
            ),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error: ${e.toString()}',
                  style: GoogleFonts.plusJakartaSans()),
              backgroundColor: const Color(0xFFDC2626),
            ),
          );
        }
      }
    }
  }

  Widget _buildFeaturedDoctor(DoctorModel? doctor) {
    final doctorName = doctor?.fullName ?? 'Dr. Saif Ababon';
    final specialty = doctor?.primarySpecialty ?? 'Cardiologist';
    final rating = doctor?.averageRating ?? 4.8;
    final doctorId = doctor?.id ?? 1;

    const days = [
      {'day': 'Mon', 'num': '12'},
      {'day': 'Tue', 'num': '13'},
      {'day': 'Wed', 'num': '14'},
      {'day': 'Thu', 'num': '15'},
      {'day': 'Fri', 'num': '16'},
      {'day': 'Sat', 'num': '17'},
      {'day': 'Sun', 'num': '18'},
    ];

    return GestureDetector(
      onTap: () => Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => DoctorProfileScreen(id: doctorId)),
      ),
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1565C0), Color(0xFF2A7DE1), Color(0xFF4FA3E0)],
            stops: [0.0, 0.55, 1.0],
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: AppTheme.primaryBlue.withValues(alpha: 0.4),
              blurRadius: 24,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.star_rounded,
                          size: 14, color: Color(0xFFF59E0B)),
                      const SizedBox(width: 4),
                      Text(
                        rating.toStringAsFixed(1),
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                GestureDetector(
                  onTap: () => setState(() => _isFavorite = !_isFavorite),
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
            const SizedBox(height: 10),
            Center(
              child: Container(
                width: 82,
                height: 82,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.2),
                  border: Border.all(
                      color: Colors.white.withValues(alpha: 0.6), width: 2.5),
                ),
                child: ClipOval(
                  child: doctor?.profilePhoto != null &&
                          doctor!.profilePhoto!.isNotEmpty
                      ? Image.network(
                          doctor.profilePhoto!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const Icon(
                              Icons.person_rounded,
                              size: 48,
                              color: Colors.white),
                        )
                      : const Icon(Icons.person_rounded,
                          size: 48, color: Colors.white),
                ),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              specialty,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.white.withValues(alpha: 0.8),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              doctorName,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Colors.white,
                letterSpacing: -0.2,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(days.length, (idx) {
                final d = days[idx];
                final isSel = idx == _selectedDayIndex;
                return GestureDetector(
                  onTap: () => setState(() => _selectedDayIndex = idx),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 38,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: isSel
                          ? Colors.white
                          : Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          d['day']!,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: isSel
                                ? AppTheme.primaryBlue
                                : Colors.white.withValues(alpha: 0.7),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          d['num']!,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color:
                                isSel ? AppTheme.primaryBlue : Colors.white,
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
    );
  }
}

// ── Supporting Widgets ────────────────────────────────────────────────────────

class _HeaderIconButton extends StatelessWidget {
  const _HeaderIconButton({required this.icon, required this.onTap, this.hasBadge = false});
  final IconData icon;
  final VoidCallback onTap;
  final bool hasBadge;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.18),
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Icon(icon, size: 20, color: Colors.white),
            if (hasBadge)
              Positioned(
                top: 9,
                right: 9,
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

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.label,
    required this.icon,
    required this.color,
    required this.value,
    required this.onTap,
  });
  final String label;
  final IconData icon;
  final Color color;
  final String value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, size: 18, color: color),
              const SizedBox(height: 8),
              Text(
                value,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
              Text(
                label,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w500,
                  color: Colors.white.withValues(alpha: 0.75),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionRow extends StatelessWidget {
  const _SectionRow({
    required this.title,
    required this.actionLabel,
    this.onAction,
    this.trailing,
  });
  final String title;
  final String actionLabel;
  final VoidCallback? onAction;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: AppTheme.textPrimary,
            letterSpacing: -0.2,
          ),
        ),
        trailing ??
            (onAction != null && actionLabel.isNotEmpty
                ? GestureDetector(
                    onTap: onAction,
                    child: Text(
                      actionLabel,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.primaryBlue,
                      ),
                    ),
                  )
                : const SizedBox()),
      ],
    );
  }
}

class _ServiceTile extends StatelessWidget {
  const _ServiceTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.gradientColors,
    required this.onTap,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  final List<Color> gradientColors;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(13),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppTheme.cardBorder),
          boxShadow: AppTheme.macOSShadow,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: gradientColors,
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: gradientColors.first.withValues(alpha: 0.35),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Icon(icon, size: 20, color: Colors.white),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10,
                    color: AppTheme.textSecondary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _UpcomingAppointmentCard extends StatelessWidget {
  const _UpcomingAppointmentCard({
    required this.appointment,
    required this.onCancel,
  });
  final AppointmentModel appointment;
  final VoidCallback onCancel;

  @override
  Widget build(BuildContext context) {
    final dt = appointment.appointmentDateTime;
    final dateStr = DateFormat('EEE, MMM d • hh:mm a').format(dt);

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
            color: AppTheme.primaryBlue.withValues(alpha: 0.25), width: 1.5),
        boxShadow: AppTheme.macOSShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              DoctorAvatar(
                photoUrl: appointment.doctorProfilePhoto,
                name: appointment.doctorName,
                radius: 26,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Dr. ${appointment.doctorName}',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Text(
                      appointment.specialtyName,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  appointment.status,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.primaryBlue,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
            decoration: BoxDecoration(
              color: AppTheme.surface2,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.access_time_rounded,
                    size: 15, color: AppTheme.primaryBlue),
                const SizedBox(width: 8),
                Text(
                  dateStr,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _PremiumButton(
                  label: 'View Details',
                  outlined: true,
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) =>
                          AppointmentDetailScreen(id: appointment.id),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _PremiumButton(
                  label: 'Cancel Visit',
                  danger: true,
                  onTap: onCancel,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PremiumButton extends StatelessWidget {
  const _PremiumButton({
    required this.label,
    required this.onTap,
    this.outlined = false,
    this.danger = false,
  });
  final String label;
  final VoidCallback onTap;
  final bool outlined;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    if (danger) {
      return GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 11),
          decoration: BoxDecoration(
            color: const Color(0xFFFEF2F2),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFFCA5A5)),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
              color: const Color(0xFFDC2626),
            ),
          ),
        ),
      );
    }

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 11),
        decoration: BoxDecoration(
          gradient: outlined
              ? null
              : const LinearGradient(
                  colors: [Color(0xFF2A7DE1), Color(0xFF1565C0)],
                ),
          color: outlined ? Colors.white : null,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.cardBorder),
          boxShadow: outlined
              ? null
              : [
                  BoxShadow(
                    color: AppTheme.primaryBlue.withValues(alpha: 0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
            color: outlined ? AppTheme.primaryBlue : Colors.white,
          ),
        ),
      ),
    );
  }
}

class _DiseaseCard extends StatelessWidget {
  const _DiseaseCard({
    required this.title,
    required this.icon,
    required this.gradient,
    required this.onTap,
  });
  final String title;
  final IconData icon;
  final List<Color> gradient;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 130,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: gradient,
          ),
          borderRadius: BorderRadius.circular(22),
          boxShadow: [
            BoxShadow(
              color: gradient.first.withValues(alpha: 0.35),
              blurRadius: 16,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 18, color: Colors.white),
                ),
                Container(
                  width: 26,
                  height: 26,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.arrow_outward_rounded,
                      size: 13, color: Colors.white),
                ),
              ],
            ),
            Text(
              title,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 13.5,
                fontWeight: FontWeight.w800,
                color: Colors.white,
                height: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PrescriptionTile extends StatelessWidget {
  const _PrescriptionTile({required this.rx});
  final PrescriptionModel rx;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.cardBorder),
        boxShadow: AppTheme.macOSShadow,
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF10B981), Color(0xFF059669)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.receipt_rounded, size: 18, color: Colors.white),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  rx.diagnosis != null && rx.diagnosis!.isNotEmpty
                      ? rx.diagnosis!
                      : 'Prescription #${rx.id}',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  'Dr. ${rx.doctorName} • ${rx.items.length} meds',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11.5,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const OrdersScreen()),
            ),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.primaryBlue50,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Track',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.primaryBlue,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MiniIconButton extends StatelessWidget {
  const _MiniIconButton({required this.icon, required this.onTap});
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: AppTheme.cardBorder),
        ),
        child: Icon(icon, size: 16, color: AppTheme.textSecondary),
      ),
    );
  }
}
