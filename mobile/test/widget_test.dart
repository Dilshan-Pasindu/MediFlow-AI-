import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mediflow_mobile/main.dart';
import 'package:mediflow_mobile/features/screens/auth/login_screen.dart';
import 'package:mediflow_mobile/shared/widgets/widgets.dart';

void main() {
  testWidgets('MediFlowApp renders SplashScreen with branding', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MediFlowApp(),
      ),
    );

    // Verify initial branding is displayed on Splash screen
    expect(find.byType(MediFlowAnimatedLogo), findsOneWidget);
    expect(find.text('Smart Clinical Healthcare'), findsOneWidget);

    // Advance timer past SplashScreen delayed navigation and route transitions
    await tester.pump(const Duration(milliseconds: 1400));
    await tester.pump(const Duration(milliseconds: 100));
    await tester.pump(const Duration(milliseconds: 1000));
  });

  testWidgets('LoginScreen renders email, password inputs, and Sign In action', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: LoginScreen(),
        ),
      ),
    );

    // Verify LoginScreen header and form inputs
    expect(find.text('Sign In'), findsWidgets);
    expect(find.byType(TextFormField), findsNWidgets(2));
  });
}
