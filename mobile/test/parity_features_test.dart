import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mediflow_mobile/features/screens/auth/register_screen.dart';
import 'package:mediflow_mobile/features/screens/auth/login_screen.dart';
import 'package:mediflow_mobile/features/screens/doctors/book_appointment_screen.dart';
import 'package:mediflow_mobile/features/screens/doctors/doctor_profile_screen.dart';
import 'package:mediflow_mobile/features/screens/profile/edit_profile_screen.dart';
import 'package:mediflow_mobile/shared/widgets/now_consulting_widget.dart';
import 'package:mediflow_mobile/features/auth/auth_provider.dart';
import 'package:mediflow_mobile/features/patient/patient_providers.dart';
import 'package:mediflow_mobile/shared/models/models.dart';

class MockAuthNotifier extends AuthNotifier {
  MockAuthNotifier(AuthState initialState) {
    state = initialState;
  }
}

void main() {
  group('Feature One: Registration Validation Parity', () {
    testWidgets('RegisterScreen validates required fields and password strength', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: RegisterScreen(),
          ),
        ),
      );
      await tester.pump();

      // Ensure form fields are present
      expect(find.text('Full Name'), findsOneWidget);
      expect(find.text('Email Address'), findsOneWidget);
      expect(find.text('Phone Number'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
      expect(find.text('Confirm Password'), findsOneWidget);

      // Attempt to submit empty form by tapping Create Account
      final createAccountText = find.text('Create Account');
      expect(createAccountText, findsWidgets);
      await tester.ensureVisible(createAccountText.last);
      await tester.tap(createAccountText.last);
      await tester.pump();

      // Form validation errors should be displayed
      expect(find.text('Full name is required'), findsOneWidget);
      expect(find.text('Email address is required'), findsOneWidget);
      expect(find.text('Phone number is required'), findsOneWidget);
      expect(find.text('Password is required'), findsOneWidget);

      // Fill in invalid inputs
      final nameField = find.widgetWithText(TextFormField, 'Enter your full name');
      final emailField = find.widgetWithText(TextFormField, 'patient@example.com');
      final phoneField = find.widgetWithText(TextFormField, '+94 71 234 5678');
      final passField = find.widgetWithText(TextFormField, 'Min. 8 characters');
      final confField = find.widgetWithText(TextFormField, 'Re-enter password');

      await tester.enterText(nameField, 'J'); // Too short (<2)
      await tester.enterText(emailField, 'invalid-email');
      await tester.enterText(phoneField, '123'); // Too short (<9 digits)
      await tester.enterText(passField, 'pass'); // < 8 characters
      await tester.enterText(confField, 'mismatch');

      await tester.ensureVisible(createAccountText.last);
      await tester.tap(createAccountText.last);
      await tester.pump();

      expect(find.text('Name must be at least 2 characters'), findsOneWidget);
      expect(find.text('Please enter a valid email address'), findsOneWidget);
      expect(find.text('Please enter a valid phone number (min 9 digits)'), findsOneWidget);
      expect(find.text('Password must be at least 8 characters'), findsOneWidget);
      expect(find.text('Passwords do not match'), findsOneWidget);
    });

    testWidgets('LoginScreen does not render Cloud indicator pill', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: LoginScreen(),
          ),
        ),
      );
      await tester.pump();
      expect(find.text('Cloud'), findsNothing);
    });
  });

  group('Feature Two: Appointment Booking Date and Time Parity', () {
    testWidgets('BookAppointmentScreen renders 60-day calendar range, time slots, and fee info', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            doctorByIdProvider(1).overrideWith((ref) async => const DoctorModel(
                  id: 1,
                  fullName: 'Dr. Gregory House',
                  isActive: true,
                  specialties: [],
                  averageRating: 4.8,
                  reviewCount: 42,
                  availability: [],
                  reviews: [],
                  consultationFee: 3500.0,
                )),
            myAppointmentsProvider.overrideWith((ref) async => []),
          ],
          child: const MaterialApp(
            home: BookAppointmentScreen(doctorId: 1),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Book Appointment'), findsOneWidget);
      expect(find.text('Dr. Gregory House'), findsOneWidget);
      expect(find.text('Rs. 3500'), findsOneWidget);
      expect(find.text('Select Date (Next 60 Days)'), findsOneWidget);
      expect(find.text('Available Consultation Slots'), findsOneWidget);
      expect(find.text('9:00 AM – 5:00 PM'), findsOneWidget);
    });

    testWidgets('DoctorProfileScreen renders 17 time slots matching web and 60-day calendar shortcut', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            doctorByIdProvider(1).overrideWith((ref) async => const DoctorModel(
                  id: 1,
                  fullName: 'Dr. Gregory House',
                  isActive: true,
                  specialties: [SpecialtyModel(id: 1, name: 'General Medicine')],
                  averageRating: 4.8,
                  reviewCount: 42,
                  availability: [],
                  reviews: [],
                  consultationFee: 3500.0,
                )),
            myAppointmentsProvider.overrideWith((ref) async => []),
          ],
          child: const MaterialApp(
            home: DoctorProfileScreen(id: 1),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('17 Slots'), findsOneWidget);
      expect(find.text('09:00 AM'), findsOneWidget);
      expect(find.text('05:00 PM'), findsOneWidget);
      expect(find.text('Need another date? Open 60-Day Calendar'), findsOneWidget);
    });
  });

  group('Feature Three: Patient Profile Editing Parity', () {
    testWidgets('EditProfileScreen renders editable fields with existing data', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authProvider.overrideWith(
              (ref) => MockAuthNotifier(
                const AuthState(
                  user: UserModel(
                    userId: 1,
                    fullName: 'John Doe',
                    email: 'john.doe@example.com',
                    role: 'Patient',
                    token: 'fake-jwt-token',
                  ),
                ),
              ),
            ),
          ],
          child: const MaterialApp(
            home: EditProfileScreen(),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      expect(find.text('Edit Health Profile'), findsOneWidget);
      expect(find.text('john.doe@example.com'), findsOneWidget);
      expect(find.text('Account email cannot be modified.'), findsOneWidget);
      expect(find.text('Save Health Records'), findsOneWidget);
    });
  });

  group('Feature Four: Live Consultation Queue and Hub Parity', () {
    testWidgets('NowConsultingWidget renders empty state when no booked appointments', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            myAppointmentsProvider.overrideWith((ref) async => []),
          ],
          child: const MaterialApp(
            home: Scaffold(
              body: NowConsultingWidget(),
            ),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      expect(find.text('CONSULTATION STATUS'), findsOneWidget);
      expect(find.text('No Booked Doctor Consultations'), findsOneWidget);
    });

    testWidgets('NowConsultingWidget renders queue comparison when doctor and appointment number provided', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            myAppointmentsProvider.overrideWith((ref) async => [
              AppointmentModel(
                id: 10,
                doctorId: 2,
                doctorName: 'Dr. Sarah Jenkins',
                specialtyName: 'Cardiology',
                appointmentDateTime: DateTime.now().add(const Duration(hours: 1)),
                status: 'Confirmed',
                appointmentNumber: 'A-005',
                hasRated: false,
              ),
            ]),
          ],
          child: const MaterialApp(
            home: Scaffold(
              body: NowConsultingWidget(
                doctorId: 2,
                doctorName: 'Dr. Sarah Jenkins',
                patientAppointmentNumber: 'A-005',
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      expect(find.text('CONSULTATION STATUS'), findsOneWidget);
      expect(
        find.textContaining('Your token is A-005'),
        findsOneWidget,
      );
    });
  });
}
