import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/auth/auth_provider.dart';
import '../../../features/auth/google_auth_service.dart';
import '../../../shared/widgets/widgets.dart';
import '../main_shell.dart';
import '../dashboard/dashboard_screen.dart';

// ── Design tokens (shared) ────────────────────────────────────────────────────
const _kBgDeep   = Color(0xFF050D1A);
const _kBgMid    = Color(0xFF0A1628);
const _kCyan     = Color(0xFF00D4FF);
const _kCyanDark = Color(0xFF00A8CC);
const _kTeal     = Color(0xFF4FD1C5);

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen>
    with SingleTickerProviderStateMixin {
  final _formKey   = GlobalKey<FormState>();
  final _nameCtrl  = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _passCtrl  = TextEditingController();
  final _confCtrl  = TextEditingController();
  bool _obscurePass = true;
  bool _obscureConf = true;
  bool _agreeTerms = false;
  String? _termsError;
  String? _passwordStrengthError;

  late final AnimationController _slideCtrl;
  late final Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ));
    _slideCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 650),
    );
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.30),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _slideCtrl, curve: Curves.easeOutCubic));
    _slideCtrl.forward();

    _passCtrl.addListener(() {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _passCtrl.dispose();
    _confCtrl.dispose();
    _slideCtrl.dispose();
    super.dispose();
  }

  // ── Password Strength Calculation (Matching Web) ──────────────────────────
  int _calculatePasswordScore(String p) {
    if (p.isEmpty) return 0;
    int score = 0;
    if (p.length >= 8) score++;
    if (RegExp(r'[A-Z]').hasMatch(p) && RegExp(r'[a-z]').hasMatch(p)) score++;
    if (RegExp(r'[0-9]').hasMatch(p)) score++;
    if (RegExp(r'[^A-Za-z0-9]').hasMatch(p)) score++;
    return score;
  }

  String _passwordStrengthLabel(int score) {
    switch (score) {
      case 4:
        return 'Strong';
      case 3:
        return 'Good';
      case 2:
        return 'Fair';
      default:
        return 'Weak';
    }
  }

  Color _passwordStrengthColor(int score) {
    switch (score) {
      case 4:
        return const Color(0xFF10B981);
      case 3:
        return const Color(0xFF3B82F6);
      case 2:
        return const Color(0xFFF59E0B);
      default:
        return const Color(0xFFEF4444);
    }
  }

  Future<void> _register() async {
    setState(() {
      _termsError = null;
      _passwordStrengthError = null;
    });

    final valid = _formKey.currentState!.validate();

    final pScore = _calculatePasswordScore(_passCtrl.text);
    if (_passCtrl.text.isNotEmpty && pScore < 2) {
      setState(() {
        _passwordStrengthError =
            'Please choose a stronger password with a mix of letters, numbers, or symbols.';
      });
    }

    if (!_agreeTerms) {
      setState(() {
        _termsError =
            'You must accept the MediFlow AI Terms of Service & Privacy Policy.';
      });
    }

    if (!valid || pScore < 2 || !_agreeTerms) return;

    final success = await ref.read(authProvider.notifier).register(
          fullName: _nameCtrl.text.trim(),
          email: _emailCtrl.text.trim(),
          password: _passCtrl.text.trim(),
          phone: _phoneCtrl.text.trim(),
        );
    if (success && mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
            builder: (_) => const MainShell(child: DashboardScreen())),
        (_) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final size = MediaQuery.of(context).size;
    final passwordText = _passCtrl.text;
    final pScore = _calculatePasswordScore(passwordText);

    return Scaffold(
      resizeToAvoidBottomInset: true,
      backgroundColor: _kBgDeep,
      body: Stack(
        children: [
          // ── Dark gradient background ──────────────────────────────────────
          Container(
            width: size.width, height: size.height,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [_kBgDeep, Color(0xFF081426), _kBgMid],
                stops: [0.0, 0.5, 1.0],
              ),
            ),
          ),

          // ── Cyan radial glow top ─────────────────────────────────────────
          Positioned(
            top: -80, left: size.width * 0.5 - 140,
            child: Container(
              width: 280, height: 280,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  _kCyan.withValues(alpha: 0.10),
                  _kTeal.withValues(alpha: 0.04),
                  Colors.transparent,
                ]),
              ),
            ),
          ),

          // ── Teal bottom glow ──────────────────────────────────────────────
          Positioned(
            bottom: 40, right: -40,
            child: Container(
              width: 200, height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  _kTeal.withValues(alpha: 0.08),
                  Colors.transparent,
                ]),
              ),
            ),
          ),

          // ── Grid dots ─────────────────────────────────────────────────────
          CustomPaint(size: size, painter: _GridDotPainter()),

          // ── Header ────────────────────────────────────────────────────────
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.of(context).pop(),
                        child: Container(
                          width: 40, height: 40,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                                color: Colors.white.withValues(alpha: 0.12)),
                          ),
                          child: const Icon(LucideIcons.arrowLeft,
                              color: Colors.white, size: 20),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Create Account',
                            style: GoogleFonts.inter(
                              fontSize: 22, fontWeight: FontWeight.w900,
                              color: Colors.white, letterSpacing: -0.5,
                            ),
                          ),
                          ShaderMask(
                            shaderCallback: (b) => const LinearGradient(
                              colors: [_kCyan, _kTeal],
                            ).createShader(b),
                            child: Text(
                              'Join MediFlow AI as a Patient',
                              style: GoogleFonts.inter(
                                fontSize: 13, fontWeight: FontWeight.w500,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
                    ),
                    child: const MediFlowLogo(
                      variant: MediFlowLogoVariant.mark,
                      height: 22,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Sliding dark glass card ────────────────────────────────────────
          Positioned(
            top: size.height * 0.18,
            left: 0, right: 0, bottom: 0,
            child: SlideTransition(
              position: _slideAnim,
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF0D1F38).withValues(alpha: 0.97),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(32),
                    topRight: Radius.circular(32),
                  ),
                  border: Border(
                    top: BorderSide(color: _kCyan.withValues(alpha: 0.18), width: 1),
                  ),
                ),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 48),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Drag handle
                        Center(
                          child: Container(
                            width: 36, height: 4,
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                        ),
                        const SizedBox(height: 18),

                        // ── Patient Registration Badge ──
                        Center(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                            decoration: BoxDecoration(
                              color: _kCyan.withValues(alpha: 0.10),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: _kCyan.withValues(alpha: 0.25)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(LucideIcons.user, size: 15, color: _kCyan),
                                const SizedBox(width: 6),
                                Text(
                                  'Patient Registration',
                                  style: GoogleFonts.inter(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 12,
                                    color: _kCyan,
                                    letterSpacing: 0.3,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 18),

                        // Error banner
                        if (auth.error != null) ...[
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.red.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                  color: Colors.red.withValues(alpha: 0.30)),
                            ),
                            child: Row(
                              children: [
                                Icon(LucideIcons.circleAlert,
                                    color: Colors.red.shade300, size: 18),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    auth.error!,
                                    style: GoogleFonts.inter(
                                        fontSize: 13,
                                        color: Colors.red.shade300),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),
                        ],

                        // Section: Personal Info
                        const _DarkSectionLabel(label: 'Personal Information'),
                        const SizedBox(height: 12),
                        _DarkRegField(
                          label: 'Full Name',
                          hint: 'Enter your full name',
                          icon: LucideIcons.user,
                          controller: _nameCtrl,
                          validator: (v) {
                            if (v == null || v.trim().isEmpty) {
                              return 'Full name is required';
                            }
                            final trimmed = v.trim();
                            if (trimmed.length < 2) {
                              return 'Name must be at least 2 characters';
                            }
                            if (!RegExp(r"^[a-zA-Z\s.'-]+$").hasMatch(trimmed)) {
                              return 'Name should only contain letters and spaces';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),
                        _DarkRegField(
                          label: 'Email Address',
                          hint: 'patient@example.com',
                          icon: LucideIcons.mail,
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          validator: (v) {
                            if (v == null || v.trim().isEmpty) {
                              return 'Email address is required';
                            }
                            final trimmed = v.trim();
                            if (!RegExp(r"^[^\s@]+@[^\s@]+\.[^\s@]+$").hasMatch(trimmed)) {
                              return 'Please enter a valid email address';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),
                        _DarkRegField(
                          label: 'Phone Number',
                          hint: '+94 71 234 5678',
                          icon: LucideIcons.phone,
                          controller: _phoneCtrl,
                          keyboardType: TextInputType.phone,
                          validator: (v) {
                            if (v == null || v.trim().isEmpty) {
                              return 'Phone number is required';
                            }
                            final cleanPhone = v.replaceAll(RegExp(r'[\s\-()]'), '');
                            if (!RegExp(r'^\+?[0-9]{9,15}$').hasMatch(cleanPhone)) {
                              return 'Please enter a valid phone number (min 9 digits)';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        // Section: Security
                        const _DarkSectionLabel(label: 'Security'),
                        const SizedBox(height: 12),
                        _DarkRegField(
                          label: 'Password',
                          hint: 'Min. 8 characters',
                          icon: LucideIcons.lock,
                          controller: _passCtrl,
                          obscure: _obscurePass,
                          suffixIcon: GestureDetector(
                            onTap: () =>
                                setState(() => _obscurePass = !_obscurePass),
                            child: Icon(
                              _obscurePass
                                  ? LucideIcons.eye
                                  : LucideIcons.eyeOff,
                              size: 20,
                              color: Colors.white.withValues(alpha: 0.45),
                            ),
                          ),
                          validator: (v) {
                            if (v == null || v.isEmpty) {
                              return 'Password is required';
                            }
                            if (v.length < 8) {
                              return 'Password must be at least 8 characters';
                            }
                            return null;
                          },
                        ),

                        // Password strength indicator (Matching Web)
                        if (passwordText.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(4),
                                  child: LinearProgressIndicator(
                                    value: (pScore / 4.0).clamp(0.1, 1.0),
                                    minHeight: 5,
                                    backgroundColor: Colors.white.withValues(alpha: 0.12),
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      _passwordStrengthColor(pScore),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Strength: ${_passwordStrengthLabel(pScore)}',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: _passwordStrengthColor(pScore),
                                ),
                              ),
                            ],
                          ),
                        ],

                        if (_passwordStrengthError != null) ...[
                          const SizedBox(height: 6),
                          Text(
                            _passwordStrengthError!,
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.red.shade300,
                            ),
                          ),
                        ],

                        const SizedBox(height: 12),
                        _DarkRegField(
                          label: 'Confirm Password',
                          hint: 'Re-enter password',
                          icon: LucideIcons.lock,
                          controller: _confCtrl,
                          obscure: _obscureConf,
                          suffixIcon: GestureDetector(
                            onTap: () =>
                                setState(() => _obscureConf = !_obscureConf),
                            child: Icon(
                              _obscureConf
                                  ? LucideIcons.eye
                                  : LucideIcons.eyeOff,
                              size: 20,
                              color: Colors.white.withValues(alpha: 0.45),
                            ),
                          ),
                          validator: (v) {
                            if (v == null || v.isEmpty) {
                              return 'Please confirm your password';
                            }
                            if (v != _passCtrl.text) {
                              return 'Passwords do not match';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 18),

                        // Terms of Service Checkbox (Matching Web)
                        InkWell(
                          onTap: () {
                            setState(() {
                              _agreeTerms = !_agreeTerms;
                              if (_agreeTerms) _termsError = null;
                            });
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: Checkbox(
                                    value: _agreeTerms,
                                    activeColor: _kCyan,
                                    checkColor: _kBgDeep,
                                    side: BorderSide(
                                      color: _termsError != null
                                          ? Colors.red.shade300
                                          : Colors.white.withValues(alpha: 0.4),
                                      width: 1.5,
                                    ),
                                    onChanged: (val) {
                                      setState(() {
                                        _agreeTerms = val ?? false;
                                        if (_agreeTerms) _termsError = null;
                                      });
                                    },
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    'I agree to the MediFlow AI Terms of Service & Privacy Policy.',
                                    style: GoogleFonts.inter(
                                      fontSize: 12.5,
                                      color: Colors.white.withValues(alpha: 0.75),
                                      height: 1.4,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        if (_termsError != null) ...[
                          const SizedBox(height: 6),
                          Text(
                            _termsError!,
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.red.shade300,
                            ),
                          ),
                        ],

                        const SizedBox(height: 24),

                        // CTA
                        _CyanGradientButton(
                          label: 'Create Account',
                          isLoading: auth.isLoading,
                          onPressed: auth.isLoading ? () {} : _register,
                        ),
                        const SizedBox(height: 20),

                        // Divider
                        Row(
                          children: [
                            Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.10))),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 14),
                              child: Text(
                                'OR SIGN UP WITH',
                                style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    letterSpacing: 0.6,
                                    color: Colors.white.withValues(alpha: 0.38)),
                              ),
                            ),
                            Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.10))),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Google Sign Up (Original as website)
                        GoogleSignInButton(
                          label: 'Continue with Google',
                          isLoading: auth.isLoading,
                          onPressed: () => triggerGoogleSignIn(context, ref),
                        ),
                        const SizedBox(height: 24),

                        // Sign In link
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Already have an account? ',
                              style: GoogleFonts.inter(
                                  fontSize: 13,
                                  color: Colors.white.withValues(alpha: 0.50)),
                            ),
                            GestureDetector(
                              onTap: () => Navigator.of(context).pop(),
                              child: Text(
                                'Sign In',
                                style: GoogleFonts.inter(
                                  fontSize: 13, fontWeight: FontWeight.w700,
                                  color: _kCyan,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // 24/7 Help Center
                        const AuthHelpCenterCard(),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Section label with cyan accent bar
// ─────────────────────────────────────────────────────────────────────────────
class _DarkSectionLabel extends StatelessWidget {
  const _DarkSectionLabel({required this.label});
  final String label;
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 4, height: 16,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [_kCyan, _kTeal],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 13, fontWeight: FontWeight.w700,
            color: Colors.white.withValues(alpha: 0.80),
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dark register text field
// ─────────────────────────────────────────────────────────────────────────────
class _DarkRegField extends StatelessWidget {
  const _DarkRegField({
    required this.label,
    required this.hint,
    required this.icon,
    this.controller,
    this.obscure = false,
    this.suffixIcon,
    this.keyboardType,
    this.validator,
  });

  final String label;
  final String hint;
  final IconData icon;
  final TextEditingController? controller;
  final bool obscure;
  final Widget? suffixIcon;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      keyboardType: keyboardType,
      validator: validator,
      style: GoogleFonts.inter(fontSize: 14, color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        filled: true,
        fillColor: Colors.white.withValues(alpha: 0.06),
        prefixIcon: Container(
          margin: const EdgeInsets.all(12),
          padding: const EdgeInsets.all(7),
          decoration: BoxDecoration(
            color: _kCyan.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(9),
          ),
          child: Icon(icon, size: 16, color: _kCyan),
        ),
        suffixIcon: suffixIcon != null
            ? Padding(
                padding: const EdgeInsets.only(right: 12),
                child: suffixIcon,
              )
            : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.12)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.12)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: const BorderSide(color: _kCyan, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: BorderSide(color: Colors.red.shade400, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: BorderSide(color: Colors.red.shade400, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
        hintStyle: GoogleFonts.inter(
            fontSize: 13, color: Colors.white.withValues(alpha: 0.28)),
        labelStyle: GoogleFonts.inter(
            fontSize: 13, color: Colors.white.withValues(alpha: 0.55)),
        floatingLabelStyle: GoogleFonts.inter(fontSize: 13, color: _kCyan),
        errorStyle: GoogleFonts.inter(fontSize: 12, color: Colors.red.shade300),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cyan gradient button
// ─────────────────────────────────────────────────────────────────────────────
class _CyanGradientButton extends StatefulWidget {
  const _CyanGradientButton({
    required this.label,
    required this.onPressed,
    this.isLoading = false,
  });
  final String label;
  final VoidCallback onPressed;
  final bool isLoading;

  @override
  State<_CyanGradientButton> createState() => _CyanGradientButtonState();
}

class _CyanGradientButtonState extends State<_CyanGradientButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) {
        setState(() => _pressed = false);
        if (!widget.isLoading) widget.onPressed();
      },
      onTapCancel: () => setState(() => _pressed = false),
      child: AnimatedScale(
        scale: _pressed ? 0.96 : 1.0,
        duration: const Duration(milliseconds: 120),
        child: Container(
          height: 54,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [_kCyan, _kCyanDark],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(AppTheme.radiusMd),
            boxShadow: [
              BoxShadow(
                color: _kCyan.withValues(alpha: 0.40),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          alignment: Alignment.center,
          child: widget.isLoading
              ? const SizedBox(
                  width: 22, height: 22,
                  child: CircularProgressIndicator(
                      color: _kBgDeep, strokeWidth: 2.5),
                )
              : Text(
                  widget.label,
                  style: GoogleFonts.inter(
                    fontSize: 15, fontWeight: FontWeight.w800,
                    color: _kBgDeep,
                  ),
                ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Grid dot painter
// ─────────────────────────────────────────────────────────────────────────────
class _GridDotPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = _kCyan.withValues(alpha: 0.04)
      ..style = PaintingStyle.fill;
    const step = 28.0;
    for (double x = 0; x < size.width; x += step) {
      for (double y = 0; y < size.height; y += step) {
        canvas.drawCircle(Offset(x, y), 1.0, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter old) => false;
}
