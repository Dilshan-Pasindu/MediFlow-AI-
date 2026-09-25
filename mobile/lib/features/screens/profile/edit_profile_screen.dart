import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/widgets/widgets.dart';

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
    _phoneCtrl.dispose(); _addressCtrl.dispose();
    _bloodCtrl.dispose(); _allergiesCtrl.dispose();
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
          SnackBar(content: Text('Profile updated successfully', style: GoogleFonts.outfit()),
              backgroundColor: AppTheme.statusConfirmed),
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
      backgroundColor: AppTheme.surfaceDim,
      body: Column(
        children: [
          Container(
            decoration: const BoxDecoration(gradient: AppTheme.primaryGradient),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(4, 8, 16, 20),
                child: Row(children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  Expanded(
                    child: Text('Edit Profile',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white)),
                  ),
                  const SizedBox(width: 48),
                ]),
              ),
            ),
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryDeep))
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
                                color: AppTheme.statusInConsult.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                                border: Border.all(color: AppTheme.statusInConsult.withOpacity(0.3)),
                              ),
                              child: Text(_error!,
                                  style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.statusInConsult)),
                            ),
                            const SizedBox(height: 16),
                          ],

                          Text('Contact Information',
                              style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
                          const SizedBox(height: 10),
                          MedTextField(
                            label: 'Phone Number',
                            controller: _phoneCtrl,
                            prefixIcon: Icons.phone_outlined,
                            keyboardType: TextInputType.phone,
                          ),
                          const SizedBox(height: 12),
                          MedTextField(
                            label: 'Address',
                            controller: _addressCtrl,
                            prefixIcon: Icons.location_on_outlined,
                            maxLines: 2,
                          ),
                          const SizedBox(height: 20),

                          Text('Health Information',
                              style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
                          const SizedBox(height: 10),
                          DropdownButtonFormField<String>(
                            value: _gender,
                            decoration: InputDecoration(
                              labelText: 'Gender',
                              prefixIcon: const Icon(Icons.person_outline_rounded, size: 20, color: AppTheme.textMuted),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                              filled: true, fillColor: AppTheme.surface,
                            ),
                            items: _genders.map((g) => DropdownMenuItem(value: g, child: Text(g, style: GoogleFonts.outfit(fontSize: 14)))).toList(),
                            onChanged: (v) => setState(() => _gender = v),
                          ),
                          const SizedBox(height: 12),
                          MedTextField(
                            label: 'Blood Group',
                            controller: _bloodCtrl,
                            prefixIcon: Icons.bloodtype_outlined,
                            hint: 'e.g. A+, O-, B+',
                          ),
                          const SizedBox(height: 12),
                          MedTextField(
                            label: 'Known Allergies',
                            controller: _allergiesCtrl,
                            prefixIcon: Icons.medical_information_outlined,
                            maxLines: 3,
                            hint: 'e.g. Penicillin, Sulfa drugs (write None if not applicable)',
                          ),
                          const SizedBox(height: 28),
                          MedPrimaryButton(
                            label: 'Save Changes',
                            onPressed: _save,
                            isLoading: _saving,
                            icon: Icons.check_circle_outline_rounded,
                          ),
                        ],
                      ),
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
