import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';

/// Medicine Orders & Real-Time Pharmacy Dispensing Tracker (macOS Medical Theme)
/// Mirrors the website OrdersPage functionality and 3-stage dispensing workflow:
///  Stage 1: In Queue (Prescription received in pharmacy dispensing queue)
///  Stage 2: Pharmacist Confirmed (Clinical safety & stock verified)
///  Stage 3: Dispensed (Medications handed over and recorded)
class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key, this.initialPrescriptionId});
  final int? initialPrescriptionId;

  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> {
  String _selectedTab = 'all'; // 'all', 'active', 'dispensed'

  @override
  Widget build(BuildContext context) {
    final ordersAsync = ref.watch(myOrdersProvider);

    return Scaffold(
      backgroundColor: AppTheme.bgCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppTheme.bgCanvas,
              shape: BoxShape.circle,
              border: Border.all(color: AppTheme.cardBorder),
            ),
            child: const Icon(Icons.arrow_back_rounded, size: 18, color: AppTheme.textPrimary),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                AppTheme.macOSWindowDots(size: 9, spacing: 4),
                const SizedBox(width: 8),
                Text(
                  'Medicine Dispensing Tracker',
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ],
            ),
            Text(
              'Real-time pharmacy fulfillment queue',
              style: GoogleFonts.outfit(
                fontSize: 11,
                color: AppTheme.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppTheme.bgCanvas,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.cardBorder),
              ),
              child: Row(
                children: [
                  _FilterSegment(
                    label: 'All Orders',
                    icon: Icons.list_alt_rounded,
                    isSelected: _selectedTab == 'all',
                    onTap: () => setState(() => _selectedTab = 'all'),
                  ),
                  _FilterSegment(
                    label: 'Active',
                    icon: Icons.hourglass_top_rounded,
                    isSelected: _selectedTab == 'active',
                    onTap: () => setState(() => _selectedTab = 'active'),
                  ),
                  _FilterSegment(
                    label: 'Dispensed',
                    icon: Icons.check_circle_outline_rounded,
                    isSelected: _selectedTab == 'dispensed',
                    onTap: () => setState(() => _selectedTab = 'dispensed'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: RefreshIndicator(
        color: AppTheme.primaryBlue,
        onRefresh: () async => ref.invalidate(myOrdersProvider),
        child: ordersAsync.when(
          loading: () => ListView(
            padding: const EdgeInsets.all(16),
            children: const [
              ShimmerCard(height: 180),
              SizedBox(height: 14),
              ShimmerCard(height: 180),
            ],
          ),
          error: (e, _) => Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: ErrorState(
                message: e.toString(),
                onRetry: () => ref.invalidate(myOrdersProvider),
              ),
            ),
          ),
          data: (orders) {
            final filtered = orders.where((o) {
              if (_selectedTab == 'active') {
                return !['Dispensed', 'Cancelled'].contains(o.status);
              } else if (_selectedTab == 'dispensed') {
                return o.status == 'Dispensed';
              }
              return true;
            }).toList();

            if (filtered.isEmpty) {
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  const SizedBox(height: 80),
                  Center(
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.medication_liquid_rounded,
                        size: 36,
                        color: AppTheme.primaryBlue,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _selectedTab == 'active'
                        ? 'No active orders in queue'
                        : _selectedTab == 'dispensed'
                            ? 'No dispensed orders yet'
                            : 'No medicine orders found',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: Text(
                      'When your doctor issues an e-prescription, it is queued for pharmacy dispensing and tracked here in real-time.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.outfit(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              );
            }

            return ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 16),
              itemBuilder: (context, i) => _OrderDispenseCard(order: filtered[i]),
            );
          },
        ),
      ),
    );
  }
}

class _FilterSegment extends StatelessWidget {
  const _FilterSegment({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 14,
                color: isSelected ? AppTheme.primaryBlue : AppTheme.textSecondary,
              ),
              const SizedBox(width: 6),
              Text(
                label,
                style: GoogleFonts.outfit(
                  fontSize: 12.5,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected ? AppTheme.primaryBlue : AppTheme.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OrderDispenseCard extends StatelessWidget {
  const _OrderDispenseCard({required this.order});
  final OrderModel order;

  int get _currentStage {
    final status = order.status.toLowerCase();
    if (status == 'dispensed') return 3;
    if (['confirmed', 'preparing', 'ready'].contains(status)) return 2;
    return 1; // Pending / In Queue
  }

  @override
  Widget build(BuildContext context) {
    final created = DateTime.tryParse(order.createdAt) ?? DateTime.now();
    final formattedDate = DateFormat('MMM d, yyyy • hh:mm a').format(created);
    final stage = _currentStage;
    final isDispensed = stage >= 3;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDispensed
              ? AppTheme.accentGreen.withValues(alpha: 0.3)
              : AppTheme.cardBorder,
          width: isDispensed ? 1.5 : 1,
        ),
        boxShadow: AppTheme.macOSShadow,
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Bar: Order ID, Pharmacy, Status Pill
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.local_pharmacy_rounded,
                        color: AppTheme.primaryBlue,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Order #${order.id}',
                          style: GoogleFonts.outfit(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        Text(
                          order.pharmacyName.isNotEmpty
                              ? order.pharmacyName
                              : 'MediFlow Central Pharmacy',
                          style: GoogleFonts.outfit(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                _buildStatusPill(order.status),
              ],
            ),

            const SizedBox(height: 16),

            // ── 3-Stage macOS Stepper Visual ─────────────────────────
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.surface2,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.cardBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'DISPENSING PROGRESS',
                        style: GoogleFonts.outfit(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textMuted,
                          letterSpacing: 0.5,
                        ),
                      ),
                      Text(
                        stage == 3
                            ? '✓ Handed to Patient'
                            : stage == 2
                                ? 'Pharmacist Verified'
                                : 'Awaiting Review',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: stage == 3
                              ? AppTheme.accentGreen
                              : stage == 2
                                  ? AppTheme.primaryBlue
                                  : AppTheme.starGold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _StepNode(
                        title: 'In Queue',
                        stepNum: 1,
                        isComplete: stage >= 1,
                        isActive: stage == 1,
                      ),
                      _StepConnector(isComplete: stage >= 2),
                      _StepNode(
                        title: 'Verified',
                        stepNum: 2,
                        isComplete: stage >= 2,
                        isActive: stage == 2,
                      ),
                      _StepConnector(isComplete: stage >= 3),
                      _StepNode(
                        title: 'Dispensed',
                        stepNum: 3,
                        isComplete: stage >= 3,
                        isActive: stage == 3,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 14),

            // Itemized Medicines Summary
            if (order.items.isNotEmpty) ...[
              Text(
                'Prescribed Items (${order.items.length})',
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 8),
              ...order.items.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.medication_rounded,
                                size: 14, color: AppTheme.primaryBlue),
                            const SizedBox(width: 6),
                            Text(
                              item.medicineName,
                              style: GoogleFonts.outfit(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.textPrimary,
                              ),
                            ),
                            if (item.dosage != null && item.dosage!.isNotEmpty) ...[
                              const SizedBox(width: 4),
                              Text(
                                '(${item.dosage})',
                                style: GoogleFonts.outfit(
                                  fontSize: 11,
                                  color: AppTheme.textMuted,
                                ),
                              ),
                            ],
                          ],
                        ),
                        Text(
                          'Qty: ${item.quantity}',
                          style: GoogleFonts.outfit(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  )),
            ],

            const Divider(height: 20),

            // Footer: Date and Total Amount
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  formattedDate,
                  style: GoogleFonts.outfit(
                    fontSize: 11.5,
                    color: AppTheme.textMuted,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Row(
                  children: [
                    Text(
                      'Total: ',
                      style: GoogleFonts.outfit(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    Text(
                      'Rs. ${order.totalAmount.toStringAsFixed(2)}',
                      style: GoogleFonts.outfit(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.primaryBlue,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusPill(String status) {
    Color bg;
    Color text;
    String label;
    IconData icon;

    switch (status.toLowerCase()) {
      case 'dispensed':
        bg = const Color(0xFFECFDF5);
        text = const Color(0xFF059669);
        label = '✓ Dispensed';
        icon = Icons.check_circle_rounded;
        break;
      case 'confirmed':
      case 'preparing':
      case 'ready':
        bg = const Color(0xFFEFF6FF);
        text = const Color(0xFF0284C7);
        label = 'Confirmed';
        icon = Icons.verified_rounded;
        break;
      case 'cancelled':
        bg = const Color(0xFFFEF2F2);
        text = const Color(0xFFDC2626);
        label = 'Cancelled';
        icon = Icons.cancel_rounded;
        break;
      default:
        bg = const Color(0xFFFFFBEB);
        text = const Color(0xFFB45309);
        label = 'In Queue';
        icon = Icons.schedule_rounded;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: text),
          const SizedBox(width: 4),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: text,
            ),
          ),
        ],
      ),
    );
  }
}

class _StepNode extends StatelessWidget {
  const _StepNode({
    required this.title,
    required this.stepNum,
    required this.isComplete,
    required this.isActive,
  });

  final String title;
  final int stepNum;
  final bool isComplete;
  final bool isActive;

  @override
  Widget build(BuildContext context) {
    Color nodeColor;
    if (isComplete) {
      nodeColor = AppTheme.accentGreen;
    } else if (isActive) {
      nodeColor = AppTheme.primaryBlue;
    } else {
      nodeColor = AppTheme.textMuted.withValues(alpha: 0.4);
    }

    return Column(
      children: [
        Container(
          width: 26,
          height: 26,
          decoration: BoxDecoration(
            color: nodeColor,
            shape: BoxShape.circle,
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: nodeColor.withValues(alpha: 0.35),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Center(
            child: isComplete
                ? const Icon(Icons.check_rounded, size: 14, color: Colors.white)
                : Text(
                    '$stepNum',
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          title,
          style: GoogleFonts.outfit(
            fontSize: 10,
            fontWeight: isComplete || isActive ? FontWeight.w700 : FontWeight.w500,
            color: isComplete || isActive ? AppTheme.textPrimary : AppTheme.textMuted,
          ),
        ),
      ],
    );
  }
}

class _StepConnector extends StatelessWidget {
  const _StepConnector({required this.isComplete});
  final bool isComplete;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        height: 3,
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: isComplete
              ? AppTheme.accentGreen
              : AppTheme.textMuted.withValues(alpha: 0.25),
          borderRadius: BorderRadius.circular(2),
        ),
      ),
    );
  }
}
