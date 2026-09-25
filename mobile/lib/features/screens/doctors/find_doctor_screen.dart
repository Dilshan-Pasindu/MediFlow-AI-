import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';
import 'doctor_profile_screen.dart';

class FindDoctorScreen extends ConsumerStatefulWidget {
  const FindDoctorScreen({super.key});

  @override
  ConsumerState<FindDoctorScreen> createState() => _FindDoctorScreenState();
}

class _FindDoctorScreenState extends ConsumerState<FindDoctorScreen> {
  final _searchCtrl = TextEditingController();
  int? _selectedSpecialty;
  String _sortBy = 'rating';

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  void _applyFilter() {
    ref.read(doctorFilterProvider.notifier).state = DoctorFilter(
      specialtyId: _selectedSpecialty,
      search: _searchCtrl.text.trim().isEmpty ? null : _searchCtrl.text.trim(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final doctorsAsync = ref.watch(doctorsProvider);
    final specialtiesAsync = ref.watch(specialtiesProvider);

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
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Find a Doctor',
                        style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                      Text('Browse verified specialists',
                        style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70)),
                      const SizedBox(height: 16),
                      // Search bar
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                          boxShadow: AppTheme.cardShadow,
                        ),
                        child: TextField(
                          controller: _searchCtrl,
                          style: GoogleFonts.outfit(fontSize: 14),
                          onChanged: (_) => _applyFilter(),
                          decoration: InputDecoration(
                            hintText: 'Search by doctor name...',
                            hintStyle: GoogleFonts.outfit(fontSize: 14, color: AppTheme.textMuted),
                            prefixIcon: const Icon(Icons.search_rounded, size: 20, color: AppTheme.textMuted),
                            suffixIcon: _searchCtrl.text.isNotEmpty
                                ? IconButton(
                                    icon: const Icon(Icons.close_rounded, size: 18, color: AppTheme.textMuted),
                                    onPressed: () { _searchCtrl.clear(); _applyFilter(); setState(() {}); },
                                  )
                                : null,
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
        body: Column(
          children: [
            // Specialty chips
            specialtiesAsync.when(
              loading: () => const SizedBox(height: 60),
              error: (_, __) => const SizedBox(),
              data: (specs) => SizedBox(
                height: 52,
                child: ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 8),
                  scrollDirection: Axis.horizontal,
                  itemCount: specs.length + 1,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (_, i) {
                    if (i == 0) {
                      return _SpecialtyChip(
                        label: 'All',
                        selected: _selectedSpecialty == null,
                        onTap: () { setState(() => _selectedSpecialty = null); _applyFilter(); },
                      );
                    }
                    final sp = specs[i - 1];
                    return _SpecialtyChip(
                      label: sp.name,
                      selected: _selectedSpecialty == sp.id,
                      onTap: () {
                        setState(() => _selectedSpecialty = _selectedSpecialty == sp.id ? null : sp.id);
                        _applyFilter();
                      },
                    );
                  },
                ),
              ),
            ),

            // Sort row
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
              child: Row(
                children: [
                  doctorsAsync.when(
                    data: (d) => Text('${d.length} doctors found',
                        style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted)),
                    loading: () => const SizedBox(),
                    error: (_, __) => const SizedBox(),
                  ),
                  const Spacer(),
                  DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _sortBy,
                      style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textPrimary),
                      isDense: true,
                      items: const [
                        DropdownMenuItem(value: 'rating', child: Text('Best Rating')),
                        DropdownMenuItem(value: 'experience', child: Text('Experience')),
                        DropdownMenuItem(value: 'fee_asc', child: Text('Fee: Low→High')),
                        DropdownMenuItem(value: 'fee_desc', child: Text('Fee: High→Low')),
                      ],
                      onChanged: (v) => setState(() => _sortBy = v!),
                    ),
                  ),
                ],
              ),
            ),

            // Doctor list
            Expanded(
              child: doctorsAsync.when(
                loading: () => ListView(
                  padding: const EdgeInsets.all(16),
                  children: List.generate(4, (_) => const ShimmerCard(height: 120)),
                ),
                error: (e, _) => ErrorState(
                  message: e.toString(),
                  onRetry: () => ref.invalidate(doctorsProvider),
                ),
                data: (doctors) {
                  final sorted = _sort(doctors);
                  if (sorted.isEmpty) {
                    return EmptyState(
                      icon: Icons.person_search_outlined,
                      title: 'No doctors found',
                      subtitle: 'Try adjusting your search or filters',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                    itemCount: sorted.length,
                    itemBuilder: (_, i) => _DoctorCard(doctor: sorted[i]),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<DoctorModel> _sort(List<DoctorModel> docs) {
    final copy = List<DoctorModel>.from(docs);
    switch (_sortBy) {
      case 'rating': copy.sort((a, b) => b.averageRating.compareTo(a.averageRating));
      case 'experience': copy.sort((a, b) => (b.experienceYears ?? 0).compareTo(a.experienceYears ?? 0));
      case 'fee_asc': copy.sort((a, b) => (a.consultationFee ?? 0).compareTo(b.consultationFee ?? 0));
      case 'fee_desc': copy.sort((a, b) => (b.consultationFee ?? 0).compareTo(a.consultationFee ?? 0));
    }
    return copy;
  }
}

class _SpecialtyChip extends StatelessWidget {
  const _SpecialtyChip({required this.label, required this.selected, required this.onTap});
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: selected ? AppTheme.primaryDeep : Colors.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusFull),
          border: Border.all(color: selected ? AppTheme.primaryDeep : AppTheme.divider),
        ),
        child: Text(label,
          style: GoogleFonts.outfit(
            fontSize: 12, fontWeight: FontWeight.w600,
            color: selected ? Colors.white : AppTheme.textSecondary,
          ),
        ),
      ),
    );
  }
}

class _DoctorCard extends StatelessWidget {
  const _DoctorCard({required this.doctor});
  final DoctorModel doctor;

  @override
  Widget build(BuildContext context) {
    return MedCard(
      margin: const EdgeInsets.only(bottom: 12),
      onTap: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => DoctorProfileScreen(id: doctor.id))),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DoctorAvatar(photoUrl: doctor.profilePhoto, name: doctor.fullName, radius: 32),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(doctor.fullName,
                    style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700)),
                Text(doctor.primarySpecialty,
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.primaryDeep, fontWeight: FontWeight.w500)),
                if (doctor.qualifications != null && doctor.qualifications!.isNotEmpty)
                  Text(doctor.qualifications!,
                    style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                    maxLines: 1, overflow: TextOverflow.ellipsis,
                  ),
                const SizedBox(height: 8),
                Row(children: [
                  StarRating(rating: doctor.averageRating),
                  const SizedBox(width: 4),
                  Text('${doctor.averageRating.toStringAsFixed(1)} (${doctor.reviewCount})',
                      style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
                  const Spacer(),
                  if (doctor.consultationFee != null)
                    Text('Rs. ${doctor.consultationFee!.toStringAsFixed(0)}',
                        style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.primaryDeep)),
                ]),
                if (doctor.hospitalClinic != null) ...[
                  const SizedBox(height: 4),
                  Row(children: [
                    const Icon(Icons.location_on_outlined, size: 12, color: AppTheme.textMuted),
                    const SizedBox(width: 3),
                    Expanded(
                      child: Text(doctor.hospitalClinic!,
                        style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                        maxLines: 1, overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ]),
                ],
              ],
            ),
          ),
          const Icon(Icons.chevron_right_rounded, color: AppTheme.textMuted, size: 20),
        ],
      ),
    );
  }
}
