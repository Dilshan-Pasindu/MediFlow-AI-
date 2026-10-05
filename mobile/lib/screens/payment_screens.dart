import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../core/constants.dart';
import '../core/network/api_client.dart';
import '../core/theme/app_theme.dart';
import '../features/auth/auth_provider.dart';
import '../features/patient/patient_providers.dart';

/// PayHere sandbox checkout parameters returned by MediFlow backend
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
      sandboxCheckoutUrl:
          json['sandboxCheckoutUrl'] ?? 'https://sandbox.payhere.lk/pay/checkout',
    );
  }
}

/// Models refund tracking status matching backend & frontend
class RefundStatusModel {
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
  final String? providerRefundId;
  final String? expectedProcessingInfo;

  const RefundStatusModel({
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
    this.providerRefundId,
    this.expectedProcessingInfo,
  });

  factory RefundStatusModel.fromJson(Map<String, dynamic> json) {
    return RefundStatusModel(
      id: json['id'] as int?,
      refundReference: json['refundReference'] as String?,
      amount: (json['amount'] as num?)?.toDouble(),
      currency: (json['currency'] as String?) ?? 'LKR',
      status: json['status'] as String?,
      reason: json['reason'] as String?,
      additionalNotes: json['additionalNotes'] as String?,
      requestedAt: json['requestedAt'] as String?,
      approvedAt: json['approvedAt'] as String?,
      processingAt: json['processingAt'] as String?,
      completedAt: json['completedAt'] as String?,
      failedAt: json['failedAt'] as String?,
      rejectionReason: json['rejectionReason'] as String?,
      providerRefundId: json['providerRefundId'] as String?,
      expectedProcessingInfo: json['expectedProcessingInfo'] as String?,
    );
  }
}

/// Payment checkout screen — supports direct sandbox gateway card payment
/// and PayHere hosted sandbox checkout with status verification.
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
  RefundStatusModel? _refundStatus;
  String _step = 'review'; // review | pay | verify | done
  double? _currentFee;
  String? _doctorName;
  String? _specialty;
  String? _providerPaymentId;
  String? _paymentMethod;
  String? _paidAt;

  // Direct Card Payment Form
  final _cardNumberCtrl = TextEditingController(text: '4111 1111 1111 1111');
  final _cardHolderCtrl = TextEditingController();
  final _expiryCtrl = TextEditingController(text: '12/28');
  final _cvvCtrl = TextEditingController(text: '123');
  String _selectedMethod = 'Credit / Debit Card';

  @override
  void initState() {
    super.initState();
    _currentFee = widget.fee;
    _doctorName = widget.doctorName;
    final user = ref.read(authProvider).user;
    _cardHolderCtrl.text = user?.fullName.isNotEmpty == true ? user!.fullName : 'Patient';
    _checkPaymentStatus();
  }

  @override
  void dispose() {
    _cardNumberCtrl.dispose();
    _cardHolderCtrl.dispose();
    _expiryCtrl.dispose();
    _cvvCtrl.dispose();
    super.dispose();
  }

  String? _getAuthToken() {
    return ApiClient.instance.token ?? ref.read(authProvider).user?.token;
  }

  Future<void> _checkPaymentStatus() async {
    final token = _getAuthToken();
    if (token == null) return;

    setState(() {
      _checkingStatus = true;
      _error = null;
    });

    try {
      final resp = await http.get(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/status'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body) as Map<String, dynamic>;
        final apptStatus = data['appointmentStatus'] as String?;
        final payStatus = data['payment']?['status'] as String?;
        final refundData = data['refund'];
        final amount = (data['amount'] as num?)?.toDouble() ??
            (data['doctorFee'] as num?)?.toDouble();
        final doc = data['doctorName'] as String?;
        final spec = data['specialty'] as String?;

        final provId = data['payment']?['providerPaymentId'] as String?;
        final pMethod = data['payment']?['paymentMethod'] as String?;
        final pDate = data['payment']?['paidAt'] as String?;

        if (mounted) {
          setState(() {
            _paymentStatus = payStatus ?? apptStatus;
            _providerPaymentId = provId;
            _paymentMethod = pMethod;
            _paidAt = pDate;

            if (amount != null && amount > 0) {
              _currentFee = amount;
            }
            if (doc != null && doc.isNotEmpty) {
              _doctorName = doc;
            }
            if (spec != null && spec.isNotEmpty) {
              _specialty = spec;
            }
            if (refundData != null) {
              _refundStatus = RefundStatusModel.fromJson(refundData);
            }

            // Sync step
            if (['Completed', 'ReceptionistApproved', 'Confirmed', 'InConsultation'].contains(apptStatus)) {
              _step = 'done';
            } else if (payStatus == 'Paid' ||
                ['PaymentVerified', 'PaymentSubmitted', 'WaitingForReceptionist'].contains(apptStatus)) {
              _step = 'done';
            } else {
              _step = 'review';
            }
          });
        }
      }
    } catch (e) {
      if (mounted) setState(() => _error = 'Failed to verify payment status: $e');
    } finally {
      if (mounted) setState(() => _checkingStatus = false);
    }
  }

  void _fillTestCard(String cardNum, String exp, String cvv, String method) {
    setState(() {
      _cardNumberCtrl.text = cardNum;
      _expiryCtrl.text = exp;
      _cvvCtrl.text = cvv;
      _selectedMethod = method;
      _error = null;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Filled $method Test Sandbox Card', style: GoogleFonts.inter()),
        backgroundColor: AppTheme.primaryBlue,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> _processGatewayCardPayment() async {
    final token = _getAuthToken();
    if (token == null) return;

    if (_cardNumberCtrl.text.replaceAll(' ', '').length < 14) {
      setState(() => _error = 'Please enter a valid card number.');
      return;
    }

    setState(() {
      _initiating = true;
      _error = null;
    });

    try {
      final resp = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/pay-gateway'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'cardNumber': _cardNumberCtrl.text.trim(),
          'cardHolder': _cardHolderCtrl.text.trim(),
          'expiry': _expiryCtrl.text.trim(),
          'cvv': _cvvCtrl.text.trim(),
          'paymentMethod': _selectedMethod,
        }),
      );

      if (resp.statusCode == 200) {
        ref.invalidate(myAppointmentsProvider);
        if (mounted) {
          setState(() {
            _step = 'done';
            _paymentStatus = 'Paid';
          });
          await _checkPaymentStatus();
        }
      } else {
        final body = jsonDecode(resp.body);
        if (mounted) {
          setState(() {
            _error = body['message'] ?? 'Payment authorization failed. Please try again.';
          });
        }
      }
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _initiating = false);
    }
  }

  Future<void> _initiateHostedPayHere() async {
    final token = _getAuthToken();
    if (token == null) return;

    setState(() {
      _initiating = true;
      _error = null;
    });

    try {
      final resp = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/initiate'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (resp.statusCode == 200) {
        final params = PayHereParams.fromJson(jsonDecode(resp.body));
        setState(() => _step = 'pay');
        await _openPayHereCheckout(params);
      } else {
        final body = jsonDecode(resp.body);
        if (mounted) {
          setState(() {
            _error = body['message'] ?? 'Failed to initiate PayHere checkout.';
          });
        }
      }
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _initiating = false);
    }
  }

  Future<void> _openPayHereCheckout(PayHereParams params) async {
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

    try {
      final launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
      if (!launched && mounted) {
        setState(() => _error = 'Could not open PayHere checkout. Please try again.');
      }
    } catch (e) {
      if (mounted) setState(() => _error = 'Error launching browser: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
      appBar: AppBar(
        title: Text('Payment Checkout',
            style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 18)),
        backgroundColor: AppTheme.primaryBlue,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.refreshCw),
            tooltip: 'Refresh Status',
            onPressed: _checkPaymentStatus,
          ),
        ],
      ),
      body: _checkingStatus && _step == 'review' && _currentFee == null
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildStepIndicator(),
                  const SizedBox(height: 18),
                  if (_step == 'review') _buildReviewStep(),
                  if (_step == 'pay') _buildPayStep(),
                  if (_step == 'verify') _buildVerifyStep(),
                  if (_step == 'done') _buildDoneStep(),
                  if (_refundStatus != null) ...[
                    const SizedBox(height: 16),
                    _buildRefundBanner(),
                  ],
                  const SizedBox(height: 16),
                  _buildPolicyCard(),
                ],
              ),
            ),
    );
  }

  Widget _buildStepIndicator() {
    final steps = ['Review', 'Authorize', 'Verified'];
    final currentIdx = _step == 'review'
        ? 0
        : _step == 'pay'
            ? 1
            : 2;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Row(
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
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isDone
                              ? AppTheme.statusConfirmed
                              : isActive
                                  ? AppTheme.primaryBlue
                                  : const Color(0xFFE2E8F0),
                        ),
                        child: Center(
                          child: isDone
                              ? const Icon(LucideIcons.check, size: 15, color: Colors.white)
                              : Text(
                                  '${i + 1}',
                                  style: GoogleFonts.inter(
                                    color: isActive ? Colors.white : const Color(0xFF94A3B8),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        steps[i],
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          color: isActive
                              ? AppTheme.primaryBlue
                              : isDone
                                  ? AppTheme.statusConfirmed
                                  : const Color(0xFF94A3B8),
                          fontWeight: isActive || isDone ? FontWeight.w700 : FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                if (i < steps.length - 1)
                  Container(
                    width: 32,
                    height: 2,
                    margin: const EdgeInsets.only(bottom: 18),
                    color: isDone ? AppTheme.statusConfirmed : const Color(0xFFE2E8F0),
                  ),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildReviewStep() {
    final fee = _currentFee ?? widget.fee ?? 2500;
    final doctor = _doctorName ?? widget.doctorName ?? 'Consulting Specialist';
    final specialty = _specialty ?? 'General Clinical Consultation';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Trust badge
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFECFDF5),
            border: Border.all(color: const Color(0xFFA7F3D0)),
            borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          ),
          child: Row(
            children: [
              const Icon(LucideIcons.shieldCheck, color: Color(0xFF059669), size: 20),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'PayHere Sandbox · 256-Bit Encrypted · Central Bank of Sri Lanka Certified',
                  style: GoogleFonts.inter(
                    color: const Color(0xFF065F46),
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Summary Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppTheme.radiusLg),
            boxShadow: AppTheme.cardShadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Appointment & Fee Breakdown',
                  style: GoogleFonts.inter(
                      fontWeight: FontWeight.w700, fontSize: 15, color: AppTheme.textPrimary)),
              const SizedBox(height: 12),
              _row('Specialist', doctor),
              _row('Specialty', specialty),
              _row('Currency', 'LKR (Sri Lankan Rupees)'),
              const Divider(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Total Amount Payable',
                      style: GoogleFonts.inter(
                          fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
                  Text(
                    'Rs. ${fee.toStringAsFixed(2)}',
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.primaryBlue,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Quick Sandbox Test Cards
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            border: Border.all(color: const Color(0xFFE2E8F0)),
            borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(LucideIcons.testTube, size: 16, color: Color(0xFF64748B)),
                  const SizedBox(width: 6),
                  Text('Sandbox Test Cards (1-Tap Auto Fill)',
                      style: GoogleFonts.inter(
                          fontSize: 12.5, fontWeight: FontWeight.w700, color: const Color(0xFF475569))),
                ],
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _testCardChip('Visa (4111)', () => _fillTestCard('4111 1111 1111 1111', '12/28', '123', 'Visa')),
                  _testCardChip('Mastercard (5200)', () => _fillTestCard('5200 0000 0000 0000', '10/27', '456', 'Mastercard')),
                  _testCardChip('Amex (3782)', () => _fillTestCard('3782 8224 6310 005', '08/29', '7890', 'Amex')),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Card Entry Form
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppTheme.radiusLg),
            boxShadow: AppTheme.cardShadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Card Details',
                  style: GoogleFonts.inter(
                      fontWeight: FontWeight.w700, fontSize: 14, color: AppTheme.textPrimary)),
              const SizedBox(height: 12),
              TextField(
                controller: _cardHolderCtrl,
                style: GoogleFonts.inter(fontSize: 13),
                decoration: InputDecoration(
                  labelText: 'Cardholder Name',
                  prefixIcon: const Icon(LucideIcons.user, size: 18),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _cardNumberCtrl,
                keyboardType: TextInputType.number,
                style: GoogleFonts.inter(fontSize: 13, letterSpacing: 1.2),
                decoration: InputDecoration(
                  labelText: 'Card Number',
                  prefixIcon: const Icon(LucideIcons.creditCard, size: 18),
                  suffixIcon: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Text(_selectedMethod,
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.primaryBlue)),
                  ),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _expiryCtrl,
                      keyboardType: TextInputType.datetime,
                      style: GoogleFonts.inter(fontSize: 13),
                      decoration: InputDecoration(
                        labelText: 'Expiry (MM/YY)',
                        prefixIcon: const Icon(LucideIcons.calendar, size: 16),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                        isDense: true,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: _cvvCtrl,
                      keyboardType: TextInputType.number,
                      obscureText: true,
                      style: GoogleFonts.inter(fontSize: 13),
                      decoration: InputDecoration(
                        labelText: 'CVV',
                        prefixIcon: const Icon(LucideIcons.lock, size: 16),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                        isDense: true,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        if (_error != null) ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              border: Border.all(color: const Color(0xFFFCA5A5)),
            ),
            child: Row(
              children: [
                const Icon(LucideIcons.circleAlert, color: Color(0xFFDC2626), size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(_error!,
                      style: GoogleFonts.inter(color: const Color(0xFFDC2626), fontSize: 12.5)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
        ],

        // Pay Button
        SizedBox(
          height: 48,
          child: ElevatedButton.icon(
            onPressed: _initiating ? null : _processGatewayCardPayment,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryBlue,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusFull)),
              elevation: 2,
            ),
            icon: _initiating
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(LucideIcons.lock, size: 18),
            label: Text(
              _initiating ? 'Authorizing Payment…' : 'Authorize & Pay Rs. ${fee.toStringAsFixed(0)}',
              style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 15),
            ),
          ),
        ),
        const SizedBox(height: 10),

        // Hosted checkout alternative
        TextButton.icon(
          onPressed: _initiating ? null : _initiateHostedPayHere,
          icon: const Icon(LucideIcons.externalLink, size: 16, color: Color(0xFF64748B)),
          label: Text('Or Checkout via PayHere Hosted Sandbox Gateway',
              style: GoogleFonts.inter(fontSize: 12.5, color: const Color(0xFF64748B))),
        ),
      ],
    );
  }

  Widget _testCardChip(String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.3)),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.creditCard, size: 13, color: AppTheme.primaryBlue),
            const SizedBox(width: 4),
            Text(label,
                style: GoogleFonts.inter(
                    fontSize: 11.5, fontWeight: FontWeight.w600, color: AppTheme.primaryBlue)),
          ],
        ),
      ),
    );
  }

  Widget _buildPayStep() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Color(0xFFEFF6FF),
            ),
            child: const Icon(LucideIcons.creditCard, size: 40, color: AppTheme.primaryBlue),
          ),
          const SizedBox(height: 16),
          Text('Redirecting to PayHere Sandbox…',
              style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 16)),
          const SizedBox(height: 8),
          Text(
            'Complete your payment on the external PayHere sandbox page, then return here to track your status.',
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 12.5),
          ),
          const SizedBox(height: 20),
          const CircularProgressIndicator(),
          const SizedBox(height: 20),
          OutlinedButton.icon(
            onPressed: _checkPaymentStatus,
            icon: const Icon(LucideIcons.refreshCw, size: 16),
            label: Text('I Have Completed Payment · Verify',
                style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }

  Widget _buildVerifyStep() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        children: [
          const CircularProgressIndicator(),
          const SizedBox(height: 16),
          Text('Verifying Payment…',
              style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 16)),
          const SizedBox(height: 6),
          Text('Communicating with PayHere gateway to confirm authorization.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 12.5)),
          const SizedBox(height: 16),
          OutlinedButton.icon(
            onPressed: _checkPaymentStatus,
            icon: const Icon(LucideIcons.refreshCw, size: 16),
            label: Text('Refresh Verification', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }

  Widget _buildDoneStep() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Color(0xFFDCFCE7),
            ),
            child: const Icon(LucideIcons.circleCheck, color: Color(0xFF059669), size: 44),
          ),
          const SizedBox(height: 14),
          Text('Payment Verified Successfully!',
              style: GoogleFonts.inter(
                  fontWeight: FontWeight.w800, fontSize: 18, color: const Color(0xFF065F46))),
          const SizedBox(height: 6),
          Text(
            'Your consultation payment has been confirmed. The receptionist will review your appointment shortly.',
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(color: const Color(0xFF047857), fontSize: 13),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _row('Payment Status', _paymentStatus ?? 'Paid & Verified'),
                if (_providerPaymentId != null) _row('Transaction Ref', _providerPaymentId!),
                if (_paymentMethod != null) _row('Method', _paymentMethod!),
                if (_paidAt != null) _row('Date', _formatDate(_paidAt!)),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => RefundTrackingScreen(appointmentId: widget.appointmentId),
                    ),
                  ),
                  icon: const Icon(LucideIcons.receiptText, size: 16),
                  label: Text('Refund Tracking', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusFull)),
                  ),
                  child: Text('Done', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRefundBanner() {
    final r = _refundStatus!;
    final isCompleted = r.status == 'RefundCompleted';
    final isApproved = r.status == 'RefundApproved' || r.status == 'RefundProcessing';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isCompleted
            ? const Color(0xFFECFDF5)
            : isApproved
                ? const Color(0xFFEFF6FF)
                : const Color(0xFFFFFBEB),
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        border: Border.all(
          color: isCompleted
              ? const Color(0xFFA7F3D0)
              : isApproved
                  ? const Color(0xFFBFDBFE)
                  : const Color(0xFFFDE68A),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    isCompleted ? LucideIcons.circleCheck : LucideIcons.info,
                    size: 16,
                    color: isCompleted
                        ? const Color(0xFF059669)
                        : isApproved
                            ? const Color(0xFF0284C7)
                            : const Color(0xFFB45309),
                  ),
                  const SizedBox(width: 6),
                  Text('Refund Status: ${r.status}',
                      style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 13)),
                ],
              ),
              Text('Rs. ${r.amount?.toStringAsFixed(0) ?? '-'}',
                  style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 13)),
            ],
          ),
          if (r.expectedProcessingInfo != null) ...[
            const SizedBox(height: 6),
            Text(r.expectedProcessingInfo!,
                style: GoogleFonts.inter(fontSize: 11.5, color: const Color(0xFF1E3A8A))),
          ],
        ],
      ),
    );
  }

  Widget _buildPolicyCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('MediFlow Payment & Refund Policy',
              style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 13, color: AppTheme.textPrimary)),
          const SizedBox(height: 8),
          _bullet('Refunds are available before receptionist approval.'),
          _bullet('Receptionist rejections trigger automatic payment refunds.'),
          _bullet('Refunds are normally credited back within 2–3 working days.'),
          _bullet('Appointments already in consultation cannot be cancelled.'),
        ],
      ),
    );
  }

  Widget _bullet(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('• ', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
          Expanded(
            child: Text(text, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF64748B))),
          ),
        ],
      ),
    );
  }

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 12.5)),
          Text(value, style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 12.5)),
        ],
      ),
    );
  }

  String _formatDate(String iso) {
    try {
      final dt = DateTime.parse(iso).toLocal();
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return iso;
    }
  }
}

/// 4-Stage Refund Tracking Screen synchronized with backend & receptionist portal
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
  RefundStatusModel? _refund;
  String _cancelReason = 'I no longer need this appointment';
  String _refundNotes = '';
  bool _showCancelForm = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  String? _getAuthToken() {
    return ApiClient.instance.token ?? ref.read(authProvider).user?.token;
  }

  Future<void> _load() async {
    final token = _getAuthToken();
    if (token == null) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final resp = await http.get(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/refund'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (resp.statusCode == 200) {
        final d = jsonDecode(resp.body) as Map<String, dynamic>;
        RefundStatusModel? refStatus;
        if (d['refund'] != null) {
          refStatus = RefundStatusModel.fromJson(d['refund']);
        }

        // Fallback: check status endpoint if refund not populated yet
        if (refStatus == null) {
          try {
            final pResp = await http.get(
              Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/status'),
              headers: {'Authorization': 'Bearer $token'},
            );
            if (pResp.statusCode == 200) {
              final pData = jsonDecode(pResp.body);
              if (pData['refund'] != null) {
                refStatus = RefundStatusModel.fromJson(pData['refund']);
              }
            }
          } catch (_) {}
        }

        if (mounted) {
          setState(() {
            _data = d;
            _refund = refStatus;
          });
        }
      } else {
        final err = jsonDecode(resp.body);
        if (mounted) setState(() => _error = err['message'] ?? 'Failed to load refund details.');
      }
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _cancelAppointment() async {
    final token = _getAuthToken();
    if (token == null) return;

    setState(() {
      _cancelling = true;
      _error = null;
    });

    try {
      final resp = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/cancel'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'reason': _cancelReason}),
      );

      if (resp.statusCode == 200) {
        ref.invalidate(myAppointmentsProvider);
        if (mounted) {
          setState(() {
            _success = 'Appointment cancelled. You may now submit your refund request.';
            _showCancelForm = false;
          });
          await _load();
        }
      } else {
        final d = jsonDecode(resp.body);
        if (mounted) setState(() => _error = d['message'] ?? 'Cancellation failed.');
      }
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _cancelling = false);
    }
  }

  Future<void> _submitRefundRequest() async {
    final token = _getAuthToken();
    if (token == null) return;

    setState(() {
      _requesting = true;
      _error = null;
    });

    try {
      final resp = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/payment/appointments/${widget.appointmentId}/refund/request'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'additionalNotes': _refundNotes.isNotEmpty ? _refundNotes : null,
        }),
      );

      if (resp.statusCode == 200) {
        ref.invalidate(myAppointmentsProvider);
        if (mounted) {
          setState(() => _success = 'Refund request submitted successfully! Awaiting receptionist review.');
          await _load();
        }
      } else {
        final d = jsonDecode(resp.body);
        if (mounted) setState(() => _error = d['message'] ?? 'Failed to request refund.');
      }
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _requesting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
      appBar: AppBar(
        title: Text('Refund Tracking',
            style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 18)),
        backgroundColor: AppTheme.primaryBlue,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.refreshCw),
            tooltip: 'Check Status',
            onPressed: _load,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (_success != null)
                      _alertBanner(_success!, const Color(0xFF059669), const Color(0xFFECFDF5),
                          LucideIcons.circleCheck),
                    if (_error != null)
                      _alertBanner(_error!, const Color(0xFFDC2626), const Color(0xFFFEF2F2),
                          LucideIcons.circleAlert),

                    // Appointment Header
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                        boxShadow: AppTheme.cardShadow,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Appointment Reference',
                              style: GoogleFonts.inter(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                  color: AppTheme.textPrimary)),
                          const SizedBox(height: 10),
                          _infoRow('Appointment No.',
                              _data?['appointmentNumber'] ?? '#${widget.appointmentId}'),
                          _infoRow('Doctor', _data?['doctorName'] ?? 'Consulting Specialist'),
                          _infoRow('Status', _data?['appointmentStatus'] ?? '—'),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Refund Timeline or Action Section
                    if (_refund != null) _buildTimelineCard() else _buildNoRefundCard(),

                    const SizedBox(height: 14),
                    _buildPolicyCard(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildTimelineCard() {
    final r = _refund!;
    final steps = [
      {'key': 'RefundRequested', 'label': 'Requested', 'desc': 'Waiting for receptionist review'},
      {'key': 'RefundApproved', 'label': 'Approved', 'desc': 'Receptionist approved refund'},
      {'key': 'RefundProcessing', 'label': 'Processing', 'desc': 'Initiated with payment gateway'},
      {'key': 'RefundCompleted', 'label': 'Completed', 'desc': 'Credited to original payment source'},
    ];

    final isCompleted = r.status == 'RefundCompleted';
    final isRejected = r.status == 'RefundRejected' || r.status == 'RefundFailed';

    final order = ['RefundRequested', 'RefundApproved', 'RefundProcessing', 'RefundCompleted'];
    final currentIdx = isCompleted ? 3 : order.indexOf(r.status ?? '');

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Refund Progress',
                  style: GoogleFonts.inter(
                      fontWeight: FontWeight.w700, fontSize: 16, color: AppTheme.textPrimary)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isCompleted
                      ? const Color(0xFFDCFCE7)
                      : isRejected
                          ? const Color(0xFFFEE2E2)
                          : const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  r.status ?? 'Processing',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: isCompleted
                        ? const Color(0xFF166534)
                        : isRejected
                            ? const Color(0xFF991B1B)
                            : AppTheme.primaryBlue,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Rs. ${r.amount?.toStringAsFixed(2) ?? '0.00'} ${r.currency ?? 'LKR'}',
            style: GoogleFonts.inter(
              fontWeight: FontWeight.w800,
              fontSize: 20,
              color: AppTheme.primaryBlue,
            ),
          ),
          if (r.refundReference != null) ...[
            const SizedBox(height: 2),
            Text('Ref: ${r.refundReference}',
                style: GoogleFonts.inter(fontSize: 11.5, color: const Color(0xFF64748B))),
          ],
          const SizedBox(height: 18),

          if (isCompleted) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                border: Border.all(color: const Color(0xFFA7F3D0)),
              ),
              child: Row(
                children: [
                  const Icon(LucideIcons.circleCheck, color: Color(0xFF059669), size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Funds Credited Successfully · Refund Completed',
                      style: GoogleFonts.inter(
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                        color: const Color(0xFF065F46),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          if (isRejected) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                border: Border.all(color: const Color(0xFFFCA5A5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(LucideIcons.circleX, color: Color(0xFFDC2626), size: 18),
                      const SizedBox(width: 6),
                      Text('Refund Request Rejected',
                          style: GoogleFonts.inter(
                              fontWeight: FontWeight.w700, color: const Color(0xFF991B1B), fontSize: 13)),
                    ],
                  ),
                  if (r.rejectionReason != null) ...[
                    const SizedBox(height: 4),
                    Text('Reason: ${r.rejectionReason}',
                        style: GoogleFonts.inter(color: const Color(0xFFB91C1C), fontSize: 12)),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 16),
          ] else ...[
            // Step items
            ...steps.asMap().entries.map((entry) {
              final idx = entry.key;
              final s = entry.value;
              final isDone = isCompleted ? true : idx < currentIdx;
              final isActive = isCompleted ? (idx == 3) : idx == currentIdx;

              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isDone || (isCompleted && idx == 3)
                              ? const Color(0xFF059669)
                              : isActive
                                  ? AppTheme.primaryBlue
                                  : const Color(0xFFE2E8F0),
                        ),
                        child: Center(
                          child: isDone || (isCompleted && idx == 3)
                              ? const Icon(LucideIcons.check, size: 16, color: Colors.white)
                              : Text(
                                  '${idx + 1}',
                                  style: GoogleFonts.inter(
                                    color: isActive ? Colors.white : const Color(0xFF94A3B8),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                        ),
                      ),
                      if (idx < steps.length - 1)
                        Container(
                          width: 2,
                          height: 34,
                          color: (isCompleted || idx < currentIdx)
                              ? const Color(0xFF059669)
                              : const Color(0xFFE2E8F0),
                        ),
                    ],
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 4, bottom: 18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            s['label'] as String,
                            style: GoogleFonts.inter(
                              fontWeight: isActive || isDone ? FontWeight.w700 : FontWeight.w500,
                              fontSize: 13.5,
                              color: isDone
                                  ? const Color(0xFF065F46)
                                  : isActive
                                      ? AppTheme.textPrimary
                                      : const Color(0xFF94A3B8),
                            ),
                          ),
                          Text(
                            s['desc'] as String,
                            style: GoogleFonts.inter(
                              fontSize: 11.5,
                              color: const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            }),
          ],

          if (r.expectedProcessingInfo != null) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                border: Border.all(color: const Color(0xFFBFDBFE)),
              ),
              child: Row(
                children: [
                  const Icon(LucideIcons.info, size: 18, color: Color(0xFF0284C7)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(r.expectedProcessingInfo!,
                        style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF1D4ED8))),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
          ],

          // Timestamps breakdown
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
            ),
            child: Column(
              children: [
                if (r.requestedAt != null) _infoRow('Requested At', _format(r.requestedAt!)),
                if (r.approvedAt != null) _infoRow('Approved At', _format(r.approvedAt!)),
                if (r.processingAt != null) _infoRow('Processing At', _format(r.processingAt!)),
                if (r.completedAt != null) _infoRow('Completed At', _format(r.completedAt!)),
                if (r.providerRefundId != null) _infoRow('Provider Ref', r.providerRefundId!),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNoRefundCard() {
    final canRequest = _data?['canRequestRefund'] == true;
    final status = _data?['appointmentStatus'] as String?;
    final isLocked = ['InConsultation', 'Completed'].contains(status);
    final isCancelled = status == 'Cancelled' || status == 'PatientCancelled';

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const Icon(LucideIcons.hourglass, color: Color(0xFF0284C7), size: 22),
              const SizedBox(width: 10),
              Text('No Active Refund Request',
                  style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 15)),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            isLocked
                ? 'Refund requests cannot be submitted for appointments that have already entered consultation or completed.'
                : canRequest || isCancelled
                    ? 'Your appointment has been cancelled. You may submit a refund request for receptionist review.'
                    : 'To request a refund, the appointment must first be cancelled prior to consultation.',
            style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 13),
          ),
          const SizedBox(height: 16),

          if (!isLocked && !isCancelled) ...[
            if (!_showCancelForm)
              OutlinedButton.icon(
                onPressed: () => setState(() => _showCancelForm = true),
                icon: const Icon(LucideIcons.circleX, size: 16),
                label: Text('Cancel Appointment First', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFFDC2626),
                  side: const BorderSide(color: Color(0xFFFCA5A5)),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              )
            else ...[
              Text('Select Cancellation Reason',
                  style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 13)),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _cancelReason,
                onChanged: (v) => setState(() => _cancelReason = v!),
                items: [
                  'I no longer need this appointment',
                  'Schedule conflict',
                  'Doctor reschedule request',
                  'Feeling better',
                  'Other',
                ]
                    .map((r) => DropdownMenuItem(
                        value: r, child: Text(r, style: GoogleFonts.inter(fontSize: 13))))
                    .toList(),
                decoration: InputDecoration(
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _cancelling ? null : _cancelAppointment,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFDC2626),
                        foregroundColor: Colors.white,
                      ),
                      icon: _cancelling
                          ? const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Icon(LucideIcons.check, size: 16),
                      label: Text('Confirm Cancellation',
                          style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  OutlinedButton(
                    onPressed: () => setState(() => _showCancelForm = false),
                    child: Text('Keep', style: GoogleFonts.inter()),
                  ),
                ],
              ),
            ],
          ],

          if (canRequest || isCancelled) ...[
            const SizedBox(height: 14),
            TextField(
              onChanged: (v) => _refundNotes = v,
              maxLines: 2,
              style: GoogleFonts.inter(fontSize: 13),
              decoration: InputDecoration(
                labelText: 'Additional Refund Notes (Optional)',
                hintText: 'e.g. Cancelled due to conflict, requesting refund to original card.',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                isDense: true,
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: _requesting ? null : _submitRefundRequest,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryBlue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              icon: _requesting
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : const Icon(LucideIcons.send, size: 16),
              label: Text('Submit Refund Request',
                  style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildPolicyCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Refund Guidelines',
              style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 13, color: AppTheme.textPrimary)),
          const SizedBox(height: 8),
          _policyBullet('Approved refunds are automatically initiated via the payment gateway.'),
          _policyBullet('Refunded funds are normally credited within 2–3 working days.'),
          _policyBullet('Appointments cancelled by receptionist or system trigger auto-refunds.'),
        ],
      ),
    );
  }

  Widget _policyBullet(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('• ', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
          Expanded(
            child: Text(text, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF64748B))),
          ),
        ],
      ),
    );
  }

  Widget _alertBanner(String msg, Color color, Color bg, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
      child: Row(
        children: [
          Icon(icon, color: color, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Text(msg,
                style: GoogleFonts.inter(color: color, fontSize: 12.5, fontWeight: FontWeight.w600)),
          ),
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
          Text(label, style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 12.5)),
          Text(value, style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 12.5)),
        ],
      ),
    );
  }

  String _format(String iso) {
    try {
      final dt = DateTime.parse(iso).toLocal();
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return iso;
    }
  }
}
