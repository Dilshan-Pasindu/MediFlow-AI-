import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mediflow_mobile/screens/payment_screens.dart';

void main() {
  testWidgets('PaymentCheckoutScreen renders step indicator and summary', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: PaymentCheckoutScreen(
            appointmentId: 101,
            doctorName: 'Dr. Sarah Jenkins',
            fee: 3500.0,
          ),
        ),
      ),
    );

    // Initial render checks
    expect(find.text('Payment Checkout'), findsOneWidget);
    expect(find.text('Review'), findsOneWidget);
    expect(find.text('Authorize'), findsOneWidget);
    expect(find.text('Verified'), findsOneWidget);
    expect(find.text('Appointment & Fee Breakdown'), findsOneWidget);
    expect(find.text('Dr. Sarah Jenkins'), findsOneWidget);
    expect(find.text('Sandbox Test Cards (1-Tap Auto Fill)'), findsOneWidget);
    expect(find.text('Authorize & Pay Rs. 3500'), findsOneWidget);
  });

  testWidgets('RefundTrackingScreen renders appointment info and refund status', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: RefundTrackingScreen(
            appointmentId: 101,
          ),
        ),
      ),
    );

    expect(find.text('Refund Tracking'), findsOneWidget);
  });
}
