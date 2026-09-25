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
        ApiClient.instance.setToken(user.token);
        state = AuthState(user: user);
      }
    } catch (_) {
      await prefs.remove(AppConfig.userKey);
    }
  }

  /// Sign in via backend /auth/login (hybrid: works for seeded accounts too).
  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final data = await ApiClient.instance.post('/auth/login', body: {
        'email': email.trim(),
        'password': password.trim(),
      }) as Map<String, dynamic>;

      final user = UserModel.fromJson(data);
      if (user.role != 'Patient') {
        state = AuthState(
          error: 'This app is for patients only. '
              'Please use the web portal for staff access.',
        );
        return false;
      }

      ApiClient.instance.setToken(user.token);
      await _persist(user);
      state = AuthState(user: user);
      return true;
    } on ApiException catch (e) {
      state = AuthState(error: e.message);
      return false;
    } catch (e) {
      state = AuthState(error: 'Login failed. Please try again.');
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
      state = AuthState(error: 'Registration failed. Please try again.');
      return false;
    }
  }

  Future<void> logout() async {
    ApiClient.instance.setToken(null);
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConfig.userKey);
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
