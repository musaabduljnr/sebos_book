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
              Watch((context) {
                final isStockEmpty = dashboardSignals.computedStockCount.value == 0;
                final isHistoryEmpty = (dashboardSignals.transactions.value ?? []).isEmpty;
                
                if (isStockEmpty && isHistoryEmpty) {
                  return _buildEmptyState(context);
                }
                
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildHeader(),
                    const SizedBox(height: 10),
                    _buildHeroCards(currencyFormat, dailyGoal),
                    const SizedBox(height: 24),
                    _buildActivitySection(),
                  ],
                );
              }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Sebos Book',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              Text(
                'Daily Overview',
                style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
              ),
            ],
          ),
          const CircleAvatar(
            backgroundColor: AppTheme.cardBg,
            child: Icon(LucideIcons.user, color: AppTheme.textSecondary, size: 20),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroCards(NumberFormat currencyFormat, double dailyGoal) {
    return Row(
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
    );
  }

  Widget _buildActivitySection() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Recent Activity', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            TextButton(
              onPressed: () {},
              child: const Text('View All', style: TextStyle(color: AppTheme.accentBlue, fontSize: 13)),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Watch((context) {
          final txs = dashboardSignals.transactions.value ?? [];
          if (txs.isEmpty) {
            return Container(
              height: 100,
              alignment: Alignment.center,
              child: const Text('No transactions today', style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
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
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 60),
          Container(
            padding: const EdgeInsets.all(30),
            decoration: BoxDecoration(
              color: AppTheme.accentBlue.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(LucideIcons.sparkles, size: 80, color: AppTheme.accentBlue),
          ),
          const SizedBox(height: 40),
          const Text(
            'Welcome to Sebos Book',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          const Text(
            'You haven\'t added any stock or recorded any sales yet. Let\'s get your business moving!',
            style: TextStyle(fontSize: 16, color: AppTheme.textSecondary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 48),
          _buildActionCard(
            context,
            icon: LucideIcons.plusCircle,
            title: 'Record First Sale',
            subtitle: 'Log a sale and capture customer details.',
            color: AppTheme.accentBlue,
            onTap: () => Navigator.pushNamed(context, '/transaction/new'),
          ),
          const SizedBox(height: 16),
          _buildActionCard(
            context,
            icon: LucideIcons.package,
            title: 'Add Inventory',
            subtitle: 'Register your mobile devices in stock.',
            color: AppTheme.success,
            onTap: () => Navigator.pushNamed(context, '/inventory'),
          ),
          const SizedBox(height: 32),
          TextButton.icon(
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: AppTheme.cardBg,
                  title: const Text('Reset Application?', style: TextStyle(color: Colors.white)),
                  content: const Text('This will delete all local transactions and inventory.', style: TextStyle(color: AppTheme.textSecondary)),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                    TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Reset', style: TextStyle(color: Colors.red))),
                  ],
                ),
              );
              if (confirm == true) {
                await IsarDatabase.clearAll();
              }
            },
            icon: const Icon(LucideIcons.refreshCcw, size: 14, color: AppTheme.textMuted),
            label: const Text('Wipe All local Data', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppTheme.cardBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(subtitle, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                ],
              ),
            ),
            const Icon(LucideIcons.chevronRight, color: AppTheme.textMuted, size: 18),
          ],
        ),
      ),
    );
  }
}
