import 'package:isar/isar.dart';

part 'transaction_entity.g.dart';

@collection
class TransactionEntity {
  Id id = Isar.autoIncrement;

  @Index(type: IndexType.value)
  late String type; // 'sale' | 'trade-in'

  late String phoneModel;
  
  @Index(type: IndexType.hash)
  late String imei;
  
  late String brand;
  late String condition;
  
  late double costPrice;
  late double salePrice;
  
  @Index(type: IndexType.value)
  late DateTime date;

  late DateTime createdAt;

  // Cloud Sync Metadata
  @Index(unique: true, replace: true)
  String? serverId;
  
  @Index(type: IndexType.value)
  bool isSynced = false;
  
  DateTime? updatedAt;

  // Computed fields
  double get profit => type == 'sale' ? salePrice - costPrice : 0;
}
