import 'package:isar/isar.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:sebos_book/core/db/isar_database.dart';
import 'package:sebos_book/features/transactions/domain/entities/transaction_entity.dart';
import 'package:sebos_book/features/inventory/domain/entities/inventory_entity.dart';

class SyncManager {
  final _isar = IsarDatabase.isar;
  final _supabase = Supabase.instance.client;

  Future<void> performSync() async {
    final user = _supabase.auth.currentUser;
    if (user == null) return;

    // 1. Push Transactions
    final unsyncedTxs = await _isar.transactionEntitys.filter().isSyncedEqualTo(false).findAll();
    for (final tx in unsyncedTxs) {
      try {
        final Map<String, dynamic> data = {
          'user_id': user.id,
          'type': tx.type,
          'phone_model': tx.phoneModel,
          'imei': tx.imei,
          'brand': tx.brand,
          'condition': tx.condition,
          'cost_price': tx.costPrice,
          'sale_price': tx.salePrice,
          'date': tx.date.toIso8601String().split('T')[0],
        };

        if (tx.serverId != null) data['id'] = tx.serverId;

        final response = await _supabase.from('transactions').upsert(data).select().single();
        
        await _isar.writeTxn(() async {
          tx.isSynced = true;
          tx.serverId = response['id'];
          tx.updatedAt = DateTime.parse(response['updated_at']);
          await _isar.transactionEntitys.put(tx);
        });
      } catch (e) {
        print('Error syncing transaction ${tx.id}: $e');
      }
    }

    // 2. Push Inventory
    final unsyncedInv = await _isar.inventoryEntitys.filter().isSyncedEqualTo(false).findAll();
    for (final item in unsyncedInv) {
      try {
        final Map<String, dynamic> data = {
          'user_id': user.id,
          'phone_model': item.phoneModel,
          'imei': item.imei,
          'brand': item.brand,
          'condition': item.condition,
          'cost_price': item.costPrice,
          'status': item.status,
          'added_at': item.addedAt.toIso8601String(),
        };

        if (item.serverId != null) data['id'] = item.serverId;

        final response = await _supabase.from('inventory').upsert(data).select().single();
        
        await _isar.writeTxn(() async {
          item.isSynced = true;
          item.serverId = response['id'];
          item.updatedAt = DateTime.parse(response['updated_at']);
          await _isar.inventoryEntitys.put(item);
        });
      } catch (e) {
        print('Error syncing inventory item ${item.imei}: $e');
      }
    }

    // 3. Pull Changes (Simplified Pull)
    final remoteTxs = await _supabase.from('transactions').select();
    for (var rTx in remoteTxs) {
       final local = await _isar.transactionEntitys.filter().serverIdEqualTo(rTx['id']).findFirst();
       if (local == null) {
         await _isar.writeTxn(() async {
           final newTx = TransactionEntity()
              ..serverId = rTx['id']
              ..type = rTx['type']
              ..phoneModel = rTx['phone_model']
              ..imei = rTx['imei']
              ..brand = rTx['brand']
              ..condition = rTx['condition']
              ..costPrice = (rTx['cost_price'] as num).toDouble()
              ..salePrice = (rTx['sale_price'] as num).toDouble()
              ..date = DateTime.parse(rTx['date'])
              ..createdAt = DateTime.parse(rTx['created_at'])
              ..isSynced = true
              ..updatedAt = DateTime.parse(rTx['updated_at']);
           await _isar.transactionEntitys.put(newTx);
         });
       }
    }
  }
}
