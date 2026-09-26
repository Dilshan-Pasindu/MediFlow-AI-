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

/// Patient Dashboard (macOS-Inspired Medical Design System)
/// Implements all website functions:
///  - macOS Top Bar with Traffic Light Window Controls & Date Badge
///  - Real-time "Now Consulting" Clinic Activity Banner
///  - 3 Stat Metrics Cards (Upcoming Visits, Active Rx, Medicine Orders)
///  - 6 macOS Application Quick Action Tiles
///  - Upcoming Appointment Hero Card with live status & instant cancel
///  - Top Doctors showcase strip with availability selector
///  - Active Prescriptions with direct "Track Dispense" order links
class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _selectedDayIndex = 3; // Thu 15 in reference design
  bool _isFavorite = false;

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final apptsAsync = ref.watch(myAppointmentsProvider);
    final rxsAsync = ref.watch(myPrescriptionsProvider);
    final doctorsAsync = ref.watch(doctorsProvider);
    final ordersAsync = ref.watch(myOrdersProvider);

    final rawName = auth.user?.fullName.trim();
    final firstName = (rawName != null && rawName.isNotEmpty) ? rawName.split(' ').first : 'Patient';
    final formattedDate = DateFormat('EEEE, MMMM d, yyyy').format(DateTime.now());

    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
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
              // ── Top Header with macOS Window Controls ─────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 14, 20, 10),
                  child: Column(
                    children: [
                      // macOS Traffic Lights & Clinic network branding
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              AppTheme.macOSWindowDots(size: 10, spacing: 5),
                              const SizedBox(width: 10),
                              Text(
                                'MediFlow AI Portal',
                                style: GoogleFonts.outfit(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: AppTheme.textSecondary,
                                  letterSpacing: 0.3,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFFECFDF5),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF059669),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 5),
                                Text(
                                  'System Online',
                                  style: GoogleFonts.outfit(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w700,
                                    color: const Color(0xFF059669),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // User Row: Avatar, Greeting, Search & Notification Buttons
                      Row(
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
                                color: AppTheme.primaryBlue.withValues(alpha: 0.12),
                                child: Center(
                                  child: Text(
                                    firstName.isNotEmpty ? firstName[0].toUpperCase() : 'P',
                                    style: GoogleFonts.outfit(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w800,
                                      color: AppTheme.primaryBlue,
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
                                  '$greeting, $firstName 👋',
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
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w500,
                                    color: AppTheme.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Circular Search Button (opens Find Doctor tab)
                          _CircularActionButton(
                            icon: Icons.search_rounded,
                            onTap: () => ref.read(shellTabProvider.notifier).state = 1,
                          ),
                          const SizedBox(width: 10),

                          // Circular Notification Button
                          _CircularActionButton(
                            icon: Icons.notifications_outlined,
                            hasBadge: true,
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // ── Main Dashboard Body ─────────────────────────────────────
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 6, 20, 110),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    // ── 1. Real-Time Now Consulting Banner ────────────────
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFFECACA).withValues(alpha: 0.7)),
                        boxShadow: AppTheme.macOSShadow,
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 10,
                            height: 10,
                            decoration: const BoxDecoration(
                              color: Color(0xFFEF4444),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'NOW CONSULTING ACTIVE',
                                  style: GoogleFonts.outfit(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w800,
                                    color: const Color(0xFFDC2626),
                                    letterSpacing: 0.4,
                                  ),
                                ),
                                Text(
                                  'Live queue sessions running with OPD doctors in clinic.',
                                  style: GoogleFonts.outfit(
                                    fontSize: 12,
                                    color: AppTheme.textSecondary,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          TextButton(
                            onPressed: () => ref.read(shellTabProvider.notifier).state = 2,
                            child: Text(
                              'View Queue',
                              style: GoogleFonts.outfit(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.primaryBlue,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // ── 2. Stat Metrics Grid (3 Cards mirroring Website) ──
                    Row(
                      children: [
                        // Upcoming Visits
                        _DashboardStatCard(
                          title: 'Upcoming',
                          icon: Icons.calendar_today_rounded,
                          color: AppTheme.primaryBlue,
                          bg: AppTheme.primaryBlue50,
                          asyncVal: apptsAsync.when(
                            data: (list) => '${list.where((a) => a.isUpcoming).length}',
                            loading: () => '...',
                            error: (_, __) => '0',
                          ),
                          subtitle: 'Visits',
                          onTap: () => ref.read(shellTabProvider.notifier).state = 2,
                        ),
                        const SizedBox(width: 10),

                        // Active Prescriptions
                        _DashboardStatCard(
                          title: 'Active Rx',
                          icon: Icons.medication_rounded,
                          color: const Color(0xFF059669),
                          bg: const Color(0xFFECFDF5),
                          asyncVal: rxsAsync.when(
                            data: (list) => '${list.where((r) => r.status == 'Active').length}',
                            loading: () => '...',
                            error: (_, __) => '0',
                          ),
                          subtitle: 'Meds',
                          onTap: () => ref.read(shellTabProvider.notifier).state = 3,
                        ),
                        const SizedBox(width: 10),

                        // Medicine Orders
                        _DashboardStatCard(
                          title: 'Dispensing',
                          icon: Icons.local_shipping_outlined,
                          color: const Color(0xFFD97706),
                          bg: const Color(0xFFFFFBEB),
                          asyncVal: ordersAsync.when(
                            data: (list) => '${list.where((o) => o.status != 'Dispensed').length}',
                            loading: () => '...',
                            error: (_, __) => '0',
                          ),
                          subtitle: 'In Queue',
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const OrdersScreen()),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // ── 3. Quick Action Grid (6 macOS Style Tiles) ─────────
                    Text(
                      'Patient Services',
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                        letterSpacing: -0.2,
                      ),
                    ),
                    const SizedBox(height: 12),

                    GridView.count(
                      crossAxisCount: 3,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      childAspectRatio: 0.95,
                      children: [
                        _QuickActionTile(
                          icon: Icons.medical_services_rounded,
                          title: 'Find Doctor',
                          subtitle: 'Specialists',
                          iconColor: AppTheme.primaryBlue,
                          iconBg: AppTheme.primaryBlue50,
                          onTap: () => ref.read(shellTabProvider.notifier).state = 1,
                        ),
                        _QuickActionTile(
                          icon: Icons.auto_awesome_rounded,
                          title: 'Symptom AI',
                          subtitle: 'Check Symptoms',
                          iconColor: const Color(0xFF7C3AED),
                          iconBg: const Color(0xFFEDE9FE),
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const SymptomAiScreen()),
                          ),
                        ),
                        _QuickActionTile(
                          icon: Icons.calendar_month_rounded,
                          title: 'Schedule',
                          subtitle: 'My Visits',
                          iconColor: const Color(0xFF0284C7),
                          iconBg: const Color(0xFFE0F2FE),
                          onTap: () => ref.read(shellTabProvider.notifier).state = 2,
                        ),
                        _QuickActionTile(
                          icon: Icons.receipt_long_rounded,
                          title: 'Prescriptions',
                          subtitle: 'E-Prescriptions',
                          iconColor: const Color(0xFF059669),
                          iconBg: const Color(0xFFECFDF5),
                          onTap: () => ref.read(shellTabProvider.notifier).state = 3,
                        ),
                        _QuickActionTile(
                          icon: Icons.local_pharmacy_rounded,
                          title: 'Orders',
                          subtitle: 'Track Dispense',
                          iconColor: const Color(0xFFD97706),
                          iconBg: const Color(0xFFFEF3C7),
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const OrdersScreen()),
                          ),
                        ),
                        _QuickActionTile(
                          icon: Icons.account_circle_rounded,
                          title: 'My Profile',
                          subtitle: 'Vitals & History',
                          iconColor: const Color(0xFF475569),
                          iconBg: const Color(0xFFF1F5F9),
                          onTap: () => ref.read(shellTabProvider.notifier).state = 4,
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // ── 4. Upcoming Appointment Hero Card ──────────────────
                    apptsAsync.when(
                      loading: () => const ShimmerCard(height: 140),
                      error: (_, __) => const SizedBox(),
                      data: (appts) {
                        final upcoming = appts.where((a) => a.isUpcoming).toList();
                        if (upcoming.isEmpty) return const SizedBox();
                        final nextAppt = upcoming.first;
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Next Appointment',
                                  style: GoogleFonts.outfit(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                    color: AppTheme.textPrimary,
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () => ref.read(shellTabProvider.notifier).state = 2,
                                  child: Text(
                                    'View all (${upcoming.length})',
                                    style: GoogleFonts.outfit(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.primaryBlue,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            _UpcomingAppointmentHero(
                              appointment: nextAppt,
                              onCancel: () => _handleCancelAppointment(nextAppt.id),
                            ),
                            const SizedBox(height: 24),
                          ],
                        );
                      },
                    ),

                    // ── 5. "Top Doctors" Section ───────────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Top Doctors',
                          style: GoogleFonts.outfit(
                            fontSize: 17,
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
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primaryBlue,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    doctorsAsync.when(
                      loading: () => const ShimmerCard(height: 240),
                      error: (_, __) => _buildFeaturedDoctorCard(null),
                      data: (doctors) => _buildFeaturedDoctorCard(
                        doctors.isNotEmpty ? doctors.first : null,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // ── 6. Disease Monitoring Section ──────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Disease Monitoring & Care',
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
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
                    const SizedBox(height: 12),

                    SizedBox(
                      height: 140,
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
                            title: "Cardio\nrhythm",
                            icon: Icons.favorite_rounded,
                            iconColor: const Color(0xFF059669),
                            iconBg: const Color(0xFFCCFBF1),
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SymptomAiScreen()),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // ── 7. Active Prescriptions Preview ────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Recent Prescriptions',
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        GestureDetector(
                          onTap: () => ref.read(shellTabProvider.notifier).state = 3,
                          child: Text(
                            'View all',
                            style: GoogleFonts.outfit(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primaryBlue,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    rxsAsync.when(
                      loading: () => const ShimmerCard(height: 80),
                      error: (_, __) => const SizedBox(),
                      data: (rxs) {
                        if (rxs.isEmpty) {
                          return Container(
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppTheme.cardBorder),
                            ),
                            child: Center(
                              child: Text(
                                'No prescriptions issued yet',
                                style: GoogleFonts.outfit(
                                  fontSize: 13,
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                            ),
                          );
                        }
                        return Column(
                          children: rxs.take(2).map((rx) => _MiniPrescriptionTile(rx: rx)).toList(),
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
          style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        content: Text(
          'Are you sure you want to cancel this scheduled consultation? This slot will be released.',
          style: GoogleFonts.outfit(fontSize: 13.5, color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text('Keep', style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('Cancel Visit', style: GoogleFonts.outfit(fontWeight: FontWeight.w700)),
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
              content: Text('Appointment cancelled successfully', style: GoogleFonts.outfit()),
              backgroundColor: const Color(0xFF1E293B),
            ),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error: ${e.toString()}', style: GoogleFonts.outfit()),
              backgroundColor: const Color(0xFFDC2626),
            ),
          );
        }
      }
    }
  }

  Widget _buildFeaturedDoctorCard(DoctorModel? doctor) {
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
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => DoctorProfileScreen(id: doctorId),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          gradient: AppTheme.primaryGradient,
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: AppTheme.primaryBlue.withValues(alpha: 0.35),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Star Rating pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.star_rounded, size: 14, color: Color(0xFFF59E0B)),
                      const SizedBox(width: 4),
                      Text(
                        rating.toStringAsFixed(1),
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                // Heart Favorite
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

            const SizedBox(height: 8),

            // Doctor Portrait
            Center(
              child: Container(
                width: 78,
                height: 78,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.2),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.6), width: 2),
                ),
                child: ClipOval(
                  child: doctor?.profilePhoto != null && doctor!.profilePhoto!.isNotEmpty
                      ? Image.network(
                          doctor.profilePhoto!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const Icon(Icons.person_rounded, size: 48, color: Colors.white),
                        )
                      : const Icon(Icons.person_rounded, size: 48, color: Colors.white),
                ),
              ),
            ),

            const SizedBox(height: 10),

            Text(
              specialty,
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.white.withValues(alpha: 0.8),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              doctorName,
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Colors.white,
                letterSpacing: -0.2,
              ),
            ),

            const SizedBox(height: 16),

            // 7-day horizontal selector strip
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(days.length, (idx) {
                final d = days[idx];
                final isSelected = idx == _selectedDayIndex;

                return GestureDetector(
                  onTap: () => setState(() => _selectedDayIndex = idx),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 38,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? Colors.white : Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          d['day']!,
                          style: GoogleFonts.outfit(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: isSelected ? AppTheme.primaryBlue : Colors.white.withValues(alpha: 0.7),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          d['num']!,
                          style: GoogleFonts.outfit(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: isSelected ? AppTheme.primaryBlue : Colors.white,
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

// ── Supporting Dashboard Widgets ─────────────────────────────────────────────

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
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Icon(icon, size: 20, color: AppTheme.textPrimary),
            if (hasBadge)
              Positioned(
                top: 10,
                right: 11,
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
      ),
    );
  }
}

class _SmallToolButton extends StatelessWidget {
  const _SmallToolButton({required this.icon, required this.onTap});
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

class _DashboardStatCard extends StatelessWidget {
  const _DashboardStatCard({
    required this.title,
    required this.icon,
    required this.color,
    required this.bg,
    required this.asyncVal,
    required this.subtitle,
    required this.onTap,
  });

  final String title;
  final IconData icon;
  final Color color;
  final Color bg;
  final String asyncVal;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppTheme.cardBorder),
            boxShadow: AppTheme.macOSShadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: bg,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, size: 16, color: color),
              ),
              const SizedBox(height: 10),
              Text(
                asyncVal,
                style: GoogleFonts.outfit(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.textPrimary,
                ),
              ),
              Text(
                title,
                style: GoogleFonts.outfit(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuickActionTile extends StatelessWidget {
  const _QuickActionTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.iconColor,
    required this.iconBg,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final Color iconColor;
  final Color iconBg;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
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
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, size: 20, color: iconColor),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.outfit(
                    fontSize: 10.5,
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

class _UpcomingAppointmentHero extends StatelessWidget {
  const _UpcomingAppointmentHero({
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
        border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.3), width: 1.5),
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
                radius: 24,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Dr. ${appointment.doctorName}',
                      style: GoogleFonts.outfit(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Text(
                      appointment.specialtyName,
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  appointment.status,
                  style: GoogleFonts.outfit(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.primaryBlue,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.surface2,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.access_time_rounded, size: 16, color: AppTheme.primaryBlue),
                const SizedBox(width: 8),
                Text(
                  dateStr,
                  style: GoogleFonts.outfit(
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
                child: OutlinedButton(
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => AppointmentDetailScreen(id: appointment.id),
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.primaryBlue,
                    side: const BorderSide(color: AppTheme.cardBorder),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                  child: Text(
                    'Details',
                    style: GoogleFonts.outfit(fontSize: 12.5, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: TextButton(
                  onPressed: onCancel,
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFFDC2626),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                  child: Text(
                    'Cancel Visit',
                    style: GoogleFonts.outfit(fontSize: 12.5, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

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
        width: 140,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppTheme.cardBorder),
          boxShadow: AppTheme.macOSShadow,
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
                    color: iconBg,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 18, color: iconColor),
                ),
                Container(
                  width: 28,
                  height: 28,
                  decoration: const BoxDecoration(
                    color: AppTheme.surface2,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.arrow_outward_rounded,
                    size: 14,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ],
            ),
            Text(
              title,
              style: GoogleFonts.outfit(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
                height: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MiniPrescriptionTile extends StatelessWidget {
  const _MiniPrescriptionTile({required this.rx});
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
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppTheme.primaryBlue.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.receipt_rounded, size: 18, color: AppTheme.primaryBlue),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  rx.diagnosis != null && rx.diagnosis!.isNotEmpty ? rx.diagnosis! : 'Prescription #${rx.id}',
                  style: GoogleFonts.outfit(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  'Dr. ${rx.doctorName} • ${rx.items.length} meds',
                  style: GoogleFonts.outfit(
                    fontSize: 11.5,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const OrdersScreen()),
              );
            },
            child: Text(
              'Track',
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: AppTheme.primaryBlue,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
