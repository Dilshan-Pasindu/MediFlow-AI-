import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Application-wide configuration and constants.
/// Environment-specific API base URLs are computed at runtime.
class AppConfig {
  AppConfig._();

  static const String appName = 'MediFlow AI';
  static const String appTagline = 'Smart Clinical Healthcare';

  /// Google OAuth Web Client ID (matches frontend .env)
  static const String googleClientId =
      '829691660050-tljhqp9iau6cgbk3nnln71p8971hpaa2.apps.googleusercontent.com';

  /// Production / Staging Cloud Base URLs (Render)
  static const String cloudApiBaseUrl = 'https://mediflow-ai-2.onrender.com/api';
  static const String cloudAiBaseUrl = 'https://mediflow-ai-1-q0d9.onrender.com';

  /// Local Development URLs
  static const String localHostApiUrl = 'http://localhost:5224/api';
  static const String androidEmulatorApiUrl = 'http://10.0.2.2:5224/api';

  /// Your Mac's current LAN IP — update if network changes.
  /// Run: ipconfig getifaddr en0
  static const String physicalDeviceIp = '192.168.8.104';
  static const String physicalDeviceApiUrl = 'http://192.168.8.104:5224/api';

  static const String customApiUrlKey = 'mediflow_custom_api_url';
  static const String customAiUrlKey = 'mediflow_custom_ai_url';
  static String? _customApiBaseUrl;
  static String? _customAiBaseUrl;

  /// Optional initialization at startup to load any saved custom server URL
  static Future<void> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _customApiBaseUrl = prefs.getString(customApiUrlKey);
      _customAiBaseUrl = prefs.getString(customAiUrlKey);
    } catch (_) {}
  }

  static String? get customApiBaseUrl => _customApiBaseUrl;
  static String? get customAiBaseUrl => _customAiBaseUrl;

  static Future<void> setCustomApiBaseUrl(String? url) async {
    final trimmed = url?.trim();
    _customApiBaseUrl = (trimmed != null && trimmed.isNotEmpty) ? trimmed : null;
    try {
      final prefs = await SharedPreferences.getInstance();
      if (_customApiBaseUrl == null) {
        await prefs.remove(customApiUrlKey);
      } else {
        await prefs.setString(customApiUrlKey, _customApiBaseUrl!);
      }
    } catch (_) {}
  }

  static Future<void> setCustomAiBaseUrl(String? url) async {
    final trimmed = url?.trim();
    _customAiBaseUrl = (trimmed != null && trimmed.isNotEmpty) ? trimmed : null;
    try {
      final prefs = await SharedPreferences.getInstance();
      if (_customAiBaseUrl == null) {
        await prefs.remove(customAiUrlKey);
      } else {
        await prefs.setString(customAiUrlKey, _customAiBaseUrl!);
      }
    } catch (_) {}
  }

  /// Resolves the backend API base URL based on runtime configuration and platform:
  ///
  /// 1. User runtime override (saved in SharedPreferences or session)
  /// 2. Compile-time flag (--dart-define=API_URL=... or --dart-define=API_BASE_URL=...)
  /// 3. Release mode (`kReleaseMode`) → always points to live Render Cloud (`cloudApiBaseUrl`)
  /// 4. Debug / Profile mode:
  ///    - Web / macOS desktop → localhost:5224/api
  ///    - Android emulator   → 10.0.2.2:5224/api
  ///    - Physical Device    → 192.168.8.104:5224/api
  static String get apiBaseUrl {
    // 1. Stored or in-memory custom override
    if (_customApiBaseUrl != null && _customApiBaseUrl!.trim().isNotEmpty) {
      return _customApiBaseUrl!.trim();
    }

    // 2. Compile-time flag
    const envUrl = String.fromEnvironment('API_BASE_URL',
        defaultValue: String.fromEnvironment('API_URL', defaultValue: ''));
    if (envUrl.trim().isNotEmpty) {
      return envUrl.trim();
    }

    // 3. When built for release (e.g. `flutter build apk --release`), always default
    // to the live production/cloud backend so it works outside the developer's laptop!
    if (kReleaseMode) {
      return cloudApiBaseUrl;
    }

    // 4. Debug / Profile mode per platform
    if (kIsWeb) return localHostApiUrl;
    if (defaultTargetPlatform == TargetPlatform.macOS) {
      return localHostApiUrl;
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return androidEmulatorApiUrl;
    }
    // iOS physical device / fallback
    if (physicalDeviceIp.isNotEmpty) {
      return physicalDeviceApiUrl;
    }
    return cloudApiBaseUrl;
  }

  /// AI service URL (FastAPI/uvicorn)
  static String get aiBaseUrl {
    if (_customAiBaseUrl != null && _customAiBaseUrl!.trim().isNotEmpty) {
      return _customAiBaseUrl!.trim();
    }

    const envAiUrl = String.fromEnvironment('AI_BASE_URL',
        defaultValue: String.fromEnvironment('AI_URL', defaultValue: ''));
    if (envAiUrl.trim().isNotEmpty) {
      return envAiUrl.trim();
    }

    if (kReleaseMode) {
      return cloudAiBaseUrl;
    }

    if (kIsWeb) return 'http://localhost:8000';
    if (defaultTargetPlatform == TargetPlatform.macOS) {
      return 'http://localhost:8000';
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:8000';
    }
    if (physicalDeviceIp.isNotEmpty) {
      return 'http://$physicalDeviceIp:8000';
    }
    return cloudAiBaseUrl;
  }

  // ── Storage Keys ──────────────────────────────────────────────────────────
  static const String tokenKey = 'mediflow_jwt_token';
  static const String userKey = 'mediflow_user_profile';

  // ── Request Timeout ───────────────────────────────────────────────────────
  // Set to 100 seconds to safely accommodate Render free-tier container cold starts
  // (which can take 70–85 seconds to spin up from sleep) without prematurely timing out.
  static const Duration requestTimeout = Duration(seconds: 100);

  // ── Business Rules (mirroring backend) ───────────────────────────────────
  static const int maxAppointmentAdvanceDays = 90;
  static const int maxSymptomLength = 2000;
  static const int minSymptomLength = 10;
  static const int maxNotesLength = 500;
}
