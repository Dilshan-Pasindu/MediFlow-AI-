import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';
import 'doctor_profile_screen.dart';
import '../main_shell.dart';

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
      backgroundColor: AppTheme.bgCanvas,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // ── Top Bar (Screen 3 Reference: < Doctors List ... ) ────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _TopCircleButton(
                    icon: Icons.chevron_left_rounded,
                    onTap: () {
                      if (Navigator.of(context).canPop()) {
                        Navigator.of(context).pop();
                      } else {
                        ref.read(shellTabProvider.notifier).state = 0;
                      }
                    },
                  ),
                  Row(
                    children: [
                      AppTheme.macOSWindowDots(size: 8, spacing: 4),
                      const SizedBox(width: 8),
                      Text(
                        'Doctors List',
                        style: GoogleFonts.outfit(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                          letterSpacing: -0.2,
                        ),
                      ),
                    ],
                  ),
                  _TopCircleButton(
                    icon: Icons.more_horiz_rounded,
                    onTap: () => _showSortModal(context),
                  ),
                ],
              ),
            ),

            // ── Search & Filter Bar ──────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(color: AppTheme.cardBorder),
                        boxShadow: AppTheme.cardShadow,
                      ),
                      child: TextField(
                        controller: _searchCtrl,
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          color: AppTheme.textPrimary,
                        ),
                        onChanged: (_) => _applyFilter(),
                        decoration: InputDecoration(
                          hintText: 'Search for doctor...',
                          hintStyle: GoogleFonts.outfit(
                            fontSize: 14,
                            color: AppTheme.textMuted,
                          ),
                          prefixIcon: const Icon(
                            Icons.search_rounded,
                            size: 20,
                            color: AppTheme.textMuted,
                          ),
                          suffixIcon: _searchCtrl.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(
                                    Icons.close_rounded,
                                    size: 18,
                                    color: AppTheme.textMuted,
                                  ),
                                  onPressed: () {
                                    _searchCtrl.clear();
                                    _applyFilter();
                                    setState(() {});
                                  },
                                )
                              : null,
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 14,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  // Filter Slider Button
                  GestureDetector(
                    onTap: () => _showSortModal(context),
                    child: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppTheme.cardBorder),
                        boxShadow: AppTheme.cardShadow,
                      ),
                      child: const Icon(
                        Icons.tune_rounded,
                        color: AppTheme.textPrimary,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ── Specialty Filter Pills ───────────────────────────────────────
            specialtiesAsync.when(
              loading: () => const SizedBox(height: 48),
              error: (_, __) => const SizedBox(),
              data: (specs) => SizedBox(
                height: 46,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: specs.length + 1,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (_, i) {
                    if (i == 0) {
                      return _FilterPill(
                        label: 'All',
                        selected: _selectedSpecialty == null,
                        onTap: () {
                          setState(() => _selectedSpecialty = null);
                          _applyFilter();
                        },
                      );
                    }
                    final sp = specs[i - 1];
                    return _FilterPill(
                      label: sp.name,
                      selected: _selectedSpecialty == sp.id,
                      onTap: () {
                        setState(() => _selectedSpecialty =
                            _selectedSpecialty == sp.id ? null : sp.id);
                        _applyFilter();
                      },
                    );
                  },
                ),
              ),
            ),

            // ── 2-Column Doctor Grid (Screen 3) ──────────────────────────────
            Expanded(
              child: doctorsAsync.when(
                loading: () => GridView.builder(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 110),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.82,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                  ),
                  itemCount: 6,
                  itemBuilder: (_, __) => const ShimmerCard(height: 180),
                ),
                error: (e, _) => ErrorState(
                  message: e.toString(),
                  onRetry: () => ref.invalidate(doctorsProvider),
                ),
                data: (doctors) {
                  final sorted = _sort(doctors);
                  if (sorted.isEmpty) {
                    return const EmptyState(
                      icon: Icons.person_search_outlined,
                      title: 'No doctors found',
                      subtitle: 'Try adjusting your search or filters',
                    );
                  }

                  return GridView.builder(
                    padding: const EdgeInsets.fromLTRB(20, 12, 20, 110),
                    physics: const BouncingScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.82,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                    ),
                    itemCount: sorted.length,
                    itemBuilder: (_, i) {
                      // Alternate highlighted Teal card on every 3rd card (index % 3 == 2)
                      // as depicted in the reference design (Dr. Marvin McKinney)!
                      final isHighlighted = (i % 3 == 2);
                      return _GridDoctorCard(
                        doctor: sorted[i],
                        isHighlighted: isHighlighted,
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => DoctorProfileScreen(id: sorted[i].id),
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showSortModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 20, 24, 30),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppTheme.divider,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Sort Specialists',
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            _SortOption(
              label: 'Highest Rating',
              selected: _sortBy == 'rating',
              onTap: () {
                setState(() => _sortBy = 'rating');
                Navigator.pop(ctx);
              },
            ),
            _SortOption(
              label: 'Most Experienced',
              selected: _sortBy == 'experience',
              onTap: () {
                setState(() => _sortBy = 'experience');
                Navigator.pop(ctx);
              },
            ),
            _SortOption(
              label: 'Consultation Fee (Low to High)',
              selected: _sortBy == 'fee_asc',
              onTap: () {
                setState(() => _sortBy = 'fee_asc');
                Navigator.pop(ctx);
              },
            ),
            _SortOption(
              label: 'Consultation Fee (High to Low)',
              selected: _sortBy == 'fee_desc',
              onTap: () {
                setState(() => _sortBy = 'fee_desc');
                Navigator.pop(ctx);
              },
            ),
          ],
        ),
      ),
    );
  }

  List<DoctorModel> _sort(List<DoctorModel> docs) {
    final copy = List<DoctorModel>.from(docs);
    switch (_sortBy) {
      case 'rating':
        copy.sort((a, b) => b.averageRating.compareTo(a.averageRating));
      case 'experience':
        copy.sort((a, b) => (b.experienceYears ?? 0).compareTo(a.experienceYears ?? 0));
      case 'fee_asc':
        copy.sort((a, b) => (a.consultationFee ?? 0).compareTo(b.consultationFee ?? 0));
      case 'fee_desc':
        copy.sort((a, b) => (b.consultationFee ?? 0).compareTo(a.consultationFee ?? 0));
    }
    return copy;
  }
}

// ── Top Circle Button ─────────────────────────────────────────────────────────
class _TopCircleButton extends StatelessWidget {
  const _TopCircleButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: AppTheme.cardBorder),
          boxShadow: AppTheme.cardShadow,
        ),
        child: Icon(icon, color: AppTheme.textPrimary, size: 20),
      ),
    );
  }
}

// ── Filter Pill ───────────────────────────────────────────────────────────────
class _FilterPill extends StatelessWidget {
  const _FilterPill({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? AppTheme.primaryBlue : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: selected ? AppTheme.primaryBlue : AppTheme.cardBorder,
          ),
          boxShadow: selected ? AppTheme.blueShadow : AppTheme.cardShadow,
        ),
        child: Center(
          child: Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
              color: selected ? Colors.white : AppTheme.textSecondary,
            ),
          ),
        ),
      ),
    );
  }
}

// ── 2-Column Doctor Grid Card (Screen 3) ──────────────────────────────────────
class _GridDoctorCard extends StatelessWidget {
  const _GridDoctorCard({
    required this.doctor,
    required this.isHighlighted,
    required this.onTap,
  });

  final DoctorModel doctor;
  final bool isHighlighted;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bgColor = isHighlighted ? AppTheme.primaryBlue : Colors.white;
    final nameColor = isHighlighted ? Colors.white : AppTheme.textPrimary;
    final specialtyColor = isHighlighted ? const Color(0xFFBDD0F8) : AppTheme.textSecondary;
    final reviewColor = isHighlighted ? Colors.white70 : AppTheme.textMuted;
    final arrowBg = isHighlighted ? Colors.white : AppTheme.primaryBlue50;
    final arrowColor = isHighlighted ? AppTheme.primaryBlue : AppTheme.primaryBlue;

    final rating = doctor.averageRating > 0 ? doctor.averageRating : 4.8;
    final reviews = doctor.reviewCount > 0 ? doctor.reviewCount : 85;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(26),
          border: Border.all(
            color: isHighlighted ? AppTheme.primaryBlue : AppTheme.cardBorder,
          ),
          boxShadow: isHighlighted ? AppTheme.blueShadow : AppTheme.cardShadow,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Avatar
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isHighlighted
                          ? Colors.white.withValues(alpha: 0.6)
                          : AppTheme.cardBorder,
                      width: 2,
                    ),
                  ),
                  child: ClipOval(
                    child: (doctor.profilePhoto != null && doctor.profilePhoto!.isNotEmpty)
                        ? Image.network(
                            doctor.profilePhoto!,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => _buildFallbackAvatar(),
                          )
                        : _buildFallbackAvatar(),
                  ),
                ),
              ],
            ),
            const Spacer(),

            // Doctor Name & Specialty
            Text(
              doctor.fullName,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.outfit(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: nameColor,
                letterSpacing: -0.2,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              doctor.primarySpecialty,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: specialtyColor,
              ),
            ),
            const Spacer(),

            // Rating & Action Arrow Button
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.star_rounded,
                            size: 15,
                            color: AppTheme.starGold,
                          ),
                          const SizedBox(width: 3),
                          Text(
                            rating.toStringAsFixed(1),
                            style: GoogleFonts.outfit(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: isHighlighted ? Colors.white : AppTheme.textPrimary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 1),
                      Text(
                        '$reviews Reviews',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                          color: reviewColor,
                        ),
                      ),
                    ],
                  ),
                ),
                // Circular Action Arrow Button ( ↗ )
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: arrowBg,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.arrow_outward_rounded,
                    color: arrowColor,
                    size: 16,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFallbackAvatar() {
    return Container(
      color: isHighlighted
          ? Colors.white.withValues(alpha: 0.2)
          : AppTheme.primaryBlue.withValues(alpha: 0.1),
      child: Center(
        child: Text(
          doctor.fullName.isNotEmpty ? doctor.fullName[0].toUpperCase() : 'D',
          style: GoogleFonts.outfit(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: isHighlighted ? Colors.white : AppTheme.primaryBlue,
          ),
        ),
      ),
    );
  }
}

class _SortOption extends StatelessWidget {
  const _SortOption({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      onTap: onTap,
      title: Text(
        label,
        style: GoogleFonts.outfit(
          fontSize: 14,
          fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
          color: selected ? AppTheme.primaryBlue : AppTheme.textPrimary,
        ),
      ),
      trailing: selected
          ? const Icon(Icons.check_circle_rounded, color: AppTheme.primaryBlue)
          : null,
    );
  }
}
