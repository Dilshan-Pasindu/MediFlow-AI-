import 'package:flutter/foundation.dart';

class AppConstants {
  static const String appName = 'MediFlow AI';

  static String get apiBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:5224/api';
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5224/api';
    }
    return 'http://localhost:5224/api';
  }

  static const String tokenKey = 'mediflow_jwt_token';
  static const String userKey = 'mediflow_user_profile';
}
