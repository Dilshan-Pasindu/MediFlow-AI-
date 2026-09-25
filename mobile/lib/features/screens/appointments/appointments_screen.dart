import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';
import 'appointment_detail_screen.dart';

class AppointmentsScreen extends ConsumerStatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  ConsumerState<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends ConsumerState<AppointmentsScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabCtrl;

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final apptsAsync = ref.watch(myAppointmentsProvider);

    return Scaffold(
      backgroundColor: AppTheme.surfaceDim,
      body: NestedScrollView(
        headerSliverBuilder: (_, __) => [
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(24),
                  bottomRight: Radius.circular(24),
                ),
              ),
              child: SafeArea(
                bottom: false,
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Appointments',
                                  style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                                Text('Manage your consultations',
                                  style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    TabBar(
                      controller: _tabCtrl,
                      labelColor: Colors.white,
                      unselectedLabelColor: Colors.white60,
                      indicatorColor: AppTheme.accentGreen,
                      indicatorWeight: 3,
                      labelStyle: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700),
                      unselectedLabelStyle: GoogleFonts.outfit(fontSize: 13),
                      tabs: const [
                        Tab(text: 'Upcoming'),
                        Tab(text: 'Past'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
        body: apptsAsync.when(
          loading: () => const _LoadingList(),
          error: (e, _) => ErrorState(
            message: e.toString(),
            onRetry: () => ref.invalidate(myAppointmentsProvider),
          ),
          data: (appts) => TabBarView(
            controller: _tabCtrl,
            children: [
              _AppointmentList(
                appointments: appts.where((a) => a.isUpcoming).toList(),
                emptyTitle: 'No upcoming appointments',
                emptySubtitle: 'Book a consultation to get started',
              ),
              _AppointmentList(
                appointments: appts.where((a) => !a.isUpcoming).toList(),
                emptyTitle: 'No past appointments',
                emptySubtitle: 'Your completed consultations will appear here',
                isPast: true,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _LoadingList extends StatelessWidget {
  const _LoadingList();
  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(16),
    children: List.generate(4, (_) => const ShimmerCard(height: 90)),
  );
}

class _AppointmentList extends ConsumerWidget {
  const _AppointmentList({
    required this.appointments, required this.emptyTitle,
    required this.emptySubtitle, this.isPast = false,
  });
  final List<AppointmentModel> appointments;
  final String emptyTitle, emptySubtitle;
  final bool isPast;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (appointments.isEmpty) {
      return EmptyState(
        icon: Icons.calendar_month_outlined,
        title: emptyTitle,
        subtitle: emptySubtitle,
      );
    }
    return RefreshIndicator(
      color: AppTheme.primaryDeep,
      onRefresh: () async => ref.invalidate(myAppointmentsProvider),
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        itemCount: appointments.length,
        itemBuilder: (_, i) => _AppointmentTile(appt: appointments[i], isPast: isPast),
      ),
    );
  }
}

class _AppointmentTile extends ConsumerStatefulWidget {
  const _AppointmentTile({required this.appt, this.isPast = false});
  final AppointmentModel appt;
  final bool isPast;

  @override
  ConsumerState<_AppointmentTile> createState() => _AppointmentTileState();
}

class _AppointmentTileState extends ConsumerState<_AppointmentTile> {
  bool _cancelling = false;

  Future<void> _cancel() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusXl)),
        title: Text('Cancel Appointment', style: GoogleFonts.outfit(fontWeight: FontWeight.w700)),
        content: Text('Are you sure you want to cancel this appointment?',
            style: GoogleFonts.outfit(fontSize: 14, color: AppTheme.textSecondary)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false),
              child: Text('No', style: GoogleFonts.outfit(color: AppTheme.textMuted))),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.statusInConsult),
            child: Text('Cancel Appointment', style: GoogleFonts.outfit(color: Colors.white)),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;

    setState(() => _cancelling = true);
    try {
      await ApiClient.instance.delete('/patient/appointments/${widget.appt.id}');
      if (mounted) {
        ref.invalidate(myAppointmentsProvider);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Appointment cancelled', style: GoogleFonts.outfit()), backgroundColor: AppTheme.statusConfirmed),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to cancel: $e', style: GoogleFonts.outfit()), backgroundColor: AppTheme.statusInConsult),
        );
      }
    } finally {
      if (mounted) setState(() => _cancelling = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final a = widget.appt;
    final st = AppTheme.appointmentStatus(a.status);
    final date = a.appointmentDateTime;

    return MedCard(
      margin: const EdgeInsets.only(bottom: 12),
      onTap: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => AppointmentDetailScreen(id: a.id))),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Date block
              Container(
                width: 52, height: 60,
                decoration: BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('${date.day}',
                        style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                    Text(DateFormat('MMM').format(date),
                        style: GoogleFonts.outfit(fontSize: 10, color: Colors.white70)),
                  ],
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      Expanded(
                        child: Text(a.doctorName,
                          style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700),
                          maxLines: 1, overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      StatusBadge(label: st.label, bg: st.bg, color: st.text, small: true),
                    ]),
                    const SizedBox(height: 2),
                    Text(a.specialtyName,
                        style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.primaryDeep, fontWeight: FontWeight.w500)),
                    const SizedBox(height: 4),
                    Row(children: [
                      const Icon(Icons.access_time_rounded, size: 12, color: AppTheme.textMuted),
                      const SizedBox(width: 4),
                      Text(DateFormat('h:mm a').format(date),
                          style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted)),
                      if (a.appointmentNumber != null) ...[
                        const SizedBox(width: 12),
                        const Icon(Icons.numbers_rounded, size: 12, color: AppTheme.textMuted),
                        const SizedBox(width: 2),
                        Text(a.appointmentNumber!,
                            style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
                      ],
                    ]),
                  ],
                ),
              ),
            ],
          ),
          if (!widget.isPast && a.isCancellable) ...[
            const Divider(height: 20),
            Row(
              children: [
                if (a.fee != null)
                  Text('Rs. ${a.fee!.toStringAsFixed(0)}',
                      style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textPrimary)),
                const Spacer(),
                _cancelling
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                    : TextButton.icon(
                        onPressed: _cancel,
                        icon: const Icon(Icons.cancel_outlined, size: 16, color: AppTheme.statusInConsult),
                        label: Text('Cancel', style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.statusInConsult, fontWeight: FontWeight.w600)),
                        style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 8)),
                      ),
              ],
            ),
          ],
          // Rating prompt for completed unrated appointments
          if (a.isCompleted && !a.hasRated) ...[
            const Divider(height: 20),
            Row(children: [
              const Icon(Icons.star_outline_rounded, size: 16, color: Color(0xFFF59E0B)),
              const SizedBox(width: 6),
              Text('Rate your consultation',
                  style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary)),
              const Spacer(),
              TextButton(
                onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => AppointmentDetailScreen(id: a.id, openRating: true))),
                child: Text('Rate Now',
                    style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.primaryDeep)),
              ),
            ]),
          ],
        ],
      ),
    );
  }
}
