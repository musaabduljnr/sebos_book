import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:signals_flutter/signals_flutter.dart';
import 'package:sebos_book/core/theme/app_theme.dart';
import 'package:sebos_book/features/dashboard/presentation/signals/dashboard_signals.dart';
import 'package:sebos_book/shared/widgets/transaction_tile.dart';

class HistoryPage extends StatefulWidget {
  const HistoryPage({super.key});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
  final TextEditingController _searchController = TextEditingController();
  final _searchQuery = signal('');

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      _searchQuery.value = _searchController.text;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Transaction History'),
        backgroundColor: Colors.transparent,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: TextField(
              controller: _searchController,
              decoration: const InputDecoration(
                hintText: 'Search history...',
                prefixIcon: Icon(LucideIcons.search, size: 18),
              ),
            ),
          ),
          Expanded(
            child: Watch((context) {
              final query = _searchQuery.value.toLowerCase();
              final allTxs = dashboardSignals.transactions.value ?? [];
              
              final filteredTxs = allTxs.where((tx) {
                return tx.phoneModel.toLowerCase().contains(query) ||
                       tx.imei.contains(query) ||
                       tx.brand.toLowerCase().contains(query);
              }).toList();

              if (filteredTxs.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(LucideIcons.clock, size: 48, color: AppTheme.textMuted),
                      const SizedBox(height: 16),
                      Text('No history records', style: AppTheme.darkTheme.textTheme.bodySmall),
                    ],
                  ),
                );
              }

              return ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                itemCount: filteredTxs.length,
                itemBuilder: (context, index) {
                  return TransactionTile(
                    transaction: filteredTxs[index],
                    onTap: () {
                      // Logic to open receipt
                    },
                  );
                },
              );
            }),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
