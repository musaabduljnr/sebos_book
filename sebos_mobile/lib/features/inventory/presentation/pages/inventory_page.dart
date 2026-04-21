import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:signals_flutter/signals_flutter.dart';
import 'package:sebos_book/core/theme/app_theme.dart';
import 'package:sebos_book/features/dashboard/presentation/signals/dashboard_signals.dart';
import 'package:sebos_book/shared/widgets/stock_tile.dart';

class InventoryPage extends StatefulWidget {
  const InventoryPage({super.key});

  @override
  State<InventoryPage> createState() => _InventoryPageState();
}

class _InventoryPageState extends State<InventoryPage> {
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
        title: const Text('Active Stock'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search by model, brand, or IMEI...',
                prefixIcon: const Icon(LucideIcons.search, size: 18),
                suffixIcon: IconButton(
                  icon: const Icon(LucideIcons.filter, size: 18),
                  onPressed: () {},
                ),
              ),
            ),
          ),

          // Stock Grid
          Expanded(
            child: Watch((context) {
              final query = _searchQuery.value.toLowerCase();
              final allStock = dashboardSignals.inventory.value ?? [];
              
              final filteredStock = allStock.where((item) {
                return item.phoneModel.toLowerCase().contains(query) ||
                       item.imei.contains(query) ||
                       item.brand.toLowerCase().contains(query);
              }).toList();

              if (filteredStock.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(LucideIcons.package, size: 48, color: AppTheme.textMuted),
                      const SizedBox(height: 16),
                      Text(
                        allStock.isEmpty ? 'Inventory is empty' : 'No matches found',
                        style: AppTheme.darkTheme.textTheme.bodySmall,
                      ),
                    ],
                  ),
                );
              }

              return GridView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.8,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: filteredStock.length,
                itemBuilder: (context, index) {
                  return StockTile(
                    item: filteredStock[index],
                    onSell: () {
                      // Logic to pre-fill sale form
                    },
                    onRemove: () {
                       // Logic to delete
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
