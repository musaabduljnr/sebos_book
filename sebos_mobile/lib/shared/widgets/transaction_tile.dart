import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:sebos_book/core/theme/app_theme.dart';
import 'package:sebos_book/features/transactions/domain/entities/transaction_entity.dart';

class TransactionTile extends StatelessWidget {
  final TransactionEntity transaction;
  final VoidCallback? onTap;

  const TransactionTile({
    super.key,
    required this.transaction,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isSale = transaction.type == 'sale';
    final currencyFormat = NumberFormat.currency(symbol: '₦', decimalDigits: 0);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(16),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: isSale 
                ? AppTheme.success.withOpacity(0.1) 
                : AppTheme.accentBlue.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            isSale ? LucideIcons.shoppingCart : LucideIcons.refreshCcw,
            color: isSale ? AppTheme.success : AppTheme.accentBlue,
            size: 20,
          ),
        ),
        title: Text(
          transaction.phoneModel,
          style: AppTheme.darkTheme.textTheme.titleLarge?.copyWith(fontSize: 15),
        ),
        subtitle: Row(
          children: [
            Text(
              transaction.brand,
              style: AppTheme.darkTheme.textTheme.bodySmall,
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                transaction.condition,
                style: AppTheme.darkTheme.textTheme.labelSmall?.copyWith(fontSize: 9),
              ),
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              currencyFormat.format(isSale ? transaction.salePrice : transaction.costPrice),
              style: AppTheme.darkTheme.textTheme.titleLarge?.copyWith(
                fontSize: 14,
                color: isSale ? Colors.white : AppTheme.accentBlue,
              ),
            ),
            if (isSale)
              Text(
                '+${currencyFormat.format(transaction.profit)}',
                style: AppTheme.darkTheme.textTheme.labelSmall?.copyWith(
                  color: AppTheme.success,
                  fontSize: 10,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
