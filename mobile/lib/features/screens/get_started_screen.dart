import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/widgets.dart';
import 'auth/login_screen.dart';
import 'auth/register_screen.dart';

/// MediFlow AI — Premium "Get Started" landing screen.
/// Responsive, polished hero illustration, orbiting pills, and round pill CTAs.
/// Color palette strictly synced with website (#2A7DE1, #1565C0, #4FD1C5, #0B2E4A).
class GetStartedScreen extends StatefulWidget {
  const GetStartedScreen({super.key});

  @override
  State<GetStartedScreen> createState() => _GetStartedScreenState();
}

class _GetStartedScreenState extends State<GetStartedScreen>
    with TickerProviderStateMixin {
  late final AnimationController _fadeCtrl;
  late final AnimationController _slideCtrl;
  late final AnimationController _pulseCtrl;
  late final AnimationController _floatCtrl;

  late final Animation<double> _fadeAnim;
  late final Animation<Offset> _heroSlide;
  late final Animation<Offset> _contentSlide;
  late final Animation<double> _pulseAnim;
  late final Animation<double> _floatAnim;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ));

    _fadeCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    _slideCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    _pulseCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 2200))..repeat(reverse: true);
    _floatCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 3200))..repeat(reverse: true);

    _fadeAnim = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut);
    _heroSlide = Tween<Offset>(begin: const Offset(0, -0.05), end: Offset.zero)
        .animate(CurvedAnimation(parent: _slideCtrl, curve: Curves.easeOutCubic));
    _contentSlide = Tween<Offset>(begin: const Offset(0, 0.08), end: Offset.zero)
        .animate(CurvedAnimation(parent: _slideCtrl, curve: Curves.easeOutCubic));
    _pulseAnim = Tween<double>(begin: 0.96, end: 1.04)
        .animate(CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut));
    _floatAnim = Tween<double>(begin: -6.0, end: 6.0)
        .animate(CurvedAnimation(parent: _floatCtrl, curve: Curves.easeInOut));

    _fadeCtrl.forward();
    _slideCtrl.forward();
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    _slideCtrl.dispose();
    _pulseCtrl.dispose();
    _floatCtrl.dispose();
    super.dispose();
  }

  void _goToLogin() {
    Navigator.of(context).push(
      PageRouteBuilder(
        pageBuilder: (_, anim, __) => const LoginScreen(),
        transitionsBuilder: (_, anim, __, child) => SlideTransition(
          position: Tween<Offset>(begin: const Offset(1, 0), end: Offset.zero)
              .animate(CurvedAnimation(parent: anim, curve: Curves.easeOutCubic)),
          child: child,
        ),
        transitionDuration: const Duration(milliseconds: 350),
      ),
    );
  }

  void _goToRegister() {
    Navigator.of(context).push(
      PageRouteBuilder(
        pageBuilder: (_, anim, __) => const RegisterScreen(),
        transitionsBuilder: (_, anim, __, child) => SlideTransition(
          position: Tween<Offset>(begin: const Offset(1, 0), end: Offset.zero)
              .animate(CurvedAnimation(parent: anim, curve: Curves.easeOutCubic)),
          child: child,
        ),
        transitionDuration: const Duration(milliseconds: 350),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xFF0B2E4A),
      body: Stack(
        children: [
          // ── Background Gradient ──────────────────────────────────────────────
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFF0B2E4A),
                    Color(0xFF134C82),
                    Color(0xFF1E5BB5),
                    Color(0xFF1A1B4B),
                  ],
                  stops: [0.0, 0.35, 0.70, 1.0],
                ),
              ),
            ),
          ),

          // ── Atmospheric Glow Orbs ────────────────────────────────────────────
          Positioned(
            top: -60, left: -60,
            child: Container(
              width: 240, height: 240,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFF4FD1C5).withValues(alpha: 0.18),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: size.height * 0.22, right: -50,
            child: Container(
              width: 200, height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFF2A7DE1).withValues(alpha: 0.22),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // ── Ambient particle stars ───────────────────────────────────────────
          ..._buildParticleDots(size),

          // ── Main Content with responsive scroll fallback ──────────────────────
          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  physics: const ClampingScrollPhysics(),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      minHeight: constraints.maxHeight,
                    ),
                    child: IntrinsicHeight(
                      child: FadeTransition(
                        opacity: _fadeAnim,
                        child: Column(
                          children: [
                            // ── Top Section: Logo & Hero Visual ───────────────
                            Expanded(
                              child: SlideTransition(
                                position: _heroSlide,
                                child: _buildHeroSection(constraints.maxHeight),
                              ),
                            ),

                            // ── Bottom Card: Information & Buttons ────────────
                            SlideTransition(
                              position: _contentSlide,
                              child: _buildBottomContent(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Hero section
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildHeroSection(double availableHeight) {
    // Compact spacing for shorter screens
    final isCompact = availableHeight < 680;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          SizedBox(height: isCompact ? 12 : 20),

          // Header Brand Mark
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.16),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const MediFlowLogo(
              variant: MediFlowLogoVariant.horizontal,
              height: 24,
            ),
          ),

          SizedBox(height: isCompact ? 10 : 20),

          // Animated Floating Hero Visual
          Expanded(
            child: Center(
              child: AnimatedBuilder(
                animation: Listenable.merge([_pulseAnim, _floatAnim]),
                builder: (context, child) {
                  return Transform.translate(
                    offset: Offset(0, _floatAnim.value),
                    child: _buildHeroIllustration(isCompact),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroIllustration(bool isCompact) {
    final scale = isCompact ? 0.85 : 1.0;

    return Transform.scale(
      scale: scale,
      child: Stack(
        alignment: Alignment.center,
        clipBehavior: Clip.none,
        children: [
          // Background soft radial pulse
          Transform.scale(
            scale: _pulseAnim.value,
            child: Container(
              width: 190, height: 190,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFF2A7DE1).withValues(alpha: 0.20),
                    const Color(0xFF4FD1C5).withValues(alpha: 0.08),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // Outer orbit track
          Container(
            width: 160, height: 160,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.10),
                width: 1.5,
              ),
            ),
          ),

          // Inner orbit track
          Container(
            width: 120, height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.14),
                width: 1.2,
              ),
            ),
          ),

          // Main Center Official MediFlow Mark with Heartbeat Animation
          Container(
            width: 82, height: 82,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF4FD1C5).withValues(alpha: 0.40),
                  blurRadius: 26,
                  offset: const Offset(0, 10),
                ),
                BoxShadow(
                  color: const Color(0xFF2A7DE1).withValues(alpha: 0.35),
                  blurRadius: 18,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Center(
              child: MediFlowAnimatedLogo(
                variant: MediFlowLogoVariant.mark,
                height: 56,
              ),
            ),
          ),

          // Orbiting Feature Badges
          ..._buildOrbitingPills(),
        ],
      ),
    );
  }

  List<Widget> _buildOrbitingPills() {
    final items = [
      (icon: Icons.person_rounded,        label: 'Doctors',       angle: -50.0,  radius: 96.0),
      (icon: Icons.psychology_rounded,    label: 'AI Match',      angle: 35.0,   radius: 96.0),
      (icon: Icons.receipt_long_rounded,  label: 'E-Rx',          angle: 155.0,  radius: 90.0),
      (icon: Icons.calendar_month_rounded,label: 'Bookings',      angle: 235.0,  radius: 94.0),
    ];

    return items.map((item) {
      final rad = item.angle * math.pi / 180.0;
      final x = item.radius * math.cos(rad);
      final y = item.radius * math.sin(rad);
      return Transform.translate(
        offset: Offset(x, y),
        child: _FloatingPill(icon: item.icon, label: item.label),
      );
    }).toList();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Bottom Content: Headline, Features, CTAs
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildBottomContent() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFF0F2643).withValues(alpha: 0.88),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        border: Border.all(color: Colors.white.withValues(alpha: 0.12), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 30,
            offset: const Offset(0, -6),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Headline
            Text(
              'Your Health,\nSmarter Than Ever',
              style: GoogleFonts.outfit(
                fontSize: 26,
                fontWeight: FontWeight.w800,
                color: Colors.white,
                height: 1.15,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 8),

            // Subtitle
            Text(
              'AI-powered doctor matching, smart e-prescriptions, and real-time clinical care at your fingertips.',
              style: GoogleFonts.outfit(
                fontSize: 13,
                fontWeight: FontWeight.w400,
                color: Colors.white.withValues(alpha: 0.72),
                height: 1.45,
              ),
            ),

            const SizedBox(height: 16),

            // Feature Highlights Strip
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _FeatureChip(icon: Icons.search_rounded,        label: 'Find Doctors'),
                  _FeatureChip(icon: Icons.psychology_rounded,    label: 'AI Triage'),
                  _FeatureChip(icon: Icons.receipt_long_rounded,  label: 'E-Prescriptions'),
                  _FeatureChip(icon: Icons.flash_on_rounded,      label: 'Instant Booking'),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Primary CTA Button (Get Started -> Login)
            _PrimaryButton(
              label: 'Get Started',
              icon: Icons.arrow_forward_rounded,
              onPressed: _goToLogin,
            ),

            const SizedBox(height: 10),

            // Secondary CTA Button (Create Account -> Register)
            _SecondaryButton(
              label: 'Create New Account',
              onPressed: _goToRegister,
            ),

            const SizedBox(height: 12),

            // Terms & Privacy note
            Center(
              child: Text(
                'By continuing, you agree to our Terms & Privacy Policy',
                style: GoogleFonts.outfit(
                  fontSize: 11,
                  color: Colors.white.withValues(alpha: 0.45),
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Ambient background particles
  // ─────────────────────────────────────────────────────────────────────────────
  List<Widget> _buildParticleDots(Size size) {
    final rng = math.Random(101);
    return List.generate(18, (i) {
      final x = rng.nextDouble() * size.width;
      final y = rng.nextDouble() * size.height * 0.60;
      final s = 2.0 + rng.nextDouble() * 2.5;
      return Positioned(
        left: x, top: y,
        child: Container(
          width: s, height: s,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white.withValues(alpha: 0.10 + rng.nextDouble() * 0.15),
          ),
        ),
      );
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Orbiting Pill Widget
// ─────────────────────────────────────────────────────────────────────────────
class _FloatingPill extends StatelessWidget {
  const _FloatingPill({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: const Color(0xFF133254).withValues(alpha: 0.85),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.22),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.25),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: const Color(0xFF4FD1C5)),
          const SizedBox(width: 5),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature Chip Widget
// ─────────────────────────────────────────────────────────────────────────────
class _FeatureChip extends StatelessWidget {
  const _FeatureChip({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.14)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: const Color(0xFF4FD1C5)),
          const SizedBox(width: 5),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 11.5,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Primary Gradient Button (Pill Shape)
// ─────────────────────────────────────────────────────────────────────────────
class _PrimaryButton extends StatefulWidget {
  const _PrimaryButton({required this.label, required this.icon, required this.onPressed});
  final String label;
  final IconData icon;
  final VoidCallback onPressed;

  @override
  State<_PrimaryButton> createState() => _PrimaryButtonState();
}

class _PrimaryButtonState extends State<_PrimaryButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 100));
    _scale = Tween<double>(begin: 1.0, end: 0.97).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _ctrl.forward(),
      onTapUp: (_) {
        _ctrl.reverse();
        widget.onPressed();
      },
      onTapCancel: () => _ctrl.reverse(),
      child: ScaleTransition(
        scale: _scale,
        child: Container(
          width: double.infinity,
          height: 50,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [Color(0xFF4FD1C5), Color(0xFF2A7DE1)],
            ),
            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF2A7DE1).withValues(alpha: 0.45),
                blurRadius: 20,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                widget.label,
                style: GoogleFonts.outfit(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  letterSpacing: 0.2,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                width: 26, height: 26,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.22),
                ),
                child: Icon(widget.icon, size: 15, color: Colors.white),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Secondary Ghost Button (Pill Shape)
// ─────────────────────────────────────────────────────────────────────────────
class _SecondaryButton extends StatefulWidget {
  const _SecondaryButton({required this.label, required this.onPressed});
  final String label;
  final VoidCallback onPressed;

  @override
  State<_SecondaryButton> createState() => _SecondaryButtonState();
}

class _SecondaryButtonState extends State<_SecondaryButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 100));
    _scale = Tween<double>(begin: 1.0, end: 0.97).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _ctrl.forward(),
      onTapUp: (_) {
        _ctrl.reverse();
        widget.onPressed();
      },
      onTapCancel: () => _ctrl.reverse(),
      child: ScaleTransition(
        scale: _scale,
        child: Container(
          width: double.infinity,
          height: 48,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.25),
              width: 1.2,
            ),
          ),
          child: Center(
            child: Text(
              widget.label,
              style: GoogleFonts.outfit(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: Colors.white,
                letterSpacing: 0.2,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
