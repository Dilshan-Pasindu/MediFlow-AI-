import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';
import '../doctors/doctor_profile_screen.dart';

// Status journey steps (matching React's STATUS_STEPS)
const _kStatusSteps = [
  _StatusStep('Pending',          'Booking Placed',          '📋'),
  _StatusStep('PaymentSubmitted', 'Payment Submitted',       '💳'),
  _StatusStep('Confirmed',        'Receptionist Verified',   '✅'),
  _StatusStep('InConsultation',   'In Consultation',         '🩺'),
  _StatusStep('Completed',        'Consultation Done',       '🎉'),
];

// Cancel reasons (matching React's CANCEL_REASONS)
const _kCancelReasons = [
  'Schedule conflict / Change of plans',
  'Feeling better / Consultation no longer needed',
  'Booked an earlier appointment with another doctor',
  'Personal or transportation difficulties',
  'Other reason',
];

class _StatusStep {
  final String key, label, icon;
  const _StatusStep(this.key, this.label, this.icon);
}

class AppointmentDetailScreen extends ConsumerStatefulWidget {
  const AppointmentDetailScreen({super.key, required this.id, this.openRating = false});
  final int id;
  final bool openRating;

  @override
  ConsumerState<AppointmentDetailScreen> createState() => _AppointmentDetailScreenState();
}

class _AppointmentDetailScreenState extends ConsumerState<AppointmentDetailScreen> {
  // Rating
  double _ratingScore = 5;
  final _reviewCtrl = TextEditingController();
  bool _submittingRating = false;
  bool _ratingDone = false;
  bool _showRatingPanel = false;

  // Payment
  bool _paying = false;
  String? _payError;

  // Cancel
  bool _showCancelSheet = false;
  String _cancelReason = _kCancelReasons.first;
  final _cancelNotesCtrl = TextEditingController();
  bool _cancelling = false;
  String? _cancelError;

  @override
  void initState() {
    super.initState();
    if (widget.openRating) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        setState(() => _showRatingPanel = true);
      });
    }
  }

  @override
  void dispose() {
    _reviewCtrl.dispose();
    _cancelNotesCtrl.dispose();
    super.dispose();
  }

  AppointmentModel? _findAppt(List<AppointmentModel> appts) {
    try { return appts.firstWhere((a) => a.id == widget.id); }
    catch (_) { return null; }
  }

  // ── Submit Rating ───────────────────────────────────────────────────────────
  Future<void> _submitRating() async {
    setState(() => _submittingRating = true);
    try {
      await ApiClient.instance.post('/appointments/${widget.id}/rate', body: {
        'stars': _ratingScore.toInt(),
        'comment': _reviewCtrl.text.trim().isEmpty ? null : _reviewCtrl.text.trim(),
      });
      setState(() { _ratingDone = true; _showRatingPanel = false; });
      ref.invalidate(myAppointmentsProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Thank you for your feedback! ⭐', style: GoogleFonts.outfit()),
              backgroundColor: AppTheme.statusConfirmed),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to submit rating: $e', style: GoogleFonts.outfit()),
              backgroundColor: AppTheme.statusInConsult),
        );
      }
    } finally {
      if (mounted) setState(() => _submittingRating = false);
    }
  }

  // ── Submit Payment ──────────────────────────────────────────────────────────
  Future<void> _submitPayment(AppointmentModel a) async {
    setState(() { _paying = true; _payError = null; });
    try {
      await ApiClient.instance.post('/appointments/${widget.id}/pay');
      ref.invalidate(myAppointmentsProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Payment submitted! ✅ Awaiting receptionist verification.',
                style: GoogleFonts.outfit()),
            backgroundColor: AppTheme.statusConfirmed,
          ),
        );
      }
    } catch (e) {
      setState(() => _payError = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _paying = false);
    }
  }

  // ── Cancel Appointment ──────────────────────────────────────────────────────
  Future<void> _confirmCancel(AppointmentModel a) async {
    if (a.appointmentDateTime.isBefore(DateTime.now())) {
      setState(() => _cancelError = 'Cannot cancel an appointment that has already passed.');
      return;
    }
    if (['Completed', 'InConsultation', 'Cancelled'].contains(a.status)) {
      setState(() => _cancelError = 'Cannot cancel an appointment that is ${a.status}.');
      return;
    }
    setState(() { _cancelling = true; _cancelError = null; });

    final notes = _cancelNotesCtrl.text.trim();
    final reason = _cancelReason == 'Other reason'
        ? (notes.isEmpty ? 'Other reason' : notes)
        : (notes.isEmpty ? _cancelReason : '$_cancelReason - $notes');

    try {
      await ApiClient.instance.post('/appointments/${widget.id}/cancel', body: {'reason': reason});
      ref.invalidate(myAppointmentsProvider);
      setState(() => _showCancelSheet = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Appointment cancelled.', style: GoogleFonts.outfit()),
              backgroundColor: AppTheme.statusPending),
        );
      }
    } catch (e) {
      setState(() => _cancelError = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _cancelling = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final apptsAsync = ref.watch(myAppointmentsProvider);

    return Scaffold(
      backgroundColor: AppTheme.surfaceDim,
      body: apptsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => ErrorState(message: e.toString()),
        data: (appts) {
          final a = _findAppt(appts);
          if (a == null) return const Center(child: Text('Appointment not found'));

          // Show cancel bottom sheet if requested
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (_showCancelSheet && mounted) {
              _showCancelSheet = false;
              _showCancelDialog(context, a);
            }
          });

          return _buildContent(a);
        },
      ),
    );
  }

  Widget _buildContent(AppointmentModel a) {
    final st = AppTheme.appointmentStatus(a.status);
    final date = a.appointmentDateTime;
    final isCancellable = !['Completed', 'InConsultation', 'Cancelled', 'NoShow'].contains(a.status)
        && a.appointmentDateTime.isAfter(DateTime.now());

    return CustomScrollView(
      slivers: [
        // ── Gradient Header ────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Container(
            decoration: const BoxDecoration(gradient: AppTheme.primaryGradient),
            child: SafeArea(
              bottom: false,
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(4, 8, 4, 0),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                        Expanded(
                          child: Text('Appointment Details',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white),
                          ),
                        ),
                        if (isCancellable)
                          TextButton(
                            onPressed: () => _showCancelDialog(context, a),
                            child: Text('Cancel', style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13)),
                          )
                        else
                          const SizedBox(width: 48),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                    child: Row(
                      children: [
                        Container(
                          width: 64, height: 72,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text('${date.day}',
                                  style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w800, color: Colors.white)),
                              Text(DateFormat('MMM').format(date),
                                  style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70)),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(a.doctorName,
                                  style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
                              Text(a.specialtyName,
                                  style: GoogleFonts.outfit(fontSize: 13, color: Colors.white70)),
                              const SizedBox(height: 6),
                              StatusBadge(label: st.label, bg: Colors.white.withValues(alpha: 0.2), color: Colors.white),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        SliverPadding(
          padding: const EdgeInsets.all(16),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              // ── Status Stepper ────────────────────────────────────────────
              if (a.status != 'Cancelled' && a.status != 'NoShow') ...[
                MedCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Appointment Journey',
                          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 16),
                      ..._kStatusSteps.asMap().entries.map((e) {
                        final idx = e.key;
                        final step = e.value;
                        final currentIdx = _kStatusSteps.indexWhere((s) => s.key == a.status);
                        final isDone = idx < currentIdx;
                        final isCurrent = idx == currentIdx;
                        final isLast = idx == _kStatusSteps.length - 1;
                        return Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Column(children: [
                              Container(
                                width: 32, height: 32,
                                decoration: BoxDecoration(
                                  color: isDone || isCurrent
                                      ? AppTheme.primaryDeep
                                      : AppTheme.divider,
                                  shape: BoxShape.circle,
                                ),
                                child: Center(
                                  child: isDone
                                      ? const Icon(Icons.check_rounded, color: Colors.white, size: 16)
                                      : Text(step.icon, style: const TextStyle(fontSize: 14)),
                                ),
                              ),
                              if (!isLast)
                                Container(
                                  width: 2,
                                  height: 28,
                                  color: isDone ? AppTheme.primaryDeep : AppTheme.divider,
                                ),
                            ]),
                            const SizedBox(width: 12),
                            Padding(
                              padding: const EdgeInsets.only(top: 6),
                              child: Text(step.label,
                                style: GoogleFonts.outfit(
                                  fontSize: 13,
                                  fontWeight: isCurrent ? FontWeight.w700 : FontWeight.w400,
                                  color: isCurrent ? AppTheme.textPrimary
                                      : isDone ? AppTheme.textSecondary
                                      : AppTheme.textMuted,
                                ),
                              ),
                            ),
                          ],
                        );
                      }),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
              ],

              // ── Pay Now Banner ────────────────────────────────────────────
              if (a.status == 'Pending') ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF059669), Color(0xFF10B981)],
                    ),
                    borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                    boxShadow: AppTheme.cardShadow,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        const Icon(Icons.credit_card_rounded, color: Colors.white, size: 22),
                        const SizedBox(width: 10),
                        Text('Payment Required',
                            style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white)),
                      ]),
                      const SizedBox(height: 6),
                      Text('Submit your payment to confirm this appointment. A receptionist will verify and generate your appointment number.',
                        style: GoogleFonts.outfit(fontSize: 12, color: Colors.white.withValues(alpha: 0.85))),
                      if (_payError != null) ...[
                        const SizedBox(height: 8),
                        Text(_payError!, style: GoogleFonts.outfit(fontSize: 12, color: Colors.redAccent)),
                      ],
                      const SizedBox(height: 14),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _paying ? null : () => _submitPayment(a),
                          icon: _paying
                              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                              : const Icon(Icons.payment_rounded, size: 18),
                          label: Text(_paying ? 'Processing…' : 'Submit Payment Now',
                              style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF059669),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusFull)),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
              ],

              // ── Appointment Info ──────────────────────────────────────────
              MedCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Appointment Info',
                        style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
                    const SizedBox(height: 12),
                    _InfoRow(icon: Icons.numbers_rounded, label: 'Appointment No.',
                        value: a.appointmentNumber ?? '#${a.id}'),
                    _InfoRow(icon: Icons.calendar_today_rounded, label: 'Date',
                        value: DateFormat('EEEE, d MMMM yyyy').format(date)),
                    _InfoRow(icon: Icons.access_time_rounded, label: 'Time',
                        value: DateFormat('h:mm a').format(date)),
                    if (a.fee != null)
                      _InfoRow(icon: Icons.payments_outlined, label: 'Consultation Fee',
                          value: 'Rs. ${a.fee!.toStringAsFixed(0)}'),
                    if (a.paymentStatus != null)
                      _InfoRow(icon: Icons.credit_card_outlined, label: 'Payment',
                          value: a.paymentStatus!),
                    if (a.notes != null && a.notes!.isNotEmpty)
                      _InfoRow(icon: Icons.notes_rounded, label: 'Notes', value: a.notes!),
                    if (a.cancelReason != null)
                      _InfoRow(icon: Icons.cancel_outlined, label: 'Cancel Reason', value: a.cancelReason!),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // ── Doctor Card ───────────────────────────────────────────────
              MedCard(
                child: Row(
                  children: [
                    DoctorAvatar(name: a.doctorName, radius: 28),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(a.doctorName,
                              style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700)),
                          Text(a.specialtyName,
                              style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.primaryDeep)),
                          if (a.doctorQualifications != null)
                            Text(a.doctorQualifications!,
                                style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                                maxLines: 1, overflow: TextOverflow.ellipsis),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.person_outline_rounded, color: AppTheme.primaryDeep),
                      onPressed: () => Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => DoctorProfileScreen(id: a.doctorId))),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // ── Rating Section (for completed appointments) ───────────────
              if (a.isCompleted) ...[
                if (a.hasRated && a.rating != null) ...[
                  MedCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Your Rating',
                            style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 8),
                        StarRating(rating: a.rating!.stars.toDouble(), size: 20),
                        if (a.rating!.comment != null && a.rating!.comment!.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Text('"${a.rating!.comment!}"',
                              style: GoogleFonts.outfit(fontSize: 13, fontStyle: FontStyle.italic, color: AppTheme.textSecondary)),
                        ],
                      ],
                    ),
                  ),
                ] else if (!_ratingDone) ...[
                  MedCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(children: [
                          const Icon(Icons.star_rounded, color: Color(0xFFF59E0B), size: 20),
                          const SizedBox(width: 8),
                          Text('Rate Your Consultation',
                              style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                        ]),
                        const SizedBox(height: 12),
                        if (_showRatingPanel) ...[
                          RatingBar.builder(
                            initialRating: _ratingScore,
                            minRating: 1,
                            direction: Axis.horizontal,
                            itemCount: 5,
                            itemSize: 36,
                            itemBuilder: (_, __) => const Icon(Icons.star_rounded, color: Color(0xFFF59E0B)),
                            onRatingUpdate: (r) => setState(() => _ratingScore = r),
                          ),
                          const SizedBox(height: 12),
                          TextFormField(
                            controller: _reviewCtrl,
                            maxLines: 3,
                            style: GoogleFonts.outfit(fontSize: 13),
                            decoration: InputDecoration(
                              hintText: 'Share your experience (optional)...',
                              hintStyle: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textMuted),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                                borderSide: const BorderSide(color: AppTheme.divider),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                                borderSide: const BorderSide(color: AppTheme.primaryDeep, width: 2),
                              ),
                              filled: true, fillColor: AppTheme.surfaceDim,
                            ),
                          ),
                          const SizedBox(height: 12),
                          MedPrimaryButton(
                            label: 'Submit Rating',
                            onPressed: _submitRating,
                            isLoading: _submittingRating,
                            icon: Icons.star_rounded,
                          ),
                        ] else ...[
                          Text('How was your consultation with Dr. ${a.doctorName}?',
                              style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary)),
                          const SizedBox(height: 10),
                          OutlinedButton.icon(
                            onPressed: () => setState(() => _showRatingPanel = true),
                            icon: const Icon(Icons.star_outline_rounded, size: 16),
                            label: Text('Rate Now', style: GoogleFonts.outfit(fontWeight: FontWeight.w700)),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 12),
              ],

              const SizedBox(height: 80),
            ]),
          ),
        ),
      ],
    );
  }

  void _showCancelDialog(BuildContext context, AppointmentModel a) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatefulBuilder(
        builder: (ctx, setSheetState) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: EdgeInsets.only(
            left: 20, right: 20, top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 40, height: 4,
                  decoration: BoxDecoration(
                    color: AppTheme.divider,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text('Cancel Appointment',
                  style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text('Please select a reason for cancellation',
                  style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textMuted)),
              const SizedBox(height: 16),
              // Reason chips
              ..._kCancelReasons.map((reason) => GestureDetector(
                onTap: () => setSheetState(() => _cancelReason = reason),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: _cancelReason == reason
                        ? AppTheme.primaryDeep.withValues(alpha: 0.08)
                        : AppTheme.surfaceDim,
                    borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    border: Border.all(
                      color: _cancelReason == reason ? AppTheme.primaryDeep : AppTheme.divider,
                      width: _cancelReason == reason ? 2 : 1,
                    ),
                  ),
                  child: Row(children: [
                    Icon(
                      _cancelReason == reason ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                      size: 18,
                      color: _cancelReason == reason ? AppTheme.primaryDeep : AppTheme.textMuted,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(reason,
                        style: GoogleFonts.outfit(
                          fontSize: 13,
                          fontWeight: _cancelReason == reason ? FontWeight.w600 : FontWeight.w400,
                          color: _cancelReason == reason ? AppTheme.textPrimary : AppTheme.textSecondary,
                        ),
                      ),
                    ),
                  ]),
                ),
              )),
              if (_cancelReason == 'Other reason' || _cancelReason != _kCancelReasons.first) ...[
                const SizedBox(height: 8),
                TextField(
                  controller: _cancelNotesCtrl,
                  maxLines: 2,
                  maxLength: 200,
                  style: GoogleFonts.outfit(fontSize: 13),
                  decoration: InputDecoration(
                    hintText: 'Additional details (optional)...',
                    hintStyle: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                    filled: true, fillColor: AppTheme.surfaceDim,
                  ),
                ),
              ],
              if (_cancelError != null) ...[
                const SizedBox(height: 8),
                Text(_cancelError!, style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.statusInConsult)),
              ],
              const SizedBox(height: 16),
              Row(children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: Text('Keep Appointment', style: GoogleFonts.outfit()),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _cancelling ? null : () async {
                      await _confirmCancel(a);
                      if (mounted) Navigator.pop(ctx);
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: AppTheme.statusInConsult),
                    child: _cancelling
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : Text('Confirm Cancel', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w700)),
                  ),
                ),
              ]),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.icon, required this.label, required this.value});
  final IconData icon;
  final String label, value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: AppTheme.textMuted),
          const SizedBox(width: 10),
          SizedBox(width: 110,
            child: Text(label, style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted))),
          Expanded(
            child: Text(value,
              style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}
