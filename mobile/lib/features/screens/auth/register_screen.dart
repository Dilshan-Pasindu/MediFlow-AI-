import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/auth/auth_provider.dart';
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
                          child: const Icon(Icons.arrow_back_rounded,
                              color: Colors.white, size: 20),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Create Account',
                            style: GoogleFonts.outfit(
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
                              style: GoogleFonts.outfit(
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
                                const Icon(Icons.person_outline_rounded, size: 15, color: _kCyan),
                                const SizedBox(width: 6),
                                Text(
                                  'Patient Registration',
                                  style: GoogleFonts.outfit(
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
                                Icon(Icons.error_outline_rounded,
                                    color: Colors.red.shade300, size: 18),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    auth.error!,
                                    style: GoogleFonts.outfit(
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
                          icon: Icons.person_outline_rounded,
                          controller: _nameCtrl,
                          validator: (v) {
                            if (v == null || v.trim().isEmpty) {
                              return 'Full name is required';
                            }
                            if (v.trim().length < 2) {
                              return 'Name must be at least 2 characters';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),
                        _DarkRegField(
                          label: 'Email Address',
                          hint: 'patient@example.com',
                          icon: Icons.email_outlined,
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          validator: (v) => v == null || !v.contains('@')
                              ? 'Enter a valid email'
                              : null,
                        ),
                        const SizedBox(height: 12),
                        _DarkRegField(
                          label: 'Phone Number',
                          hint: '+94 71 234 5678',
                          icon: Icons.phone_outlined,
                          controller: _phoneCtrl,
                          keyboardType: TextInputType.phone,
                          validator: (v) {
                            if (v == null || v.trim().isEmpty) {
                              return 'Phone number is required';
                            }
                            if (v.trim().length < 7) {
                              return 'Enter a valid phone number';
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
                          hint: 'Min. 6 characters',
                          icon: Icons.lock_outline_rounded,
                          controller: _passCtrl,
                          obscure: _obscurePass,
                          suffixIcon: GestureDetector(
                            onTap: () =>
                                setState(() => _obscurePass = !_obscurePass),
                            child: Icon(
                              _obscurePass
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                              size: 20,
                              color: Colors.white.withValues(alpha: 0.45),
                            ),
                          ),
                          validator: (v) {
                            if (v == null || v.isEmpty) {
                              return 'Password is required';
                            }
                            if (v.length < 6) {
                              return 'Password must be at least 6 characters';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),
                        _DarkRegField(
                          label: 'Confirm Password',
                          hint: 'Re-enter password',
                          icon: Icons.lock_outline_rounded,
                          controller: _confCtrl,
                          obscure: _obscureConf,
                          suffixIcon: GestureDetector(
                            onTap: () =>
                                setState(() => _obscureConf = !_obscureConf),
                            child: Icon(
                              _obscureConf
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                              size: 20,
                              color: Colors.white.withValues(alpha: 0.45),
                            ),
                          ),
                          validator: (v) => v != _passCtrl.text
                              ? 'Passwords do not match'
                              : null,
                        ),
                        const SizedBox(height: 28),

                        // CTA
                        _CyanGradientButton(
                          label: 'Create Account',
                          isLoading: auth.isLoading,
                          onPressed: _register,
                        ),
                        const SizedBox(height: 20),

                        // Sign In link
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Already have an account? ',
                              style: GoogleFonts.outfit(
                                  fontSize: 13,
                                  color: Colors.white.withValues(alpha: 0.50)),
                            ),
                            GestureDetector(
                              onTap: () => Navigator.of(context).pop(),
                              child: Text(
                                'Sign In',
                                style: GoogleFonts.outfit(
                                  fontSize: 13, fontWeight: FontWeight.w700,
                                  color: _kCyan,
                                ),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),
                        Text(
                          'By creating an account you agree to our\nTerms of Service and Privacy Policy.',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.outfit(
                              fontSize: 11,
                              color: Colors.white.withValues(alpha: 0.28),
                              height: 1.5),
                        ),
                        const SizedBox(height: 12),

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
          style: GoogleFonts.outfit(
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
      style: GoogleFonts.outfit(fontSize: 14, color: Colors.white),
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
        hintStyle: GoogleFonts.outfit(
            fontSize: 13, color: Colors.white.withValues(alpha: 0.28)),
        labelStyle: GoogleFonts.outfit(
            fontSize: 13, color: Colors.white.withValues(alpha: 0.55)),
        floatingLabelStyle: GoogleFonts.outfit(fontSize: 13, color: _kCyan),
        errorStyle: GoogleFonts.outfit(fontSize: 12, color: Colors.red.shade300),
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
                  style: GoogleFonts.outfit(
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
