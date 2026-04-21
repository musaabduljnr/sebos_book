import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:signals_flutter/signals_flutter.dart';
import 'package:intl/intl.dart';
import 'package:sebos_book/core/theme/app_theme.dart';
import 'package:sebos_book/features/dashboard/presentation/signals/dashboard_signals.dart';
import 'package:sebos_book/shared/widgets/bento_card.dart';
import 'package:sebos_book/shared/widgets/progress_ring.dart';
import 'package:sebos_book/shared/widgets/transaction_tile.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: '₦', decimalDigits: 0);
    const dailyGoal = 50000.0;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Sebos Book',
                          style: AppTheme.darkTheme.textTheme.displayLarge?.copyWith(fontSize: 24),
                        ),
                        Text(
                          'Daily Overview',
                          style: AppTheme.darkTheme.textTheme.bodySmall,
                        ),
                      ],
                    ),
                    const CircleAvatar(
                      backgroundColor: AppTheme.cardBg,
                      child: Icon(LucideIcons.user, color: AppTheme.textSecondary, size: 20),
                    ),
                  ],
                ),
              ),

              // Hero Bento Section
              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Watch((context) {
                      final profit = dashboardSignals.computedDailyProfit.value;
                      final percentage = (profit / dailyGoal * 100).round();

                      return BentoCard(
                        isAccent: true,
                        height: 180,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Daily Profit', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
                                const SizedBox(height: 4),
                                Text(
                                  currencyFormat.format(profit),
                                  style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            ProgressRing(
                              value: profit,
                              max: dailyGoal,
                              size: 60,
                              strokeWidth: 6,
                              label: '$percentage%',
                            ),
                          ],
                        ),
                      );
                    }),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    flex: 1,
                    child: Column(
                      children: [
                        Watch((context) {
                          return BentoCard(
                            height: 82,
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Icon(LucideIcons.package, size: 16, color: AppTheme.textSecondary),
                                const Spacer(),
                                Text(
                                  '${dashboardSignals.computedStockCount.value}',
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                ),
                                const Text('Stock', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                              ],
                            ),
                          );
                        }),
                        const SizedBox(height: 16),
                        Watch((context) {
                          return BentoCard(
                            height: 82,
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Icon(LucideIcons.trendingUp, size: 16, color: AppTheme.success),
                                const Spacer(),
                                Text(
                                  '${dashboardSignals.computedSalesCountToday.value}',
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                ),
                                const Text('Sales', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                              ],
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Weekly Mini Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Recent Activity', style: AppTheme.darkTheme.textTheme.titleLarge),
                  TextButton(
                    onPressed: () {},
                    child: const Text('View All', style: TextStyle(color: AppTheme.accentBlue, fontSize: 13)),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // Activity List
              Watch((context) {
                final txs = dashboardSignals.transactions.value ?? [];
                if (txs.isEmpty) {
                  return Container(
                    height: 100,
                    alignment: Alignment.center,
                    child: Text('No transactions today', style: AppTheme.darkTheme.textTheme.bodySmall),
                  );
                }

                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: txs.length > 5 ? 5 : txs.length,
                  itemBuilder: (context, index) {
                    return TransactionTile(transaction: txs[index]);
                  },
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
