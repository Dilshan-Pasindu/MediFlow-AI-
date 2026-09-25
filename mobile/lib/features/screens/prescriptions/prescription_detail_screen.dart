import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';

class PrescriptionDetailScreen extends ConsumerWidget {
  const PrescriptionDetailScreen({super.key, required this.id});
  final int id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rxAsync = ref.watch(prescriptionByIdProvider(id));

    return Scaffold(
      backgroundColor: AppTheme.surfaceDim,
      body: rxAsync.when(
        loading: () => const Center(child: CircularProgressIndicator(color: AppTheme.primaryDeep)),
        error: (e, _) => ErrorState(message: e.toString()),
        data: (rx) => _buildContent(context, rx),
      ),
    );
  }

  Widget _buildContent(BuildContext context, PrescriptionModel rx) {

    return CustomScrollView(
      slivers: [
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
                          child: Text('Prescription Detail',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white),
                          ),
                        ),
                        const SizedBox(width: 48),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
                    child: Row(children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.description_rounded, color: Colors.white, size: 28),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text('Prescription #${rx.id}',
                            style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
                          Text('Dr. ${rx.doctorName}',
                            style: GoogleFonts.outfit(fontSize: 13, color: Colors.white70)),
                          const SizedBox(height: 6),
                          StatusBadge(label: rx.status, bg: Colors.white.withOpacity(0.2), color: Colors.white),
                        ]),
                      ),
                    ]),
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
              // Patient info
              MedCard(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Patient Information',
                      style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 10),
                  _Row(label: 'Patient', value: rx.patientName),
                  if (rx.patientAge != null) _Row(label: 'Age', value: '${rx.patientAge} years'),
                  if (rx.patientGender != null) _Row(label: 'Gender', value: rx.patientGender!),
                  _Row(label: 'Doctor', value: 'Dr. ${rx.doctorName}'),
                  if (rx.doctorSpecialty != null) _Row(label: 'Specialty', value: rx.doctorSpecialty!),
                  if (rx.dateIssued != null) _Row(
                    label: 'Date Issued',
                    value: DateFormat('d MMMM yyyy').format(DateTime.tryParse(rx.dateIssued!) ?? DateTime.now()),
                  ),
                  if (rx.appointmentNumber != null) _Row(label: 'Appointment', value: rx.appointmentNumber!),
                ]),
              ),
              const SizedBox(height: 12),

              // Diagnosis
              if (rx.diagnosis != null && rx.diagnosis!.isNotEmpty) ...[
                MedCard(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Diagnosis', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    Text(rx.diagnosis!,
                        style: GoogleFonts.outfit(fontSize: 14, color: AppTheme.textPrimary, height: 1.5)),
                  ]),
                ),
                const SizedBox(height: 12),
              ],

              // Medicines
              MedCard(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Text('Medicines', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryDeep.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                      ),
                      child: Text('${rx.items.length}',
                          style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.primaryDeep)),
                    ),
                  ]),
                  const SizedBox(height: 12),
                  ...rx.items.asMap().entries.map((e) => _MedicineRow(item: e.value, index: e.key + 1)),
                ]),
              ),
              const SizedBox(height: 12),

              // Instructions
              if (rx.instructions != null && rx.instructions!.isNotEmpty) ...[
                MedCard(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      const Icon(Icons.info_outline_rounded, size: 18, color: AppTheme.primaryDeep),
                      const SizedBox(width: 8),
                      Text('Special Instructions',
                          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                    ]),
                    const SizedBox(height: 8),
                    Text(rx.instructions!,
                        style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary, height: 1.5)),
                  ]),
                ),
                const SizedBox(height: 12),
              ],
            ]),
          ),
        ),
      ],
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.label, required this.value});
  final String label, value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(children: [
        SizedBox(width: 110, child: Text(label, style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted))),
        Expanded(child: Text(value, style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600), textAlign: TextAlign.right)),
      ]),
    );
  }
}

class _MedicineRow extends StatelessWidget {
  const _MedicineRow({required this.item, required this.index});
  final PrescriptionItemModel item;
  final int index;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.surfaceDim,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 28, height: 28,
            decoration: BoxDecoration(
              color: AppTheme.primaryDeep,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Center(child: Text('$index',
                style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white))),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(item.medicineName,
                  style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
              if (item.dosage != null)
                Text('Dosage: ${item.dosage}',
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary)),
              if (item.frequency != null)
                Text('Frequency: ${item.frequency}',
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary)),
              if (item.duration != null)
                Text('Duration: ${item.duration}',
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary)),
              if (item.instructions != null)
                Text(item.instructions!,
                    style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted, fontStyle: FontStyle.italic)),
            ]),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.primaryDeep.withOpacity(0.1),
              borderRadius: BorderRadius.circular(AppTheme.radiusFull),
            ),
            child: Text('Qty: ${item.quantity}',
                style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.primaryDeep)),
          ),
        ],
      ),
    );
  }
}
