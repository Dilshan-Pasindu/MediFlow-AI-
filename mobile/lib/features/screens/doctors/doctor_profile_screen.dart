import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';

class DoctorProfileScreen extends ConsumerStatefulWidget {
  const DoctorProfileScreen({super.key, required this.id});
  final int id;

  @override
  ConsumerState<DoctorProfileScreen> createState() => _DoctorProfileScreenState();
}

class _DoctorProfileScreenState extends ConsumerState<DoctorProfileScreen> {
  int _selectedDayIndex = 3; // Thu 15 in reference
  String _selectedTimeSlot = '08:30 PM';
  bool _isBooking = false;

  final List<Map<String, String>> _days = const [
    {'day': 'Mon', 'num': '12'},
    {'day': 'Tue', 'num': '13'},
    {'day': 'Wed', 'num': '14'},
    {'day': 'Thu', 'num': '15'},
    {'day': 'Fri', 'num': '16'},
    {'day': 'Sat', 'num': '17'},
    {'day': 'Sun', 'num': '18'},
  ];

  final List<String> _timeSlots = const [
    '04:30 PM',
    '05:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:45 PM',
    '08:30 PM',
  ];

  Future<void> _handleBookAppointment(DoctorModel doctor) async {
    setState(() {
      _isBooking = true;
    });

    try {
      final now = DateTime.now();
      final dayOffset = _selectedDayIndex - 3; // relative offset
      final targetDate = now.add(Duration(days: dayOffset >= 0 ? dayOffset + 1 : 1));

      // Parse time slot
      final timeParts = _selectedTimeSlot.split(' ');
      final hm = timeParts[0].split(':');
      var hour = int.parse(hm[0]);
      final minute = int.parse(hm[1]);
      if (timeParts.length > 1 && timeParts[1].toUpperCase() == 'PM' && hour < 12) {
        hour += 12;
      } else if (timeParts.length > 1 && timeParts[1].toUpperCase() == 'AM' && hour == 12) {
        hour = 0;
      }

      final dt = DateTime(targetDate.year, targetDate.month, targetDate.day, hour, minute).toUtc();

      await ApiClient.instance.post('/appointments', body: {
        'doctorId': doctor.id,
        'dateTime': dt.toIso8601String(),
        'notes': 'Consultation booked via MediFlow AI Portal',
      });

      ref.invalidate(myAppointmentsProvider);

      if (mounted) {
        _showSuccessDialog(doctor, dt);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Booking note: ${e.toString().replaceFirst("ApiException(400): ", "").replaceFirst("Exception: ", "")}',
              style: GoogleFonts.outfit(),
            ),
            backgroundColor: AppTheme.primaryTeal,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isBooking = false;
        });
      }
    }
  }

  void _showSuccessDialog(DoctorModel doctor, DateTime dt) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppTheme.primaryTeal.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle_rounded,
                  color: AppTheme.primaryTeal,
                  size: 36,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Appointment Confirmed!',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Your session with ${doctor.fullName} on ${DateFormat("EEEE, MMMM d 'at' h:mm a").format(dt.toLocal())} has been scheduled.',
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: 13,
                  color: AppTheme.textSecondary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    Navigator.of(context).pop();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryTeal,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                  ),
                  child: Text(
                    'Done',
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final doctorAsync = ref.watch(doctorByIdProvider(widget.id));

    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
      body: doctorAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppTheme.primaryTeal),
        ),
        error: (e, _) => ErrorState(message: e.toString()),
        data: (doctor) => SafeArea(
          bottom: false,
          child: Column(
            children: [
              // ── Top Navigation Bar: < ... ────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _CircleNavButton(
                      icon: Icons.chevron_left_rounded,
                      onTap: () => Navigator.of(context).pop(),
                    ),
                    Row(
                      children: [
                        AppTheme.macOSWindowDots(size: 8, spacing: 4),
                        const SizedBox(width: 8),
                        Text(
                          'Doctor Profile',
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                      ],
                    ),
                    _CircleNavButton(
                      icon: Icons.chat_bubble_outline_rounded,
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              'Direct messaging with ${doctor.fullName} will be available upon confirmed appointment.',
                              style: GoogleFonts.outfit(),
                            ),
                            backgroundColor: AppTheme.primaryTeal,
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),

              // ── Scrollable Body ──────────────────────────────────────────
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 4, 20, 120),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // ── Doctor Info & Portrait (Screen 2) ────────────────
                      Text(
                        doctor.primarySpecialty,
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        doctor.fullName,
                        style: GoogleFonts.outfit(
                          fontSize: 23,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 6),
                      // ID Badge Pill
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppTheme.cardBorder),
                        ),
                        child: Text(
                          'ID: ${doctor.registrationNumber ?? "32145687"}',
                          style: GoogleFonts.outfit(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Doctor Portrait Illustration
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: 140,
                            height: 140,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                              boxShadow: AppTheme.cardShadow,
                              border: Border.all(color: Colors.white, width: 4),
                            ),
                            child: ClipOval(
                              child: (doctor.profilePhoto != null && doctor.profilePhoto!.isNotEmpty)
                                  ? Image.network(
                                      doctor.profilePhoto!,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) => _buildFallbackAvatar(doctor),
                                    )
                                  : _buildFallbackAvatar(doctor),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Heartbeat / ECG Wave Line (from Reference Design)
                      SizedBox(
                        width: double.infinity,
                        height: 30,
                        child: CustomPaint(
                          painter: _EcgWavePainter(),
                        ),
                      ),
                      const SizedBox(height: 6),

                      // Center Rating Badge: ★ Rating 4.8
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryTeal,
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: AppTheme.tealCardShadow,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.star_rounded, color: Colors.white, size: 18),
                            const SizedBox(width: 6),
                            Text(
                              'Rating ${(doctor.averageRating > 0 ? doctor.averageRating : 4.8).toStringAsFixed(1)}',
                              style: GoogleFonts.outfit(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Circular Action Buttons Row: [Prescription, Rating, Calendar, Time]
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _ActionCircleButton(
                            icon: Icons.description_outlined,
                            onTap: () => _showDoctorBioModal(context, doctor),
                          ),
                          const SizedBox(width: 16),
                          _ActionCircleButton(
                            icon: Icons.star_border_rounded,
                            onTap: () => _showDoctorReviewsModal(context, doctor),
                          ),
                          const SizedBox(width: 16),
                          _ActionCircleButton(
                            icon: Icons.calendar_today_outlined,
                            onTap: () {},
                          ),
                          const SizedBox(width: 16),
                          _ActionCircleButton(
                            icon: Icons.access_time_rounded,
                            onTap: () => _showDoctorAvailabilityModal(context, doctor),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // ── Month Navigator & 7-Day Row ──────────────────────
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            DateFormat('MMMM yyyy').format(DateTime.now()),
                            style: GoogleFonts.outfit(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const Row(
                            children: [
                              Icon(Icons.chevron_left_rounded, size: 20, color: AppTheme.textSecondary),
                              SizedBox(width: 6),
                              Icon(Icons.chevron_right_rounded, size: 20, color: AppTheme.textSecondary),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Horizontal 7 Days Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: List.generate(_days.length, (i) {
                          final item = _days[i];
                          final isSelected = i == _selectedDayIndex;
                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedDayIndex = i;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              decoration: BoxDecoration(
                                color: isSelected ? AppTheme.primaryTeal : Colors.white,
                                borderRadius: BorderRadius.circular(22),
                                border: Border.all(
                                  color: isSelected ? AppTheme.primaryTeal : AppTheme.cardBorder,
                                ),
                                boxShadow: isSelected ? AppTheme.tealCardShadow : AppTheme.cardShadow,
                              ),
                              child: Column(
                                children: [
                                  Text(
                                    item['day']!,
                                    style: GoogleFonts.outfit(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                      color: isSelected ? Colors.white : AppTheme.textSecondary,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Container(
                                    width: 28,
                                    height: 28,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: isSelected ? Colors.white : Colors.transparent,
                                    ),
                                    child: Center(
                                      child: Text(
                                        item['num']!,
                                        style: GoogleFonts.outfit(
                                          fontSize: 13,
                                          fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                          color: isSelected ? AppTheme.primaryTeal : AppTheme.textPrimary,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }),
                      ),
                      const SizedBox(height: 24),

                      // ── "Today, Availability" Container ──────────────────
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: AppTheme.cardBorder),
                          boxShadow: AppTheme.cardShadow,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Today,\nAvailability',
                                  style: GoogleFonts.outfit(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w800,
                                    color: AppTheme.textPrimary,
                                    height: 1.2,
                                  ),
                                ),
                                Text(
                                  '${_timeSlots.length} Slots',
                                  style: GoogleFonts.outfit(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: AppTheme.textMuted,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),

                            // Time Slot Chips Grid (Wrapped)
                            Wrap(
                              spacing: 8,
                              runSpacing: 10,
                              children: _timeSlots.map((slot) {
                                final isSelected = slot == _selectedTimeSlot;
                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedTimeSlot = slot;
                                    });
                                  },
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 180),
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                    decoration: BoxDecoration(
                                      color: isSelected ? AppTheme.primaryTeal : AppTheme.bgCanvas,
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(
                                        color: isSelected ? AppTheme.primaryTeal : AppTheme.cardBorder,
                                      ),
                                      boxShadow: isSelected ? AppTheme.tealCardShadow : null,
                                    ),
                                    child: Text(
                                      slot,
                                      style: GoogleFonts.outfit(
                                        fontSize: 12,
                                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                        color: isSelected ? Colors.white : AppTheme.textPrimary,
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Fee display note
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.info_outline_rounded, size: 14, color: AppTheme.textMuted),
                          const SizedBox(width: 4),
                          Text(
                            'Consultation Fee: Rs. ${(doctor.consultationFee ?? 2500).toStringAsFixed(0)}',
                            style: GoogleFonts.outfit(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // ── Bottom Fixed Full-Width CTA "Book Appointment" ───────────
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
                    onPressed: _isBooking ? null : () => _handleBookAppointment(doctor),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryTeal,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(28),
                      ),
                    ),
                    child: _isBooking
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2.5,
                            ),
                          )
                        : Text(
                            'Book Appointment',
                            style: GoogleFonts.outfit(
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
        ),
      ),
    );
  }

  Widget _buildFallbackAvatar(DoctorModel doc) {
    return Container(
      color: AppTheme.primaryTeal.withValues(alpha: 0.12),
      child: Center(
        child: Text(
          doc.fullName.isNotEmpty ? doc.fullName[0].toUpperCase() : 'D',
          style: GoogleFonts.outfit(
            fontSize: 48,
            fontWeight: FontWeight.w800,
            color: AppTheme.primaryTeal,
          ),
        ),
      ),
    );
  }

  void _showDoctorBioModal(BuildContext context, DoctorModel doctor) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('About ${doctor.fullName}',
                style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            Text(
              doctor.bio != null && doctor.bio!.isNotEmpty
                  ? doctor.bio!
                  : 'Experienced clinical specialist committed to providing empathetic, evidence-based care.',
              style: GoogleFonts.outfit(fontSize: 14, color: AppTheme.textSecondary, height: 1.5),
            ),
            const SizedBox(height: 16),
            if (doctor.hospitalClinic != null) ...[
              Text('Location: ${doctor.hospitalClinic}',
                  style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.primaryTeal)),
            ],
          ],
        ),
      ),
    );
  }

  void _showDoctorReviewsModal(BuildContext context, DoctorModel doctor) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.star_rounded, color: AppTheme.starGold, size: 24),
                const SizedBox(width: 8),
                Text(
                  '${(doctor.averageRating > 0 ? doctor.averageRating : 4.8).toStringAsFixed(1)} Rating (${doctor.reviewCount} reviews)',
                  style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w800),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Text('100% verified patient feedback from clinical visits.',
                style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary)),
          ],
        ),
      ),
    );
  }

  void _showDoctorAvailabilityModal(BuildContext context, DoctorModel doctor) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Clinical Schedule', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 14),
            if (doctor.availability.isNotEmpty)
              ...doctor.availability.map((a) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(a.dayOfWeek, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600)),
                        Text('${a.startTime} – ${a.endTime}',
                            style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.primaryTeal)),
                      ],
                    ),
                  ))
            else
              Text('Available Monday to Saturday for scheduled outpatient appointments.',
                  style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary)),
          ],
        ),
      ),
    );
  }
}

// ── Top Circle Nav Button ─────────────────────────────────────────────────────
class _CircleNavButton extends StatelessWidget {
  const _CircleNavButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

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
        child: Icon(icon, color: AppTheme.textPrimary, size: 22),
      ),
    );
  }
}

// ── Action Circle Button ──────────────────────────────────────────────────────
class _ActionCircleButton extends StatelessWidget {
  const _ActionCircleButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: AppTheme.cardBorder),
          boxShadow: AppTheme.cardShadow,
        ),
        child: Icon(icon, color: AppTheme.textSecondary, size: 20),
      ),
    );
  }
}

// ── Heartbeat / ECG Wave Line Painter ─────────────────────────────────────────
class _EcgWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.primaryTeal.withValues(alpha: 0.35)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    final h = size.height;
    final w = size.width;

    path.moveTo(0, h * 0.5);
    path.lineTo(w * 0.18, h * 0.5);
    path.lineTo(w * 0.22, h * 0.2);
    path.lineTo(w * 0.28, h * 0.85);
    path.lineTo(w * 0.32, h * 0.35);
    path.lineTo(w * 0.38, h * 0.5);
    path.lineTo(w * 0.55, h * 0.5);
    path.lineTo(w * 0.60, h * 0.15);
    path.lineTo(w * 0.66, h * 0.9);
    path.lineTo(w * 0.72, h * 0.35);
    path.lineTo(w * 0.78, h * 0.5);
    path.lineTo(w, h * 0.5);

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
