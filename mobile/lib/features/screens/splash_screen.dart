import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../features/auth/auth_provider.dart';
import '../../shared/widgets/widgets.dart';
import 'get_started_screen.dart';

/// Splash screen: shown on cold start while session is being restored.
/// Transitions to GetStartedScreen (new user) or MainShell (authenticated).
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _fadeAnim;
  late final Animation<double> _scaleAnim;
  bool _navigated = false;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ));

    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _fadeAnim  = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);
    _scaleAnim = Tween<double>(begin: 0.75, end: 1.0).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeOutBack),
    );
    _ctrl.forward();

    // Fast 1400ms transition to GetStartedScreen
    Future.delayed(const Duration(milliseconds: 1400), _navigate);
  }

  void _navigate() {
    if (_navigated || !mounted) return;
    _navigated = true;
    final auth = ref.read(authProvider);
    if (auth.isAuthenticated) return;
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (_, anim, __) => const GetStartedScreen(),
        transitionsBuilder: (_, anim, __, child) =>
            FadeTransition(opacity: anim, child: child),
        transitionDuration: const Duration(milliseconds: 350),
      ),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    if (auth.isAuthenticated && !_navigated) {
      _navigated = true;
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0B2E4A),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0B2E4A),
              Color(0xFF1565C0),
              Color(0xFF1A1B4B),
            ],
            stops: [0.0, 0.5, 1.0],
          ),
        ),
        child: Center(
          child: FadeTransition(
            opacity: _fadeAnim,
            child: ScaleTransition(
              scale: _scaleAnim,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Official MediFlow Logo with Heartbeat Pumping Animation
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 22),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.25),
                          blurRadius: 36,
                          offset: const Offset(0, 12),
                        ),
                        BoxShadow(
                          color: const Color(0xFF4FD1C5).withValues(alpha: 0.30),
                          blurRadius: 30,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const MediFlowAnimatedLogo(
                      variant: MediFlowLogoVariant.full,
                      height: 110,
                    ),
                  ),
                  const SizedBox(height: 28),
                  Text(
                    'Smart Clinical Healthcare',
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Colors.white.withValues(alpha: 0.80),
                      letterSpacing: 0.4,
                    ),
                  ),
                  const SizedBox(height: 48),
                  SizedBox(
                    width: 24, height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.2,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        const Color(0xFF4FD1C5).withValues(alpha: 0.90),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
