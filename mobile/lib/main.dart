import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/auth_provider.dart';
import 'features/screens/splash_screen.dart';
import 'features/screens/main_shell.dart';
import 'features/screens/dashboard/dashboard_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
  ));
  runApp(const ProviderScope(child: MediFlowApp()));
}

class MediFlowApp extends ConsumerWidget {
  const MediFlowApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'MediFlow AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: const _AppNavigator(),
    );
  }
}

/// Watches auth state and routes to the appropriate root screen.
class _AppNavigator extends ConsumerWidget {
  const _AppNavigator();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);

    // Show splash while restoring session
    if (!auth.isAuthenticated) {
      return const SplashScreen();
    }
    return const MainShell(child: DashboardScreen());
  }
}
