// ── Domain Models ─────────────────────────────────────────────────────────────
// Mirrors the ASP.NET Core response DTOs exactly.

class UserModel {
  final int userId;
  final String fullName;
  final String email;
  final String role;
  final String token;
  final String? expiresAt;

  const UserModel({
    required this.userId,
    required this.fullName,
    required this.email,
    required this.role,
    required this.token,
    this.expiresAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> j) => UserModel(
        userId: j['userId'] as int? ?? 0,
        fullName: j['fullName'] as String? ?? '',
        email: j['email'] as String? ?? '',
        role: j['role'] as String? ?? 'Patient',
        token: j['token'] as String? ?? '',
        expiresAt: j['expiresAt'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'userId': userId,
        'fullName': fullName,
        'email': email,
        'role': role,
        'token': token,
        'expiresAt': expiresAt,
      };
}

class PatientProfile {
  final int id;
  final int userId;
  final String fullName;
  final String email;
  final String? phoneNumber;
  final String? dateOfBirth;
  final String? gender;
  final String? address;
  final String? bloodGroup;
  final String? allergies;
  final String? createdAt;

  const PatientProfile({
    required this.id,
    required this.userId,
    required this.fullName,
    required this.email,
    this.phoneNumber,
    this.dateOfBirth,
    this.gender,
    this.address,
    this.bloodGroup,
    this.allergies,
    this.createdAt,
  });

  factory PatientProfile.fromJson(Map<String, dynamic> j) => PatientProfile(
        id: j['id'] as int? ?? 0,
        userId: j['userId'] as int? ?? 0,
        fullName: j['fullName'] as String? ?? '',
        email: j['email'] as String? ?? '',
        phoneNumber: j['phoneNumber'] as String?,
        dateOfBirth: j['dateOfBirth'] as String?,
        gender: j['gender'] as String?,
        address: j['address'] as String?,
        bloodGroup: j['bloodGroup'] as String?,
        allergies: j['allergies'] as String?,
        createdAt: j['createdAt'] as String?,
      );
}

class DoctorModel {
  final int id;
  final String fullName;
  final String? bio;
  final String? qualifications;
  final int? experienceYears;
  final double? consultationFee;
  final bool isActive;
  final String? profilePhoto;
  final String? subSpecialty;
  final String? hospitalClinic;
  final String? languages;
  final String? location;
  final String? mbbsUniversity;
  final String? registrationNumber;
  final List<SpecialtyModel> specialties;
  final double averageRating;
  final int reviewCount;
  final List<AvailabilityModel> availability;
  final List<ReviewModel> reviews;

  const DoctorModel({
    required this.id,
    required this.fullName,
    this.bio,
    this.qualifications,
    this.experienceYears,
    this.consultationFee,
    required this.isActive,
    this.profilePhoto,
    this.subSpecialty,
    this.hospitalClinic,
    this.languages,
    this.location,
    this.mbbsUniversity,
    this.registrationNumber,
    required this.specialties,
    required this.averageRating,
    required this.reviewCount,
    required this.availability,
    required this.reviews,
  });

  factory DoctorModel.fromJson(Map<String, dynamic> j) => DoctorModel(
        id: j['id'] as int? ?? 0,
        fullName: j['fullName'] as String? ?? '',
        bio: j['bio'] as String?,
        qualifications: j['qualifications'] as String?,
        experienceYears: j['experienceYears'] as int?,
        consultationFee: (j['consultationFee'] as num?)?.toDouble(),
        isActive: j['isActive'] as bool? ?? true,
        profilePhoto: j['profilePhoto'] as String?,
        subSpecialty: j['subSpecialty'] as String?,
        hospitalClinic: j['hospitalClinic'] as String?,
        languages: j['languages'] as String?,
        location: j['location'] as String?,
        mbbsUniversity: j['mbbsUniversity'] as String?,
        registrationNumber: j['registrationNumber'] as String?,
        specialties: (j['specialties'] as List<dynamic>? ?? [])
            .map((s) => SpecialtyModel.fromJson(s as Map<String, dynamic>))
            .toList(),
        averageRating: (j['averageRating'] as num?)?.toDouble() ?? 0.0,
        reviewCount: j['reviewCount'] as int? ?? 0,
        availability: (j['availability'] as List<dynamic>? ?? [])
            .map((a) => AvailabilityModel.fromJson(a as Map<String, dynamic>))
            .toList(),
        reviews: (j['reviews'] as List<dynamic>? ?? [])
            .map((r) => ReviewModel.fromJson(r as Map<String, dynamic>))
            .toList(),
      );

  String get primarySpecialty =>
      specialties.isNotEmpty ? specialties.first.name : 'General Medicine';
}

class SpecialtyModel {
  final int id;
  final String name;
  const SpecialtyModel({required this.id, required this.name});
  factory SpecialtyModel.fromJson(Map<String, dynamic> j) =>
      SpecialtyModel(id: j['id'] as int? ?? 0, name: j['name'] as String? ?? '');
}

class AvailabilityModel {
  final String dayOfWeek;
  final String startTime;
  final String endTime;
  const AvailabilityModel({
    required this.dayOfWeek,
    required this.startTime,
    required this.endTime,
  });
  factory AvailabilityModel.fromJson(Map<String, dynamic> j) =>
      AvailabilityModel(
        dayOfWeek: j['dayOfWeek'] as String? ?? '',
        startTime: j['startTime'] as String? ?? '',
        endTime: j['endTime'] as String? ?? '',
      );
}

class ReviewModel {
  final int id;
  final int stars;
  final String? comment;
  final String? patientName;
  final String? createdAt;

  const ReviewModel({
    required this.id,
    required this.stars,
    this.comment,
    this.patientName,
    this.createdAt,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> j) => ReviewModel(
        id: j['id'] as int? ?? 0,
        stars: (j['stars'] ?? j['rating']) as int? ?? 5,
        comment: (j['comment'] ?? j['review']) as String?,
        patientName: j['patientName'] as String?,
        createdAt: j['createdAt'] as String?,
      );
}

class AppointmentModel {
  final int id;
  final String? appointmentNumber;
  final int doctorId;
  final String doctorName;
  final String? doctorQualifications;
  final String? doctorProfilePhoto;
  final String specialtyName;
  final DateTime appointmentDateTime;
  final String status;
  final double? fee;
  final String? paymentStatus;
  final String? notes;
  final String? createdAt;
  final String? cancelReason;
  final bool hasRated;
  final RatingModel? rating;

  const AppointmentModel({
    required this.id,
    this.appointmentNumber,
    required this.doctorId,
    required this.doctorName,
    this.doctorQualifications,
    this.doctorProfilePhoto,
    required this.specialtyName,
    required this.appointmentDateTime,
    required this.status,
    this.fee,
    this.paymentStatus,
    this.notes,
    this.createdAt,
    this.cancelReason,
    required this.hasRated,
    this.rating,
  });

  factory AppointmentModel.fromJson(Map<String, dynamic> j) {
    return AppointmentModel(
      id: j['id'] as int? ?? 0,
      appointmentNumber: j['appointmentNumber'] as String?,
      doctorId: j['doctorId'] as int? ?? 0,
      doctorName: j['doctorName'] as String? ?? '',
      doctorQualifications: j['doctorQualifications'] as String?,
      doctorProfilePhoto: j['doctorProfilePhoto'] as String?,
      specialtyName: j['specialtyName'] as String? ?? 'General Medicine',
      appointmentDateTime: DateTime.tryParse(
              j['appointmentDateTime'] as String? ?? '') ??
          DateTime.now(),
      status: j['status'] as String? ?? 'Pending',
      fee: (j['fee'] as num?)?.toDouble(),
      paymentStatus: j['paymentStatus'] as String?,
      notes: j['notes'] as String?,
      createdAt: j['createdAt'] as String?,
      cancelReason: j['cancelReason'] as String? ?? j['cancellationReason'] as String?,
      hasRated: j['hasRated'] as bool? ?? false,
      rating: j['rating'] != null
          ? RatingModel.fromJson(j['rating'] as Map<String, dynamic>)
          : null,
    );
  }

  bool get isUpcoming => ['Pending', 'PaymentSubmitted', 'Confirmed', 'InConsultation']
      .contains(status);
  bool get isCompleted => status == 'Completed';
  bool get isCancellable =>
      ['Pending', 'PaymentSubmitted'].contains(status) &&
      appointmentDateTime.isAfter(DateTime.now());
}

class RatingModel {
  final int stars;
  final String? comment;
  const RatingModel({required this.stars, this.comment});
  factory RatingModel.fromJson(Map<String, dynamic> j) =>
      RatingModel(stars: j['stars'] as int? ?? 5, comment: j['comment'] as String?);
}

class PrescriptionModel {
  final int id;
  final int? appointmentId;
  final String? appointmentNumber;
  final int? patientId;
  final String patientName;
  final String? patientAge;
  final String? patientGender;
  final String doctorName;
  final String? doctorSpecialty;
  final String? diagnosis;
  final String status;
  final List<PrescriptionItemModel> items;
  final int itemCount;
  final String? dateIssued;
  final String? instructions;

  const PrescriptionModel({
    required this.id,
    this.appointmentId,
    this.appointmentNumber,
    this.patientId,
    required this.patientName,
    this.patientAge,
    this.patientGender,
    required this.doctorName,
    this.doctorSpecialty,
    this.diagnosis,
    required this.status,
    required this.items,
    required this.itemCount,
    this.dateIssued,
    this.instructions,
  });

  factory PrescriptionModel.fromJson(Map<String, dynamic> j) =>
      PrescriptionModel(
        id: j['id'] as int? ?? 0,
        appointmentId: j['appointmentId'] as int?,
        appointmentNumber: j['appointmentNumber'] as String?,
        patientId: j['patientId'] as int?,
        patientName: j['patientName'] as String? ?? '',
        patientAge: j['patientAge'] as String?,
        patientGender: j['patientGender'] as String?,
        doctorName: j['doctorName'] as String? ?? '',
        doctorSpecialty: j['doctorSpecialty'] as String?,
        diagnosis: j['diagnosis'] as String?,
        status: j['status'] as String? ?? 'Active',
        items: (j['items'] as List<dynamic>? ?? [])
            .map((i) => PrescriptionItemModel.fromJson(i as Map<String, dynamic>))
            .toList(),
        itemCount: j['itemCount'] as int? ?? 0,
        dateIssued: j['dateIssued'] as String?,
        instructions: j['instructions'] as String?,
      );
}

class PrescriptionItemModel {
  final int? medicineId;
  final String medicineName;
  final String? dosage;
  final String? frequency;
  final String? duration;
  final int quantity;
  final String? instructions;

  const PrescriptionItemModel({
    this.medicineId,
    required this.medicineName,
    this.dosage,
    this.frequency,
    this.duration,
    required this.quantity,
    this.instructions,
  });

  factory PrescriptionItemModel.fromJson(Map<String, dynamic> j) =>
      PrescriptionItemModel(
        medicineId: j['medicineId'] as int?,
        medicineName: j['medicineName'] as String? ?? '',
        dosage: j['dosage'] as String?,
        frequency: j['frequency'] as String?,
        duration: j['duration'] as String?,
        quantity: j['quantity'] as int? ?? 1,
        instructions: j['instructions'] as String?,
      );
}

class OrderModel {
  final int id;
  final int? prescriptionId;
  final int? patientId;
  final String patientName;
  final int? pharmacyId;
  final String pharmacyName;
  final String? appointmentNumber;
  final String? doctorName;
  final String status;
  final List<OrderItemModel> items;
  final double totalAmount;
  final bool isPaid;
  final String? deliveryAddress;
  final String? notes;
  final String createdAt;
  final String updatedAt;
  final String? dispensedAt;

  const OrderModel({
    required this.id,
    this.prescriptionId,
    this.patientId,
    required this.patientName,
    this.pharmacyId,
    required this.pharmacyName,
    this.appointmentNumber,
    this.doctorName,
    required this.status,
    required this.items,
    required this.totalAmount,
    required this.isPaid,
    this.deliveryAddress,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
    this.dispensedAt,
  });

  factory OrderModel.fromJson(Map<String, dynamic> j) => OrderModel(
        id: j['id'] as int? ?? 0,
        prescriptionId: j['prescriptionId'] as int?,
        patientId: j['patientId'] as int?,
        patientName: j['patientName'] as String? ?? '',
        pharmacyId: j['pharmacyId'] as int?,
        pharmacyName: j['pharmacyName'] as String? ?? '',
        appointmentNumber: j['appointmentNumber'] as String?,
        doctorName: j['doctorName'] as String?,
        status: j['status'] as String? ?? 'Pending',
        items: (j['items'] as List<dynamic>? ?? [])
            .map((i) => OrderItemModel.fromJson(i as Map<String, dynamic>))
            .toList(),
        totalAmount: (j['totalAmount'] as num?)?.toDouble() ?? 0.0,
        isPaid: j['isPaid'] as bool? ?? false,
        deliveryAddress: j['deliveryAddress'] as String?,
        notes: j['notes'] as String?,
        createdAt: j['createdAt'] as String? ?? '',
        updatedAt: j['updatedAt'] as String? ?? '',
        dispensedAt: j['dispensedAt'] as String?,
      );
}

class OrderItemModel {
  final int id;
  final int? medicineId;
  final String medicineName;
  final String? dosage;
  final int quantity;
  final double unitPrice;
  final double subtotal;

  const OrderItemModel({
    required this.id,
    this.medicineId,
    required this.medicineName,
    this.dosage,
    required this.quantity,
    required this.unitPrice,
    required this.subtotal,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> j) => OrderItemModel(
        id: j['id'] as int? ?? 0,
        medicineId: j['medicineId'] as int?,
        medicineName: j['medicineName'] as String? ?? '',
        dosage: j['dosage'] as String?,
        quantity: j['quantity'] as int? ?? 1,
        unitPrice: (j['unitPrice'] as num?)?.toDouble() ?? 0.0,
        subtotal: (j['subtotal'] as num?)?.toDouble() ?? 0.0,
      );
}

class NotificationModel {
  final int id;
  final String title;
  final String message;
  final String? type;
  final bool isRead;
  final String createdAt;

  const NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    this.type,
    required this.isRead,
    required this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> j) =>
      NotificationModel(
        id: j['id'] as int? ?? 0,
        title: j['title'] as String? ?? '',
        message: j['message'] as String? ?? '',
        type: j['type'] as String?,
        isRead: j['isRead'] as bool? ?? false,
        createdAt: j['createdAt'] as String? ?? '',
      );
}

class SymptomResultModel {
  final int? submissionId;
  final String specialty;
  final int confidence;
  final String altSpecialty;
  final int altConfidence;
  final String reason;
  final bool isCrisis;

  const SymptomResultModel({
    this.submissionId,
    required this.specialty,
    required this.confidence,
    required this.altSpecialty,
    required this.altConfidence,
    required this.reason,
    required this.isCrisis,
  });

  factory SymptomResultModel.fromJson(Map<String, dynamic> j) {
    final reason = j['reason'] as String? ?? '';
    final checker = j['systemChecker'] as Map<String, dynamic>?;
    final isCrisis = reason.contains('CRITICAL CRISIS') ||
        reason.toLowerCase().contains('suicide') ||
        (checker?['status'] as String?) == 'WARNING';
    return SymptomResultModel(
      submissionId: j['submissionId'] as int?,
      specialty: j['specialty'] as String? ?? 'General Medicine',
      confidence: j['confidence'] as int? ?? 80,
      altSpecialty: j['altSpecialty'] as String? ?? 'Internal Medicine',
      altConfidence: j['altConfidence'] as int? ?? 60,
      reason: reason,
      isCrisis: isCrisis,
    );
  }
}
