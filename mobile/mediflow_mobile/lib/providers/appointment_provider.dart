import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import '../core/constants.dart';
import '../models/appointment.dart';
import 'auth_provider.dart';

final myAppointmentsProvider = FutureProvider<List<Appointment>>((ref) async {
  final auth = ref.watch(authProvider);
  if (!auth.isAuthenticated || auth.token == null) {
    return [];
  }

  final response = await http.get(
    Uri.parse('${AppConstants.apiBaseUrl}/patient/appointments'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${auth.token}',
    },
  );

  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(response.body);
    return data.map((json) => Appointment.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load appointments: ${response.statusCode}');
  }
});
