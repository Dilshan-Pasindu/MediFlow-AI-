import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import 'auth/login_screen.dart';
import 'auth/register_screen.dart';

/// Onboarding screen shown on first launch.
/// Showcases key patient features and leads to login/register.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _page = 0;

  static const _pages = [
    _PageData(
      emoji: '🩺',
      title: 'Find Specialist\nDoctors',
      subtitle: 'Browse verified specialists by specialty, rating, or fee. Book in seconds.',
      gradient: [Color(0xFF1A1B4B), Color(0xFF2D2BE8)],
    ),
    _PageData(
      emoji: '🤖',
      title: 'AI Symptom\nAnalysis',
      subtitle: 'Describe your symptoms and our AI recommends the right specialist for you.',
      gradient: [Color(0xFF2D2BE8), Color(0xFF6C3AE0)],
    ),
    _PageData(
      emoji: '💊',
      title: 'E-Prescriptions\n& Orders',
      subtitle: 'Access your digital prescriptions and track medicine orders from any pharmacy.',
      gradient: [Color(0xFF1E3A5F), Color(0xFF0284C7)],
    ),
    _PageData(
      emoji: '📋',
      title: 'Manage All\nAppointments',
      subtitle: 'View, track, and cancel appointments. Rate your doctors after consultations.',
      gradient: [Color(0xFF1A1B4B), Color(0xFF4F46E5)],
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _next() {
    if (_page < _pages.length - 1) {
      _controller.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    }
  }

  void _goToLogin() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  void _goToRegister() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const RegisterScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = _pages[_page];
    final isLast = _page == _pages.length - 1;

    return Scaffold(
      body: Stack(
        children: [
          // Background
          AnimatedContainer(
            duration: const Duration(milliseconds: 400),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: data.gradient,
              ),
            ),
          ),

          // Decorative circles
          Positioned(top: -60, right: -60,
            child: Container(width: 200, height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.05),
              ),
            ),
          ),
          Positioned(bottom: 120, left: -40,
            child: Container(width: 150, height: 150,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.04),
              ),
            ),
          ),

          PageView.builder(
            controller: _controller,
            itemCount: _pages.length,
            onPageChanged: (i) => setState(() => _page = i),
            itemBuilder: (_, i) => _PageContent(data: _pages[i]),
          ),

          // Bottom controls
          Positioned(
            bottom: 0, left: 0, right: 0,
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                child: Column(
                  children: [
                    // Page indicators
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(_pages.length, (i) =>
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: i == _page ? 24 : 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: i == _page ? AppTheme.accentGreen : Colors.white38,
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),

                    if (isLast) ...[
                      // Get Started (green accent)
                      SizedBox(
                        width: double.infinity, height: 52,
                        child: ElevatedButton(
                          onPressed: _goToLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.accentGreen,
                            foregroundColor: AppTheme.textPrimary,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                            ),
                          ),
                          child: Text('Get Started',
                            style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed: _goToRegister,
                        child: Text("Don't have an account? Register",
                          style: GoogleFonts.outfit(fontSize: 13, color: Colors.white70, fontWeight: FontWeight.w500),
                        ),
                      ),
                    ] else ...[
                      Row(
                        children: [
                          TextButton(
                            onPressed: _goToLogin,
                            child: Text('Skip',
                              style: GoogleFonts.outfit(fontSize: 14, color: Colors.white60),
                            ),
                          ),
                          const Spacer(),
                          ElevatedButton(
                            onPressed: _next,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.accentGreen,
                              foregroundColor: AppTheme.textPrimary,
                              shape: const CircleBorder(),
                              padding: const EdgeInsets.all(14),
                            ),
                            child: const Icon(Icons.arrow_forward_rounded, size: 22),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PageData {
  final String emoji;
  final String title;
  final String subtitle;
  final List<Color> gradient;
  const _PageData({required this.emoji, required this.title, required this.subtitle, required this.gradient});
}

class _PageContent extends StatelessWidget {
  const _PageContent({required this.data});
  final _PageData data;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(32, 80, 32, 160),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Emoji icon in glass container
          Container(
            width: 120, height: 120,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: Colors.white.withOpacity(0.2)),
            ),
            child: Center(
              child: Text(data.emoji, style: const TextStyle(fontSize: 56)),
            ),
          ),
          const SizedBox(height: 40),
          Text(
            data.title,
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(
              fontSize: 32, fontWeight: FontWeight.w800,
              color: Colors.white, height: 1.15,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            data.subtitle,
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(fontSize: 15, color: Colors.white70, height: 1.5),
          ),
        ],
      ),
    );
  }
}
