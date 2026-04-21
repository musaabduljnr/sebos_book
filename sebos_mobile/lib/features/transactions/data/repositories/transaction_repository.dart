import 'package:isar/isar.dart';
import 'package:sebos_book/core/db/isar_database.dart';
import 'package:sebos_book/features/inventory/domain/entities/inventory_entity.dart';
import 'package:sebos_book/features/transactions/domain/entities/transaction_entity.dart';

class TransactionRepository {
  final _isar = IsarDatabase.isar;

  // Watch all transactions for real-time updates
  Stream<List<TransactionEntity>> watchTransactions() {
    return _isar.transactionEntitys.where().sortByCreatedAtDesc().watch(fireImmediately: true);
  }

  Future<void> addTransaction(TransactionEntity transaction) async {
    await _isar.writeTxn(() async {
      await _isar.transactionEntitys.put(transaction);

      // Inventory business logic management
      if (transaction.type == 'trade-in') {
        // Add to inventory
        final item = InventoryEntity()
          ..phoneModel = transaction.phoneModel
          ..imei = transaction.imei
          ..brand = transaction.brand
          ..condition = transaction.condition
          ..costPrice = transaction.costPrice
          ..status = 'active'
          ..addedAt = DateTime.now();
        await _isar.inventoryEntitys.put(item);
      } else if (transaction.type == 'sale') {
        // Mark as sold or remove from inventory
        final existing = await _isar.inventoryEntitys.filter()
            .imeiEqualTo(transaction.imei)
            .statusEqualTo('active')
            .findFirst();
        
        if (existing != null) {
          existing.status = 'sold';
          await _isar.inventoryEntitys.put(existing);
        }
      }
    });
  }

  Future<List<TransactionEntity>> getRecentTransactions({int limit = 10}) async {
    return await _isar.transactionEntitys.where().sortByCreatedAtDesc().limit(limit).findAll();
  }

  Future<double> getDailyProfit(DateTime date) async {
    final startOfDay = DateTime(date.year, date.month, date.day);
    final endOfDay = startOfDay.add(const Duration(days: 1));
    
    final txs = await _isar.transactionEntitys.filter()
        .dateBetween(startOfDay, endOfDay)
        .typeEqualTo('sale')
        .findAll();
    
    return txs.fold(0.0, (sum, tx) => sum + tx.profit);
  }

  Future<List<Map<String, dynamic>>> getWeeklyRevenue() async {
    final now = DateTime.now();
    final List<Map<String, dynamic>> results = [];

    for (int i = 6; i >= 0; i--) {
      final date = now.subtract(Duration(days: i));
      final start = DateTime(date.year, date.month, date.day);
      final end = start.add(const Duration(days: 1));
      
      final txs = await _isar.transactionEntitys.filter()
          .dateBetween(start, end)
          .typeEqualTo('sale')
          .findAll();
      
      results.add({
        'day': _getWeekday(date.weekday),
        'revenue': txs.fold(0.0, (sum, tx) => sum + tx.salePrice),
        'profit': txs.fold(0.0, (sum, tx) => sum + tx.profit),
      });
    }
    return results;
  }

  String _getWeekday(int day) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[day - 1];
  }
}
