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
    final picked = await showDatePicker(
      context: context,
      initialDate: now.add(const Duration(days: 1)),
      firstDate: now.add(const Duration(days: 1)),
      lastDate: now.add(const Duration(days: 90)),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppTheme.primaryDeep),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _selectedDate = picked);
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: const TimeOfDay(hour: 9, minute: 0),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppTheme.primaryDeep),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _selectedTime = picked);
  }

  Future<void> _book() async {
    if (_selectedDate == null || _selectedTime == null) {
      setState(() => _error = 'Please select both a date and time.');
      return;
    }
    setState(() { _submitting = true; _error = null; });

    final dt = DateTime(
      _selectedDate!.year, _selectedDate!.month, _selectedDate!.day,
      _selectedTime!.hour, _selectedTime!.minute,
    ).toUtc();

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
            content: Text('Appointment booked successfully! 🎉', style: GoogleFonts.outfit()),
            backgroundColor: AppTheme.statusConfirmed,
          ),
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('ApiException(400): ', '').replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final doctorAsync = ref.watch(doctorByIdProvider(widget.doctorId));

    return Scaffold(
      backgroundColor: AppTheme.surfaceDim,
      body: doctorAsync.when(
        loading: () => const Center(child: CircularProgressIndicator(color: AppTheme.primaryDeep)),
        error: (e, _) => ErrorState(message: e.toString()),
        data: (doctor) => Column(
          children: [
            // Header
            Container(
              decoration: const BoxDecoration(gradient: AppTheme.primaryGradient),
              child: SafeArea(
                bottom: false,
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(4, 8, 16, 0),
                      child: Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                          Expanded(
                            child: Text('Book Appointment',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white),
                            ),
                          ),
                          const SizedBox(width: 48),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
                      child: Row(children: [
                        DoctorAvatar(photoUrl: doctor.profilePhoto, name: doctor.fullName, radius: 26),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(doctor.fullName,
                                style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white),
                              ),
                              Text(doctor.primarySpecialty,
                                style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                          ),
                          child: Text(
                            'Rs. ${doctor.consultationFee?.toStringAsFixed(0) ?? 0}',
                            style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white),
                          ),
                        ),
                      ]),
                    ),
                  ],
                ),
              ),
            ),

            // Form
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Error
                    if (_error != null) ...[
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppTheme.statusInConsult.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                          border: Border.all(color: AppTheme.statusInConsult.withOpacity(0.3)),
                        ),
                        child: Row(children: [
                          const Icon(Icons.error_outline, color: AppTheme.statusInConsult, size: 18),
                          const SizedBox(width: 8),
                          Expanded(child: Text(_error!,
                              style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.statusInConsult))),
                        ]),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Date selector
                    MedCard(
                      onTap: _pickDate,
                      child: Row(children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryDeep.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.calendar_today_rounded, color: AppTheme.primaryDeep, size: 20),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text('Appointment Date', style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
                            Text(
                              _selectedDate != null
                                  ? DateFormat('EEEE, d MMMM yyyy').format(_selectedDate!)
                                  : 'Tap to select date',
                              style: GoogleFonts.outfit(
                                fontSize: 14, fontWeight: FontWeight.w600,
                                color: _selectedDate != null ? AppTheme.textPrimary : AppTheme.textMuted,
                              ),
                            ),
                          ]),
                        ),
                        const Icon(Icons.chevron_right_rounded, color: AppTheme.textMuted),
                      ]),
                    ),
                    const SizedBox(height: 12),

                    // Time selector
                    MedCard(
                      onTap: _pickTime,
                      child: Row(children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryDeep.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.access_time_rounded, color: AppTheme.primaryDeep, size: 20),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text('Appointment Time', style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
                            Text(
                              _selectedTime != null
                                  ? _selectedTime!.format(context)
                                  : 'Tap to select time',
                              style: GoogleFonts.outfit(
                                fontSize: 14, fontWeight: FontWeight.w600,
                                color: _selectedTime != null ? AppTheme.textPrimary : AppTheme.textMuted,
                              ),
                            ),
                          ]),
                        ),
                        const Icon(Icons.chevron_right_rounded, color: AppTheme.textMuted),
                      ]),
                    ),
                    const SizedBox(height: 12),

                    // Notes
                    MedCard(
                      padding: const EdgeInsets.all(16),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Row(children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryDeep.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.notes_rounded, color: AppTheme.primaryDeep, size: 20),
                          ),
                          const SizedBox(width: 14),
                          Text('Additional Notes', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600)),
                        ]),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _notesCtrl,
                          maxLines: 3,
                          maxLength: 500,
                          style: GoogleFonts.outfit(fontSize: 13),
                          decoration: InputDecoration(
                            hintText: 'Describe your main symptoms or reason for visit (optional)...',
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
                      ]),
                    ),
                    const SizedBox(height: 24),

                    // Availability hint
                    if (doctor.availability.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryDeep.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                          border: Border.all(color: AppTheme.primaryDeep.withOpacity(0.15)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Doctor Availability',
                                style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.primaryDeep)),
                            const SizedBox(height: 6),
                            ...doctor.availability.map((a) => Text(
                              '${a.dayOfWeek}: ${a.startTime} – ${a.endTime}',
                              style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary),
                            )),
                          ],
                        ),
                      ),
                    const SizedBox(height: 28),

                    MedPrimaryButton(
                      label: 'Confirm Booking',
                      onPressed: _book,
                      isLoading: _submitting,
                      icon: Icons.check_circle_outline_rounded,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
