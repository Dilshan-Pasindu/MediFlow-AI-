import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/appointment_provider.dart';
import '../providers/auth_provider.dart';
import 'login_screen.dart';
import 'payment_screens.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final appointmentsAsync = ref.watch(myAppointmentsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('MediFlow Patient Portal'),
        backgroundColor: const Color(0xFF0284C7),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () {
              ref.read(authProvider.notifier).logout();
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (_) => const LoginScreen()),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(myAppointmentsProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Card
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: const Color(0xFFE0F2FE),
                        child: Text(
                          (authState.user?.fullName.isNotEmpty ?? false)
                              ? authState.user!.fullName[0].toUpperCase()
                              : 'U',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0284C7),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Hello, ${authState.user?.fullName ?? "Patient"}!',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              authState.user?.email ?? 'patient@mediflow.lk',
                              style: const TextStyle(
                                color: Color(0xFF64748B),
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'My Appointments',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 12),
              appointmentsAsync.when(
                data: (appointments) {
                  if (appointments.isEmpty) {
                    return const Center(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 40),
                        child: Text(
                          'No appointments booked yet.',
                          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 16),
                        ),
                      ),
                    );
                  }

                  return ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: appointments.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final appt = appointments[index];
                      final dateFormatted =
                          DateFormat('EEE, MMM d, yyyy • h:mm a')
                              .format(appt.appointmentDateTime);

                      final bool isPendingPayment = [
                            'Pending', 'PaymentFailed'
                          ].contains(appt.status);
                      final bool hasPaidPayment = [
                            'PaymentPending', 'PaymentSubmitted', 'PaymentVerified',
                            'WaitingForReceptionist'
                          ].contains(appt.status);
                      final bool isCancelledWithRefund = [
                            'Cancelled', 'PatientCancelled', 'ReceptionistRejected',
                            'RefundRequested'
                          ].contains(appt.status);

                      Color chipColor = const Color(0xFF0F172A);
                      Color chipBg = const Color(0xFFF1F5F9);
                      if (appt.status == 'Confirmed' || appt.status == 'ReceptionistApproved') {
                        chipColor = const Color(0xFF166534); chipBg = const Color(0xFFDCFCE7);
                      } else if (appt.status == 'Pending' || isPendingPayment) {
                        chipColor = const Color(0xFF854D0E); chipBg = const Color(0xFFFEF3C7);
                      } else if (isCancelledWithRefund) {
                        chipColor = const Color(0xFF991B1B); chipBg = const Color(0xFFFEF2F2);
                      } else if (hasPaidPayment) {
                        chipColor = const Color(0xFF0369A1); chipBg = const Color(0xFFEFF6FF);
                      }

                      return Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(color: chipBg, width: 1.5),
                        ),
                        elevation: 1.5,
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const CircleAvatar(
                                    radius: 20,
                                    backgroundColor: Color(0xFFE0F2FE),
                                    child: Icon(Icons.person, color: Color(0xFF0284C7), size: 20),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(appt.doctorName,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                                        const SizedBox(height: 2),
                                        Text(appt.specialty,
                                            style: const TextStyle(color: Color(0xFF0284C7), fontSize: 12.5, fontWeight: FontWeight.w500)),
                                        const SizedBox(height: 3),
                                        Text(dateFormatted,
                                            style: const TextStyle(color: Color(0xFF64748B), fontSize: 11.5)),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: chipBg, borderRadius: BorderRadius.circular(20)),
                                    child: Text(appt.status,
                                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: chipColor)),
                                  ),
                                ],
                              ),
                              if (appt.appointmentNumber != null && appt.appointmentNumber!.isNotEmpty) ...[  
                                const SizedBox(height: 6),
                                Text('Appointment: #${appt.appointmentNumber}',
                                    style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                              ],
                              // Payment action buttons
                              if (isPendingPayment || hasPaidPayment || isCancelledWithRefund) ...
                                [const SizedBox(height: 10),
                                Row(
                                  children: [
                                    if (isPendingPayment)
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          onPressed: () => Navigator.of(context).push(
                                            MaterialPageRoute(builder: (_) => PaymentCheckoutScreen(
                                              appointmentId: appt.id,
                                              doctorName: appt.doctorName,
                                              fee: appt.fee,
                                            )),
                                          ).then((_) => ref.invalidate(myAppointmentsProvider)),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: const Color(0xFF0284C7),
                                            foregroundColor: Colors.white,
                                            padding: const EdgeInsets.symmetric(vertical: 8),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                          ),
                                          icon: const Icon(Icons.credit_card, size: 15),
                                          label: Text('Pay Rs. ${(appt.fee > 0 ? appt.fee : 2500.0).toStringAsFixed(0)}',
                                              style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold)),
                                        ),
                                      ),
                                    if (hasPaidPayment)
                                      Expanded(
                                        child: OutlinedButton.icon(
                                          onPressed: () => Navigator.of(context).push(
                                            MaterialPageRoute(builder: (_) => PaymentCheckoutScreen(
                                              appointmentId: appt.id,
                                              doctorName: appt.doctorName,
                                              fee: appt.fee,
                                            )),
                                          ),
                                          style: OutlinedButton.styleFrom(
                                            padding: const EdgeInsets.symmetric(vertical: 8),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                          ),
                                          icon: const Icon(Icons.payment_outlined, size: 14),
                                          label: const Text('Payment Status', style: TextStyle(fontSize: 12.5)),
                                        ),
                                      ),
                                    if (isCancelledWithRefund)
                                      Expanded(
                                        child: OutlinedButton.icon(
                                          onPressed: () => Navigator.of(context).push(
                                            MaterialPageRoute(builder: (_) => RefundTrackingScreen(
                                              appointmentId: appt.id,
                                            )),
                                          ),
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: const Color(0xFFDC2626),
                                            padding: const EdgeInsets.symmetric(vertical: 8),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                          ),
                                          icon: const Icon(Icons.monetization_on_outlined, size: 14),
                                          label: const Text('Track Refund', style: TextStyle(fontSize: 12.5)),
                                        ),
                                      ),
                                  ],
                                )],
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
                loading: () => const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(vertical: 40),
                    child: CircularProgressIndicator(),
                  ),
                ),
                error: (err, _) => Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 40),
                    child: Text(
                      'Failed to load appointments: $err',
                      style: const TextStyle(color: Colors.red),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
