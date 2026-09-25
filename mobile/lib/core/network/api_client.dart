import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';

/// Generic API exception carrying the HTTP status and a user-friendly message.
class ApiException implements Exception {
  final int? statusCode;
  final String message;
  const ApiException(this.message, {this.statusCode});

  @override
  String toString() => 'ApiException($statusCode): $message';
}

/// Centralized HTTP networking layer.
///
/// Every request automatically:
///  1. Attaches the JWT Bearer token.
///  2. Sets Content-Type: application/json.
///  3. Enforces a request timeout.
///  4. Maps HTTP error codes to [ApiException] with user-friendly messages.
class ApiClient {
  ApiClient._();
  static final ApiClient instance = ApiClient._();

  String? _token;

  /// Set/clear the JWT access token.
  void setToken(String? token) => _token = token;

  String? get token => _token;

  // ── Internal helpers ─────────────────────────────────────────────────────

  Map<String, String> _headers({Map<String, String>? extra}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_token != null) headers['Authorization'] = 'Bearer $_token';
    if (extra != null) headers.addAll(extra);
    return headers;
  }

  Uri _uri(String path, {Map<String, dynamic>? query}) {
    final base = Uri.parse('${AppConfig.apiBaseUrl}$path');
    if (query == null || query.isEmpty) return base;
    final cleaned = query.map((k, v) => MapEntry(k, v.toString()))
      ..removeWhere((_, v) => v == 'null');
    return base.replace(queryParameters: cleaned);
  }

  dynamic _handleResponse(http.Response res) {
    final body = _tryDecode(res.body);
    if (res.statusCode >= 200 && res.statusCode < 300) return body;

    // Map error status codes to user-friendly messages
    final serverMsg = _extractMessage(body);
    final msg = switch (res.statusCode) {
      400 => serverMsg ?? 'Invalid request. Please check your input.',
      401 => 'Your session has expired. Please sign in again.',
      403 => 'You do not have permission to perform this action.',
      404 => serverMsg ?? 'The requested resource was not found.',
      409 => serverMsg ?? 'A conflict occurred. This record may already exist.',
      422 => serverMsg ?? 'Validation failed. Please check your input.',
      500 => 'A server error occurred. Please try again later.',
      _ => serverMsg ?? 'An unexpected error occurred (${res.statusCode}).',
    };

    throw ApiException(msg, statusCode: res.statusCode);
  }

  dynamic _tryDecode(String body) {
    if (body.isEmpty) return null;
    try {
      return jsonDecode(body);
    } catch (_) {
      return body;
    }
  }

  String? _extractMessage(dynamic body) {
    if (body is Map<String, dynamic>) {
      return (body['message'] ?? body['title'] ?? body['error'])?.toString();
    }
    return null;
  }

  // ── Public HTTP verbs ─────────────────────────────────────────────────────

  Future<dynamic> get(String path, {Map<String, dynamic>? query}) async {
    try {
      final res = await http
          .get(_uri(path, query: query), headers: _headers())
          .timeout(AppConfig.requestTimeout);
      return _handleResponse(res);
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(_networkErrorMessage(e));
    }
  }

  Future<dynamic> post(String path, {dynamic body}) async {
    try {
      final res = await http
          .post(
            _uri(path),
            headers: _headers(),
            body: body != null ? jsonEncode(body) : null,
          )
          .timeout(AppConfig.requestTimeout);
      return _handleResponse(res);
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(_networkErrorMessage(e));
    }
  }

  Future<dynamic> put(String path, {dynamic body}) async {
    try {
      final res = await http
          .put(
            _uri(path),
            headers: _headers(),
            body: body != null ? jsonEncode(body) : null,
          )
          .timeout(AppConfig.requestTimeout);
      return _handleResponse(res);
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(_networkErrorMessage(e));
    }
  }

  Future<dynamic> delete(String path, {dynamic body}) async {
    try {
      final req = http.Request('DELETE', _uri(path));
      req.headers.addAll(_headers());
      if (body != null) req.body = jsonEncode(body);
      final streamed = await req.send().timeout(AppConfig.requestTimeout);
      final res = await http.Response.fromStream(streamed);
      return _handleResponse(res);
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(_networkErrorMessage(e));
    }
  }

  String _networkErrorMessage(Object e) {
    final str = e.toString();
    if (str.contains('SocketException') || str.contains('No route to host') ||
        str.contains('Connection refused')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (str.contains('TimeoutException')) {
      return 'The request timed out. Please try again.';
    }
    return 'A network error occurred. Please try again.';
  }
}
