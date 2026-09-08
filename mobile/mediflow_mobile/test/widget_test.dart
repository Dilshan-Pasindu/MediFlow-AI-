import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mediflow_mobile/main.dart';

void main() {
  testWidgets('MediFlowApp renders LoginScreen with title and input fields', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MediFlowApp(),
      ),
    );

    // Verify app title is displayed
    expect(find.text('MediFlow AI'), findsOneWidget);
    expect(find.text('Smart Clinical Healthcare Portal'), findsOneWidget);

    // Verify Sign In button is present
    expect(find.text('Sign In'), findsOneWidget);
  });
}
