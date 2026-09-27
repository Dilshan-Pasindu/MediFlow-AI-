import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../shared/widgets/widgets.dart';
import 'auth/login_screen.dart';
import 'auth/register_screen.dart';

// ── Design tokens ────────────────────────────────────────────────────────────
const _kBgDeep    = Color(0xFF050D1A); // near-black navy
const _kBgMid     = Color(0xFF0A1628); // dark navy
const _kCyan      = Color(0xFF00D4FF); // neon cyan (accent)
const _kCyanDark  = Color(0xFF00A8CC); // deeper cyan
const _kTeal      = Color(0xFF4FD1C5); // teal secondary

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
  late final AnimationController _ecgCtrl;
  late final AnimationController _glowCtrl;
  late final AnimationController _particleCtrl;

  late final Animation<double> _fadeAnim;
  late final Animation<Offset> _heroSlide;
  late final Animation<double> _pulseAnim;
  late final Animation<double> _ecgAnim;
  late final Animation<double> _glowAnim;
  late final Animation<double> _particleAnim;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ));

    _fadeCtrl     = AnimationController(vsync: this, duration: const Duration(milliseconds: 1000));
    _slideCtrl    = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _pulseCtrl    = AnimationController(vsync: this, duration: const Duration(milliseconds: 2500))..repeat(reverse: true);
    _ecgCtrl      = AnimationController(vsync: this, duration: const Duration(milliseconds: 2200))..repeat();
    _glowCtrl     = AnimationController(vsync: this, duration: const Duration(milliseconds: 3000))..repeat(reverse: true);
    _particleCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 8000))..repeat();

    _fadeAnim     = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut);
    _heroSlide    = Tween<Offset>(begin: const Offset(0, 0.06), end: Offset.zero)
        .animate(CurvedAnimation(parent: _slideCtrl, curve: Curves.easeOutCubic));
    _pulseAnim    = Tween<double>(begin: 0.92, end: 1.08)
        .animate(CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut));
    _ecgAnim      = Tween<double>(begin: 0.0, end: 1.0).animate(_ecgCtrl);
    _glowAnim     = Tween<double>(begin: 0.4, end: 1.0)
        .animate(CurvedAnimation(parent: _glowCtrl, curve: Curves.easeInOut));
    _particleAnim = Tween<double>(begin: 0.0, end: 1.0).animate(_particleCtrl);

    Future.delayed(const Duration(milliseconds: 60), () {
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
    _ecgCtrl.dispose();
    _glowCtrl.dispose();
    _particleCtrl.dispose();
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
      backgroundColor: _kBgDeep,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // ── Deep navy gradient background ─────────────────────────────────
          Container(
            width: size.width,
            height: size.height,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [_kBgDeep, Color(0xFF081426), _kBgMid],
                stops: [0.0, 0.5, 1.0],
              ),
            ),
          ),

          // ── Radial cyan glow — top centre ─────────────────────────────────
          Positioned(
            top: -80,
            left: size.width * 0.5 - 180,
            child: AnimatedBuilder(
              animation: _glowAnim,
              builder: (_, __) => Container(
                width: 360,
                height: 360,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      _kCyan.withValues(alpha: 0.12 * _glowAnim.value),
                      _kTeal.withValues(alpha: 0.05 * _glowAnim.value),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
          ),

          // ── Radial teal glow — bottom left ───────────────────────────────
          Positioned(
            bottom: 80, left: -60,
            child: Container(
              width: 260, height: 260,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  _kTeal.withValues(alpha: 0.08),
                  Colors.transparent,
                ]),
              ),
            ),
          ),

          // ── Subtle grid dots ─────────────────────────────────────────────
          CustomPaint(
            size: size,
            painter: _GridDotPainter(),
          ),

          // ── Floating particles ────────────────────────────────────────────
          AnimatedBuilder(
            animation: _particleAnim,
            builder: (_, __) => CustomPaint(
              size: size,
              painter: _ParticlePainter(progress: _particleAnim.value),
            ),
          ),

          // ── Main content ──────────────────────────────────────────────────
          Positioned.fill(
            child: SafeArea(
              child: FadeTransition(
                opacity: _fadeAnim,
                child: SlideTransition(
                  position: _heroSlide,
                  child: LayoutBuilder(
                    builder: (context, constraints) => SingleChildScrollView(
                      physics: const ClampingScrollPhysics(),
                      child: ConstrainedBox(
                        constraints: BoxConstraints(
                          minHeight: constraints.maxHeight,
                        ),
                        child: IntrinsicHeight(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // ─ Top header bar ──────────────────────────────────────
                              Padding(
                                padding: const EdgeInsets.fromLTRB(22, 14, 22, 0),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const MediFlowLogo(
                                      variant: MediFlowLogoVariant.horizontal,
                                      height: 28,
                                    ),
                                    // Logo badge (medical cross circle)
                                    AnimatedBuilder(
                                      animation: _pulseAnim,
                                      builder: (_, __) => Transform.scale(
                                        scale: _pulseAnim.value,
                                        child: Container(
                                          width: 42, height: 42,
                                          decoration: BoxDecoration(
                                            shape: BoxShape.circle,
                                            gradient: const LinearGradient(
                                              colors: [_kCyan, _kTeal],
                                              begin: Alignment.topLeft,
                                              end: Alignment.bottomRight,
                                            ),
                                            boxShadow: [
                                              BoxShadow(
                                                color: _kCyan.withValues(alpha: 0.45),
                                                blurRadius: 18,
                                                spreadRadius: 2,
                                              ),
                                            ],
                                          ),
                                          child: const Icon(
                                            Icons.medical_services_rounded,
                                            color: Colors.white,
                                            size: 20,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 28),

                              // ─ Main headline ───────────────────────────────────────
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 22),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Smart',
                                      style: GoogleFonts.outfit(
                                        fontSize: 40, fontWeight: FontWeight.w900,
                                        color: Colors.white, height: 1.1, letterSpacing: -1.0,
                                      ),
                                    ),
                                    ShaderMask(
                                      shaderCallback: (bounds) => const LinearGradient(
                                        colors: [_kCyan, _kTeal],
                                        begin: Alignment.centerLeft,
                                        end: Alignment.centerRight,
                                      ).createShader(bounds),
                                      child: Text(
                                        'Healthcare',
                                        style: GoogleFonts.outfit(
                                          fontSize: 40, fontWeight: FontWeight.w900,
                                          color: Colors.white, height: 1.1, letterSpacing: -1.0,
                                        ),
                                      ),
                                    ),
                                    Text(
                                      'At Your',
                                      style: GoogleFonts.outfit(
                                        fontSize: 40, fontWeight: FontWeight.w900,
                                        color: Colors.white, height: 1.1, letterSpacing: -1.0,
                                      ),
                                    ),
                                    Text(
                                      'Fingertips',
                                      style: GoogleFonts.outfit(
                                        fontSize: 40, fontWeight: FontWeight.w900,
                                        color: Colors.white, height: 1.1, letterSpacing: -1.0,
                                      ),
                                    ),

                                    const SizedBox(height: 16),

                                    Text(
                                      'Connect with certified specialists, manage\nappointments, and receive digital prescriptions\n— all in one secure AI platform.',
                                      style: GoogleFonts.outfit(
                                        fontSize: 13.5, fontWeight: FontWeight.w400,
                                        color: Colors.white.withValues(alpha: 0.70),
                                        height: 1.55,
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 24),

                              // ─ Animated ECG waveform ───────────────────────────────
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 22),
                                child: SizedBox(
                                  height: 42,
                                  width: double.infinity,
                                  child: AnimatedBuilder(
                                    animation: _ecgAnim,
                                    builder: (_, __) => CustomPaint(
                                      painter: _EcgWavePainter(progress: _ecgAnim.value),
                                    ),
                                  ),
                                ),
                              ),

                              const Spacer(),

                              // ─ Tagline ─────────────────────────────────────────────
                              Center(
                                child: Text(
                                  'Your healthcare, simplified.',
                                  style: GoogleFonts.outfit(
                                    fontSize: 13, fontWeight: FontWeight.w400,
                                    color: Colors.white.withValues(alpha: 0.55),
                                    letterSpacing: 0.2,
                                  ),
                                ),
                              ),

                              const SizedBox(height: 14),

                              // ─ Get Started CTA ────────────────────────────────────
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 22),
                                child: _CyanButton(
                                  label: 'Get Started',
                                  onPressed: _goToLogin,
                                ),
                              ),

                              const SizedBox(height: 14),

                              // ─ Create Account link ────────────────────────────────
                              Center(
                                child: GestureDetector(
                                  onTap: _goToRegister,
                                  child: Text(
                                    'Create an Account',
                                    style: GoogleFonts.outfit(
                                      fontSize: 14, fontWeight: FontWeight.w600,
                                      color: Colors.white.withValues(alpha: 0.85),
                                      decoration: TextDecoration.underline,
                                      decorationColor: Colors.white.withValues(alpha: 0.40),
                                    ),
                                  ),
                                ),
                              ),

                              const SizedBox(height: 24),

                              // ─ Footer links ────────────────────────────────────────
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16),
                                child: FittedBox(
                                  fit: BoxFit.scaleDown,
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        'Terms of Service',
                                        style: GoogleFonts.outfit(
                                          fontSize: 11, color: Colors.white.withValues(alpha: 0.35),
                                        ),
                                      ),
                                      Container(
                                        width: 3, height: 3,
                                        margin: const EdgeInsets.symmetric(horizontal: 8),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withValues(alpha: 0.25),
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      Text(
                                        'Privacy Policy',
                                        style: GoogleFonts.outfit(
                                          fontSize: 11, color: Colors.white.withValues(alpha: 0.35),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),

                              const SizedBox(height: 20),
                            ],
                          ),
                        ),
                      ),
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
// Animated ECG Heartbeat Wave Painter — glowing cyan on dark
// ─────────────────────────────────────────────────────────────────────────────
class _EcgWavePainter extends CustomPainter {
  final double progress;
  const _EcgWavePainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final cy = size.height / 2;

    // Baseline
    final dashPaint = Paint()
      ..color = _kCyan.withValues(alpha: 0.12)
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;
    canvas.drawLine(Offset(0, cy), Offset(w, cy), dashPaint);

    // ECG path
    final path = Path();
    path.moveTo(0, cy);
    path.lineTo(w * 0.08, cy);
    path.lineTo(w * 0.12, cy - 6);
    path.lineTo(w * 0.16, cy + 6);
    path.lineTo(w * 0.19, cy - 20);
    path.lineTo(w * 0.23, cy + 20);
    path.lineTo(w * 0.27, cy);
    path.lineTo(w * 0.44, cy);
    path.lineTo(w * 0.48, cy - 10);
    path.lineTo(w * 0.51, cy + 10);
    path.lineTo(w * 0.54, cy);
    path.lineTo(w * 0.68, cy);
    path.lineTo(w * 0.71, cy - 18);
    path.lineTo(w * 0.75, cy + 18);
    path.lineTo(w * 0.79, cy);
    path.lineTo(w, cy);

    // Glowing wave
    final glowPaint = Paint()
      ..shader = LinearGradient(
        colors: [
          Colors.transparent,
          _kCyan.withValues(alpha: 0.35 + progress * 0.35),
          _kCyan,
          _kTeal,
          _kCyan.withValues(alpha: 0.35 + progress * 0.35),
          Colors.transparent,
        ],
        stops: const [0.0, 0.15, 0.40, 0.60, 0.82, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, w, size.height))
      ..strokeWidth = 1.8
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    // Outer glow pass
    final outerGlow = Paint()
      ..shader = LinearGradient(
        colors: [
          Colors.transparent,
          _kCyan.withValues(alpha: 0.10 + progress * 0.12),
          _kCyan.withValues(alpha: 0.15),
          Colors.transparent,
        ],
        stops: const [0.0, 0.30, 0.65, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, w, size.height))
      ..strokeWidth = 5.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, outerGlow);
    canvas.drawPath(path, glowPaint);
  }

  @override
  bool shouldRepaint(covariant _EcgWavePainter old) => old.progress != progress;
}

// ─────────────────────────────────────────────────────────────────────────────
// Grid dot background painter
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

// ─────────────────────────────────────────────────────────────────────────────
// Floating particle painter
// ─────────────────────────────────────────────────────────────────────────────
class _ParticlePainter extends CustomPainter {
  final double progress;
  static final _rng = math.Random(99);
  static final _particles = List.generate(20, (_) => [
    _rng.nextDouble(), // x rel
    _rng.nextDouble(), // y rel
    _rng.nextDouble(), // speed factor
    _rng.nextDouble(), // size
    _rng.nextDouble(), // opacity seed
  ]);

  const _ParticlePainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    for (final p in _particles) {
      final y = (p[1] + progress * p[2] * 0.4) % 1.0;
      final opacity = (math.sin((progress + p[4]) * math.pi * 2).abs() * 0.20 + 0.03);
      canvas.drawCircle(
        Offset(p[0] * size.width, y * size.height * 0.85),
        1.0 + p[3] * 2.5,
        Paint()..color = _kCyan.withValues(alpha: opacity),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _ParticlePainter old) => old.progress != progress;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cyan glowing CTA button
// ─────────────────────────────────────────────────────────────────────────────
class _CyanButton extends StatefulWidget {
  const _CyanButton({required this.label, required this.onPressed});
  final String label;
  final VoidCallback onPressed;

  @override
  State<_CyanButton> createState() => _CyanButtonState();
}

class _CyanButtonState extends State<_CyanButton>
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
          width: double.infinity, height: 56,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [_kCyan, _kCyanDark],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(999),
            boxShadow: [
              BoxShadow(
                color: _kCyan.withValues(alpha: 0.45),
                blurRadius: 28,
                spreadRadius: 2,
                offset: const Offset(0, 8),
              ),
              BoxShadow(
                color: _kCyan.withValues(alpha: 0.18),
                blurRadius: 60,
                spreadRadius: 4,
                offset: const Offset(0, 0),
              ),
            ],
          ),
          child: Center(
            child: Text(
              widget.label,
              style: GoogleFonts.outfit(
                fontSize: 16, fontWeight: FontWeight.w800,
                color: _kBgDeep, letterSpacing: 0.3,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
