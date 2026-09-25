import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';

class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(myOrdersProvider);

    return Scaffold(
      backgroundColor: AppTheme.surfaceDim,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(24),
                  bottomRight: Radius.circular(24),
                ),
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Medicine Orders',
                              style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                            Text('Track your pharmacy orders',
                              style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          ordersAsync.when(
            loading: () => SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                    (_, __) => const ShimmerCard(height: 100), childCount: 4),
              ),
            ),
            error: (e, _) => SliverFillRemaining(
              child: ErrorState(message: e.toString(), onRetry: () => ref.invalidate(myOrdersProvider)),
            ),
            data: (orders) {
              if (orders.isEmpty) {
                return const SliverFillRemaining(
                  child: EmptyState(
                    icon: Icons.shopping_bag_outlined,
                    title: 'No medicine orders',
                    subtitle: 'Medicine orders placed for your prescriptions will appear here',
                  ),
                );
              }
              return SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (_, i) => _OrderCard(order: orders[i]),
                    childCount: orders.length,
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  const _OrderCard({required this.order});
  final OrderModel order;

  @override
  Widget build(BuildContext context) {
    final st = AppTheme.orderStatus(order.status);
    final created = DateTime.tryParse(order.createdAt) ?? DateTime.now();

    return MedCard(
      margin: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppTheme.primaryDeep.withOpacity(0.08),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.shopping_bag_outlined, color: AppTheme.primaryDeep, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Order #${order.id}',
                    style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700)),
                Text(order.pharmacyName,
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary)),
              ]),
            ),
            StatusBadge(label: order.status, bg: st.bg, color: st.text),
          ]),
          const Divider(height: 20),
          Row(children: [
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('${order.items.length} item${order.items.length != 1 ? 's' : ''}',
                  style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted)),
              Text(DateFormat('d MMM yyyy').format(created),
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
            ])),
            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text('Rs. ${order.totalAmount.toStringAsFixed(2)}',
                  style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.primaryDeep)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: order.isPaid ? AppTheme.statusConfirmed.withOpacity(0.1) : AppTheme.statusPending.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(order.isPaid ? '✓ Paid' : 'Unpaid',
                  style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600,
                      color: order.isPaid ? AppTheme.statusConfirmed : AppTheme.statusPending)),
              ),
            ]),
          ]),
          // Items preview
          if (order.items.isNotEmpty) ...[
            const SizedBox(height: 8),
            ...order.items.take(2).map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 2),
              child: Text('• ${item.medicineName} × ${item.quantity}',
                style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary),
              ),
            )),
            if (order.items.length > 2)
              Text('+ ${order.items.length - 2} more...',
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted)),
          ],
        ],
      ),
    );
  }
}
