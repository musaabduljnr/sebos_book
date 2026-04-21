import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sebos_book/features/transactions/domain/entities/transaction_entity.dart';
import 'package:sebos_book/features/inventory/domain/entities/inventory_entity.dart';

class IsarDatabase {
  static late Isar isar;

  static Future<void> init() async {
    final dir = await getApplicationDocumentsDirectory();
    isar = await Isar.open(
      [TransactionEntitySchema, InventoryEntitySchema],
      directory: dir.path,
      inspector: true, // Enable Isar Inspector for debugging
    );
  }

  // Helper to ensure database is cleared for demo purposes if needed
  static Future<void> clearAll() async {
    await isar.writeTxn(() => isar.clear());
  }
}
