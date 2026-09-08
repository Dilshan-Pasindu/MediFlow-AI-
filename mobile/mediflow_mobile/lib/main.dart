import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(
    const ProviderScope(
      child: MediFlowApp(),
    ),
  );
}

class MediFlowApp extends StatelessWidget {
  const MediFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MediFlow AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0284C7),
          primary: const Color(0xFF0284C7),
        ),
        useMaterial3: true,
      ),
      home: const LoginScreen(),
    );
  }
}
