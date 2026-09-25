import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/auth_provider.dart';
import '../../features/screens/splash_screen.dart';
import '../../features/screens/onboarding_screen.dart';
import '../../features/screens/auth/login_screen.dart';
import '../../features/screens/auth/register_screen.dart';
import '../../features/screens/main_shell.dart';
import '../../features/screens/dashboard/dashboard_screen.dart';
import '../../features/screens/appointments/appointments_screen.dart';
import '../../features/screens/appointments/appointment_detail_screen.dart';
import '../../features/screens/doctors/find_doctor_screen.dart';
import '../../features/screens/doctors/doctor_profile_screen.dart';
import '../../features/screens/doctors/book_appointment_screen.dart';
import '../../features/screens/prescriptions/prescriptions_screen.dart';
import '../../features/screens/prescriptions/prescription_detail_screen.dart';
import '../../features/screens/orders/orders_screen.dart';
import '../../features/screens/ai/symptom_ai_screen.dart';
import '../../features/screens/notifications/notifications_screen.dart';
import '../../features/screens/profile/profile_screen.dart';
import '../../features/screens/profile/edit_profile_screen.dart';

final _rootKey = GlobalKey<NavigatorState>();

/// GoRouter config. Redirects to /login when unauthenticated.
GoRouter buildRouter(WidgetRef ref) {
  final auth = ref.watch(authProvider);

  return GoRouter(
    navigatorKey: _rootKey,
    initialLocation: '/splash',
    redirect: (context, state) {
      final authenticated = auth.isAuthenticated;
      final splashOrAuth = state.matchedLocation == '/splash' ||
          state.matchedLocation == '/onboarding' ||
          state.matchedLocation.startsWith('/login') ||
          state.matchedLocation.startsWith('/register');

      if (!authenticated && !splashOrAuth) return '/login';
      if (authenticated && (state.matchedLocation == '/login' ||
          state.matchedLocation == '/register' ||
          state.matchedLocation == '/onboarding')) {
        return '/dashboard';
      }
      return null;
    },
    routes: [
      GoRoute(path: '/splash',      builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/onboarding',  builder: (_, __) => const OnboardingScreen()),
      GoRoute(path: '/login',       builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/register',    builder: (_, __) => const RegisterScreen()),

      // Main shell (bottom nav)
      ShellRoute(
        builder: (_, __, child) => MainShell(child: child),
        routes: [
          GoRoute(path: '/dashboard',     builder: (_, __) => const DashboardScreen()),
          GoRoute(path: '/appointments',  builder: (_, __) => const AppointmentsScreen()),
          GoRoute(path: '/find-doctor',   builder: (_, __) => const FindDoctorScreen()),
          GoRoute(path: '/prescriptions', builder: (_, __) => const PrescriptionsScreen()),
          GoRoute(path: '/profile',       builder: (_, __) => const ProfileScreen()),
        ],
      ),

      // Full-page routes (no bottom nav)
      GoRoute(
        path: '/appointments/:id',
        builder: (_, state) => AppointmentDetailScreen(id: int.parse(state.pathParameters['id']!)),
      ),
      GoRoute(
        path: '/doctors/:id',
        builder: (_, state) => DoctorProfileScreen(id: int.parse(state.pathParameters['id']!)),
      ),
      GoRoute(
        path: '/doctors/:id/book',
        builder: (_, state) => BookAppointmentScreen(doctorId: int.parse(state.pathParameters['id']!)),
      ),
      GoRoute(
        path: '/prescriptions/:id',
        builder: (_, state) => PrescriptionDetailScreen(id: int.parse(state.pathParameters['id']!)),
      ),
      GoRoute(path: '/orders',        builder: (_, __) => const OrdersScreen()),
      GoRoute(path: '/symptom-check', builder: (_, __) => const SymptomAiScreen()),
      GoRoute(path: '/notifications', builder: (_, __) => const NotificationsScreen()),
      GoRoute(path: '/profile/edit',  builder: (_, __) => const EditProfileScreen()),
    ],
  );
}
