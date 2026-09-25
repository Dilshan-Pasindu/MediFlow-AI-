import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/auth/auth_provider.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/widgets/widgets.dart';
import '../appointments/appointment_detail_screen.dart';
import '../ai/symptom_ai_screen.dart';
import '../notifications/notifications_screen.dart';
import '../main_shell.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final apptsAsync = ref.watch(myAppointmentsProvider);
    final rxsAsync  = ref.watch(myPrescriptionsProvider);

    final firstName = auth.user?.fullName.split(' ').first ?? 'Patient';
    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return Scaffold(
      backgroundColor: AppTheme.surfaceDim,
      body: RefreshIndicator(
        color: AppTheme.primaryDeep,
        onRefresh: () async {
          ref.invalidate(myAppointmentsProvider);
          ref.invalidate(myPrescriptionsProvider);
        },
        child: CustomScrollView(
          slivers: [
            // ── Gradient Header ──────────────────────────────────────────
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
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('$greeting 👋',
                                    style: GoogleFonts.outfit(fontSize: 13, color: Colors.white70)),
                                  const SizedBox(height: 2),
                                  Text(firstName,
                                    style: GoogleFonts.outfit(
                                      fontSize: 26, fontWeight: FontWeight.w800, color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Notification bell
                            GestureDetector(
                              onTap: () => Navigator.of(context).push(
                                MaterialPageRoute(
                                    builder: (_) => const NotificationsScreen())),
                              child: Container(
                                width: 44, height: 44,
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(Icons.notifications_outlined, color: Colors.white, size: 22),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // AI Symptom Chip CTA
                        GestureDetector(
                          onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SymptomAiScreen())),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                              border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: AppTheme.accentGreen,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Icon(Icons.psychology_rounded, color: AppTheme.textPrimary, size: 16),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text('AI Symptom Check — Describe your symptoms',
                                    style: GoogleFonts.outfit(fontSize: 13, color: Colors.white, fontWeight: FontWeight.w500),
                                  ),
                                ),
                                const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white60, size: 14),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 100),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // ── Stats Row ────────────────────────────────────────
                  apptsAsync.when(
                    loading: () => const Row(children: [
                      Expanded(child: ShimmerCard(height: 90, margin: EdgeInsets.only(right: 6))),
                      Expanded(child: ShimmerCard(height: 90, margin: EdgeInsets.symmetric(horizontal: 6))),
                      Expanded(child: ShimmerCard(height: 90, margin: EdgeInsets.only(left: 6))),
                    ]),
                    error: (_, __) => const SizedBox(),
                    data: (appts) {
                      final upcoming = appts.where((a) => a.isUpcoming).length;
                      final completed = appts.where((a) => a.isCompleted).length;
                      final rxCount = rxsAsync.valueOrNull?.length ?? 0;
                      return Row(
                        children: [
                          Expanded(child: StatTile(
                            icon: Icons.calendar_today_rounded, value: '$upcoming',
                            label: 'Upcoming', color: AppTheme.primaryDeep,
                            bgColor: AppTheme.primaryDeep.withValues(alpha: 0.07),
                            onTap: () {
                              ref.read(shellTabProvider.notifier).state = 1;
                            },
                          )),
                          const SizedBox(width: 10),
                          Expanded(child: StatTile(
                            icon: Icons.check_circle_outline_rounded, value: '$completed',
                            label: 'Completed', color: AppTheme.statusConfirmed,
                            bgColor: AppTheme.statusConfirmed.withValues(alpha: 0.08),
                          )),
                          const SizedBox(width: 10),
                          Expanded(child: StatTile(
                            icon: Icons.medication_outlined, value: '$rxCount',
                            label: 'Prescriptions', color: const Color(0xFF0D9488),
                            bgColor: const Color(0xFF0D9488).withValues(alpha: 0.08),
                            onTap: () {
                              ref.read(shellTabProvider.notifier).state = 3;
                            },
                          )),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 24),

                  // ── Quick Actions ────────────────────────────────────
                  const SectionHeader(title: 'Quick Actions'),
                  const SizedBox(height: 12),
                  _QuickActionsGrid(context: context, ref: ref),
                  const SizedBox(height: 24),

                  // ── Upcoming Appointments ────────────────────────────
                  SectionHeader(
                    title: 'Upcoming Appointments',
                    subtitle: 'Your scheduled visits',
                    onSeeAll: () => ref.read(shellTabProvider.notifier).state = 1,
                  ),
                  const SizedBox(height: 12),
                  apptsAsync.when(
                    loading: () => Column(children: List.generate(2, (_) => const ShimmerCard(height: 80))),
                    error: (e, _) => ErrorState(message: e.toString(), onRetry: () => ref.invalidate(myAppointmentsProvider)),
                    data: (appts) {
                      final upcoming = appts.where((a) => a.isUpcoming).take(3).toList();
                      if (upcoming.isEmpty) {
                        return EmptyState(
                          icon: Icons.calendar_month_outlined,
                          title: 'No upcoming appointments',
                          subtitle: 'Book a consultation with a specialist today',
                          actionLabel: 'Find Doctor',
                          action: () => ref.read(shellTabProvider.notifier).state = 2,
                        );
                      }
                      return Column(
                        children: upcoming.map((a) => _AppointmentCard(appt: a, onTap: () {
                          Navigator.of(context).push(MaterialPageRoute(
                              builder: (_) => AppointmentDetailScreen(id: a.id)));
                        })).toList(),
                      );
                    },
                  ),
                  const SizedBox(height: 24),

                  // ── Recent Prescriptions ─────────────────────────────
                  rxsAsync.when(
                    loading: () => const SizedBox(),
                    error: (_, __) => const SizedBox(),
                    data: (rxs) {
                      if (rxs.isEmpty) return const SizedBox();
                      return Column(
                        children: [
                          SectionHeader(
                            title: 'Recent Prescriptions',
                            onSeeAll: () => ref.read(shellTabProvider.notifier).state = 3,
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
    );
  }
}



// ── Quick Actions Grid ────────────────────────────────────────────────────────

class _QuickActionsGrid extends StatelessWidget {
  const _QuickActionsGrid({required this.context, required this.ref});
  final BuildContext context;
  final WidgetRef ref;

  @override
  Widget build(BuildContext ctx) {
    final actions = [
      _QuickAction(
        emoji: '🩺', label: 'Find Doctor', color: const Color(0xFFEFF6FF),
        border: const Color(0xFFBFDBFE),
        onTap: () => ref.read(shellTabProvider.notifier).state = 2,
      ),
      _QuickAction(
        emoji: '🤖', label: 'AI Symptom Check', color: const Color(0xFFF5F3FF),
        border: const Color(0xFFDDD6FE),
        onTap: () => Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const SymptomAiScreen())),
      ),
      _QuickAction(
        emoji: '📋', label: 'Appointments', color: const Color(0xFFECFDF5),
        border: const Color(0xFFA7F3D0),
        onTap: () => ref.read(shellTabProvider.notifier).state = 1,
      ),
      _QuickAction(
        emoji: '💊', label: 'Prescriptions', color: const Color(0xFFFFF7ED),
        border: const Color(0xFFFED7AA),
        onTap: () => ref.read(shellTabProvider.notifier).state = 3,
      ),
    ];

    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.6,
      children: actions.map((a) => _QuickActionTile(action: a)).toList(),
    );
  }
}

class _QuickAction {
  final String emoji, label;
  final Color color, border;
  final VoidCallback onTap;
  const _QuickAction({required this.emoji, required this.label, required this.color, required this.border, required this.onTap});
}

class _QuickActionTile extends StatelessWidget {
  const _QuickActionTile({required this.action});
  final _QuickAction action;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: action.onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: action.color,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          border: Border.all(color: action.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(action.emoji, style: const TextStyle(fontSize: 26)),
            const SizedBox(height: 6),
            Text(action.label,
              style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Appointment Card ──────────────────────────────────────────────────────────

class _AppointmentCard extends StatelessWidget {
  const _AppointmentCard({required this.appt, required this.onTap});
  final dynamic appt;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final st = AppTheme.appointmentStatus(appt.status);
    final date = appt.appointmentDateTime as DateTime;

    return MedCard(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      onTap: onTap,
      child: Row(
        children: [
          // Date block
          Container(
            width: 48, height: 52,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft, end: Alignment.bottomRight,
                colors: [Color(0xFF2D2BE8), Color(0xFF6C3AE0)],
              ),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('${date.day}',
                    style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
                Text(DateFormat('MMM').format(date),
                    style: GoogleFonts.outfit(fontSize: 10, color: Colors.white70)),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(appt.doctorName,
                    style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
                Text(appt.specialtyName,
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.primaryDeep, fontWeight: FontWeight.w500)),
                const SizedBox(height: 2),
                Row(children: [
                  const Icon(Icons.access_time_rounded, size: 11, color: AppTheme.textMuted),
                  const SizedBox(width: 3),
                  Text(DateFormat('h:mm a').format(date),
                      style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
                ]),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              StatusBadge(label: st.label, bg: st.bg, color: st.text, small: true),
              if (appt.fee != null) ...[
                const SizedBox(height: 4),
                Text('Rs. ${appt.fee!.toStringAsFixed(0)}',
                    style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

// ── Prescription Card ─────────────────────────────────────────────────────────

class _PrescriptionCard extends StatelessWidget {
  const _PrescriptionCard({required this.rx});
  final dynamic rx;

  @override
  Widget build(BuildContext context) {
    final st = AppTheme.prescriptionStatus(rx.status);
    return MedCard(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              color: AppTheme.primaryDeep.withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.description_outlined, color: AppTheme.primaryDeep, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Rx #${rx.id}',
                    style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                Text('Dr. ${rx.doctorName}',
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary)),
                Text('${rx.itemCount} medicine${rx.itemCount != 1 ? 's' : ''}',
                    style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
              ],
            ),
          ),
          StatusBadge(label: rx.status, bg: st.bg, color: st.text, small: true),
        ],
      ),
    );
  }
}
