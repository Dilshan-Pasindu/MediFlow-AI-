class Appointment {
  final int id;
  final int doctorId;
  final String doctorName;
  final String specialty;
  final DateTime appointmentDateTime;
  final String status;
  final String? appointmentNumber;
  final double fee;

  const Appointment({
    required this.id,
    required this.doctorId,
    required this.doctorName,
    required this.specialty,
    required this.appointmentDateTime,
    required this.status,
    this.appointmentNumber,
    required this.fee,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id'] ?? 0,
      doctorId: json['doctorId'] ?? 0,
      doctorName: json['doctorName'] ?? 'Doctor',
      specialty: json['specialty'] ?? 'General Medicine',
      appointmentDateTime: DateTime.tryParse(json['appointmentDateTime'] ?? '') ?? DateTime.now(),
      status: json['status'] ?? 'Pending',
      appointmentNumber: json['appointmentNumber'],
      fee: (json['fee'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
