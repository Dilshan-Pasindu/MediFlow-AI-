import 'package:flutter/foundation.dart';

/// Application-wide configuration and constants.
/// Environment-specific API base URLs are computed at runtime.
class AppConfig {
  AppConfig._();

  static const String appName = 'MediFlow AI';
  static const String appTagline = 'Smart Clinical Healthcare';

  /// Resolves the backend API base URL based on the current platform.
  ///
  /// Android Emulator  → 10.0.2.2:5224
  /// iOS / macOS / web → localhost:5224
  /// Physical device   → Set via [physicalDeviceIp]
  static String get apiBaseUrl {
    // Override for physical device testing (keep empty for simulator/emulator)
    const physicalDeviceIp = '';

    if (physicalDeviceIp.isNotEmpty) {
      return 'http://$physicalDeviceIp:5224/api';
    }
    if (kIsWeb) return 'http://localhost:5224/api';
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5224/api';
    }
    return 'http://localhost:5224/api';
  }

  /// AI service URL (FastAPI/uvicorn)
  static String get aiBaseUrl {
    if (kIsWeb) return 'http://localhost:8000';
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
