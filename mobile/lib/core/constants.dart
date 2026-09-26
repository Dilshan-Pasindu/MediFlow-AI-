import 'config/app_config.dart';

class AppConstants {
  static const String appName = AppConfig.appName;

  static String get apiBaseUrl => AppConfig.apiBaseUrl;

  static const String tokenKey = AppConfig.tokenKey;
  static const String userKey = AppConfig.userKey;
}
