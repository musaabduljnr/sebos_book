import 'package:flutter/material.dart';
import 'package:signals_flutter/signals_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:sebos_book/core/db/isar_database.dart';
import 'package:sebos_book/core/theme/app_theme.dart';
import 'package:sebos_book/features/layout/presentation/pages/main_layout.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase
  // Replace these with your project credentials
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  );

  // Initialize Isar Local Database
  await IsarDatabase.init();

  runApp(const SebosBookApp());
}

class SebosBookApp extends StatelessWidget {
  const SebosBookApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sebos Book',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: StreamBuilder<AuthState>(
        stream: Supabase.instance.client.auth.onAuthStateChange,
        builder: (context, snapshot) {
          final session = Supabase.instance.client.auth.currentSession;
          if (session == null) {
            // Ideally navigate to a dedicated LoginPage. 
            // For now, we'll root to MainLayout but you'd use a conditional.
            return const MainLayout(); 
          }
          return const MainLayout();
        },
      ),
      builder: (context, child) {
        return SignalsObserver(child: child!);
      },
    );
  }
}
