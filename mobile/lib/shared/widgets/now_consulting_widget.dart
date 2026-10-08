import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/network/api_client.dart';
import '../../core/services/consultation_hub_service.dart';
import '../../core/theme/app_theme.dart';
import '../../features/patient/patient_providers.dart';
import '../../shared/models/models.dart';

// ── State ────────────────────────────────────────────────────────────────────

class ConsultationStatus {
  final bool hasActive;
  final int? appointmentId;
  final String? appointmentNumber;
  final int? doctorId;
  final String? doctorName;
  final DateTime? startedAt;
  final bool loading;

  const ConsultationStatus({
    this.hasActive = false,
    this.appointmentId,
    this.appointmentNumber,
    this.doctorId,
    this.doctorName,
    this.startedAt,
    this.loading = false,
  });

  ConsultationStatus copyWith({
    bool? hasActive,
    int? appointmentId,
    String? appointmentNumber,
    int? doctorId,
    String? doctorName,
    DateTime? startedAt,
    bool? loading,
  }) {
    return ConsultationStatus(
      hasActive: hasActive ?? this.hasActive,
      appointmentId: appointmentId ?? this.appointmentId,
      appointmentNumber: appointmentNumber ?? this.appointmentNumber,
      doctorId: doctorId ?? this.doctorId,
      doctorName: doctorName ?? this.doctorName,
      startedAt: startedAt ?? this.startedAt,
      loading: loading ?? this.loading,
    );
  }
}

// ── Widget ───────────────────────────────────────────────────────────────────

/// Real-time "Now Consulting" banner for the mobile dashboard.
/// Mirrors the web's NowConsultingCard component:
///  - Shows a doctor selector if the patient has multiple booked doctors
///  - Connects to SignalR for live updates
///  - Shows active appointment number when a consultation is live
class NowConsultingWidget extends ConsumerStatefulWidget {
  const NowConsultingWidget({super.key});

  @override
  ConsumerState<NowConsultingWidget> createState() => _NowConsultingWidgetState();
}

class _NowConsultingWidgetState extends ConsumerState<NowConsultingWidget>
    with SingleTickerProviderStateMixin {
  ConsultationStatus _status = const ConsultationStatus();
  int? _selectedDoctorId;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnim;

  late ConsultationEventCallback _onStarted;
  late ConsultationEventCallback _onEnded;
  late VoidCallback _onReconnected;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _pulseAnim = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _onStarted = (payload) {
      if (!mounted) return;
      if (_selectedDoctorId == null || payload.doctorId != _selectedDoctorId) return;
      setState(() {
        _status = ConsultationStatus(
          hasActive: true,
          appointmentId: payload.appointmentId,
          appointmentNumber: payload.appointmentNumber,
          doctorId: payload.doctorId,
          doctorName: payload.doctorName,
          startedAt: payload.startedAt,
          loading: false,
        );
      });
    };

    _onEnded = (payload) {
      if (!mounted) return;
      if (_selectedDoctorId == null || payload.doctorId != _selectedDoctorId) return;
      setState(() {
        _status = const ConsultationStatus(hasActive: false, loading: false);
      });
    };

    _onReconnected = () {
      if (_selectedDoctorId != null) {
        ConsultationHubService.instance.joinDoctorQueue(_selectedDoctorId!);
        _fetchConsultation(_selectedDoctorId!);
      }
    };

    ConsultationHubService.instance.onConsultationStarted(_onStarted);
    ConsultationHubService.instance.onConsultationEnded(_onEnded);
    ConsultationHubService.instance.onReconnected(_onReconnected);

    _connect();
  }

  Future<void> _connect() async {
    await ConsultationHubService.instance.startConnection();
  }

  @override
  void dispose() {
    ConsultationHubService.instance.offConsultationStarted(_onStarted);
    ConsultationHubService.instance.offConsultationEnded(_onEnded);
    ConsultationHubService.instance.offReconnected(_onReconnected);
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _fetchConsultation(int doctorId) async {
    setState(() => _status = _status.copyWith(loading: true));
    try {
      final data = await ApiClient.instance.get(
        '/appointments/current-consultation',
        query: {'doctorId': doctorId.toString()},
      ) as Map<String, dynamic>?;

      if (!mounted) return;
      if (data == null) {
        setState(() => _status = const ConsultationStatus(hasActive: false, loading: false));
        return;
      }
      final hasActive = data['hasActiveConsultation'] as bool? ?? false;
      setState(() {
        _status = ConsultationStatus(
          hasActive: hasActive,
          appointmentId: data['appointmentId'] as int?,
          appointmentNumber: data['appointmentNumber'] as String?,
          doctorId: data['doctorId'] as int?,
          doctorName: data['doctorName'] as String?,
          startedAt: data['startedAt'] != null
              ? DateTime.tryParse(data['startedAt'] as String)
              : null,
          loading: false,
        );
      });
    } catch (_) {
      if (mounted) setState(() => _status = const ConsultationStatus(hasActive: false, loading: false));
    }
  }

  void _selectDoctor(int doctorId) async {
    if (_selectedDoctorId != null) {
      ConsultationHubService.instance.leaveDoctorQueue(_selectedDoctorId!);
    }
    setState(() {
      _selectedDoctorId = doctorId;
      _status = const ConsultationStatus(loading: true);
    });
    ConsultationHubService.instance.joinDoctorQueue(doctorId);
    await _fetchConsultation(doctorId);
  }

  @override
  Widget build(BuildContext context) {
    final apptsAsync = ref.watch(myAppointmentsProvider);
    final isConnected = ConsultationHubService.instance.isConnected;

    // Extract unique doctors from patient's active appointments
    List<AppointmentModel> bookedDoctors = [];
    apptsAsync.whenData((appts) {
      final seen = <int>{};
      for (final a in appts) {
        if (a.isUpcoming && !seen.contains(a.doctorId)) {
          seen.add(a.doctorId);
          bookedDoctors.add(a);
        }
      }
    });

    // Auto-select if only one booked doctor and none selected
    if (bookedDoctors.length == 1 && _selectedDoctorId == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && _selectedDoctorId == null) {
          _selectDoctor(bookedDoctors.first.doctorId);
        }
      });
    }

    final hasActive = _status.hasActive;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
      decoration: BoxDecoration(
        color: hasActive ? const Color(0xFFFEF2F2) : Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        border: Border.all(
          color: hasActive ? const Color(0xFFFCA5A5) : AppTheme.cardBorder,
          width: hasActive ? 1.5 : 1.0,
        ),
        boxShadow: hasActive
            ? [
                BoxShadow(
                  color: const Color(0xFFEF4444).withValues(alpha: 0.16),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ]
            : AppTheme.macOSShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top accent stripe
          Container(
            height: 3,
            decoration: BoxDecoration(
              gradient: hasActive
                  ? const LinearGradient(
                      colors: [Color(0xFFDC2626), Color(0xFFEF4444), Color(0xFFF87171)],
                    )
                  : null,
              color: hasActive ? null : AppTheme.cardBorder,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(AppTheme.radiusLg),
                topRight: Radius.circular(AppTheme.radiusLg),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status icon with pulse
                _buildStatusIcon(hasActive),

                const SizedBox(width: 14),

                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Badge row
                      Row(
                        children: [
                          _buildStatusBadge(hasActive),
                          if (isConnected) ...[
                            const SizedBox(width: 8),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 5,
                                  height: 5,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF10B981),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'Live',
                                  style: GoogleFonts.inter(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: const Color(0xFF059669),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ],
                      ),

                      const SizedBox(height: 10),

                      // Doctor selector (if multiple)
                      if (bookedDoctors.length > 1) ...[
                        _buildDoctorSelector(bookedDoctors),
                        const SizedBox(height: 10),
                      ],

                      // Content area
                      apptsAsync.when(
                        loading: () => _buildShimmer(),
                        error: (_, __) => _buildNoBookingsMessage(),
                        data: (appts) {
                          if (bookedDoctors.isEmpty) return _buildNoBookingsMessage();
                          return _buildConsultationContent(hasActive);
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusIcon(bool hasActive) {
    return AnimatedBuilder(
      animation: _pulseAnim,
      builder: (_, __) => Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: hasActive ? const Color(0xFFFEE2E2) : AppTheme.surface2,
          border: Border.all(
            color: hasActive ? const Color(0xFFFCA5A5) : AppTheme.cardBorder,
          ),
          boxShadow: hasActive
              ? [
                  BoxShadow(
                    color: const Color(0xFFEF4444).withValues(alpha: _pulseAnim.value * 0.3),
                    blurRadius: 12,
                    spreadRadius: 2,
                  ),
                ]
              : null,
        ),
        child: Icon(
          hasActive ? LucideIcons.stethoscope : LucideIcons.radio,
          size: 22,
          color: hasActive ? const Color(0xFFDC2626) : AppTheme.textSecondary,
        ),
      ),
    );
  }

  Widget _buildStatusBadge(bool hasActive) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      decoration: BoxDecoration(
        color: hasActive ? const Color(0xFFFEE2E2) : AppTheme.surface2,
        borderRadius: BorderRadius.circular(99),
        border: Border.all(
          color: hasActive ? const Color(0xFFFECACA) : AppTheme.cardBorder,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedBuilder(
            animation: _pulseAnim,
            builder: (_, __) => Container(
              width: 7,
              height: 7,
              decoration: BoxDecoration(
                color: hasActive ? const Color(0xFFDC2626) : AppTheme.textMuted,
                shape: BoxShape.circle,
                boxShadow: hasActive
                    ? [
                        BoxShadow(
                          color: const Color(0xFFDC2626).withValues(alpha: _pulseAnim.value),
                          blurRadius: 6,
                        ),
                      ]
                    : null,
              ),
            ),
          ),
          const SizedBox(width: 5),
          Text(
            hasActive ? 'NOW CONSULTING' : 'CONSULTATION STATUS',
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.6,
              color: hasActive ? const Color(0xFFB91C1C) : AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorSelector(List<AppointmentModel> doctors) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppTheme.cardBorder),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<int>(
          value: _selectedDoctorId,
          hint: Text(
            'Select Doctor',
            style: GoogleFonts.inter(fontSize: 12.5, color: AppTheme.textSecondary),
          ),
          isExpanded: true,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppTheme.textPrimary,
          ),
          icon: const Icon(LucideIcons.chevronDown, size: 18, color: AppTheme.textMuted),
          items: doctors.map((a) {
            final name = a.doctorName.startsWith('Dr.') ? a.doctorName : 'Dr. ${a.doctorName}';
            return DropdownMenuItem<int>(
              value: a.doctorId,
              child: Text('$name • ${a.specialtyName}'),
            );
          }).toList(),
          onChanged: (id) {
            if (id != null) _selectDoctor(id);
          },
        ),
      ),
    );
  }

  Widget _buildConsultationContent(bool hasActive) {
    if (_selectedDoctorId == null) {
      return Text(
        'Select a doctor above to view live consultation status.',
        style: GoogleFonts.inter(
          fontSize: 12.5,
          color: AppTheme.textSecondary,
          height: 1.4,
        ),
      );
    }

    if (_status.loading) return _buildShimmer();

    if (hasActive) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'CURRENTLY CONSULTING:',
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.5,
              color: const Color(0xFFB91C1C),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Appointment No: ',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textPrimary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFFCA5A5)),
                ),
                child: Text(
                  _status.appointmentNumber ?? '#${_status.appointmentId ?? '—'}',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFFDC2626),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'The doctor is currently seeing this appointment.',
            style: GoogleFonts.inter(
              fontSize: 11.5,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      );
    } else {
      return Text(
        'No appointment is currently being consulted. Updates will appear here in real time.',
        style: GoogleFonts.inter(
          fontSize: 12.5,
          color: AppTheme.textSecondary,
          height: 1.4,
        ),
      );
    }
  }

  Widget _buildNoBookingsMessage() {
    return Text(
      'No active booked appointments. Book a doctor to track live consultation status.',
      style: GoogleFonts.inter(
        fontSize: 12.5,
        color: AppTheme.textSecondary,
        height: 1.4,
      ),
    );
  }

  Widget _buildShimmer() {
    return Container(
      height: 16,
      width: 160,
      decoration: BoxDecoration(
        color: AppTheme.surface2,
        borderRadius: BorderRadius.circular(6),
      ),
    );
  }
}
