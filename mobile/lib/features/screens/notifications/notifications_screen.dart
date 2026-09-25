import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/network/api_client.dart';
import '../../../features/patient/patient_providers.dart';
import '../../../shared/models/models.dart';
import '../../../shared/widgets/widgets.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifAsync = ref.watch(notificationsProvider);

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
                  padding: const EdgeInsets.fromLTRB(4, 8, 16, 20),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                      Expanded(
                        child: Text('Notifications',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white)),
                      ),
                      notifAsync.valueOrNull?.any((n) => !n.isRead) == true
                          ? TextButton(
                              onPressed: () async {
                                await ApiClient.instance.post('/notifications/read-all');
                                ref.invalidate(notificationsProvider);
                              },
                              child: Text('Mark all read',
                                  style: GoogleFonts.outfit(fontSize: 12, color: Colors.white70)),
                            )
                          : const SizedBox(width: 80),
                    ],
                  ),
                ),
              ),
            ),
          ),

          notifAsync.when(
            loading: () => SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                    (_, __) => const ShimmerCard(height: 70), childCount: 6),
              ),
            ),
            error: (e, _) => SliverFillRemaining(
              child: ErrorState(message: e.toString(), onRetry: () => ref.invalidate(notificationsProvider)),
            ),
            data: (notifs) {
              if (notifs.isEmpty) {
                return const SliverFillRemaining(
                  child: EmptyState(
                    icon: Icons.notifications_none_outlined,
                    title: 'No notifications',
                    subtitle: 'System notifications about your appointments and prescriptions will appear here',
                  ),
                );
              }
              return SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (_, i) => _NotificationTile(notif: notifs[i], ref: ref),
                    childCount: notifs.length,
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

class _NotificationTile extends StatelessWidget {
  const _NotificationTile({required this.notif, required this.ref});
  final NotificationModel notif;
  final WidgetRef ref;

  IconData _icon(String? type) {
    return switch (type) {
      'appointment' => Icons.calendar_today_rounded,
      'prescription' => Icons.medication_rounded,
      'payment' => Icons.payments_rounded,
      'system' => Icons.info_outline_rounded,
      _ => Icons.notifications_outlined,
    };
  }

  Color _iconColor(String? type) {
    return switch (type) {
      'appointment' => AppTheme.primaryDeep,
      'prescription' => const Color(0xFF0D9488),
      'payment' => const Color(0xFFF59E0B),
      'system' => AppTheme.textSecondary,
      _ => AppTheme.primaryDeep,
    };
  }

  @override
  Widget build(BuildContext context) {
    final created = DateTime.tryParse(notif.createdAt) ?? DateTime.now();
    final isRecent = DateTime.now().difference(created).inDays < 1;

    return GestureDetector(
      onTap: () async {
        if (!notif.isRead) {
          await ApiClient.instance.post('/notifications/${notif.id}/read');
          ref.invalidate(notificationsProvider);
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: notif.isRead ? AppTheme.surface : AppTheme.primaryDeep.withOpacity(0.04),
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          border: Border.all(
            color: notif.isRead ? AppTheme.divider : AppTheme.primaryDeep.withOpacity(0.2),
          ),
          boxShadow: notif.isRead ? AppTheme.cardShadow : [],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: _iconColor(notif.type).withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(_icon(notif.type), color: _iconColor(notif.type), size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(notif.title,
                    style: GoogleFonts.outfit(
                      fontSize: 13, fontWeight: notif.isRead ? FontWeight.w500 : FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(notif.message,
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textSecondary, height: 1.4)),
                  const SizedBox(height: 4),
                  Text(
                    isRecent
                        ? DateFormat('h:mm a').format(created)
                        : DateFormat('d MMM • h:mm a').format(created),
                    style: GoogleFonts.outfit(fontSize: 10, color: AppTheme.textMuted),
                  ),
                ],
              ),
            ),
            if (!notif.isRead)
              Container(
                width: 8, height: 8,
                margin: const EdgeInsets.only(top: 4),
                decoration: const BoxDecoration(color: AppTheme.primaryDeep, shape: BoxShape.circle),
              ),
          ],
        ),
      ),
    );
  }
}
