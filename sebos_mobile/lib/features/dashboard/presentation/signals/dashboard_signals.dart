import 'package:signals_flutter/signals_flutter.dart';
import 'package:sebos_book/features/transactions/data/repositories/transaction_repository.dart';
import 'package:sebos_book/features/inventory/data/repositories/inventory_repository.dart';
import 'package:sebos_book/features/transactions/domain/entities/transaction_entity.dart';
import 'package:sebos_book/features/inventory/domain/entities/inventory_entity.dart';

class DashboardSignals {
  final TransactionRepository _txRepo = TransactionRepository();
  final InventoryRepository _invRepo = InventoryRepository();

  // Primary Signals (Reactive sources)
  late final StreamSignal<List<TransactionEntity>> transactions;
  late final StreamSignal<List<InventoryEntity>> inventory;

  // Computed Signals (Automatic derived values)
  late final computedDailyProfit = computed(() {
    final startOfDay = DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);
    final txs = transactions.value?.where((tx) => 
      tx.type == 'sale' && tx.date.isAfter(startOfDay.subtract(const Duration(seconds: 1)))
    ).toList() ?? [];
    return txs.fold(0.0, (sum, tx) => sum + tx.profit);
  });

  late final computedStockCount = computed(() => inventory.value?.length ?? 0);
  
  late final computedSalesCountToday = computed(() {
    final startOfDay = DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);
    return transactions.value?.where((tx) => 
      tx.type == 'sale' && tx.date.isAfter(startOfDay.subtract(const Duration(seconds: 1)))
    ).length ?? 0;
  });

  DashboardSignals() {
    transactions = _txRepo.watchTransactions().toSignal();
    inventory = _invRepo.watchInventory().toSignal();
  }

  // Analytics data signals
  final weeklyData = signal<List<Map<String, dynamic>>>([]);
  final isLoadingAnalytics = signal<bool>(false);

  Future<void> refreshAnalytics() async {
    isLoadingAnalytics.value = true;
    final data = await _txRepo.getWeeklyRevenue();
    weeklyData.value = data;
    isLoadingAnalytics.value = false;
  }
}

// Global instance for simple access (Service Locator pattern)
final dashboardSignals = DashboardSignals();
