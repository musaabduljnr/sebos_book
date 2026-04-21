import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:sebos_book/core/theme/app_theme.dart';
import 'package:sebos_book/features/dashboard/presentation/pages/home_page.dart';
import 'package:sebos_book/features/inventory/presentation/pages/inventory_page.dart';
import 'package:sebos_book/features/transactions/presentation/pages/transaction_form_page.dart';
import 'package:sebos_book/features/history/presentation/pages/history_page.dart';
import 'package:sebos_book/features/analytics/presentation/pages/analytics_page.dart';

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const HomePage(),
    const InventoryPage(),
    const TransactionFormPage(), // Middle button logic handled below
    const AnalyticsPage(),
    const HistoryPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _pages,
      ),
      bottomNavigationBar: NavigationBar(
        height: 65,
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          if (index == 2) {
            // "Add" button usually opens a modal or a primary page without changing bottom nav index
            // But for this simple implementation, we'll let it stay as a page
            setState(() => _selectedIndex = index);
          } else {
            setState(() => _selectedIndex = index);
          }
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(LucideIcons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(LucideIcons.package),
            label: 'Stock',
          ),
          NavigationDestination(
            icon: CircleAvatar(
              backgroundColor: AppTheme.accentBlue,
              radius: 20,
              child: Icon(LucideIcons.plus, color: Colors.white),
            ),
            label: 'Add',
          ),
          NavigationDestination(
            icon: Icon(LucideIcons.barChart2),
            label: 'Analytics',
          ),
          NavigationDestination(
            icon: Icon(LucideIcons.history),
            label: 'History',
          ),
        ],
      ),
    );
  }
}
