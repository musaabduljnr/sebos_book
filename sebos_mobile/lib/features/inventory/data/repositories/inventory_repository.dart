import 'package:isar/isar.dart';
import 'package:sebos_book/core/db/isar_database.dart';
import 'package:sebos_book/features/inventory/domain/entities/inventory_entity.dart';

class InventoryRepository {
  final _isar = IsarDatabase.isar;

  // Watch active inventory
  Stream<List<InventoryEntity>> watchInventory() {
    return _isar.inventoryEntitys.filter()
        .statusEqualTo('active')
        .sortByAddedAtDesc()
        .watch(fireImmediately: true);
  }

  Future<List<InventoryEntity>> searchInventory(String query) async {
    return await _isar.inventoryEntitys.filter()
        .statusEqualTo('active')
        .and()
        .group((q) => q
          .phoneModelContains(query, caseSensitive: false)
          .or()
          .imeiContains(query)
          .or()
          .brandContains(query, caseSensitive: false)
        )
        .findAll();
  }

  Future<void> removeByIMEI(String imei) async {
    await _isar.writeTxn(() async {
      await _isar.inventoryEntitys.filter()
          .imeiEqualTo(imei)
          .deleteAll();
    });
  }

  Future<Map<String, dynamic>> getInventoryStats() async {
    final activeItems = await _isar.inventoryEntitys.filter()
        .statusEqualTo('active')
        .findAll();
    
    return {
      'totalItems': activeItems.length,
      'totalValue': activeItems.fold(0.0, (sum, item) => sum + item.costPrice),
      'brands': activeItems.map((e) => e.brand).toSet().toList(),
    };
  }
}
