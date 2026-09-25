import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';
import '../doctors/find_doctor_screen.dart';
import '../doctors/doctor_profile_screen.dart';

// ── Provider ─────────────────────────────────────────────────────────────────

final specialtiesForAiProvider = FutureProvider<List<SpecialtyModel>>((ref) async {
  final data = await ApiClient.instance.get('/doctors/specialties') as List<dynamic>;
  return data.map((j) => SpecialtyModel.fromJson(j as Map<String, dynamic>)).toList();
});

// ── Screen ────────────────────────────────────────────────────────────────────

/// AI Symptom Checker & Clinical Triage Center (macOS Medical Theme)
/// Mirrors the website SymptomAIPage:
///  - AI Clinical Domain Mapping
///  - Emergency Red Flag Screening
///  - Confidence scoring & alternative specialty routing
///  - Ranked specialist directory match
class SymptomAiScreen extends ConsumerStatefulWidget {
  const SymptomAiScreen({super.key});

  @override
  ConsumerState<SymptomAiScreen> createState() => _SymptomAiScreenState();
}

class _SymptomAiScreenState extends ConsumerState<SymptomAiScreen> {
  final _symptomsCtrl = TextEditingController();
  final _durationCtrl = TextEditingController();
  double _severity = 5;
  _Step _step = _Step.input;
  String? _error;
  SymptomResultModel? _result;
  List<DoctorModel> _recommendedDoctors = [];

  @override
  void dispose() {
    _symptomsCtrl.dispose();
    _durationCtrl.dispose();
    super.dispose();
  }

  String get _severityLabel {
    if (_severity <= 3) return 'Mild';
    if (_severity <= 6) return 'Moderate';
    return 'Severe';
  }

  Color get _severityColor {
    if (_severity <= 3) return const Color(0xFF0284C7);
    if (_severity <= 6) return const Color(0xFFF59E0B);
    return const Color(0xFFEF4444);
  }

  Future<void> _analyze() async {
    final text = _symptomsCtrl.text.trim();
    if (text.length < 10) {
      setState(() => _error = 'Please describe your symptoms in more detail (at least 10 characters).');
      return;
    }
    setState(() { _step = _Step.analyzing; _error = null; });

    try {
      final data = await ApiClient.instance.post('/patient/symptoms', body: {
        'symptoms': text,
        'duration': _durationCtrl.text.trim().isEmpty ? null : _durationCtrl.text.trim(),
        'severity': _severityLabel,
      }) as Map<String, dynamic>;

      final result = SymptomResultModel.fromJson(data);

      // Fetch recommended doctors for the specialty
      List<DoctorModel> doctors = [];
      try {
        final specs = await ApiClient.instance.get('/doctors/specialties') as List<dynamic>;
        final specModels = specs.map((j) => SpecialtyModel.fromJson(j as Map<String, dynamic>)).toList();
        final matchedSpec = specModels.firstWhere(
          (s) => s.name.toLowerCase().contains(result.specialty.toLowerCase()) ||
                 result.specialty.toLowerCase().contains(s.name.toLowerCase()),
          orElse: () => const SpecialtyModel(id: 0, name: ''),
        );
        final qryData = await ApiClient.instance.get('/doctors/ranked',
            query: matchedSpec.id > 0 ? {'specialty': matchedSpec.id} : {}) as List<dynamic>;
        doctors = qryData.map((j) => DoctorModel.fromJson(j as Map<String, dynamic>)).toList();
      } catch (_) {}

      setState(() {
        _result = result;
        _recommendedDoctors = doctors;
        _step = _Step.result;
      });
    } catch (e) {
      setState(() {
        _step = _Step.input;
        _error = e.toString().replaceFirst('ApiException(', '').replaceAll('): ', ': ');
      });
    }
  }

  void _reset() {
    setState(() {
      _step = _Step.input;
      _result = null;
      _recommendedDoctors = [];
      _error = null;
      _symptomsCtrl.clear();
      _durationCtrl.clear();
      _severity = 5;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppTheme.bgCanvas,
              shape: BoxShape.circle,
              border: Border.all(color: AppTheme.cardBorder),
            ),
            child: const Icon(Icons.arrow_back_rounded, size: 18, color: AppTheme.textPrimary),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                AppTheme.macOSWindowDots(size: 9, spacing: 4),
                const SizedBox(width: 8),
                Text(
                  'AI Symptom Checker',
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ],
            ),
            Text(
              'Clinical Triage & Specialist Recommendation',
              style: GoogleFonts.outfit(
                fontSize: 11,
                color: AppTheme.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        actions: [
          if (_step == _Step.result)
            TextButton.icon(
              onPressed: _reset,
              icon: const Icon(Icons.refresh_rounded, size: 16, color: AppTheme.primaryBlue),
              label: Text(
                'Reset',
                style: GoogleFonts.outfit(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.primaryBlue,
                ),
              ),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 350),
        child: switch (_step) {
          _Step.input => _InputView(
              key: const ValueKey('input'),
              symptomsCtrl: _symptomsCtrl,
              durationCtrl: _durationCtrl,
              severity: _severity,
              severityLabel: _severityLabel,
              severityColor: _severityColor,
              onSeverityChanged: (v) => setState(() => _severity = v),
              onAnalyze: _analyze,
              error: _error,
            ),
          _Step.analyzing => const _AnalyzingView(key: ValueKey('analyzing')),
          _Step.result => _ResultView(
              key: const ValueKey('result'),
              result: _result!,
              doctors: _recommendedDoctors,
              onReset: _reset,
            ),
        },
      ),
    );
  }
}

enum _Step { input, analyzing, result }

// ── Input View ────────────────────────────────────────────────────────────────

class _InputView extends StatelessWidget {
  const _InputView({
    super.key,
    required this.symptomsCtrl,
    required this.durationCtrl,
    required this.severity,
    required this.severityLabel,
    required this.severityColor,
    required this.onSeverityChanged,
    required this.onAnalyze,
    this.error,
  });

  final TextEditingController symptomsCtrl, durationCtrl;
  final double severity;
  final String severityLabel;
  final Color severityColor;
  final void Function(double) onSeverityChanged;
  final VoidCallback onAnalyze;
  final String? error;

  static const _quickExamples = [
    'Chest pain and palpitations',
    'Severe headache and dizziness',
    'Skin rash and itching',
    'Shortness of breath',
    'Stomach pain, bloating, acid reflux',
    'Joint pain and swelling',
  ];

  static const _durationPresets = [
    '1 day',
    '3 days',
    '1 week',
    '2 weeks',
    '1 month',
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (error != null) ...[
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFFECACA)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline_rounded, color: Color(0xFFEF4444), size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      error!,
                      style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFFDC2626)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
          ],

          // ── Describe Symptoms Card ──
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.cardBorder),
              boxShadow: AppTheme.macOSShadow,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Describe Your Symptoms',
                      style: GoogleFonts.outfit(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryBlue50,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'AI Triage',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.primaryBlue,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Mention pain intensity, location, and any accompanying discomfort.',
                  style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: symptomsCtrl,
                  maxLines: 5,
                  maxLength: 2000,
                  style: GoogleFonts.outfit(fontSize: 14, color: AppTheme.textPrimary),
                  decoration: InputDecoration(
                    hintText: 'e.g., I have had sharp chest pain for 3 days with shortness of breath when climbing stairs...',
                    hintStyle: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textMuted),
                    filled: true,
                    fillColor: AppTheme.surface2,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: AppTheme.cardBorder),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: AppTheme.cardBorder),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: AppTheme.primaryBlue, width: 1.8),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // ── Quick Examples ──
          Text(
            'Common Clinical Symptoms',
            style: GoogleFonts.outfit(
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _quickExamples.map((ex) {
              return GestureDetector(
                onTap: () => symptomsCtrl.text = ex,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.cardBorder),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 4,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.add_rounded, size: 14, color: AppTheme.primaryBlue),
                      const SizedBox(width: 4),
                      Text(
                        ex,
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 16),

          // ── Duration and Severity Card ──
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.cardBorder),
              boxShadow: AppTheme.macOSShadow,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Duration
                Text(
                  'How long have you experienced this?',
                  style: GoogleFonts.outfit(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: _durationPresets.map((dur) {
                    final isSelected = durationCtrl.text == dur;
                    return GestureDetector(
                      onTap: () => durationCtrl.text = dur,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: isSelected ? AppTheme.primaryBlue : AppTheme.surface2,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          dur,
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

                const Divider(height: 24),

                // Severity
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Symptom Severity',
                      style: GoogleFonts.outfit(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: severityColor.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '$severityLabel (${severity.toInt()}/10)',
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: severityColor,
                        ),
                      ),
                    ),
                  ],
                ),
                Slider(
                  value: severity,
                  min: 1,
                  max: 10,
                  divisions: 9,
                  activeColor: severityColor,
                  inactiveColor: AppTheme.surface2,
                  onChanged: onSeverityChanged,
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // ── Analyze Button ──
          ElevatedButton(
            onPressed: onAnalyze,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryBlue,
              foregroundColor: Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              shadowColor: Colors.transparent,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.auto_awesome_rounded, size: 18),
                const SizedBox(width: 8),
                Text(
                  'Analyze Symptoms with AI',
                  style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w800),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '🔒 Secure clinical AI analysis. For guidance only; does not replace emergency medical care.',
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
          ),
        ],
      ),
    );
  }
}

// ── Analyzing View ────────────────────────────────────────────────────────────

class _AnalyzingView extends StatelessWidget {
  const _AnalyzingView({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Container(
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.cardBorder),
            boxShadow: AppTheme.macOSShadow,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.psychology_rounded,
                  color: AppTheme.primaryBlue,
                  size: 38,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Analyzing Symptoms...',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Mapping clinical indications to specialist medical fields and screening emergency red flags.',
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: 13,
                  color: AppTheme.textSecondary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 24),
              const CircularProgressIndicator(color: AppTheme.primaryBlue),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Result View ───────────────────────────────────────────────────────────────

class _ResultView extends StatelessWidget {
  const _ResultView({
    super.key,
    required this.result,
    required this.doctors,
    required this.onReset,
  });

  final SymptomResultModel result;
  final List<DoctorModel> doctors;
  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ── Safety Emergency Warning (If Crisis Detected) ──
          if (result.isCrisis) ...[
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFFECACA), width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.warning_rounded, color: Color(0xFFDC2626), size: 22),
                      const SizedBox(width: 8),
                      Text(
                        'CRITICAL SAFETY SCREENING ALERT',
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFFDC2626),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    result.reason,
                    style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFF991B1B), height: 1.4),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Emergency Helpline: Call 1990 (Ambulance) or visit the nearest ER immediately.',
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFFDC2626),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          // ── Main Recommendation Card (macOS Medical Hero) ──
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF2A7DE1), Color(0xFF1565C0)],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.35),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.verified_rounded, size: 14, color: Colors.white),
                          const SizedBox(width: 5),
                          Text(
                            'Clinical Recommendation',
                            style: GoogleFonts.outfit(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '${result.confidence}% Match',
                      style: GoogleFonts.outfit(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF81E6D9),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'Consult a ${result.specialty} Specialist',
                  style: GoogleFonts.outfit(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: result.confidence / 100,
                    backgroundColor: Colors.white.withValues(alpha: 0.2),
                    valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF4FD1C5)),
                    minHeight: 6,
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  result.reason,
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    color: Colors.white.withValues(alpha: 0.9),
                    height: 1.45,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // ── Alternative Specialty ──
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.cardBorder),
              boxShadow: AppTheme.macOSShadow,
            ),
            child: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: AppTheme.surface2,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.alt_route_rounded, size: 20, color: AppTheme.textSecondary),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Alternative Clinical Route',
                        style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                      ),
                      Text(
                        result.altSpecialty,
                        style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                      ),
                    ],
                  ),
                ),
                Text(
                  '${result.altConfidence}%',
                  style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.primaryBlue),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // ── Recommended Doctors in This Specialty ──
          if (doctors.isNotEmpty) ...[
            Text(
              'Available ${result.specialty} Specialists',
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            ...doctors.take(3).map((doc) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppTheme.cardBorder),
                    boxShadow: AppTheme.macOSShadow,
                  ),
                  child: Row(
                    children: [
                      DoctorAvatar(photoUrl: doc.profilePhoto, name: doc.fullName, radius: 26),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              doc.fullName,
                              style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.w800, color: AppTheme.textPrimary),
                            ),
                            Text(
                              doc.hospitalClinic ?? doc.primarySpecialty,
                              style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary),
                            ),
                            Row(
                              children: [
                                const Icon(Icons.star_rounded, size: 14, color: AppTheme.starGold),
                                const SizedBox(width: 3),
                                Text(
                                  doc.averageRating.toStringAsFixed(1),
                                  style: GoogleFonts.outfit(fontSize: 11.5, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () => Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => DoctorProfileScreen(id: doc.id)),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryBlue,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Book',
                          style: GoogleFonts.outfit(fontSize: 12.5, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ],
                  ),
                )),
          ],

          const SizedBox(height: 16),

          OutlinedButton.icon(
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const FindDoctorScreen()),
            ),
            icon: const Icon(Icons.search_rounded, size: 18),
            label: const Text('Browse All Doctors'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.primaryBlue,
              side: const BorderSide(color: AppTheme.primaryBlue),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              textStyle: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(height: 10),
          TextButton.icon(
            onPressed: onReset,
            icon: const Icon(Icons.refresh_rounded, size: 16),
            label: Text(
              'Analyze Different Symptoms',
              style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
            ),
          ),
        ],
      ),
    );
  }
}
