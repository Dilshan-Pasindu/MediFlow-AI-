import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/widgets/widgets.dart';

/// Edit Patient Profile Screen (macOS Medical Theme)
class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneCtrl     = TextEditingController();
  final _addressCtrl   = TextEditingController();
  final _bloodCtrl     = TextEditingController();
  final _allergiesCtrl = TextEditingController();
  String? _gender;
  bool _loading = true;
  bool _saving = false;
  String? _error;

  static const _genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  static const _bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final data = await ApiClient.instance.get('/patient/profile') as Map<String, dynamic>;
      _phoneCtrl.text = data['phoneNumber'] as String? ?? '';
      _addressCtrl.text = data['address'] as String? ?? '';
      _bloodCtrl.text = data['bloodGroup'] as String? ?? '';
      _allergiesCtrl.text = data['allergies'] as String? ?? '';
      final g = data['gender'] as String?;
      if (g != null && _genders.contains(g)) _gender = g;
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
    _bloodCtrl.dispose();
    _allergiesCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _saving = true; _error = null; });

    try {
      await ApiClient.instance.put('/patient/profile', body: {
        'phoneNumber': _phoneCtrl.text.trim().isEmpty ? null : _phoneCtrl.text.trim(),
        'address': _addressCtrl.text.trim().isEmpty ? null : _addressCtrl.text.trim(),
        'bloodGroup': _bloodCtrl.text.trim().isEmpty ? null : _bloodCtrl.text.trim(),
        'allergies': _allergiesCtrl.text.trim().isEmpty ? null : _allergiesCtrl.text.trim(),
        'gender': _gender,
      });
      ref.invalidate(patientProfileProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Profile updated successfully', style: GoogleFonts.outfit()),
            backgroundColor: const Color(0xFF059669),
          ),
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      setState(() => _error = e.toString().replaceAll('ApiException(', '').replaceAll('): ', ': '));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
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
        title: Row(
          children: [
            AppTheme.macOSWindowDots(size: 9, spacing: 4),
            const SizedBox(width: 8),
            Text(
              'Edit Health Profile',
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
              ),
            ),
          ],
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryBlue))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (_error != null) ...[
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF2F2),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFFECACA)),
                        ),
                        child: Text(
                          _error!,
                          style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFFDC2626)),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // ── Contact Information Box ──
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
                          Text(
                            'Contact Details',
                            style: GoogleFonts.outfit(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 14),
                          MedTextField(
                            label: 'Phone Number',
                            controller: _phoneCtrl,
                            prefixIcon: Icons.phone_outlined,
                            keyboardType: TextInputType.phone,
                          ),
                          const SizedBox(height: 14),
                          MedTextField(
                            label: 'Home Address',
                            controller: _addressCtrl,
                            prefixIcon: Icons.location_on_outlined,
                            maxLines: 2,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // ── Clinical & Health Info Box ──
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
                          Text(
                            'Medical Information',
                            style: GoogleFonts.outfit(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 14),
                          DropdownButtonFormField<String>(
                            value: _gender,
                            decoration: InputDecoration(
                              labelText: 'Gender',
                              prefixIcon: const Icon(Icons.person_outline_rounded, size: 20, color: AppTheme.textMuted),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                              filled: true,
                              fillColor: AppTheme.surface2,
                            ),
                            items: _genders
                                .map((g) => DropdownMenuItem(value: g, child: Text(g, style: GoogleFonts.outfit(fontSize: 14))))
                                .toList(),
                            onChanged: (v) => setState(() => _gender = v),
                          ),
                          const SizedBox(height: 14),
                          DropdownButtonFormField<String>(
                            value: _bloodGroups.contains(_bloodCtrl.text) ? _bloodCtrl.text : null,
                            decoration: InputDecoration(
                              labelText: 'Blood Group',
                              prefixIcon: const Icon(Icons.bloodtype_outlined, size: 20, color: AppTheme.textMuted),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                              filled: true,
                              fillColor: AppTheme.surface2,
                            ),
                            items: _bloodGroups
                                .map((bg) => DropdownMenuItem(value: bg, child: Text(bg, style: GoogleFonts.outfit(fontSize: 14))))
                                .toList(),
                            onChanged: (v) {
                              if (v != null) _bloodCtrl.text = v;
                            },
                          ),
                          const SizedBox(height: 14),
                          MedTextField(
                            label: 'Known Allergies',
                            controller: _allergiesCtrl,
                            prefixIcon: Icons.warning_amber_rounded,
                            maxLines: 3,
                            hint: 'e.g., Penicillin, Sulfa drugs, Peanuts (write None if not applicable)',
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    ElevatedButton(
                      onPressed: _saving ? null : _save,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryBlue,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: _saving
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : Text(
                              'Save Health Records',
                              style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w800),
                            ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
