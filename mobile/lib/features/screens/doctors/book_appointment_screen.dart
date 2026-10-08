import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/widgets/widgets.dart';

class BookAppointmentScreen extends ConsumerStatefulWidget {
  const BookAppointmentScreen({super.key, required this.doctorId});
  final int doctorId;

  @override
  ConsumerState<BookAppointmentScreen> createState() => _BookAppointmentScreenState();
}

class _BookAppointmentScreenState extends ConsumerState<BookAppointmentScreen> {
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  final _notesCtrl = TextEditingController();
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _notesCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? today,
      firstDate: today,
      lastDate: today.add(const Duration(days: 90)),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppTheme.primaryTeal),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
        _error = null;
      });
    }
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: const TimeOfDay(hour: 9, minute: 0),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppTheme.primaryTeal),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        _selectedTime = picked;
        _error = null;
      });
    }
  }

  Future<void> _book() async {
    if (_selectedDate == null || _selectedTime == null) {
      setState(() => _error = 'Please select both a date and time.');
      return;
    }

    final localDt = DateTime(
      _selectedDate!.year,
      _selectedDate!.month,
      _selectedDate!.day,
      _selectedTime!.hour,
      _selectedTime!.minute,
    );

    if (localDt.isBefore(DateTime.now())) {
      setState(() => _error =
          'The selected appointment time has already passed. Please select an upcoming slot.');
      return;
    }

    // Check existing appointments on this date
    final myAppts = ref.read(myAppointmentsProvider).valueOrNull ?? [];
    final hasActiveOnDate = myAppts.any((a) {
      if (a.doctorId != widget.doctorId) return false;
      if (a.isCancelledOrInactive) return false; // Cancelled appointments allow same-day rebooking!
      final ad = a.appointmentDateTime;
      return ad.year == _selectedDate!.year &&
          ad.month == _selectedDate!.month &&
          ad.day == _selectedDate!.day;
    });

    if (hasActiveOnDate) {
      setState(() => _error =
          'You already have an active appointment scheduled with this doctor on this date.');
      return;
    }

    setState(() {
      _submitting = true;
      _error = null;
    });

    final dt = localDt.toUtc();

    try {
      await ApiClient.instance.post('/appointments', body: {
        'doctorId': widget.doctorId,
        'dateTime': dt.toIso8601String(),
        'notes': _notesCtrl.text.trim().isEmpty ? null : _notesCtrl.text.trim(),
      });

      ref.invalidate(myAppointmentsProvider);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Appointment booked successfully! 🎉', style: GoogleFonts.inter()),
            backgroundColor: AppTheme.statusConfirmed,
          ),
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      setState(() => _error = e
          .toString()
          .replaceFirst('ApiException(400): ', '')
          .replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final doctorAsync = ref.watch(doctorByIdProvider(widget.doctorId));

    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
      body: doctorAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppTheme.primaryTeal),
        ),
        data: (doctor) {
          final myAppts = ref.watch(myAppointmentsProvider).valueOrNull ?? [];
          final activeApptOnDate = _selectedDate != null
              ? myAppts.where((a) =>
                  a.doctorId == widget.doctorId &&
                  !a.isCancelledOrInactive &&
                  a.appointmentDateTime.year == _selectedDate!.year &&
                  a.appointmentDateTime.month == _selectedDate!.month &&
                  a.appointmentDateTime.day == _selectedDate!.day).firstOrNull
              : null;

          final cancelledApptOnDate = _selectedDate != null
              ? myAppts.where((a) =>
                  a.doctorId == widget.doctorId &&
                  a.isCancelledOrInactive &&
                  a.appointmentDateTime.year == _selectedDate!.year &&
                  a.appointmentDateTime.month == _selectedDate!.month &&
                  a.appointmentDateTime.day == _selectedDate!.day).firstOrNull
              : null;

          return SafeArea(
            bottom: false,
            child: Column(
            children: [
              // Top Bar
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 10),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => Navigator.of(context).pop(),
                      child: Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppTheme.cardBorder),
                          boxShadow: AppTheme.cardShadow,
                        ),
                        child: const Icon(
                          LucideIcons.chevronLeft,
                          color: AppTheme.textPrimary,
                          size: 22,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        'Book Appointment',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 42),
                  ],
                ),
              ),

              // Doctor summary card
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppTheme.cardBorder),
                    boxShadow: AppTheme.cardShadow,
                  ),
                  child: Row(
                    children: [
                      DoctorAvatar(
                        photoUrl: doctor.profilePhoto,
                        name: doctor.fullName,
                        radius: 26,
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              doctor.fullName,
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: AppTheme.textPrimary,
                              ),
                            ),
                            Text(
                              doctor.primarySpecialty,
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.accentMint,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          'Rs. ${(doctor.consultationFee ?? 2500).toStringAsFixed(0)}',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.primaryDeep,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Form fields
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(20, 10, 20, 120),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      if (_error != null) ...[
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: AppTheme.statusInConsBg,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: AppTheme.statusInConsult.withValues(alpha: 0.3)),
                          ),
                          child: Row(
                            children: [
                              const Icon(LucideIcons.circleAlert, color: AppTheme.statusInConsult, size: 18),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _error!,
                                  style: GoogleFonts.inter(
                                    fontSize: 13,
                                    color: AppTheme.statusInConsult,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      if (activeApptOnDate != null) ...[
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: AppTheme.statusInConsBg,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: AppTheme.statusInConsult.withValues(alpha: 0.3)),
                          ),
                          child: Row(
                            children: [
                              const Icon(LucideIcons.calendarX, color: AppTheme.statusInConsult, size: 18),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'You already have an active appointment scheduled with Dr. ${doctor.fullName} on this date.',
                                  style: GoogleFonts.inter(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.statusInConsult,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ] else if (cancelledApptOnDate != null) ...[
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: const Color(0xFFBFDBFE)),
                          ),
                          child: Row(
                            children: [
                              const Icon(LucideIcons.circleCheck, color: AppTheme.primaryBlue, size: 18),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Your earlier appointment on this date was cancelled. You are eligible to book a new appointment for this day.',
                                  style: GoogleFonts.inter(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w600,
                                    color: const Color(0xFF1E40AF),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Date Picker Card
                      GestureDetector(
                        onTap: _pickDate,
                        child: Container(
                          padding: const EdgeInsets.all(18),
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
                                  LucideIcons.calendar,
                                  color: AppTheme.primaryTeal,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Appointment Date',
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        color: AppTheme.textMuted,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      _selectedDate != null
                                          ? DateFormat('EEEE, d MMMM yyyy').format(_selectedDate!)
                                          : 'Tap to select date',
                                      style: GoogleFonts.inter(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: _selectedDate != null
                                            ? AppTheme.textPrimary
                                            : AppTheme.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(LucideIcons.chevronRight, color: AppTheme.textMuted),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Time Picker Card
                      GestureDetector(
                        onTap: _pickTime,
                        child: Container(
                          padding: const EdgeInsets.all(18),
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
                                  LucideIcons.clock,
                                  color: AppTheme.primaryTeal,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Appointment Time',
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        color: AppTheme.textMuted,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      _selectedTime != null
                                          ? _selectedTime!.format(context)
                                          : 'Tap to select time',
                                      style: GoogleFonts.inter(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: _selectedTime != null
                                            ? AppTheme.textPrimary
                                            : AppTheme.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(LucideIcons.chevronRight, color: AppTheme.textMuted),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 18),

                      // Clinical Notes
                      Text(
                        'Reason for visit / symptoms (optional)',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.cardBorder),
                          boxShadow: AppTheme.cardShadow,
                        ),
                        child: TextField(
                          controller: _notesCtrl,
                          maxLines: 3,
                          style: GoogleFonts.inter(fontSize: 14),
                          decoration: InputDecoration(
                            hintText: 'Describe your symptoms or reason for consulting...',
                            hintStyle: GoogleFonts.inter(fontSize: 13, color: AppTheme.textMuted),
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                            contentPadding: const EdgeInsets.all(16),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom Confirmation Button
              Container(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 16,
                      offset: const Offset(0, -4),
                    ),
                  ],
                ),
                child: SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton(
                    onPressed: (_submitting || activeApptOnDate != null) ? null : _book,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: activeApptOnDate != null
                          ? AppTheme.textMuted
                          : AppTheme.primaryTeal,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(28),
                      ),
                    ),
                    child: _submitting
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                                color: Colors.white, strokeWidth: 2.5),
                          )
                        : Text(
                            activeApptOnDate != null
                                ? 'Already Booked on this Date'
                                : 'Confirm Appointment',
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
      error: (e, _) => ErrorState(message: e.toString()),
    ),
  );
}
}
