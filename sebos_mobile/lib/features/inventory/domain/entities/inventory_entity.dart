import 'package:isar/isar.dart';

part 'inventory_entity.g.dart';

@collection
class InventoryEntity {
  Id id = Isar.autoIncrement;

  late String phoneModel;
  
  @Index(unique: true, replace: true)
  late String imei;
  
  @Index(type: IndexType.value)
  late String brand;
  
  late String condition;
  late double costPrice;
  
  @Index(type: IndexType.value)
  late String status; // 'active' | 'sold'
  
  late DateTime addedAt;

  // Cloud Sync Metadata
  @Index(unique: true, replace: true)
  String? serverId;
  
  @Index(type: IndexType.value)
  bool isSynced = false;
  
  DateTime? updatedAt;
}
