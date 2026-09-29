import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:signalr_netcore/signalr_client.dart';
import '../config/app_config.dart';

/// Payload broadcast by the backend's ConsultationHub.
class ConsultationEventPayload {
  final int appointmentId;
  final String? appointmentNumber;
  final int doctorId;
  final String? doctorName;
  final String? patientName;
  final String? status;
  final DateTime? startedAt;

  const ConsultationEventPayload({
    required this.appointmentId,
    this.appointmentNumber,
    required this.doctorId,
    this.doctorName,
    this.patientName,
    this.status,
    this.startedAt,
  });

  factory ConsultationEventPayload.fromJson(Map<String, dynamic> j) {
    return ConsultationEventPayload(
      appointmentId: (j['appointmentId'] as num?)?.toInt() ?? 0,
      appointmentNumber: j['appointmentNumber'] as String?,
      doctorId: (j['doctorId'] as num?)?.toInt() ?? 0,
      doctorName: j['doctorName'] as String?,
      patientName: j['patientName'] as String?,
      status: j['status'] as String?,
      startedAt: j['startedAt'] != null ? DateTime.tryParse(j['startedAt'] as String) : null,
    );
  }
}

typedef ConsultationEventCallback = void Function(ConsultationEventPayload payload);

/// Singleton SignalR client that connects to /hubs/consultation.
/// Mirrors the web's consultationHubService.ts behaviour.
class ConsultationHubService {
  ConsultationHubService._();
  static final ConsultationHubService instance = ConsultationHubService._();

  HubConnection? _connection;
  bool _isStarting = false;
  bool _isConnected = false;

  final List<ConsultationEventCallback> _startedListeners = [];
  final List<ConsultationEventCallback> _endedListeners = [];
  final List<VoidCallback> _reconnectedListeners = [];

  bool get isConnected => _isConnected;

  String get _hubUrl {
    final base = AppConfig.apiBaseUrl.replaceAll('/api', '');
    return '$base/hubs/consultation';
  }

  Future<void> startConnection() async {
    if (_isConnected || _isStarting) return;
    _isStarting = true;

    try {
      _connection = HubConnectionBuilder()
          .withUrl(_hubUrl)
          .withAutomaticReconnect()
          .build();

      _connection!.on('ConsultationStarted', (args) {
        if (args == null || args.isEmpty) return;
        final raw = args[0];
        if (raw is Map<String, dynamic>) {
          final payload = ConsultationEventPayload.fromJson(raw);
          for (final cb in List.of(_startedListeners)) {
            cb(payload);
          }
        }
      });

      _connection!.on('ConsultationEnded', (args) {
        if (args == null || args.isEmpty) return;
        final raw = args[0];
        if (raw is Map<String, dynamic>) {
          final payload = ConsultationEventPayload.fromJson(raw);
          for (final cb in List.of(_endedListeners)) {
            cb(payload);
          }
        }
      });

      _connection!.onreconnected(({connectionId}) {
        _isConnected = true;
        for (final cb in List.of(_reconnectedListeners)) {
          cb();
        }
      });

      _connection!.onclose(({Exception? error}) {
        _isConnected = false;
      });

      await _connection!.start();
      _isConnected = true;
    } catch (e) {
      debugPrint('[ConsultationHub] Failed to connect: $e');
    } finally {
      _isStarting = false;
    }
  }

  Future<void> joinDoctorQueue(int doctorId) async {
    if (_connection?.state != HubConnectionState.Connected) return;
    try {
      await _connection!.invoke('JoinDoctorQueue', args: [doctorId.toString()]);
    } catch (e) {
      debugPrint('[ConsultationHub] joinDoctorQueue error: $e');
    }
  }

  Future<void> leaveDoctorQueue(int doctorId) async {
    if (_connection?.state != HubConnectionState.Connected) return;
    try {
      await _connection!.invoke('LeaveDoctorQueue', args: [doctorId.toString()]);
    } catch (e) {
      debugPrint('[ConsultationHub] leaveDoctorQueue error: $e');
    }
  }

  void onConsultationStarted(ConsultationEventCallback cb) => _startedListeners.add(cb);
  void onConsultationEnded(ConsultationEventCallback cb) => _endedListeners.add(cb);
  void onReconnected(VoidCallback cb) => _reconnectedListeners.add(cb);

  void offConsultationStarted(ConsultationEventCallback cb) => _startedListeners.remove(cb);
  void offConsultationEnded(ConsultationEventCallback cb) => _endedListeners.remove(cb);
  void offReconnected(VoidCallback cb) => _reconnectedListeners.remove(cb);

  Future<void> dispose() async {
    _isConnected = false;
    _startedListeners.clear();
    _endedListeners.clear();
    _reconnectedListeners.clear();
    await _connection?.stop();
    _connection = null;
  }
}
