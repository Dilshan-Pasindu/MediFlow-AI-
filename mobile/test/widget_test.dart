import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mediflow_mobile/main.dart';
import 'package:mediflow_mobile/features/screens/auth/login_screen.dart';

void main() {
  testWidgets('MediFlowApp renders SplashScreen with branding', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MediFlowApp(),
      ),
    );

    // Verify initial branding is displayed on Splash screen
    expect(find.text('MediFlow AI'), findsOneWidget);
    expect(find.text('Smart Clinical Healthcare'), findsOneWidget);

    // Advance timer past SplashScreen delayed navigation to avoid pending timers
    await tester.pumpAndSettle(const Duration(milliseconds: 3000));
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
