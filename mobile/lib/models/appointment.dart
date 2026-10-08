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
    final rawStatus = json['status'] ?? 'Pending';
    final parsedDt = DateTime.tryParse(json['appointmentDateTime'] ?? '')?.toLocal() ?? DateTime.now();

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final apptDay = DateTime(parsedDt.year, parsedDt.month, parsedDt.day);
    final isPastDay = apptDay.isBefore(today);

    final isExpired = isPastDay && rawStatus != 'Completed';
    final effectiveStatus = isExpired ? 'Cancelled' : rawStatus;

    return Appointment(
      id: json['id'] ?? 0,
      doctorId: json['doctorId'] ?? 0,
      doctorName: json['doctorName'] ?? 'Doctor',
      specialty: json['specialtyName'] ?? json['specialty'] ?? 'General Medicine',
      appointmentDateTime: parsedDt,
      status: effectiveStatus,
      appointmentNumber: json['appointmentNumber'],
      fee: (json['fee'] as num?)?.toDouble() ?? 0.0,
    );
  }

  bool get isPastDay {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final apptDay = DateTime(appointmentDateTime.year, appointmentDateTime.month, appointmentDateTime.day);
    return apptDay.isBefore(today);
  }

  bool get isUpcoming =>
      !isPastDay &&
      [
        'Pending',
        'PaymentPending',
        'PaymentSubmitted',
        'PaymentVerified',
        'WaitingForReceptionist',
        'Confirmed',
        'ReceptionistApproved',
        'InConsultation'
      ].contains(status);

  bool get isCancelledOrInactive {
    if (isPastDay && status != 'Completed') return true;
    final s = status.toLowerCase();
    return [
      'cancelled',
      'patientcancelled',
      'receptionistrejected',
      'refundrequested',
      'refundapproved',
      'refundprocessing',
      'refundcompleted',
      'refundrejected',
      'paymentfailed',
      'noshow',
    ].contains(s) ||
    s.contains('cancel') ||
    s.contains('reject') ||
    s.contains('refund');
  }
}
