import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/widgets/widgets.dart';
import 'book_appointment_screen.dart';

class DoctorProfileScreen extends ConsumerWidget {
  const DoctorProfileScreen({super.key, required this.id});
  final int id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final doctorAsync = ref.watch(doctorByIdProvider(id));

    return Scaffold(
      backgroundColor: AppTheme.surfaceDim,
      body: doctorAsync.when(
        loading: () => const Center(child: CircularProgressIndicator(color: AppTheme.primaryDeep)),
        error: (e, _) => ErrorState(message: e.toString()),
        data: (doctor) => CustomScrollView(
          slivers: [
            // Header
            SliverToBoxAdapter(
              child: Container(
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
                            const Spacer(),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
                        child: Column(
                          children: [
                            DoctorAvatar(photoUrl: doctor.profilePhoto, name: doctor.fullName, radius: 44),
                            const SizedBox(height: 12),
                            Text(doctor.fullName,
                              style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white),
                              textAlign: TextAlign.center,
                            ),
                            Text(doctor.primarySpecialty,
                              style: GoogleFonts.outfit(fontSize: 14, color: Colors.white70),
                            ),
                            const SizedBox(height: 8),
                            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                              StarRating(rating: doctor.averageRating, size: 16),
                              const SizedBox(width: 6),
                              Text('${doctor.averageRating.toStringAsFixed(1)} (${doctor.reviewCount} reviews)',
                                  style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70)),
                            ]),
                            const SizedBox(height: 16),
                            // Stats row
                            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                              _StatChip(value: '${doctor.experienceYears ?? 0}+', label: 'Years\nExp.'),
                              const SizedBox(width: 12),
                              _StatChip(value: 'Rs. ${doctor.consultationFee?.toStringAsFixed(0) ?? 0}', label: 'Consult\nFee'),
                              const SizedBox(width: 12),
                              _StatChip(value: '${doctor.reviewCount}', label: 'Patient\nReviews'),
                            ]),
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
                  // Bio
                  if (doctor.bio != null && doctor.bio!.isNotEmpty) ...[
                    MedCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('About', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                          const SizedBox(height: 8),
                          Text(doctor.bio!,
                            style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary, height: 1.5)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],

                  // Details
                  MedCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Professional Details',
                            style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 12),
                        if (doctor.qualifications != null)
                          _DetailRow(icon: Icons.school_outlined, label: 'Qualifications',
                              value: doctor.qualifications!),
                        if (doctor.subSpecialty != null)
                          _DetailRow(icon: Icons.biotech_outlined, label: 'Sub-specialty',
                              value: doctor.subSpecialty!),
                        if (doctor.hospitalClinic != null)
                          _DetailRow(icon: Icons.local_hospital_outlined, label: 'Hospital/Clinic',
                              value: doctor.hospitalClinic!),
                        if (doctor.location != null)
                          _DetailRow(icon: Icons.location_on_outlined, label: 'Location',
                              value: doctor.location!),
                        if (doctor.languages != null)
                          _DetailRow(icon: Icons.language_outlined, label: 'Languages',
                              value: doctor.languages!),
                        if (doctor.registrationNumber != null)
                          _DetailRow(icon: Icons.badge_outlined, label: 'License No.',
                              value: doctor.registrationNumber!),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Availability
                  if (doctor.availability.isNotEmpty) ...[
                    MedCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Availability',
                              style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                          const SizedBox(height: 12),
                          ...doctor.availability.map((a) => Padding(
                            padding: const EdgeInsets.only(bottom: 6),
                            child: Row(children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryDeep.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                                ),
                                child: Text(a.dayOfWeek,
                                  style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.primaryDeep),
                                ),
                              ),
                              const SizedBox(width: 12),
                              const Icon(Icons.access_time_rounded, size: 14, color: AppTheme.textMuted),
                              const SizedBox(width: 4),
                              Text('${a.startTime} – ${a.endTime}',
                                style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary),
                              ),
                            ]),
                          )),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],

                  // Reviews
                  if (doctor.reviews.isNotEmpty) ...[
                    MedCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(children: [
                            Text('Patient Reviews',
                                style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFFBEB),
                                borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                              ),
                              child: Row(children: [
                                const Icon(Icons.star_rounded, color: Color(0xFFF59E0B), size: 14),
                                const SizedBox(width: 3),
                                Text(doctor.averageRating.toStringAsFixed(1),
                                    style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: const Color(0xFFB45309))),
                              ]),
                            ),
                          ]),
                          const SizedBox(height: 12),
                          ...doctor.reviews.take(5).map((r) => Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(children: [
                                  CircleAvatar(
                                    radius: 14,
                                    backgroundColor: AppTheme.primaryDeep.withOpacity(0.1),
                                    child: Text(
                                      r.patientName?.isNotEmpty == true ? r.patientName![0].toUpperCase() : 'P',
                                      style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.primaryDeep),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(r.patientName ?? 'Patient',
                                        style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600)),
                                  ),
                                  StarRating(rating: r.stars.toDouble(), size: 12),
                                ]),
                                if (r.comment != null && r.comment!.isNotEmpty) ...[
                                  const SizedBox(height: 4),
                                  Text(r.comment!,
                                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary),
                                  ),
                                ],
                                if (r.createdAt != null) ...[
                                  const SizedBox(height: 2),
                                  Text(
                                    DateFormat('d MMM yyyy').format(DateTime.tryParse(r.createdAt!) ?? DateTime.now()),
                                    style: GoogleFonts.outfit(fontSize: 10, color: AppTheme.textMuted),
                                  ),
                                ],
                                const Divider(),
                              ],
                            ),
                          )),
                        ],
                      ),
                    ),
                    const SizedBox(height: 80),
                  ],
                ]),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: doctorAsync.valueOrNull?.isActive == true
          ? Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => BookAppointmentScreen(doctorId: id)),
                  ),
                  icon: const Icon(Icons.calendar_today_rounded, size: 18),
                  label: Text('Book Appointment',
                      style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryDeep,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                    ),
                  ),
                ),
              ),
            )
          : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({required this.value, required this.label});
  final String value, label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Text(value, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
          Text(label, textAlign: TextAlign.center,
            style: GoogleFonts.outfit(fontSize: 10, color: Colors.white70)),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.icon, required this.label, required this.value});
  final IconData icon;
  final String label, value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: AppTheme.textMuted),
          const SizedBox(width: 10),
          SizedBox(width: 110,
            child: Text(label, style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted))),
          Expanded(
            child: Text(value,
              style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w500, color: AppTheme.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}
