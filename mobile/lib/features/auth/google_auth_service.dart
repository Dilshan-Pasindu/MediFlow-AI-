import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../../core/config/app_config.dart';
import 'auth_provider.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Google Brand 4-Color Icon
// ─────────────────────────────────────────────────────────────────────────────
class GoogleBrandIcon extends StatelessWidget {
  final double size;
  const GoogleBrandIcon({super.key, this.size = 20});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _GoogleLogoPainter(),
      ),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;
    final double strokeWidth = w * 0.22;
    final double r = (w - strokeWidth) / 2;
    final center = Offset(w / 2, h / 2);
    final rect = Rect.fromCircle(center: center, radius: r);

    // Red: Top arc
    final paintRed = Paint()
      ..color = const Color(0xFFEA4335)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    // Yellow: Left arc
    final paintYellow = Paint()
      ..color = const Color(0xFFFBBC05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    // Green: Bottom arc
    final paintGreen = Paint()
      ..color = const Color(0xFF34A853)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    // Blue: Right arc
    final paintBlue = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    // Draw the 4 colored arcs
    canvas.drawArc(rect, -3.14159 * 0.75, 3.14159 * 0.50, false, paintRed);
    canvas.drawArc(rect, -3.14159 * 1.25, 3.14159 * 0.50, false, paintYellow);
    canvas.drawArc(rect, 3.14159 * 0.25, 3.14159 * 0.50, false, paintGreen);
    canvas.drawArc(rect, -3.14159 * 0.25, 3.14159 * 0.50, false, paintBlue);

    // Crossbar for the 'G'
    final barPaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.fill;
    final barRect = Rect.fromLTWH(
        w * 0.46, h * 0.50 - strokeWidth / 2, w * 0.54, strokeWidth);
    canvas.drawRect(barRect, barPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Google Sign In / Sign Up Button (Matches the website's .lp-g-btn)
// ─────────────────────────────────────────────────────────────────────────────
class GoogleSignInButton extends StatelessWidget {
  final String label;
  final bool isLoading;
  final VoidCallback onPressed;

  const GoogleSignInButton({
    super.key,
    this.label = 'Continue with Google',
    this.isLoading = false,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: OutlinedButton(
        onPressed: isLoading ? null : onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF1E293B),
          elevation: 1,
          shadowColor: Colors.black.withValues(alpha: 0.12),
          side: const BorderSide(color: Color(0xFFE2E8F0), width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
        ),
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Color(0xFF1E293B),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const GoogleBrandIcon(size: 19),
                  const SizedBox(width: 10),
                  Text(
                    label,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF1E293B),
                      letterSpacing: 0.1,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Original Google OAuth Authentication Trigger
// ─────────────────────────────────────────────────────────────────────────────
final GoogleSignIn _googleSignIn = GoogleSignIn(
  clientId: AppConfig.googleClientId,
  scopes: const <String>[
    'email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ],
);

Future<void> triggerGoogleSignIn(BuildContext context, WidgetRef ref) async {
  try {
    if (await _googleSignIn.isSignedIn()) {
      await _googleSignIn.signOut();
    }

    final GoogleSignInAccount? account = await _googleSignIn.signIn();
    if (account == null) {
      // User dismissed or cancelled the Google prompt
      return;
    }

    final GoogleSignInAuthentication auth = await account.authentication;
    final String email = account.email;
    final String fullName = account.displayName?.trim().isNotEmpty == true
        ? account.displayName!.trim()
        : email.split('@')[0];
    final String? photoUrl = account.photoUrl;
    final String? idToken = auth.idToken;

    final success = await ref.read(authProvider.notifier).signInWithGoogle(
      idToken: idToken,
      email: email,
      fullName: fullName,
      photoUrl: photoUrl,
      role: 'Patient',
    );

    if (success && context.mounted) {
      context.go('/dashboard');
    } else if (context.mounted) {
      final err = ref.read(authProvider).error ?? 'Google sign-in failed.';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(err),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  } catch (error) {
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Google Sign-In: $error'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }
}
