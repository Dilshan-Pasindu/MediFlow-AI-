import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/widgets.dart';
import 'auth/login_screen.dart';
import 'auth/register_screen.dart';

/// MediFlow AI — Get Started Screen
/// Original hero layout preserved (split top hero + bottom content).
/// Theme: white & light-blue medical palette matching the official website.
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
  late final AnimationController _ecgCtrl;

  late final Animation<double> _fadeAnim;
  late final Animation<Offset> _heroSlide;
  late final Animation<Offset> _contentSlide;
  late final Animation<double> _pulseAnim;
  late final Animation<double> _floatAnim;
  late final Animation<double> _ecgAnim;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ));

    _fadeCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _slideCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _pulseCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 2200))..repeat(reverse: true);
    _floatCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 3200))..repeat(reverse: true);
    _ecgCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 2400))..repeat();

    _fadeAnim = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut);
    _heroSlide = Tween<Offset>(begin: const Offset(0, -0.08), end: Offset.zero)
        .animate(CurvedAnimation(parent: _slideCtrl, curve: Curves.easeOutCubic));
    _contentSlide = Tween<Offset>(begin: const Offset(0, 0.12), end: Offset.zero)
        .animate(CurvedAnimation(parent: _slideCtrl, curve: Curves.easeOutCubic));
    _pulseAnim = Tween<double>(begin: 0.94, end: 1.06)
        .animate(CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut));
    _floatAnim = Tween<double>(begin: -7.0, end: 7.0)
        .animate(CurvedAnimation(parent: _floatCtrl, curve: Curves.easeInOut));
    _ecgAnim = Tween<double>(begin: 0.0, end: 1.0).animate(_ecgCtrl);

    Future.delayed(const Duration(milliseconds: 80), () {
      if (mounted) {
        _fadeCtrl.forward();
        _slideCtrl.forward();
      }
    });
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    _slideCtrl.dispose();
    _pulseCtrl.dispose();
    _floatCtrl.dispose();
    _ecgCtrl.dispose();
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
        transitionDuration: const Duration(milliseconds: 380),
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
        transitionDuration: const Duration(milliseconds: 380),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          // ── Ambient light blue radial glows (top-right & mid-left) ───────────
          Positioned(
            top: -100, right: -80,
            child: Container(
              width: 300, height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  const Color(0xFF2A7DE1).withValues(alpha: 0.10),
                  Colors.transparent,
                ]),
              ),
            ),
          ),
          Positioned(
            top: size.height * 0.30, left: -70,
            child: Container(
              width: 240, height: 240,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  const Color(0xFF4FD1C5).withValues(alpha: 0.12),
                  Colors.transparent,
                ]),
              ),
            ),
          ),
          Positioned(
            bottom: 180, right: -60,
            child: Container(
              width: 200, height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  const Color(0xFF7C3AED).withValues(alpha: 0.08),
                  Colors.transparent,
                ]),
              ),
            ),
          ),

          // ── Subtle dot particles ──────────────────────────────────────────────
          ..._buildParticleDots(size),

          // ── Main content ──────────────────────────────────────────────────────
          SafeArea(
            child: FadeTransition(
              opacity: _fadeAnim,
              child: Column(
                children: [
                  // TOP: Logo + Hero illustration (40% height)
                  Expanded(
                    flex: 42,
                    child: SlideTransition(
                      position: _heroSlide,
                      child: _buildHeroSection(size),
                    ),
                  ),

                  // BOTTOM: All website details in a scrollable card panel (60%)
                  Expanded(
                    flex: 58,
                    child: SlideTransition(
                      position: _contentSlide,
                      child: _buildBottomPanel(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Hero section (top 40%): official logo + animated illustration
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildHeroSection(Size size) {
    return Column(
      children: [
        const SizedBox(height: 16),

        // Official MediFlow Logo + Portal Active badge
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const MediFlowLogo(
                variant: MediFlowLogoVariant.horizontal,
                height: 30,
              ),
              // Portal Active pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AnimatedBuilder(
                      animation: _pulseAnim,
                      builder: (_, __) => Transform.scale(
                        scale: _pulseAnim.value,
                        child: Container(
                          width: 6, height: 6,
                          decoration: const BoxDecoration(
                            color: Color(0xFF059669),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 5),
                    Text(
                      'Portal Active',
                      style: GoogleFonts.outfit(
                        fontSize: 10, fontWeight: FontWeight.w600,
                        color: const Color(0xFF047857),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 8),

        // Central animated hero illustration (floating medical icon)
        Expanded(
          child: AnimatedBuilder(
            animation: Listenable.merge([_floatAnim, _pulseAnim]),
            builder: (context, _) {
              return Transform.translate(
                offset: Offset(0, _floatAnim.value),
                child: _buildHeroIllustration(),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildHeroIllustration() {
    return Stack(
      alignment: Alignment.center,
      children: [
        // Outer pulsing glow ring
        AnimatedBuilder(
          animation: _pulseAnim,
          builder: (_, __) => Transform.scale(
            scale: _pulseAnim.value,
            child: Container(
              width: 190, height: 190,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  const Color(0xFF2A7DE1).withValues(alpha: 0.12),
                  const Color(0xFF4FD1C5).withValues(alpha: 0.04),
                  Colors.transparent,
                ]),
              ),
            ),
          ),
        ),

        // Outer decorative ring
        Container(
          width: 155, height: 155,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: const Color(0xFF2A7DE1).withValues(alpha: 0.15),
              width: 1.5,
            ),
          ),
        ),

        // Inner decorative ring
        Container(
          width: 118, height: 118,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: const Color(0xFF4FD1C5).withValues(alpha: 0.20),
              width: 1.5,
            ),
          ),
        ),

        // Central gradient card — medical icon
        Container(
          width: 88, height: 88,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(26),
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF2A7DE1), Color(0xFF4FD1C5)],
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF2A7DE1).withValues(alpha: 0.35),
                blurRadius: 28,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: const Icon(
            Icons.medical_services_rounded,
            color: Colors.white,
            size: 42,
          ),
        ),

        // Floating stat pills around the illustration
        Positioned(
          top: 10, right: 20,
          child: _buildFloatingPill(Icons.people_alt_rounded, '10K+ Patients'),
        ),
        Positioned(
          bottom: 20, left: 15,
          child: _buildFloatingPill(Icons.star_rounded, '4.9★ Rating'),
        ),
        Positioned(
          bottom: 60, right: 10,
          child: _buildFloatingPill(Icons.access_time_rounded, '24/7 Support'),
        ),
      ],
    );
  }

  Widget _buildFloatingPill(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2A7DE1).withValues(alpha: 0.10),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 11, color: const Color(0xFF2A7DE1)),
          const SizedBox(width: 4),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 10, fontWeight: FontWeight.w600,
              color: const Color(0xFF0F172A),
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Bottom panel (bottom 60%): all website details
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildBottomPanel() {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        boxShadow: [
          BoxShadow(
            color: Color(0x12000000),
            blurRadius: 24,
            offset: Offset(0, -6),
          ),
        ],
      ),
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 36, height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // AI-POWERED HEALTHCARE badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFBFDBFE)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 6, height: 6,
                    decoration: const BoxDecoration(
                      color: Color(0xFF22C55E),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Icon(Icons.auto_awesome_rounded, size: 12, color: Color(0xFF2A7DE1)),
                  const SizedBox(width: 5),
                  Text(
                    'AI-POWERED HEALTHCARE',
                    style: GoogleFonts.outfit(
                      fontSize: 10, fontWeight: FontWeight.w700,
                      color: const Color(0xFF2A7DE1), letterSpacing: 0.6,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Headline
            Text(
              'Smart Healthcare',
              style: GoogleFonts.outfit(
                fontSize: 26, fontWeight: FontWeight.w900,
                color: const Color(0xFF0F172A), letterSpacing: -0.6, height: 1.1,
              ),
            ),
            ShaderMask(
              shaderCallback: (bounds) => const LinearGradient(
                colors: [Color(0xFF2A7DE1), Color(0xFF4FD1C5)],
                begin: Alignment.centerLeft, end: Alignment.centerRight,
              ).createShader(bounds),
              child: Text(
                'At Your Fingertips',
                style: GoogleFonts.outfit(
                  fontSize: 26, fontWeight: FontWeight.w900,
                  color: Colors.white, letterSpacing: -0.6, height: 1.1,
                ),
              ),
            ),

            const SizedBox(height: 8),

            // Subtitle
            Text(
              'Connect with certified specialists, manage appointments, and receive digital prescriptions — all in one secure AI platform.',
              style: GoogleFonts.outfit(
                fontSize: 12.5, fontWeight: FontWeight.w400,
                color: const Color(0xFF64748B), height: 1.5,
              ),
            ),

            const SizedBox(height: 14),

            // Animated ECG waveform line
            SizedBox(
              height: 32,
              width: double.infinity,
              child: AnimatedBuilder(
                animation: _ecgAnim,
                builder: (_, __) => CustomPaint(
                  painter: _EcgWavePainter(progress: _ecgAnim.value),
                ),
              ),
            ),

            const SizedBox(height: 14),

            // 4 KPI stat cards
            Row(
              children: [
                _buildStatCard(Icons.people_alt_rounded, '10K+', 'Patients',
                    const Color(0xFF2A7DE1), const Color(0xFFEFF6FF)),
                const SizedBox(width: 7),
                _buildStatCard(Icons.medical_services_rounded, '500+', 'Doctors',
                    const Color(0xFF059669), const Color(0xFFECFDF5)),
                const SizedBox(width: 7),
                _buildStatCard(Icons.star_rounded, '4.9★', 'Rating',
                    const Color(0xFFD97706), const Color(0xFFFFFBEB)),
                const SizedBox(width: 7),
                _buildStatCard(Icons.access_time_rounded, '24/7', 'Support',
                    const Color(0xFF7C3AED), const Color(0xFFFAF5FF)),
              ],
            ),

            const SizedBox(height: 14),

            // 4 Feature cards
            _buildFeatureCard(Icons.person_search_rounded, 'Smart Doctor Matching',
                'AI finds the best specialist instantly',
                const Color(0xFF2A7DE1), const Color(0xFFEFF6FF)),
            const SizedBox(height: 8),
            _buildFeatureCard(Icons.psychology_rounded, 'AI Clinical Support',
                'Evidence-based decision support',
                const Color(0xFF7C3AED), const Color(0xFFFAF5FF)),
            const SizedBox(height: 8),
            _buildFeatureCard(Icons.medication_rounded, 'Digital Prescriptions',
                'Secure e-prescriptions & pharmacy sync',
                const Color(0xFF059669), const Color(0xFFECFDF5)),
            const SizedBox(height: 8),
            _buildFeatureCard(Icons.monitor_heart_rounded, 'Real-time Monitoring',
                'Track appointments & health metrics',
                const Color(0xFFD97706), const Color(0xFFFFFBEB)),

            const SizedBox(height: 16),

            // Trust & security badges
            Wrap(
              spacing: 8, runSpacing: 8,
              alignment: WrapAlignment.center,
              children: [
                _buildTrustPill(Icons.verified_user_rounded, '256-bit JWT',
                    const Color(0xFF22C55E), const Color(0xFFF0FDF4), const Color(0xFFDCFCE7)),
                _buildTrustPill(Icons.shield_rounded, 'RBAC Secured',
                    const Color(0xFF2A7DE1), const Color(0xFFEFF6FF), const Color(0xFFDBEAFE)),
                _buildTrustPill(Icons.health_and_safety_rounded, 'HIPAA Aligned',
                    const Color(0xFF7C3AED), const Color(0xFFFAF5FF), const Color(0xFFF3E8FF)),
              ],
            ),

            const SizedBox(height: 20),

            // Primary CTA — Get Started
            _PrimaryButton(
              label: 'Get Started',
              icon: Icons.arrow_forward_rounded,
              onPressed: _goToLogin,
            ),

            const SizedBox(height: 10),

            // Secondary CTA — Create Account
            _SecondaryButton(
              label: 'Create New Account',
              onPressed: _goToRegister,
            ),

            const SizedBox(height: 14),

            Center(
              child: Text(
                'By continuing, you agree to our Terms & Privacy Policy',
                style: GoogleFonts.outfit(
                  fontSize: 10.5, fontWeight: FontWeight.w400,
                  color: const Color(0xFF94A3B8),
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
  // Stat KPI Card
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildStatCard(IconData icon, String value, String label, Color color, Color bg) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          children: [
            Container(
              width: 30, height: 30,
              decoration: BoxDecoration(
                color: bg, borderRadius: BorderRadius.circular(9),
                border: Border.all(color: color.withValues(alpha: 0.20)),
              ),
              child: Icon(icon, size: 15, color: color),
            ),
            const SizedBox(height: 6),
            Text(value, style: GoogleFonts.outfit(
              fontSize: 13, fontWeight: FontWeight.w800,
              color: const Color(0xFF0F172A), height: 1.1,
            )),
            const SizedBox(height: 1),
            Text(label, style: GoogleFonts.outfit(
              fontSize: 10, fontWeight: FontWeight.w500,
              color: const Color(0xFF64748B),
            )),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Feature Card
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildFeatureCard(IconData icon, String title, String subtitle, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              color: bg, borderRadius: BorderRadius.circular(12),
              border: Border.all(color: color.withValues(alpha: 0.22)),
            ),
            child: Icon(icon, size: 20, color: color),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.outfit(
                  fontSize: 13, fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                )),
                const SizedBox(height: 1),
                Text(subtitle, style: GoogleFonts.outfit(
                  fontSize: 11.5, fontWeight: FontWeight.w400,
                  color: const Color(0xFF64748B),
                )),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Trust Badge Pill
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildTrustPill(IconData icon, String label, Color color, Color bg, Color border) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: bg, borderRadius: BorderRadius.circular(20),
        border: Border.all(color: border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 11, color: color),
          const SizedBox(width: 4),
          Text(label, style: GoogleFonts.outfit(
            fontSize: 10.5, fontWeight: FontWeight.w600, color: color,
          )),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Particle dot decoration
  // ─────────────────────────────────────────────────────────────────────────────
  List<Widget> _buildParticleDots(Size size) {
    final rng = math.Random(42);
    return List.generate(16, (i) {
      final x = rng.nextDouble() * size.width;
      final y = rng.nextDouble() * size.height * 0.42;
      final s = 1.5 + rng.nextDouble() * 2.5;
      return Positioned(
        left: x, top: y,
        child: Container(
          width: s, height: s,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: const Color(0xFF2A7DE1).withValues(alpha: 0.08 + rng.nextDouble() * 0.10),
          ),
        ),
      );
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated ECG Heartbeat Wave Painter
// ─────────────────────────────────────────────────────────────────────────────
class _EcgWavePainter extends CustomPainter {
  final double progress;
  const _EcgWavePainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final cy = size.height / 2;

    // Baseline dash
    final dashPaint = Paint()
      ..color = const Color(0xFF2A7DE1).withValues(alpha: 0.12)
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;
    canvas.drawLine(Offset(0, cy), Offset(w, cy), dashPaint);

    // ECG path
    final path = Path();
    path.moveTo(0, cy);
    path.lineTo(w * 0.10, cy);
    path.lineTo(w * 0.14, cy - 7);
    path.lineTo(w * 0.18, cy + 7);
    path.lineTo(w * 0.21, cy - 15);
    path.lineTo(w * 0.25, cy + 15);
    path.lineTo(w * 0.29, cy);
    path.lineTo(w * 0.46, cy);
    path.lineTo(w * 0.50, cy - 9);
    path.lineTo(w * 0.53, cy + 9);
    path.lineTo(w * 0.56, cy);
    path.lineTo(w * 0.70, cy);
    path.lineTo(w * 0.73, cy - 16);
    path.lineTo(w * 0.77, cy + 16);
    path.lineTo(w * 0.81, cy);
    path.lineTo(w, cy);

    // Gradient paint
    final wavePaint = Paint()
      ..shader = LinearGradient(
        colors: [
          Colors.transparent,
          const Color(0xFF2A7DE1).withValues(alpha: 0.6 + progress * 0.4),
          const Color(0xFF4FD1C5),
          const Color(0xFF2A7DE1).withValues(alpha: 0.6 + progress * 0.4),
          Colors.transparent,
        ],
        stops: const [0.0, 0.25, 0.55, 0.80, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, w, size.height))
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(path, wavePaint);
  }

  @override
  bool shouldRepaint(covariant _EcgWavePainter old) => old.progress != progress;
}

// ─────────────────────────────────────────────────────────────────────────────
// Primary CTA Button (scale-on-press with blue gradient)
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
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 110));
    _scale = Tween<double>(begin: 1.0, end: 0.97)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _ctrl.forward(),
      onTapUp: (_) { _ctrl.reverse(); widget.onPressed(); },
      onTapCancel: () => _ctrl.reverse(),
      child: ScaleTransition(
        scale: _scale,
        child: Container(
          width: double.infinity, height: 52,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF2A7DE1), Color(0xFF1E5BB5)],
              begin: Alignment.centerLeft, end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF2A7DE1).withValues(alpha: 0.38),
                blurRadius: 20, offset: const Offset(0, 7),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(widget.label, style: GoogleFonts.outfit(
                fontSize: 15, fontWeight: FontWeight.w700,
                color: Colors.white, letterSpacing: 0.2,
              )),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.22),
                  shape: BoxShape.circle,
                ),
                child: Icon(widget.icon, size: 13, color: Colors.white),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Secondary CTA Button (outlined, white bg)
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
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 110));
    _scale = Tween<double>(begin: 1.0, end: 0.97)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _ctrl.forward(),
      onTapUp: (_) { _ctrl.reverse(); widget.onPressed(); },
      onTapCancel: () => _ctrl.reverse(),
      child: ScaleTransition(
        scale: _scale,
        child: Container(
          width: double.infinity, height: 50,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
            border: Border.all(color: const Color(0xFFCBD5E1), width: 1.2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 8, offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: Text(widget.label, style: GoogleFonts.outfit(
              fontSize: 15, fontWeight: FontWeight.w700,
              color: const Color(0xFF0F172A), letterSpacing: 0.2,
            )),
          ),
        ),
      ),
    );
  }
}
