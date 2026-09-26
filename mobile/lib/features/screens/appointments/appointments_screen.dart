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

/// Appointments Management Screen (macOS Medical Theme)
/// Features 3 filter views: Upcoming, Past/Completed, and Cancelled
class AppointmentsScreen extends ConsumerStatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  ConsumerState<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends ConsumerState<AppointmentsScreen> {
  String _selectedTab = 'upcoming'; // 'upcoming', 'completed', 'cancelled'

  @override
  Widget build(BuildContext context) {
    final apptsAsync = ref.watch(myAppointmentsProvider);

    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            AppTheme.macOSWindowDots(size: 9, spacing: 4),
            const SizedBox(width: 8),
            Text(
              'My Appointments',
              style: GoogleFonts.outfit(
                fontSize: 17,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
              ),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppTheme.bgCanvas,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.cardBorder),
              ),
              child: Row(
                children: [
                  _TabSegment(
                    label: 'Upcoming',
                    isSelected: _selectedTab == 'upcoming',
                    onTap: () => setState(() => _selectedTab = 'upcoming'),
                  ),
                  _TabSegment(
                    label: 'Completed',
                    isSelected: _selectedTab == 'completed',
                    onTap: () => setState(() => _selectedTab = 'completed'),
                  ),
                  _TabSegment(
                    label: 'Cancelled',
                    isSelected: _selectedTab == 'cancelled',
                    onTap: () => setState(() => _selectedTab = 'cancelled'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: RefreshIndicator(
        color: AppTheme.primaryBlue,
        onRefresh: () async => ref.invalidate(myAppointmentsProvider),
        child: apptsAsync.when(
          loading: () => ListView(
            padding: const EdgeInsets.all(16),
            children: const [
              ShimmerCard(height: 140),
              SizedBox(height: 12),
              ShimmerCard(height: 140),
            ],
          ),
          error: (e, _) => Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: ErrorState(
                message: e.toString(),
                onRetry: () => ref.invalidate(myAppointmentsProvider),
              ),
            ),
          ),
          data: (appts) {
            final filtered = appts.where((a) {
              if (_selectedTab == 'upcoming') {
                return a.isUpcoming;
              } else if (_selectedTab == 'completed') {
                return a.isCompleted;
              } else {
                return a.status == 'Cancelled' || a.status == 'NoShow';
              }
            }).toList();

            if (filtered.isEmpty) {
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  const SizedBox(height: 80),
                  Center(
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.calendar_today_rounded,
                        size: 34,
                        color: AppTheme.primaryBlue,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _selectedTab == 'upcoming'
                        ? 'No upcoming appointments'
                        : _selectedTab == 'completed'
                            ? 'No past consultations found'
                            : 'No cancelled appointments',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: Text(
                      _selectedTab == 'upcoming'
                          ? 'Find a verified doctor and schedule a physical or tele-consultation.'
                          : 'Your consultation history and records will be archived here.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.outfit(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              );
            }

            return ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 110),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (context, i) => _AppointmentCard(
                appointment: filtered[i],
                onCancel: () => _handleCancel(filtered[i].id),
              ),
            );
          },
        ),
      ),
    );
  }

  Future<void> _handleCancel(int id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          'Cancel Consultation?',
          style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        content: Text(
          'Are you sure you want to cancel this scheduled appointment?',
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
}

class _TabSegment extends StatelessWidget {
  const _TabSegment({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Center(
            child: Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 12.5,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? AppTheme.primaryBlue : AppTheme.textSecondary,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _AppointmentCard extends StatelessWidget {
  const _AppointmentCard({
    required this.appointment,
    required this.onCancel,
  });

  final AppointmentModel appointment;
  final VoidCallback onCancel;

  @override
  Widget build(BuildContext context) {
    final dt = appointment.appointmentDateTime;
    final dateStr = DateFormat('EEE, MMM d, yyyy').format(dt);
    final timeStr = DateFormat('hh:mm a').format(dt);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.cardBorder),
        boxShadow: AppTheme.macOSShadow,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () => Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => AppointmentDetailScreen(id: appointment.id),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Doctor and status
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    DoctorAvatar(
                      photoUrl: appointment.doctorProfilePhoto,
                      name: appointment.doctorName,
                      radius: 26,
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Dr. ${appointment.doctorName}',
                            style: GoogleFonts.outfit(
                              fontSize: 15.5,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          Text(
                            appointment.specialtyName,
                            style: GoogleFonts.outfit(
                              fontSize: 12.5,
                              color: AppTheme.textSecondary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    _buildStatusPill(appointment.status),
                  ],
                ),

                const SizedBox(height: 14),

                // Date & Time Banner
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppTheme.surface2,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_rounded, size: 14, color: AppTheme.primaryBlue),
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
                      Row(
                        children: [
                          const Icon(Icons.access_time_rounded, size: 14, color: AppTheme.primaryBlue),
                          const SizedBox(width: 6),
                          Text(
                            timeStr,
                            style: GoogleFonts.outfit(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primaryBlue,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 14),

                // Actions: Details & Cancel
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
                          'View Details',
                          style: GoogleFonts.outfit(fontSize: 12.5, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                    if (appointment.isCancellable) ...[
                      const SizedBox(width: 10),
                      TextButton(
                        onPressed: onCancel,
                        style: TextButton.styleFrom(
                          foregroundColor: const Color(0xFFDC2626),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        ),
                        child: Text(
                          'Cancel',
                          style: GoogleFonts.outfit(fontSize: 12.5, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatusPill(String status) {
    Color bg;
    Color text;
    String label;

    switch (status) {
      case 'Confirmed':
        bg = const Color(0xFFECFDF5);
        text = const Color(0xFF059669);
        label = 'Confirmed';
        break;
      case 'Completed':
        bg = const Color(0xFFF0FDFA);
        text = const Color(0xFF0D9488);
        label = 'Completed';
        break;
      case 'InConsultation':
        bg = const Color(0xFFFEF2F2);
        text = const Color(0xFFE11D48);
        label = '🔴 In Session';
        break;
      case 'PaymentSubmitted':
        bg = const Color(0xFFEFF6FF);
        text = const Color(0xFF0284C7);
        label = 'Payment Sent';
        break;
      case 'Cancelled':
      case 'NoShow':
        bg = const Color(0xFFF1F5F9);
        text = const Color(0xFF64748B);
        label = 'Cancelled';
        break;
      default:
        bg = const Color(0xFFFFFBEB);
        text = const Color(0xFFB45309);
        label = 'Pending';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        label,
        style: GoogleFonts.outfit(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: text,
        ),
      ),
    );
  }
}
