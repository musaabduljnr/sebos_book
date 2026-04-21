import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:sebos_book/core/theme/app_theme.dart';
import 'package:sebos_book/features/inventory/domain/entities/inventory_entity.dart';

class StockTile extends StatelessWidget {
  final InventoryEntity item;
  final VoidCallback? onSell;
  final VoidCallback? onRemove;

  const StockTile({
    super.key,
    required this.item,
    this.onSell,
    this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: '₦', decimalDigits: 0);

    return Container(
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0x1AFFFFFF)),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.accentBlue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  item.brand,
                  style: AppTheme.darkTheme.textTheme.labelSmall?.copyWith(
                    color: AppTheme.accentBlue,
                    fontSize: 10,
                  ),
                ),
              ),
              PopupMenuButton(
                icon: const Icon(LucideIcons.moreHorizontal, size: 18, color: AppTheme.textMuted),
                itemBuilder: (context) => [
                  const PopupMenuItem(value: 'edit', child: Text('Edit Details')),
                  const PopupMenuItem(value: 'remove', child: Text('Remove Stock')),
                ],
                onSelected: (val) {
                  if (val == 'remove') onRemove?.call();
                },
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            item.phoneModel,
            style: AppTheme.darkTheme.textTheme.titleLarge?.copyWith(fontSize: 16),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            item.imei,
            style: AppTheme.darkTheme.textTheme.bodySmall?.copyWith(
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              letterSpacing: 0.5,
            ),
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'COST',
                    style: AppTheme.darkTheme.textTheme.labelSmall,
                  ),
                  Text(
                    currencyFormat.format(item.costPrice),
                    style: AppTheme.darkTheme.textTheme.titleLarge?.copyWith(
                      fontSize: 15,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: onSell,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                  minimumSize: const Size(60, 32),
                  backgroundColor: AppTheme.success.withOpacity(0.15),
                  foregroundColor: AppTheme.success,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('SELL', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
