import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/config/app_config.dart';
import '../../core/network/api_client.dart';
import '../../shared/models/models.dart';

// ── Auth State ────────────────────────────────────────────────────────────────

class AuthState {
  final UserModel? user;
  final bool isLoading;
  final String? error;

  const AuthState({this.user, this.isLoading = false, this.error});

  bool get isAuthenticated => user != null && user!.token.isNotEmpty;

  AuthState copyWith({UserModel? user, bool? isLoading, String? error,
      bool clearUser = false, bool clearError = false}) {
    return AuthState(
      user: clearUser ? null : user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : error ?? this.error,
    );
  }
}

// ── Auth Notifier ─────────────────────────────────────────────────────────────

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState()) {
    ApiClient.instance.onSessionExpired = logout;
    _restore();
  }

  /// Restore session from SharedPreferences on cold start.
  Future<void> _restore() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(AppConfig.userKey);
    if (raw == null) return;
    try {
      final map = jsonDecode(raw) as Map<String, dynamic>;
      final user = UserModel.fromJson(map);
      if (user.token.isNotEmpty) {
        // If the token is already expired, cleanly discard it
        if (user.expiresAt != null) {
          final expiry = DateTime.tryParse(user.expiresAt!);
          if (expiry != null && DateTime.now().toUtc().isAfter(expiry)) {
            await prefs.remove(AppConfig.userKey);
            await prefs.remove(AppConfig.tokenKey);
            return;
          }
        }
        ApiClient.instance.setToken(user.token);
        state = AuthState(user: user);
      }
    } catch (_) {
      await prefs.remove(AppConfig.userKey);
    }
  }

  /// Sign in via backend /auth/login with portal separation.
  Future<bool> login(String email, String password, {String loginType = 'Patient'}) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final data = await ApiClient.instance.post('/auth/login', body: {
        'email': email.trim(),
        'password': password.trim(),
        'loginType': loginType,
      }) as Map<String, dynamic>;

      final user = UserModel.fromJson(data);

      ApiClient.instance.setToken(user.token);
      await _persist(user);
      state = AuthState(user: user);
      return true;
    } on ApiException catch (e) {
      state = AuthState(error: e.message);
      return false;
    } catch (e) {
      state = const AuthState(error: 'Login failed. Please try again.');
      return false;
    }
  }

  /// Sign in or register with Google account via backend /auth/google.
  Future<bool> signInWithGoogle({
    String? idToken,
    required String email,
    required String fullName,
    String? photoUrl,
    String role = 'Patient',
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final body = <String, dynamic>{
        'email': email.trim(),
        'fullName': fullName.trim(),
        'role': role,
      };
      if (idToken != null && idToken.isNotEmpty) {
        body['idToken'] = idToken;
      }
      if (photoUrl != null && photoUrl.isNotEmpty) {
        body['photoUrl'] = photoUrl;
      }

      final data = await ApiClient.instance.post('/auth/google', body: body)
          as Map<String, dynamic>;

      final user = UserModel.fromJson(data);
      ApiClient.instance.setToken(user.token);
      await _persist(user);
      state = AuthState(user: user);
      return true;
    } on ApiException catch (e) {
      state = AuthState(error: e.message);
      return false;
    } catch (e) {
      state = const AuthState(error: 'Google authentication failed. Please try again.');
      return false;
    }
  }


  /// Register a new patient account.
  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
    required String phone,
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final data = await ApiClient.instance.post('/auth/register', body: {
        'fullName': fullName.trim(),
        'email': email.trim(),
        'password': password.trim(),
        'phoneNumber': phone.trim(),
        'role': 'Patient',
      }) as Map<String, dynamic>;

      final user = UserModel.fromJson(data);
      ApiClient.instance.setToken(user.token);
      await _persist(user);
      state = AuthState(user: user);
      return true;
    } on ApiException catch (e) {
      state = AuthState(error: e.message);
      return false;
    } catch (e) {
      state = const AuthState(error: 'Registration failed. Please try again.');
      return false;
    }
  }

  /// Register a new staff account (Pending Verification).
  Future<Map<String, dynamic>?> registerStaff({
    required String fullName,
    required String email,
    required String password,
    required String phone,
    required String role,
    String? registrationNumber,
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final Map<String, dynamic> body = {
        'fullName': fullName.trim(),
        'email': email.trim(),
        'password': password.trim(),
        'phoneNumber': phone.trim(),
        'role': role,
      };
      if (registrationNumber != null && registrationNumber.isNotEmpty) {
        body['registrationNumber'] = registrationNumber.trim();
      }

      final data = await ApiClient.instance.post('/auth/register-staff', body: body) as Map<String, dynamic>;
      state = state.copyWith(isLoading: false);
      return data;
    } on ApiException catch (e) {
      state = AuthState(error: e.message);
      return null;
    } catch (e) {
      state = const AuthState(error: 'Staff registration failed. Please try again.');
      return null;
    }
  }

  Future<void> logout() async {
    ApiClient.instance.setToken(null);
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConfig.userKey);
    await prefs.remove(AppConfig.tokenKey);
    state = const AuthState();
  }

  Future<void> _persist(UserModel user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConfig.userKey, jsonEncode(user.toJson()));
  }

  void clearError() => state = state.copyWith(clearError: true);
}

// ── Providers ─────────────────────────────────────────────────────────────────

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(),
);
