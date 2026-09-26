import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/widgets.dart';
import 'auth/login_screen.dart';
import 'auth/register_screen.dart';

/// MediFlow AI — Get Started Screen
/// White and light blue medical theme mirroring the official website landing:
/// - Official MediFlow Logo
/// - "AI-POWERED HEALTHCARE" badge
/// - "Smart Healthcare At Your Fingertips" headline with cyan-teal gradient accent
/// - Subtitle description
/// - Subtle glowing ECG heartbeat line (without operational text as requested)
/// - 4 Key Clinical Metric Cards (10K+ Patients, 500+ Doctors, 4.9★ Rating, 24/7 Support)
/// - 4 Interactive Feature Cards (Smart Doctor Matching, AI Clinical Support, Digital Prescriptions, Real-time Monitoring)
/// - Trust & Security badges (256-bit JWT, RBAC Secured, HIPAA Aligned)
/// - Full-width pill-shaped CTAs (Get Started, Create New Account)
class GetStartedScreen extends StatefulWidget {
  const GetStartedScreen({super.key});

  @override
  State<GetStartedScreen> createState() => _GetStartedScreenState();
}

class _GetStartedScreenState extends State<GetStartedScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _animCtrl;
  late final Animation<double> _fadeAnim;
  late final Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ));

    _animCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.04), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));

    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
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
        transitionDuration: const Duration(milliseconds: 320),
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
        transitionDuration: const Duration(milliseconds: 320),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          // ── Background Ambient Light Blue Gradients ────────────────────────
          Positioned(
            top: -120,
            right: -80,
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFF2A7DE1).withValues(alpha: 0.10),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: 260,
            left: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFF4FD1C5).withValues(alpha: 0.12),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // ── Scrollable Body ────────────────────────────────────────────────
          SafeArea(
            child: FadeTransition(
              opacity: _fadeAnim,
              child: SlideTransition(
                position: _slideAnim,
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Official MediFlow Brand Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const MediFlowLogo(
                            variant: MediFlowLogoVariant.horizontal,
                            height: 32,
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFECFDF5),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFA7F3D0)),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF059669),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Portal Active',
                                  style: GoogleFonts.outfit(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: const Color(0xFF047857),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // 2. AI-Powered Healthcare Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF6FF),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFBFDBFE)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: Color(0xFF22C55E),
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Icon(
                              Icons.auto_awesome_rounded,
                              size: 13,
                              color: Color(0xFF2A7DE1),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'AI-POWERED HEALTHCARE',
                              style: GoogleFonts.outfit(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF2A7DE1),
                                letterSpacing: 0.6,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 16),

                      // 3. Main Headline
                      Text(
                        'Smart Healthcare',
                        style: GoogleFonts.outfit(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF0F172A),
                          letterSpacing: -0.8,
                          height: 1.1,
                        ),
                      ),
                      ShaderMask(
                        shaderCallback: (bounds) => const LinearGradient(
                          colors: [Color(0xFF2A7DE1), Color(0xFF4FD1C5)],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ).createShader(bounds),
                        child: Text(
                          'At Your Fingertips',
                          style: GoogleFonts.outfit(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -0.8,
                            height: 1.1,
                          ),
                        ),
                      ),

                      const SizedBox(height: 12),

                      // 4. Subtitle Description
                      Text(
                        'Connect with certified specialists, manage appointments, and receive digital prescriptions — all in one secure AI platform.',
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF64748B),
                          height: 1.5,
                        ),
                      ),

                      const SizedBox(height: 20),

                      // 5. Subtle ECG Heartbeat Pulse Line
                      SizedBox(
                        height: 38,
                        width: double.infinity,
                        child: CustomPaint(
                          painter: _EcgWavePainter(),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // 6. 4 Metric KPI Cards (10K+ Patients, 500+ Doctors, 4.9★ Rating, 24/7 Support)
                      Row(
                        children: [
                          _buildStatCard(
                            icon: Icons.people_alt_rounded,
                            value: '10K+',
                            label: 'Patients',
                            color: const Color(0xFF2A7DE1),
                            bg: const Color(0xFFEFF6FF),
                          ),
                          const SizedBox(width: 8),
                          _buildStatCard(
                            icon: Icons.medical_services_rounded,
                            value: '500+',
                            label: 'Doctors',
                            color: const Color(0xFF059669),
                            bg: const Color(0xFFECFDF5),
                          ),
                          const SizedBox(width: 8),
                          _buildStatCard(
                            icon: Icons.star_rounded,
                            value: '4.9★',
                            label: 'Rating',
                            color: const Color(0xFFD97706),
                            bg: const Color(0xFFFFFBEB),
                          ),
                          const SizedBox(width: 8),
                          _buildStatCard(
                            icon: Icons.access_time_rounded,
                            value: '24/7',
                            label: 'Support',
                            color: const Color(0xFF7C3AED),
                            bg: const Color(0xFFFAF5FF),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // 7. 4 Clinical Feature Cards
                      _buildFeatureCard(
                        icon: Icons.person_search_rounded,
                        title: 'Smart Doctor Matching',
                        subtitle: 'AI finds the best specialist instantly',
                        color: const Color(0xFF2A7DE1),
                        bg: const Color(0xFFEFF6FF),
                      ),
                      const SizedBox(height: 10),
                      _buildFeatureCard(
                        icon: Icons.psychology_rounded,
                        title: 'AI Clinical Support',
                        subtitle: 'Evidence-based decision support',
                        color: const Color(0xFF7C3AED),
                        bg: const Color(0xFFFAF5FF),
                      ),
                      const SizedBox(height: 10),
                      _buildFeatureCard(
                        icon: Icons.medication_rounded,
                        title: 'Digital Prescriptions',
                        subtitle: 'Secure e-prescriptions & pharmacy sync',
                        color: const Color(0xFF059669),
                        bg: const Color(0xFFECFDF5),
                      ),
                      const SizedBox(height: 10),
                      _buildFeatureCard(
                        icon: Icons.monitor_heart_rounded,
                        title: 'Real-time Monitoring',
                        subtitle: 'Track appointments & health metrics',
                        color: const Color(0xFFD97706),
                        bg: const Color(0xFFFFFBEB),
                      ),

                      const SizedBox(height: 22),

                      // 8. Trust & Security Badges
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        alignment: WrapAlignment.center,
                        children: [
                          _buildTrustPill(
                            icon: Icons.verified_user_rounded,
                            label: '256-bit JWT',
                            color: const Color(0xFF22C55E),
                            bg: const Color(0xFFF0FDF4),
                            border: const Color(0xFFDCFCE7),
                          ),
                          _buildTrustPill(
                            icon: Icons.shield_rounded,
                            label: 'RBAC Secured',
                            color: const Color(0xFF2A7DE1),
                            bg: const Color(0xFFEFF6FF),
                            border: const Color(0xFFDBEAFE),
                          ),
                          _buildTrustPill(
                            icon: Icons.health_and_safety_rounded,
                            label: 'HIPAA Aligned',
                            color: const Color(0xFF7C3AED),
                            bg: const Color(0xFFFAF5FF),
                            border: const Color(0xFFF3E8FF),
                          ),
                        ],
                      ),

                      const SizedBox(height: 28),

                      // 9. Primary Action — Get Started Button
                      GestureDetector(
                        onTap: _goToLogin,
                        child: Container(
                          width: double.infinity,
                          height: 52,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF2A7DE1), Color(0xFF1E5BB5)],
                              begin: Alignment.centerLeft,
                              end: Alignment.centerRight,
                            ),
                            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF2A7DE1).withValues(alpha: 0.35),
                                blurRadius: 18,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Get Started',
                                style: GoogleFonts.outfit(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                  letterSpacing: 0.2,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                width: 26,
                                height: 26,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white.withValues(alpha: 0.20),
                                ),
                                child: const Icon(
                                  Icons.arrow_forward_rounded,
                                  size: 15,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 12),

                      // 10. Secondary Action — Create New Account Button
                      GestureDetector(
                        onTap: _goToRegister,
                        child: Container(
                          width: double.infinity,
                          height: 50,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                            border: Border.all(color: const Color(0xFFCBD5E1), width: 1.2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.04),
                                blurRadius: 10,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Text(
                              'Create New Account',
                              style: GoogleFonts.outfit(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF0F172A),
                                letterSpacing: 0.2,
                              ),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // 11. Disclaimer Note
                      Center(
                        child: Text(
                          'By continuing, you agree to our Terms & Privacy Policy',
                          style: GoogleFonts.outfit(
                            fontSize: 11,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF94A3B8),
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Stat Metric Card Widget
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildStatCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
    required Color bg,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 12,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: color.withValues(alpha: 0.2)),
              ),
              child: Icon(icon, size: 16, color: color),
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: GoogleFonts.outfit(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF0F172A),
                height: 1.1,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Clinical Feature Card Widget
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildFeatureCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required Color bg,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: bg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: color.withValues(alpha: 0.25)),
            ),
            child: Icon(icon, size: 20, color: color),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Trust Badge Pill Widget
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildTrustPill({
    required IconData icon,
    required String label,
    required Color color,
    required Color bg,
    required Color border,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 5),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ECG Heartbeat Wave Painter
// ─────────────────────────────────────────────────────────────────────────────
class _EcgWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final cy = size.height / 2;

    // Background dash line
    final dashPaint = Paint()
      ..color = const Color(0xFF2A7DE1).withValues(alpha: 0.14)
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    canvas.drawLine(Offset(0, cy), Offset(w, cy), dashPaint);

    // Heartbeat waveform path matching website SVG
    final path = Path();
    path.moveTo(0, cy);
    path.lineTo(w * 0.12, cy);
    path.lineTo(w * 0.16, cy - 8);
    path.lineTo(w * 0.20, cy + 8);
    path.lineTo(w * 0.23, cy - 16);
    path.lineTo(w * 0.27, cy + 16);
    path.lineTo(w * 0.31, cy);
    path.lineTo(w * 0.48, cy);
    path.lineTo(w * 0.52, cy - 10);
    path.lineTo(w * 0.55, cy + 10);
    path.lineTo(w * 0.58, cy);
    path.lineTo(w * 0.72, cy);
    path.lineTo(w * 0.75, cy - 18);
    path.lineTo(w * 0.79, cy + 18);
    path.lineTo(w * 0.83, cy);
    path.lineTo(w, cy);

    final wavePaint = Paint()
      ..shader = const LinearGradient(
        colors: [
          Colors.transparent,
          Color(0xFF2A7DE1),
          Color(0xFF4FD1C5),
          Color(0xFF2A7DE1),
          Colors.transparent,
        ],
        stops: [0.0, 0.25, 0.55, 0.80, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, w, size.height))
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(path, wavePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
