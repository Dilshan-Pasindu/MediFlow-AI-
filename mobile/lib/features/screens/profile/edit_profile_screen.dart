import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../features/auth/auth_provider.dart';
import '../../../features/patient/patient_providers.dart';

/// Edit Patient Profile Screen (Matching Web ProfilePage)
class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl      = TextEditingController();
  final _emailCtrl     = TextEditingController();
  final _phoneCtrl     = TextEditingController();
  final _addressCtrl   = TextEditingController();
  final _allergiesCtrl = TextEditingController();
  String? _gender;
  String? _bloodGroup;
  DateTime? _dob;
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
    final authUser = ref.read(authProvider).user;
    try {
      final data = await ApiClient.instance.get('/patient/profile') as Map<String, dynamic>;
      _nameCtrl.text = (data['fullName'] as String?) ?? authUser?.fullName ?? '';
      _emailCtrl.text = (data['email'] as String?) ?? authUser?.email ?? '';
      _phoneCtrl.text = (data['phoneNumber'] as String?) ?? '';
      _addressCtrl.text = (data['address'] as String?) ?? '';
      _allergiesCtrl.text = (data['allergies'] as String?) ?? '';

      final bg = data['bloodGroup'] as String?;
      if (bg != null && _bloodGroups.contains(bg.toUpperCase())) {
        _bloodGroup = bg.toUpperCase();
      }

      final g = data['gender'] as String?;
      if (g != null && _genders.contains(g)) {
        _gender = g;
      }

      final dobStr = data['dateOfBirth'] as String?;
      if (dobStr != null && dobStr.isNotEmpty) {
        _dob = DateTime.tryParse(dobStr.substring(0, 10));
      }
    } catch (_) {
      if (authUser != null) {
        _nameCtrl.text = authUser.fullName;
        _emailCtrl.text = authUser.email;
      }
    }
    if (mounted) setState(() => _loading = false);
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
    _allergiesCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickDob() async {
    final now = DateTime.now();
    final initial = _dob ?? DateTime(now.year - 25, now.month, now.day);
    final picked = await showDatePicker(
      context: context,
      initialDate: initial.isAfter(now) ? now : initial,
      firstDate: DateTime(1900, 1, 1),
      lastDate: now,
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppTheme.primaryBlue),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        _dob = picked;
        _error = null;
      });
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    if (_dob != null) {
      final now = DateTime.now();
      if (_dob!.isAfter(now)) {
        setState(() => _error = 'Date of birth cannot be in the future.');
        return;
      }
      if (_dob!.year < 1900) {
        setState(() => _error = 'Date of birth must be after year 1900.');
        return;
      }
    }

    setState(() {
      _saving = true;
      _error = null;
    });

    final trimmedName = _nameCtrl.text.trim();
    final trimmedPhone = _phoneCtrl.text.trim();
    final trimmedAddress = _addressCtrl.text.trim();
    final trimmedAllergies = _allergiesCtrl.text.trim();

    try {
      await ApiClient.instance.put('/patient/profile', body: {
        'fullName': trimmedName,
        'phoneNumber': trimmedPhone.isEmpty ? null : trimmedPhone,
        'dateOfBirth': _dob != null ? DateFormat('yyyy-MM-dd').format(_dob!) : null,
        'gender': _gender,
        'bloodGroup': _bloodGroup,
        'address': trimmedAddress.isEmpty ? null : trimmedAddress,
        'allergies': trimmedAllergies.isEmpty ? null : trimmedAllergies,
      });

      // Synchronize auth state so full name updates globally across the app
      await ref.read(authProvider.notifier).updateCurrentUser(fullName: trimmedName);
      ref.invalidate(patientProfileProvider);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Profile updated successfully! 🎉', style: GoogleFonts.inter()),
            backgroundColor: const Color(0xFF059669),
          ),
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      setState(() => _error = e.toString()
          .replaceFirst('ApiException(400): ', '')
          .replaceFirst('ApiException: ', '')
          .replaceFirst('Exception: ', ''));
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
            child: const Icon(LucideIcons.arrowLeft, size: 18, color: AppTheme.textPrimary),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Edit Health Profile',
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: AppTheme.textPrimary,
          ),
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
                        child: Row(
                          children: [
                            const Icon(LucideIcons.circleAlert, color: Color(0xFFDC2626), size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _error!,
                                style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFFDC2626)),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // ── Personal & Identity Box ──
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
                            'Personal Details',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 14),
                          TextFormField(
                            controller: _nameCtrl,
                            style: GoogleFonts.inter(fontSize: 14),
                            decoration: InputDecoration(
                              labelText: 'Full Name *',
                              hintText: 'Enter your full name',
                              prefixIcon: const Icon(LucideIcons.user, size: 20, color: AppTheme.textMuted),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                              filled: true,
                              fillColor: AppTheme.surface2,
                            ),
                            validator: (v) {
                              if (v == null || v.trim().isEmpty) {
                                return 'Full name is required.';
                              }
                              final trimmed = v.trim();
                              if (trimmed.length < 2) {
                                return 'Full name must be at least 2 characters.';
                              }
                              if (trimmed.length > 100) {
                                return 'Full name cannot exceed 100 characters.';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 14),
                          // Email field (Read-only / Immutable account credential)
                          TextFormField(
                            controller: _emailCtrl,
                            enabled: false,
                            style: GoogleFonts.inter(fontSize: 14, color: AppTheme.textMuted),
                            decoration: InputDecoration(
                              labelText: 'Email Address (Verified)',
                              prefixIcon: const Icon(LucideIcons.mail, size: 20, color: AppTheme.textMuted),
                              suffixIcon: const Padding(
                                padding: EdgeInsets.all(12),
                                child: Icon(LucideIcons.lock, size: 16, color: AppTheme.textMuted),
                              ),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                              filled: true,
                              fillColor: const Color(0xFFF1F5F9),
                              helperText: 'Account email cannot be modified.',
                              helperStyle: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
                            ),
                          ),
                          const SizedBox(height: 14),
                          TextFormField(
                            controller: _phoneCtrl,
                            keyboardType: TextInputType.phone,
                            style: GoogleFonts.inter(fontSize: 14),
                            decoration: InputDecoration(
                              labelText: 'Contact Phone Number',
                              hintText: '+94 77 123 4567',
                              prefixIcon: const Icon(LucideIcons.phone, size: 20, color: AppTheme.textMuted),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                              filled: true,
                              fillColor: AppTheme.surface2,
                            ),
                            validator: (v) {
                              if (v != null && v.trim().isNotEmpty) {
                                final phoneRegex = RegExp(r'^\+?[0-9\s\-()]{7,20}$');
                                if (!phoneRegex.hasMatch(v.trim())) {
                                  return 'Enter a valid phone number (e.g. +94 77 123 4567).';
                                }
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 14),
                          // Date of birth picker
                          GestureDetector(
                            onTap: _pickDob,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                              decoration: BoxDecoration(
                                color: AppTheme.surface2,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: const Color(0xFFCBD5E1)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(LucideIcons.calendar, size: 20, color: AppTheme.textMuted),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Date of Birth',
                                          style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w600,
                                            color: AppTheme.textMuted,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          _dob != null
                                              ? DateFormat('MMMM d, yyyy').format(_dob!)
                                              : 'Tap to select date of birth',
                                          style: GoogleFonts.inter(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w600,
                                            color: _dob != null ? AppTheme.textPrimary : AppTheme.textMuted,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const Icon(LucideIcons.chevronRight, size: 18, color: AppTheme.textMuted),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 14),
                          DropdownButtonFormField<String>(
                            value: _gender,
                            decoration: InputDecoration(
                              labelText: 'Gender',
                              prefixIcon: const Icon(LucideIcons.userCheck, size: 20, color: AppTheme.textMuted),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                              filled: true,
                              fillColor: AppTheme.surface2,
                            ),
                            items: _genders
                                .map((g) => DropdownMenuItem(value: g, child: Text(g, style: GoogleFonts.inter(fontSize: 14))))
                                .toList(),
                            onChanged: (v) => setState(() => _gender = v),
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
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 14),
                          DropdownButtonFormField<String>(
                            value: _bloodGroup,
                            decoration: InputDecoration(
                              labelText: 'Blood Group',
                              prefixIcon: const Icon(LucideIcons.droplets, size: 20, color: AppTheme.textMuted),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                              filled: true,
                              fillColor: AppTheme.surface2,
                            ),
                            items: _bloodGroups
                                .map((bg) => DropdownMenuItem(value: bg, child: Text(bg, style: GoogleFonts.inter(fontSize: 14))))
                                .toList(),
                            onChanged: (v) => setState(() => _bloodGroup = v),
                          ),
                          const SizedBox(height: 14),
                          TextFormField(
                            controller: _addressCtrl,
                            maxLines: 2,
                            maxLength: 250,
                            style: GoogleFonts.inter(fontSize: 14),
                            decoration: InputDecoration(
                              labelText: 'Home Address',
                              hintText: 'Enter your residential address',
                              prefixIcon: const Icon(LucideIcons.mapPin, size: 20, color: AppTheme.textMuted),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                              filled: true,
                              fillColor: AppTheme.surface2,
                            ),
                            validator: (v) {
                              if (v != null && v.length > 250) {
                                return 'Address cannot exceed 250 characters.';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 14),
                          TextFormField(
                            controller: _allergiesCtrl,
                            maxLines: 3,
                            maxLength: 500,
                            style: GoogleFonts.inter(fontSize: 14),
                            decoration: InputDecoration(
                              labelText: 'Known Drug & Food Allergies',
                              hintText: 'e.g., Penicillin, Sulfa drugs, Peanuts (write None if not applicable)',
                              prefixIcon: const Icon(LucideIcons.triangleAlert, size: 20, color: AppTheme.textMuted),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                              filled: true,
                              fillColor: AppTheme.surface2,
                            ),
                            validator: (v) {
                              if (v != null && v.length > 500) {
                                return 'Allergies cannot exceed 500 characters.';
                              }
                              return null;
                            },
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
                              style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w800),
                            ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
