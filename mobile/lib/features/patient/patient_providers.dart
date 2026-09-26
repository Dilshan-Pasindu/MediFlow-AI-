import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../shared/models/models.dart';

// ── Patient Profile ───────────────────────────────────────────────────────────

final patientProfileProvider = FutureProvider<PatientProfile>((ref) async {
  final data = await ApiClient.instance.get('/patient/profile') as Map<String, dynamic>;
  return PatientProfile.fromJson(data);
});

// ── Appointments ──────────────────────────────────────────────────────────────

final myAppointmentsProvider = FutureProvider<List<AppointmentModel>>((ref) async {
  final data = await ApiClient.instance.get('/patient/appointments') as List<dynamic>;
  return data.map((j) => AppointmentModel.fromJson(j as Map<String, dynamic>)).toList();
});

// ── Doctors ───────────────────────────────────────────────────────────────────

class DoctorFilter {
  final int? specialtyId;
  final String? search;
  const DoctorFilter({this.specialtyId, this.search});
}

final doctorFilterProvider = StateProvider<DoctorFilter>((_) => const DoctorFilter());

final doctorsProvider = FutureProvider<List<DoctorModel>>((ref) async {
  final filter = ref.watch(doctorFilterProvider);
  final query = <String, dynamic>{};
  if (filter.specialtyId != null) query['specialtyId'] = filter.specialtyId;
  if (filter.search != null && filter.search!.isNotEmpty) query['search'] = filter.search;
  final data = await ApiClient.instance.get('/doctors', query: query) as List<dynamic>;
  return data.map((j) => DoctorModel.fromJson(j as Map<String, dynamic>)).toList();
});

final specialtiesProvider = FutureProvider<List<SpecialtyModel>>((ref) async {
  final data = await ApiClient.instance.get('/doctors/specialties') as List<dynamic>;
  return data.map((j) => SpecialtyModel.fromJson(j as Map<String, dynamic>)).toList();
});

final doctorByIdProvider = FutureProvider.family<DoctorModel, int>((ref, id) async {
  final data = await ApiClient.instance.get('/doctors/$id') as Map<String, dynamic>;
  return DoctorModel.fromJson(data);
});

final rankedDoctorsProvider = FutureProvider.family<List<DoctorModel>, int?>((ref, specialtyId) async {
  final query = specialtyId != null ? {'specialty': specialtyId} : <String, dynamic>{};
  final data = await ApiClient.instance.get('/doctors/ranked', query: query.map((k, v) => MapEntry(k, v))) as List<dynamic>;
  return data.map((j) => DoctorModel.fromJson(j as Map<String, dynamic>)).toList();
});

// ── Prescriptions ─────────────────────────────────────────────────────────────

final myPrescriptionsProvider = FutureProvider<List<PrescriptionModel>>((ref) async {
  final data = await ApiClient.instance.get('/prescriptions/my') as List<dynamic>;
  return data.map((j) => PrescriptionModel.fromJson(j as Map<String, dynamic>)).toList();
});

final prescriptionByIdProvider = FutureProvider.family<PrescriptionModel, int>((ref, id) async {
  final data = await ApiClient.instance.get('/prescriptions/$id') as Map<String, dynamic>;
  return PrescriptionModel.fromJson(data);
});

// ── Orders ────────────────────────────────────────────────────────────────────

final myOrdersProvider = FutureProvider<List<OrderModel>>((ref) async {
  final data = await ApiClient.instance.get('/orders/my') as List<dynamic>;
  return data.map((j) => OrderModel.fromJson(j as Map<String, dynamic>)).toList();
});

// ── Notifications ─────────────────────────────────────────────────────────────

final notificationsProvider = FutureProvider<List<NotificationModel>>((ref) async {
  final data = await ApiClient.instance.get('/notifications') as List<dynamic>;
  return data.map((j) => NotificationModel.fromJson(j as Map<String, dynamic>)).toList();
});

final unreadCountProvider = Provider<int>((ref) {
  final notifications = ref.watch(notificationsProvider);
  return notifications.valueOrNull
      ?.where((n) => !n.isRead)
      .length ?? 0;
});
