import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../core/constants.dart';
import '../providers/auth_provider.dart';
import '../providers/appointment_provider.dart';

/// PayHere sandbox checkout parameters returned by our backend
class PayHereParams {
  final String merchantId;
  final String returnUrl;
  final String cancelUrl;
  final String notifyUrl;
  final String orderId;
  final String amount;
  final String currency;
  final String hash;
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final String address;
  final String city;
  final String country;
  final String items;
  final int appointmentId;
  final String sandboxCheckoutUrl;

  const PayHereParams({
    required this.merchantId,
    required this.returnUrl,
    required this.cancelUrl,
    required this.notifyUrl,
    required this.orderId,
    required this.amount,
    required this.currency,
    required this.hash,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.phone,
    required this.address,
    required this.city,
    required this.country,
    required this.items,
    required this.appointmentId,
    required this.sandboxCheckoutUrl,
  });

  factory PayHereParams.fromJson(Map<String, dynamic> json) {
    return PayHereParams(
      merchantId: json['merchantId'] ?? '',
      returnUrl: json['returnUrl'] ?? '',
      cancelUrl: json['cancelUrl'] ?? '',
      notifyUrl: json['notifyUrl'] ?? '',
      orderId: json['orderId'] ?? '',
      amount: json['amount'] ?? '',
      currency: json['currency'] ?? 'LKR',
      hash: json['hash'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      country: json['country'] ?? '',
      items: json['items'] ?? '',
      appointmentId: json['appointmentId'] ?? 0,
      sandboxCheckoutUrl: json['sandboxCheckoutUrl'] ?? 'https://sandbox.payhere.lk/pay/checkout',
    );
  }
}

class RefundStatus {
  final int? id;
  final String? refundReference;
  final double? amount;
  final String? currency;
  final String? status;
  final String? reason;
  final String? additionalNotes;
  final String? requestedAt;
  final String? approvedAt;
  final String? processingAt;
  final String? completedAt;
  final String? failedAt;
  final String? rejectionReason;
  final String? expectedProcessingInfo;

  const RefundStatus({
    this.id,
    this.refundReference,
    this.amount,
    this.currency,
    this.status,
    this.reason,
    this.additionalNotes,
    this.requestedAt,
    this.approvedAt,
    this.processingAt,
    this.completedAt,
    this.failedAt,
    this.rejectionReason,
    this.expectedProcessingInfo,
  });

  factory RefundStatus.fromJson(Map<String, dynamic> json) {
    return RefundStatus(
      id: json['id'],
      refundReference: json['refundReference'],
      amount: (json['amount'] as num?)?.toDouble(),
      currency: json['currency'] ?? 'LKR',
      status: json['status'],
      reason: json['reason'],
      additionalNotes: json['additionalNotes'],
      requestedAt: json['requestedAt'],
      approvedAt: json['approvedAt'],
      processingAt: json['processingAt'],
      completedAt: json['completedAt'],
      failedAt: json['failedAt'],
      rejectionReason: json['rejectionReason'],
      expectedProcessingInfo: json['expectedProcessingInfo'],
    );
  }
}

/// Payment checkout screen — initiates PayHere sandbox payment and shows status
class PaymentCheckoutScreen extends ConsumerStatefulWidget {
  final int appointmentId;
  final String? doctorName;
  final double? fee;

  const PaymentCheckoutScreen({
    super.key,
    required this.appointmentId,
    this.doctorName,
    this.fee,
  });

  @override
  ConsumerState<PaymentCheckoutScreen> createState() => _PaymentCheckoutScreenState();
}

class _PaymentCheckoutScreenState extends ConsumerState<PaymentCheckoutScreen> {
  bool _initiating = false;
  bool _checkingStatus = false;
  String? _error;
  String? _paymentStatus;
  RefundStatus? _refundStatus;
  String _step = 'review'; // review | pay | verify | done
  double? _currentFee;
  String? _doctorName;

  @override
  void initState() {
    super.initState();
    _checkPaymentStatus();
  }

  Future<void> _checkPaymentStatus() async {
    final auth = ref.read(authProvider);
    if (auth.token == null) return;

    setState(() { _checkingStatus = true; });
    try {
      final resp = await http.get(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/status'),
        headers: {'Authorization': 'Bearer ${auth.token}'},
      );
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        final apptStatus = data['appointmentStatus'] as String?;
        final payStatus = data['payment']?['status'] as String?;
        final refundData = data['refund'];
        final amount = (data['amount'] as num?)?.toDouble() ?? (data['doctorFee'] as num?)?.toDouble();
        final doctorName = data['doctorName'] as String?;

        setState(() {
          _paymentStatus = payStatus ?? apptStatus;
          if (amount != null && amount > 0) {
            _currentFee = amount;
          }
          if (doctorName != null && doctorName.isNotEmpty) {
            _doctorName = doctorName;
          }
          if (refundData != null) {
            _refundStatus = RefundStatus.fromJson(refundData);
          }
          // Set step
          if (['Completed', 'ReceptionistApproved', 'Confirmed', 'InConsultation'].contains(apptStatus)) {
            _step = 'done';
          } else if (payStatus == 'Paid' || ['PaymentVerified', 'PaymentSubmitted', 'WaitingForReceptionist'].contains(apptStatus)) {
            _step = 'verify';
          }
        });
      }
    } catch (_) {}
    finally {
      setState(() { _checkingStatus = false; });
    }
  }

  Future<void> _processGatewayCardPayment() async {
    final auth = ref.read(authProvider);
    if (auth.token == null) return;

    setState(() { _initiating = true; _error = null; });
    try {
      final resp = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/pay-gateway'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${auth.token}',
        },
        body: jsonEncode({
          'cardNumber': '4111 1111 1111 1111',
          'cardHolder': auth.user?.fullName ?? 'Patient',
          'expiry': '12/28',
          'cvv': '123',
          'paymentMethod': 'Credit / Debit Card',
        }),
      );

      if (resp.statusCode == 200) {
        setState(() {
          _step = 'verify';
          _paymentStatus = 'Paid';
        });
        await _checkPaymentStatus();
      } else {
        final body = jsonDecode(resp.body);
        setState(() { _error = body['message'] ?? 'Payment failed. Please retry.'; });
      }
    } catch (e) {
      setState(() { _error = e.toString(); });
    } finally {
      setState(() { _initiating = false; });
    }
  }

  Future<void> _initiatePayment() async {
    final auth = ref.read(authProvider);
    if (auth.token == null) return;

    setState(() { _initiating = true; _error = null; });
    try {
      final resp = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/initiate'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${auth.token}',
        },
      );

      if (resp.statusCode == 200) {
        final params = PayHereParams.fromJson(jsonDecode(resp.body));
        setState(() { _step = 'pay'; });
        await _openPayHereCheckout(params);
      } else {
        final body = jsonDecode(resp.body);
        setState(() { _error = body['message'] ?? 'Failed to initiate payment.'; });
      }
    } catch (e) {
      setState(() { _error = e.toString(); });
    } finally {
      setState(() { _initiating = false; });
    }
  }

  Future<void> _openPayHereCheckout(PayHereParams params) async {
    // Build the PayHere checkout URL with query parameters
    final uri = Uri.parse(params.sandboxCheckoutUrl).replace(queryParameters: {
      'merchant_id': params.merchantId,
      'return_url': params.returnUrl,
      'cancel_url': params.cancelUrl,
      'notify_url': params.notifyUrl,
      'order_id': params.orderId,
      'items': params.items,
      'currency': params.currency,
      'amount': params.amount,
      'first_name': params.firstName,
      'last_name': params.lastName,
      'email': params.email,
      'phone': params.phone,
      'address': params.address,
      'city': params.city,
      'country': params.country,
      'hash': params.hash,
      'platform': 'MOBILE',
    });

    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      setState(() { _error = 'Could not open PayHere checkout. Please try again.'; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Payment Checkout'),
        backgroundColor: const Color(0xFF0284C7),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh Status',
            onPressed: _checkPaymentStatus,
          ),
        ],
      ),
      body: _checkingStatus && _step == 'review'
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildStepIndicator(),
                  const SizedBox(height: 20),
                  if (_step == 'review') _buildReviewStep(),
                  if (_step == 'pay') _buildPayStep(),
                  if (_step == 'verify') _buildVerifyStep(),
                  if (_step == 'done') _buildDoneStep(),
                  if (_refundStatus != null) ...[
                    const SizedBox(height: 16),
                    _buildRefundCard(),
                  ],
                  const SizedBox(height: 16),
                  _buildPolicyCard(),
                ],
              ),
            ),
    );
  }

  Widget _buildStepIndicator() {
    final steps = ['Review', 'Checkout', 'Verify', 'Confirmed'];
    final currentIdx = ['review', 'pay', 'verify', 'done'].indexOf(_step);

    return Row(
      children: List.generate(steps.length, (i) {
        final isDone = i < currentIdx;
        final isActive = i == currentIdx;
        return Expanded(
          child: Row(
            children: [
              Expanded(
                child: Column(
                  children: [
                    Container(
                      width: 32, height: 32,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isDone ? const Color(0xFF059669)
                            : isActive ? const Color(0xFF0284C7)
                            : const Color(0xFFE2E8F0),
                      ),
                      child: Center(
                        child: isDone
                            ? const Icon(Icons.check, size: 16, color: Colors.white)
                            : Text('${i + 1}', style: TextStyle(
                                color: isActive ? Colors.white : const Color(0xFF94A3B8),
                                fontWeight: FontWeight.bold, fontSize: 13)),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(steps[i], style: TextStyle(
                      fontSize: 10,
                      color: isActive ? const Color(0xFF0284C7) : isDone ? const Color(0xFF059669) : const Color(0xFF94A3B8),
                      fontWeight: isActive || isDone ? FontWeight.w600 : FontWeight.normal,
                    )),
                  ],
                ),
              ),
              if (i < steps.length - 1)
                Expanded(
                  child: Container(
                    height: 2, margin: const EdgeInsets.only(bottom: 20),
                    color: isDone ? const Color(0xFF059669) : const Color(0xFFE2E8F0),
                  ),
                ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildReviewStep() {
    final fee = _currentFee ?? widget.fee ?? 3500;
    return Column(
      children: [
        // Security notice
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFF0FDF4),
            border: Border.all(color: const Color(0xFFBBF7D0), width: 1.5),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Row(
            children: [
              Icon(Icons.shield_outlined, color: Color(0xFF16A34A), size: 20),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  '256-Bit SSL Encrypted Payment · Authorized by Central Bank of Sri Lanka (PayHere)',
                  style: TextStyle(color: Color(0xFF166534), fontSize: 12.5, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Payment summary card
        Card(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Payment Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 14),
                if (_doctorName != null) _summaryRow('Doctor', _doctorName!),
                _summaryRow('Consultation Fee', 'Rs. ${fee.toStringAsFixed(0)}'),
                _summaryRow('Currency', 'Sri Lankan Rupees (LKR)'),
                _summaryRow('Payment Gateway', 'PayHere Secure Payment'),
              ],
            ),
          ),
        ),
        const SizedBox(height: 14),

        // Accepted payment methods badge
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: const Color(0xFFE2E8F0)),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.credit_card, color: Color(0xFF0284C7), size: 20),
                  SizedBox(width: 8),
                  Text('Accepted Cards', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                ],
              ),
              Text('Visa · Mastercard · Amex', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B))),
            ],
          ),
        ),
        const SizedBox(height: 16),

        if (_error != null) ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFFCA5A5)),
            ),
            child: Row(
              children: [
                const Icon(Icons.error_outline, color: Color(0xFFDC2626), size: 16),
                const SizedBox(width: 8),
                Expanded(child: Text(_error!, style: const TextStyle(color: Color(0xFFDC2626), fontSize: 13))),
              ],
            ),
          ),
          const SizedBox(height: 12),
        ],

        SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton.icon(
            onPressed: _initiating ? null : _processGatewayCardPayment,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0284C7),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 2,
            ),
            icon: _initiating
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(Icons.lock_outline, size: 18),
            label: Text(_initiating ? 'Authorizing Payment...' : 'Pay Rs. ${fee.toStringAsFixed(0)}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          ),
        ),
        const SizedBox(height: 10),
        TextButton(
          onPressed: _initiating ? null : _initiatePayment,
          child: const Text('Or pay via PayHere Hosted Gateway', style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
        ),
      ],
    );
  }

  Widget _buildPayStep() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: const Padding(
        padding: EdgeInsets.all(40),
        child: Column(
          children: [
            Text('💳', style: TextStyle(fontSize: 48)),
            SizedBox(height: 16),
            Text('Redirecting to PayHere...', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            SizedBox(height: 8),
            Text(
              'Complete your payment on the PayHere page, then return here to track your status.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Color(0xFF64748B), fontSize: 13),
            ),
            SizedBox(height: 20),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }

  Widget _buildVerifyStep() {
    final isPaid = _paymentStatus == 'Paid';
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            if (isPaid) ...[
              const Icon(Icons.check_circle, color: Color(0xFF059669), size: 40),
              const SizedBox(height: 10),
              const Text('Payment Verified!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF065F46))),
              const SizedBox(height: 8),
              const Text('Your payment has been received. The receptionist will confirm your appointment shortly.',
                  textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF047857), fontSize: 13)),
            ] else ...[
              const CircularProgressIndicator(),
              const SizedBox(height: 14),
              const Text('Verifying payment...', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 6),
              const Text('Our server is confirming your payment with PayHere.',
                  textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF64748B), fontSize: 13)),
            ],
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: _checkPaymentStatus,
              icon: const Icon(Icons.refresh, size: 16),
              label: const Text('Refresh Status'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDoneStep() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFDCFCE7)),
              child: const Icon(Icons.check_circle, color: Color(0xFF059669), size: 40),
            ),
            const SizedBox(height: 12),
            const Text('Appointment Confirmed!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF065F46))),
            const SizedBox(height: 8),
            const Text('Payment verified and appointment approved. Please arrive on time.',
                textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF047857), fontSize: 13)),
          ],
        ),
      ),
    );
  }

  Widget _buildRefundCard() {
    final r = _refundStatus!;
    final statusColors = {
      'RefundRequested':  const Color(0xFFB45309),
      'RefundApproved':   const Color(0xFF0369A1),
      'RefundProcessing': const Color(0xFF7C3AED),
      'RefundCompleted':  const Color(0xFF059669),
      'RefundRejected':   const Color(0xFFDC2626),
      'RefundFailed':     const Color(0xFFDC2626),
    };
    final color = statusColors[r.status] ?? const Color(0xFF64748B);

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Refund Status', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                  child: Text(r.status ?? 'Unknown', style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 10),
            _summaryRow('Reference', r.refundReference ?? '-'),
            _summaryRow('Amount', 'Rs. ${r.amount?.toStringAsFixed(0) ?? '-'}'),
            if (r.requestedAt != null)
              _summaryRow('Requested', _formatDate(r.requestedAt!)),
            if (r.approvedAt != null)
              _summaryRow('Approved', _formatDate(r.approvedAt!)),
            if (r.completedAt != null)
              _summaryRow('Completed', _formatDate(r.completedAt!)),
            if (r.rejectionReason != null)
              Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text('Rejection reason: ${r.rejectionReason}',
                    style: const TextStyle(color: Color(0xFFDC2626), fontSize: 12)),
              ),
            if (r.expectedProcessingInfo != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, size: 14, color: Color(0xFF0369A1)),
                    const SizedBox(width: 6),
                    Expanded(child: Text(r.expectedProcessingInfo!, style: const TextStyle(fontSize: 11.5, color: Color(0xFF1D4ED8)))),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPolicyCard() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: const Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Payment Policy', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            SizedBox(height: 10),
            Text('✅ Refunds available before receptionist approval.', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
            SizedBox(height: 4),
            Text('⛔ No refunds after appointment is approved.', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
            SizedBox(height: 4),
            Text('⚡ Rejections trigger automatic refunds.', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
            SizedBox(height: 4),
            Text('🕐 Refunds credited within 2–3 working days.', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
          ],
        ),
      ),
    );
  }

  Widget _summaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
        ],
      ),
    );
  }

  String _formatDate(String iso) {
    try {
      final dt = DateTime.parse(iso).toLocal();
      return '${dt.day}/${dt.month}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return iso;
    }
  }
}

/// Refund tracking screen for patients
class RefundTrackingScreen extends ConsumerStatefulWidget {
  final int appointmentId;

  const RefundTrackingScreen({super.key, required this.appointmentId});

  @override
  ConsumerState<RefundTrackingScreen> createState() => _RefundTrackingScreenState();
}

class _RefundTrackingScreenState extends ConsumerState<RefundTrackingScreen> {
  bool _loading = true;
  bool _cancelling = false;
  bool _requesting = false;
  String? _error;
  String? _success;
  Map<String, dynamic>? _data;
  RefundStatus? _refund;
  String _cancelReason = 'I no longer need this appointment';
  String _refundNotes = '';
  bool _showCancelForm = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final auth = ref.read(authProvider);
    if (auth.token == null) return;
    setState(() { _loading = true; _error = null; });
    try {
      final resp = await http.get(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/refund'),
        headers: {'Authorization': 'Bearer ${auth.token}'},
      );
      if (resp.statusCode == 200) {
        final d = jsonDecode(resp.body);
        setState(() {
          _data = d;
          if (d['refund'] != null) {
            _refund = RefundStatus.fromJson(d['refund']);
          }
        });
      }
    } catch (e) {
      setState(() { _error = e.toString(); });
    } finally {
      setState(() { _loading = false; });
    }
  }

  Future<void> _cancelAndRequestRefund() async {
    final auth = ref.read(authProvider);
    if (auth.token == null) return;
    setState(() { _cancelling = true; _error = null; });
    try {
      final resp = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/cancel'),
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ${auth.token}'},
        body: jsonEncode({'reason': _cancelReason}),
      );
      if (resp.statusCode == 200) {
        setState(() { _success = 'Appointment cancelled. You can now request a refund.'; _showCancelForm = false; });
        await _load();
        ref.invalidate(myAppointmentsProvider);
      } else {
        final d = jsonDecode(resp.body);
        setState(() { _error = d['message'] ?? 'Cancellation failed.'; });
      }
    } catch (e) {
      setState(() { _error = e.toString(); });
    } finally {
      setState(() { _cancelling = false; });
    }
  }

  Future<void> _requestRefund() async {
    final auth = ref.read(authProvider);
    if (auth.token == null) return;
    setState(() { _requesting = true; _error = null; });
    try {
      final resp = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/refund/request'),
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ${auth.token}'},
        body: jsonEncode({'additionalNotes': _refundNotes.isNotEmpty ? _refundNotes : null}),
      );
      if (resp.statusCode == 200) {
        setState(() { _success = 'Refund requested successfully!'; });
        await _load();
      } else {
        final d = jsonDecode(resp.body);
        setState(() { _error = d['message'] ?? 'Failed to request refund.'; });
      }
    } catch (e) {
      setState(() { _error = e.toString(); });
    } finally {
      setState(() { _requesting = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Refund Tracking'),
        backgroundColor: const Color(0xFF0284C7),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _load,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (_success != null)
                    _alertBox(_success!, const Color(0xFF059669), const Color(0xFFECFDF5), Icons.check_circle),
                  if (_error != null)
                    _alertBox(_error!, const Color(0xFFDC2626), const Color(0xFFFEF2F2), Icons.error_outline),

                  // Appointment info
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Appointment Info', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          const SizedBox(height: 10),
                          _infoRow('Number', _data?['appointmentNumber'] ?? '#${widget.appointmentId}'),
                          _infoRow('Doctor', _data?['doctorName'] ?? '—'),
                          _infoRow('Status', _data?['appointmentStatus'] ?? '—'),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Refund timeline or request section
                  if (_refund != null) _buildRefundTimeline() else _buildRefundRequest(),

                  const SizedBox(height: 14),
                  _buildPolicyCard(),
                ],
              ),
            ),
    );
  }

  Widget _buildRefundTimeline() {
    final steps = [
      {'key': 'RefundRequested', 'label': 'Requested', 'icon': Icons.assignment_outlined},
      {'key': 'RefundApproved', 'label': 'Approved', 'icon': Icons.thumb_up_outlined},
      {'key': 'RefundProcessing', 'label': 'Processing', 'icon': Icons.hourglass_empty},
      {'key': 'RefundCompleted', 'label': 'Completed', 'icon': Icons.monetization_on_outlined},
    ];
    final statusOrder = ['RefundRequested', 'RefundApproved', 'RefundProcessing', 'RefundCompleted'];
    final currentIdx = statusOrder.indexOf(_refund!.status ?? '');
    final isRejected = _refund!.status == 'RefundRejected' || _refund!.status == 'RefundFailed';

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Refund Progress', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text('Ref: ${_refund!.refundReference ?? '-'}',
                    style: const TextStyle(color: Color(0xFF64748B), fontSize: 11)),
              ],
            ),
            const SizedBox(height: 6),
            Text('Rs. ${_refund!.amount?.toStringAsFixed(0) ?? '-'} ${_refund!.currency}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17, color: Color(0xFF0284C7))),
            const SizedBox(height: 16),
            if (isRejected)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.cancel_outlined, color: Color(0xFFDC2626), size: 16),
                        SizedBox(width: 6),
                        Text('Refund Rejected', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF991B1B))),
                      ],
                    ),
                    if (_refund!.rejectionReason != null) ...[
                      const SizedBox(height: 6),
                      Text('Reason: ${_refund!.rejectionReason}',
                          style: const TextStyle(color: Color(0xFFB91C1C), fontSize: 12)),
                    ],
                  ],
                ),
              )
            else
              ...steps.asMap().entries.map((e) {
                final i = e.key;
                final step = e.value;
                final isDone = i < currentIdx;
                final isActive = i == currentIdx;
                return Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Column(
                      children: [
                        Container(
                          width: 32, height: 32,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: isDone ? const Color(0xFF059669)
                                : isActive ? const Color(0xFF0284C7)
                                : const Color(0xFFE2E8F0),
                          ),
                          child: Center(
                            child: isDone
                                ? const Icon(Icons.check, size: 16, color: Colors.white)
                                : Icon(step['icon'] as IconData, size: 15,
                                    color: isActive ? Colors.white : const Color(0xFF94A3B8)),
                          ),
                        ),
                        if (i < steps.length - 1)
                          Container(width: 2, height: 30,
                              color: isDone ? const Color(0xFF059669) : const Color(0xFFE2E8F0)),
                      ],
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(top: 5, bottom: 20),
                        child: Text(step['label'] as String,
                            style: TextStyle(
                              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                              color: isDone || isActive ? const Color(0xFF0F172A) : const Color(0xFF94A3B8),
                            )),
                      ),
                    ),
                  ],
                );
              }),
          ],
        ),
      ),
    );
  }

  Widget _buildRefundRequest() {
    final canRequestRefund = _data?['canRequestRefund'] == true;
    final apptStatus = _data?['appointmentStatus'] as String?;
    final isApprovedLocked = ['Confirmed', 'ReceptionistApproved', 'InConsultation', 'Completed'].contains(apptStatus);
    final isCancellable = ['Pending', 'PaymentSubmitted', 'PaymentVerified', 'PaymentPending', 'WaitingForReceptionist'].contains(apptStatus);

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('💳 No Refund Request Yet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 8),
            Text(
              isApprovedLocked
                  ? 'Refunds are not available once the appointment is approved.'
                  : canRequestRefund
                  ? 'Your appointment has been cancelled. Request a refund below.'
                  : 'Cancel your appointment to apply for a refund.',
              style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
            ),
            const SizedBox(height: 16),

            if (isApprovedLocked)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFBEB),
                  border: Border.all(color: const Color(0xFFF59E0B)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text('This appointment has already been approved by the receptionist. Refund requests are no longer available after appointment approval.',
                    style: TextStyle(color: Color(0xFFB45309), fontSize: 12.5)),
              ),

            if (isCancellable && !isApprovedLocked) ...[
              if (!_showCancelForm)
                OutlinedButton.icon(
                  onPressed: () => setState(() { _showCancelForm = true; _error = null; }),
                  icon: const Icon(Icons.cancel_outlined),
                  label: const Text('Cancel Appointment & Request Refund'),
                  style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFFDC2626)),
                )
              else ...[
                const Text('Cancellation Reason', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  value: _cancelReason,
                  onChanged: (v) => setState(() { _cancelReason = v!; }),
                  items: [
                    'I no longer need this appointment',
                    'Schedule conflict',
                    'Feeling better',
                    'Transportation issues',
                    'Other',
                  ].map((r) => DropdownMenuItem(value: r, child: Text(r, style: const TextStyle(fontSize: 13)))).toList(),
                  decoration: const InputDecoration(border: OutlineInputBorder(), isDense: true),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _cancelling ? null : _cancelAndRequestRefund,
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFDC2626), foregroundColor: Colors.white),
                        icon: _cancelling ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.cancel_outlined, size: 16),
                        label: const Text('Confirm Cancel'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    OutlinedButton(
                      onPressed: () => setState(() { _showCancelForm = false; }),
                      child: const Text('Keep'),
                    ),
                  ],
                ),
              ],
            ],

            if (canRequestRefund) ...[
              const SizedBox(height: 12),
              TextField(
                onChanged: (v) => _refundNotes = v,
                maxLines: 2,
                decoration: const InputDecoration(
                  labelText: 'Additional notes (optional)',
                  border: OutlineInputBorder(),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 10),
              ElevatedButton.icon(
                onPressed: _requesting ? null : _requestRefund,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0284C7),
                  foregroundColor: Colors.white,
                ),
                icon: _requesting
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.send_outlined, size: 16),
                label: const Text('Submit Refund Request'),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPolicyCard() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: const Padding(
        padding: EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Refund Policy', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            SizedBox(height: 8),
            Text('✅ Refunds available before receptionist approval.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
            SizedBox(height: 3),
            Text('⛔ No refunds after appointment is approved.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
            SizedBox(height: 3),
            Text('⚡ Receptionist rejections trigger auto-refunds.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
            SizedBox(height: 3),
            Text('🕐 Processing time: 2–3 working days.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          ],
        ),
      ),
    );
  }

  Widget _alertBox(String msg, Color color, Color bg, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
      child: Row(
        children: [
          Icon(icon, color: color, size: 16),
          const SizedBox(width: 8),
          Expanded(child: Text(msg, style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.w600))),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
        ],
      ),
    );
  }
}
