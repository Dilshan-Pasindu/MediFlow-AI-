import 'package:flutter_test/flutter_test.dart';
import 'package:mediflow_mobile/shared/models/models.dart';

void main() {
  group('Appointment Rating and Completion Model Tests', () {
    test('Completed appointment with past date retains Completed status and isCompleted == true', () {
      final pastDate = DateTime.now().subtract(const Duration(days: 3)).toIso8601String();
      final json = {
        'id': 101,
        'appointmentNumber': 'APT-20261008-0001',
        'doctorId': 1,
        'doctorName': 'John Doe',
        'specialtyName': 'Cardiology',
        'appointmentDateTime': pastDate,
        'status': 'Completed',
        'hasRated': false,
      };

      final appt = AppointmentModel.fromJson(json);
      expect(appt.status, 'Completed');
      expect(appt.isCompleted, true);
      expect(appt.isCancelledOrInactive, false);
      expect(appt.hasRated, false);
    });

    test('Completed appointment with lowercase "completed" retains Completed status', () {
      final json = {
        'id': 102,
        'appointmentNumber': 'APT-20261008-0002',
        'doctorId': 2,
        'doctorName': 'Jane Smith',
        'specialtyName': 'Neurology',
        'appointmentDateTime': DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
        'status': 'completed',
        'hasRated': true,
        'rating': {
          'stars': 5,
          'comment': 'Outstanding physician!',
        },
      };

      final appt = AppointmentModel.fromJson(json);
      expect(appt.isCompleted, true);
      expect(appt.hasRated, true);
      expect(appt.rating, isNotNull);
      expect(appt.rating!.stars, 5);
      expect(appt.rating!.comment, 'Outstanding physician!');
    });

    test('RatingModel.fromJson parses varied casing and numeric types safely', () {
      final r1 = RatingModel.fromJson({'Stars': 4, 'Comment': 'Very clear'});
      expect(r1.stars, 4);
      expect(r1.comment, 'Very clear');

      final r2 = RatingModel.fromJson({'rating': 3.0, 'review': 'Average'});
      expect(r2.stars, 3);
      expect(r2.comment, 'Average');

      final r3 = RatingModel.fromJson({'Rating': '5', 'comment': 'Top notch'});
      expect(r3.stars, 5);
      expect(r3.comment, 'Top notch');
    });

    test('AppointmentModel.copyWith updates rating seamlessly', () {
      final appt = AppointmentModel.fromJson({
        'id': 103,
        'doctorId': 1,
        'doctorName': 'Doc',
        'specialtyName': 'General',
        'appointmentDateTime': DateTime.now().toIso8601String(),
        'status': 'Completed',
        'hasRated': false,
      });

      expect(appt.hasRated, false);
      expect(appt.rating, isNull);

      final updated = appt.copyWith(
        hasRated: true,
        rating: const RatingModel(stars: 5, comment: 'Thank you doctor!'),
      );

      expect(updated.hasRated, true);
      expect(updated.rating, isNotNull);
      expect(updated.rating!.stars, 5);
      expect(updated.rating!.comment, 'Thank you doctor!');
    });
  });
}
