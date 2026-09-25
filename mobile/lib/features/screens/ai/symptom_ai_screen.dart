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
    if (_severity <= 3) return const Color(0xFF0EA5E9);
    if (_severity <= 6) return const Color(0xFFF59E0B);
    return AppTheme.statusInConsult;
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
      setState(() { _step = _Step.input; _error = e.toString().replaceFirst('ApiException(', '').replaceAll('): ', ': '); });
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
      backgroundColor: AppTheme.surfaceDim,
      body: Column(
        children: [
          // Header
          Container(
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
                padding: const EdgeInsets.fromLTRB(4, 8, 16, 20),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    Expanded(
                      child: Column(children: [
                        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: AppTheme.accentGreen,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Icon(Icons.psychology_rounded, color: AppTheme.textPrimary, size: 14),
                          ),
                          const SizedBox(width: 6),
                          Text('AI Symptom Analysis',
                            style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white)),
                        ]),
                        Text('Powered by MediFlow Clinical AI',
                          style: GoogleFonts.outfit(fontSize: 11, color: Colors.white60)),
                      ]),
                    ),
                    if (_step == _Step.result)
                      TextButton.icon(
                        onPressed: _reset,
                        icon: const Icon(Icons.refresh_rounded, color: Colors.white, size: 16),
                        label: Text('Reset', style: GoogleFonts.outfit(color: Colors.white, fontSize: 12)),
                      )
                    else
                      const SizedBox(width: 48),
                  ],
                ),
              ),
            ),
          ),

          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 400),
              child: switch (_step) {
                _Step.input    => _InputView(
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
                _Step.result    => _ResultView(
                    key: const ValueKey('result'),
                    result: _result!,
                    doctors: _recommendedDoctors,
                    onReset: _reset,
                  ),
              },
            ),
          ),
        ],
      ),
    );
  }
}

enum _Step { input, analyzing, result }

// ── Input View ────────────────────────────────────────────────────────────────

class _InputView extends StatelessWidget {
  const _InputView({
    super.key, required this.symptomsCtrl, required this.durationCtrl,
    required this.severity, required this.severityLabel, required this.severityColor,
    required this.onSeverityChanged, required this.onAnalyze, this.error,
  });

  final TextEditingController symptomsCtrl, durationCtrl;
  final double severity;
  final String severityLabel;
  final Color severityColor;
  final void Function(double) onSeverityChanged;
  final VoidCallback onAnalyze;
  final String? error;

  static const _examples = [
    'Chest pain and palpitations',
    'Severe headache and dizziness',
    'Skin rash and itching',
    'Shortness of breath',
    'Stomach pain and acid reflux',
    'Joint pain and swelling',
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (error != null) ...[
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
                Expanded(child: Text(error!,
                    style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.statusInConsult))),
              ]),
            ),
            const SizedBox(height: 12),
          ],

          // Symptoms textarea
          MedCard(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Describe Your Symptoms',
                  style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text('Be as specific as possible for better AI recommendations',
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
              const SizedBox(height: 12),
              TextFormField(
                controller: symptomsCtrl,
                maxLines: 5,
                maxLength: 2000,
                style: GoogleFonts.outfit(fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'e.g. I have had chest pain for 3 days, along with shortness of breath...',
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
          const SizedBox(height: 10),

          // Quick examples
          Wrap(
            spacing: 8, runSpacing: 6,
            children: _examples.map((ex) => ActionChip(
              label: Text(ex, style: GoogleFonts.outfit(fontSize: 11)),
              onPressed: () => symptomsCtrl.text = ex,
              backgroundColor: AppTheme.surface,
              side: const BorderSide(color: AppTheme.divider),
              padding: const EdgeInsets.symmetric(horizontal: 4),
            )).toList(),
          ),
          const SizedBox(height: 12),

          // Duration & Severity row
          Row(children: [
            Expanded(
              child: MedCard(
                padding: const EdgeInsets.all(12),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Duration', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: durationCtrl,
                    style: GoogleFonts.outfit(fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'e.g. 3 days',
                      hintStyle: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted),
                      isDense: true,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: const BorderSide(color: AppTheme.divider),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: const BorderSide(color: AppTheme.primaryDeep, width: 2),
                      ),
                      filled: true, fillColor: AppTheme.surfaceDim,
                    ),
                  ),
                ]),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: MedCard(
                padding: const EdgeInsets.all(12),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Text('Severity', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700)),
                    const Spacer(),
                    Text(severityLabel,
                        style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: severityColor)),
                  ]),
                  Slider(
                    value: severity,
                    min: 1, max: 10, divisions: 9,
                    activeColor: severityColor,
                    onChanged: onSeverityChanged,
                  ),
                ]),
              ),
            ),
          ]),
          const SizedBox(height: 20),

          MedPrimaryButton(
            label: 'Analyze Symptoms with AI',
            onPressed: onAnalyze,
            icon: Icons.psychology_rounded,
          ),
          const SizedBox(height: 12),
          Text(
            '⚠️ This AI analysis is for guidance only and does not replace professional medical advice.',
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
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 80, height: 80,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2D2BE8), Color(0xFF6C3AE0)],
              ),
              shape: BoxShape.circle,
              boxShadow: [BoxShadow(color: AppTheme.primaryDeep.withOpacity(0.4), blurRadius: 20, offset: const Offset(0, 8))],
            ),
            child: const Icon(Icons.psychology_rounded, color: Colors.white, size: 40),
          ),
          const SizedBox(height: 24),
          Text('Analyzing Symptoms…',
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
          const SizedBox(height: 8),
          Text('Our AI is mapping your symptoms to clinical specialties',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary)),
          const SizedBox(height: 24),
          const CircularProgressIndicator(color: AppTheme.primaryDeep),
        ],
      ),
    );
  }
}

// ── Result View ───────────────────────────────────────────────────────────────

class _ResultView extends StatelessWidget {
  const _ResultView({super.key, required this.result, required this.doctors, required this.onReset});
  final SymptomResultModel result;
  final List<DoctorModel> doctors;
  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Crisis alert
          if (result.isCrisis) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.statusInConsult.withOpacity(0.12),
                borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                border: Border.all(color: AppTheme.statusInConsult.withOpacity(0.4), width: 1.5),
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  const Icon(Icons.warning_amber_rounded, color: AppTheme.statusInConsult, size: 22),
                  const SizedBox(width: 8),
                  Text('⚠️ CRITICAL SAFETY ALERT',
                      style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.statusInConsult)),
                ]),
                const SizedBox(height: 8),
                Text(result.reason, style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.statusInConsult, height: 1.5)),
                const SizedBox(height: 12),
                Text('Emergency contacts: Call 1926 (SL Mental Health) or 1990 (Ambulance)',
                    style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.statusInConsult)),
              ]),
            ),
            const SizedBox(height: 12),
          ],

          // Primary recommendation
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft, end: Alignment.bottomRight,
                colors: [Color(0xFF2D2BE8), Color(0xFF6C3AE0)],
              ),
              borderRadius: BorderRadius.circular(AppTheme.radiusXl),
              boxShadow: AppTheme.elevatedShadow,
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppTheme.accentGreen,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.psychology_rounded, color: AppTheme.textPrimary, size: 16),
                ),
                const SizedBox(width: 8),
                Text('AI Recommendation',
                    style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600)),
              ]),
              const SizedBox(height: 12),
              Text('See a ${result.specialty} Specialist',
                style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white),
              ),
              const SizedBox(height: 6),
              Text('${result.confidence}% confidence',
                  style: GoogleFonts.outfit(fontSize: 13, color: Colors.white70)),
              const SizedBox(height: 12),
              // Confidence bar
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: result.confidence / 100,
                  backgroundColor: Colors.white.withOpacity(0.2),
                  valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.accentGreen),
                  minHeight: 6,
                ),
              ),
              const SizedBox(height: 12),
              Text(result.reason,
                style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70, height: 1.5),
                maxLines: 5, overflow: TextOverflow.ellipsis,
              ),
            ]),
          ),
          const SizedBox(height: 12),

          // Alt recommendation
          MedCard(
            child: Row(children: [
              const Icon(Icons.alt_route_rounded, color: AppTheme.textMuted, size: 20),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Alternative Recommendation',
                    style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
                Text(result.altSpecialty,
                    style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
              ])),
              Text('${result.altConfidence}%',
                  style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textSecondary)),
            ]),
          ),
          const SizedBox(height: 20),

          // Recommended doctors
          if (doctors.isNotEmpty) ...[
            SectionHeader(
              title: 'Recommended Doctors',
              subtitle: '${result.specialty} specialists',
            ),
            const SizedBox(height: 12),
            ...doctors.take(3).map((d) => MedCard(
              margin: const EdgeInsets.only(bottom: 10),
              onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => DoctorProfileScreen(id: d.id))),
              child: Row(children: [
                DoctorAvatar(photoUrl: d.profilePhoto, name: d.fullName, radius: 26),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(d.fullName, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                  Text(d.primarySpecialty, style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.primaryDeep)),
                  Row(children: [
                    StarRating(rating: d.averageRating, size: 12),
                    const SizedBox(width: 4),
                    Text('${d.averageRating.toStringAsFixed(1)}',
                        style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
                  ]),
                ])),
                Text('Rs. ${d.consultationFee?.toStringAsFixed(0) ?? 0}',
                    style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.primaryDeep)),
                const SizedBox(width: 4),
                const Icon(Icons.chevron_right_rounded, color: AppTheme.textMuted, size: 18),
              ]),
            )),
            const SizedBox(height: 12),
          ],

          OutlinedButton.icon(
            onPressed: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const FindDoctorScreen())),
            icon: const Icon(Icons.search_rounded),
            label: Text('Browse All Doctors',
                style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
          ),
          const SizedBox(height: 12),
          TextButton.icon(
            onPressed: onReset,
            icon: const Icon(Icons.refresh_rounded, size: 16),
            label: Text('Analyze Different Symptoms',
                style: GoogleFonts.outfit(fontSize: 13)),
          ),
        ],
      ),
    );
  }
}
