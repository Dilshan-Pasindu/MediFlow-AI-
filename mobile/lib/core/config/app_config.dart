import 'package:flutter/foundation.dart';

/// Application-wide configuration and constants.
/// Environment-specific API base URLs are computed at runtime.
class AppConfig {
  AppConfig._();

  static const String appName = 'MediFlow AI';
  static const String appTagline = 'Smart Clinical Healthcare';

  /// Resolves the backend API base URL based on the current platform.
  ///
  /// Web (Chrome/Safari) → localhost:5224
  /// Android Emulator   → 10.0.2.2:5224
  /// iOS Simulator       → localhost:5224
  /// Physical Device     → your Mac's local network IP (e.g. '172.28.17.196')
  static const String physicalDeviceIp = '172.28.17.196';

  /// Resolves the backend API base URL based on the current platform.
  static String get apiBaseUrl {
    if (kIsWeb) return 'http://localhost:5224/api';
    if (physicalDeviceIp.isNotEmpty) {
      return 'http://$physicalDeviceIp:5224/api';
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5224/api';
    }
    return 'http://localhost:5224/api';
  }

  /// AI service URL (FastAPI/uvicorn)
  static String get aiBaseUrl {
    if (kIsWeb) return 'http://localhost:8000';
    if (physicalDeviceIp.isNotEmpty) {
      return 'http://$physicalDeviceIp:8000';
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:8000';
    }
    return 'http://localhost:8000';
  }

  // ── Storage Keys ──────────────────────────────────────────────────────────
  static const String tokenKey = 'mediflow_jwt_token';
  static const String userKey = 'mediflow_user_profile';

  // ── Request Timeout ───────────────────────────────────────────────────────
  static const Duration requestTimeout = Duration(seconds: 15);

  // ── Business Rules (mirroring backend) ───────────────────────────────────
  static const int maxAppointmentAdvanceDays = 90;
  static const int maxSymptomLength = 2000;
  static const int minSymptomLength = 10;
  static const int maxNotesLength = 500;
}
