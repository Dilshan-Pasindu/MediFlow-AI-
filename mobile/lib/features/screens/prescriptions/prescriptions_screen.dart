import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';
import 'prescription_detail_screen.dart';

class PrescriptionsScreen extends ConsumerWidget {
  const PrescriptionsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rxsAsync = ref.watch(myPrescriptionsProvider);

    return Scaffold(
      backgroundColor: AppTheme.surfaceDim,
      body: CustomScrollView(
        slivers: [
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
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('E-Prescriptions',
                        style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                      Text('Your digital prescriptions',
                        style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70)),
                      const SizedBox(height: 16),
                      rxsAsync.when(
                        loading: () => const SizedBox(),
                        error: (_, __) => const SizedBox(),
                        data: (rxs) {
                          final active = rxs.where((r) => r.status == 'Active').length;
                          final fulfilled = rxs.where((r) => r.status == 'Fulfilled').length;
                          return Row(children: [
                            Expanded(child: _StatBubble(value: '$active', label: 'Active')),
                            const SizedBox(width: 10),
                            Expanded(child: _StatBubble(value: '$fulfilled', label: 'Fulfilled')),
                            const SizedBox(width: 10),
                            Expanded(child: _StatBubble(value: '${rxs.length}', label: 'Total')),
                          ]);
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          rxsAsync.when(
            loading: () => SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (_, __) => const ShimmerCard(height: 100),
                  childCount: 4,
                ),
              ),
            ),
            error: (e, _) => SliverFillRemaining(
              child: ErrorState(
                message: e.toString(),
                onRetry: () => ref.invalidate(myPrescriptionsProvider),
              ),
            ),
            data: (rxs) {
              if (rxs.isEmpty) {
                return const SliverFillRemaining(
                  child: EmptyState(
                    icon: Icons.medication_outlined,
                    title: 'No prescriptions yet',
                    subtitle: 'Your doctor will issue prescriptions after consultations',
                  ),
                );
              }
              return SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (_, i) => _PrescriptionCard(rx: rxs[i]),
                    childCount: rxs.length,
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _StatBubble extends StatelessWidget {
  const _StatBubble({required this.value, required this.label});
  final String value, label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.18)),
      ),
      child: Column(
        children: [
          Text(value, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
          Text(label, style: GoogleFonts.outfit(fontSize: 11, color: Colors.white70)),
        ],
      ),
    );
  }
}

class _PrescriptionCard extends StatelessWidget {
  const _PrescriptionCard({required this.rx});
  final PrescriptionModel rx;

  @override
  Widget build(BuildContext context) {
    final st = AppTheme.prescriptionStatus(rx.status);

    return MedCard(
      margin: const EdgeInsets.only(bottom: 12),
      onTap: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => PrescriptionDetailScreen(id: rx.id))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppTheme.primaryDeep.withOpacity(0.08),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.description_outlined, color: AppTheme.primaryDeep, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Prescription #${rx.id}',
                      style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                  Text('Dr. ${rx.doctorName}',
                      style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary)),
                ],
              ),
            ),
            StatusBadge(label: rx.status, bg: st.bg, color: st.text),
          ]),
          const Divider(height: 20),
          Row(children: [
            if (rx.diagnosis != null && rx.diagnosis!.isNotEmpty) ...[
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Diagnosis', style: GoogleFonts.outfit(fontSize: 10, color: AppTheme.textMuted)),
                Text(rx.diagnosis!, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600),
                    maxLines: 1, overflow: TextOverflow.ellipsis),
              ])),
            ],
            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text('${rx.itemCount} medicine${rx.itemCount != 1 ? 's' : ''}',
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
              if (rx.dateIssued != null)
                Text(
                  DateFormat('d MMM yyyy').format(DateTime.tryParse(rx.dateIssued!) ?? DateTime.now()),
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                ),
            ]),
            const SizedBox(width: 8),
            const Icon(Icons.chevron_right_rounded, color: AppTheme.textMuted, size: 18),
          ]),
        ],
      ),
    );
  }
}
