import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/auth/auth_provider.dart';
import '../../../shared/widgets/widgets.dart';
import '../main_shell.dart';
import '../dashboard/dashboard_screen.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl  = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _passCtrl  = TextEditingController();
  final _confCtrl  = TextEditingController();
  bool _obscurePass = true;
  bool _obscureConf = true;

  @override
  void dispose() {
    _nameCtrl.dispose(); _emailCtrl.dispose(); _phoneCtrl.dispose();
    _passCtrl.dispose(); _confCtrl.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;
    final success = await ref.read(authProvider.notifier).register(
      fullName: _nameCtrl.text.trim(),
      email: _emailCtrl.text.trim(),
      password: _passCtrl.text.trim(),
      phone: _phoneCtrl.text.trim(),
    );
    if (success && mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const MainShell(child: DashboardScreen())),
        (_) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);

    return Scaffold(
      body: Stack(
        children: [
          Container(
            height: 200,
            decoration: const BoxDecoration(gradient: AppTheme.primaryGradient),
          ),
          SafeArea(
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                      Text('Create Account',
                        style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Container(
                    margin: const EdgeInsets.only(top: 12),
                    decoration: const BoxDecoration(
                      color: AppTheme.surfaceDim,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(28),
                        topRight: Radius.circular(28),
                      ),
                    ),
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.fromLTRB(24, 28, 24, 40),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            if (auth.error != null) ...[
                              Container(
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(
                                  color: AppTheme.statusInConsult.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                                  border: Border.all(color: AppTheme.statusInConsult.withOpacity(0.3)),
                                ),
                                child: Text(auth.error!,
                                  style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.statusInConsult)),
                              ),
                              const SizedBox(height: 16),
                            ],

                            Text('Personal Information',
                              style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                            ),
                            const SizedBox(height: 12),
                            MedTextField(
                              label: 'Full Name',
                              controller: _nameCtrl,
                              prefixIcon: Icons.person_outline_rounded,
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) return 'Full name is required';
                                if (v.trim().length < 2) return 'Name must be at least 2 characters';
                                return null;
                              },
                            ),
                            const SizedBox(height: 12),
                            MedTextField(
                              label: 'Email Address',
                              controller: _emailCtrl,
                              prefixIcon: Icons.email_outlined,
                              keyboardType: TextInputType.emailAddress,
                              validator: (v) =>
                                  v == null || !v.contains('@') ? 'Enter a valid email' : null,
                            ),
                            const SizedBox(height: 12),
                            MedTextField(
                              label: 'Phone Number',
                              controller: _phoneCtrl,
                              prefixIcon: Icons.phone_outlined,
                              keyboardType: TextInputType.phone,
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) return 'Phone number is required';
                                if (v.trim().length < 7) return 'Enter a valid phone number';
                                return null;
                              },
                            ),
                            const SizedBox(height: 20),
                            Text('Security',
                              style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                            ),
                            const SizedBox(height: 12),
                            MedTextField(
                              label: 'Password',
                              controller: _passCtrl,
                              prefixIcon: Icons.lock_outline_rounded,
                              obscureText: _obscurePass,
                              suffixIcon: IconButton(
                                icon: Icon(_obscurePass ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                    size: 20, color: AppTheme.textMuted),
                                onPressed: () => setState(() => _obscurePass = !_obscurePass),
                              ),
                              validator: (v) {
                                if (v == null || v.isEmpty) return 'Password is required';
                                if (v.length < 6) return 'Password must be at least 6 characters';
                                return null;
                              },
                            ),
                            const SizedBox(height: 12),
                            MedTextField(
                              label: 'Confirm Password',
                              controller: _confCtrl,
                              prefixIcon: Icons.lock_outline_rounded,
                              obscureText: _obscureConf,
                              suffixIcon: IconButton(
                                icon: Icon(_obscureConf ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                    size: 20, color: AppTheme.textMuted),
                                onPressed: () => setState(() => _obscureConf = !_obscureConf),
                              ),
                              validator: (v) =>
                                  v != _passCtrl.text ? 'Passwords do not match' : null,
                            ),
                            const SizedBox(height: 28),
                            MedPrimaryButton(
                              label: 'Create Account',
                              onPressed: _register,
                              isLoading: auth.isLoading,
                              icon: Icons.person_add_rounded,
                            ),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('Already have an account? ',
                                    style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textSecondary)),
                                GestureDetector(
                                  onTap: () => Navigator.of(context).pop(),
                                  child: Text('Sign In',
                                    style: GoogleFonts.outfit(
                                        fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.primaryDeep),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
