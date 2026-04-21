import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:signals_flutter/signals_flutter.dart';
import 'package:intl/intl.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:sebos_book/core/theme/app_theme.dart';
import 'package:sebos_book/features/dashboard/presentation/signals/dashboard_signals.dart';
import 'package:sebos_book/shared/widgets/bento_card.dart';

class AnalyticsPage extends StatefulWidget {
  const AnalyticsPage({super.key});

  @override
  State<AnalyticsPage> createState() => _AnalyticsPageState();
}

class _AnalyticsPageState extends State<AnalyticsPage> {
  @override
  void initState() {
    super.initState();
    dashboardSignals.refreshAnalytics();
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: '₦', decimalDigits: 0);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Analytics'),
        backgroundColor: Colors.transparent,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // KPI Summary
            Row(
              children: [
                Expanded(
                  child: BentoCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('7D Revenue', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                        const SizedBox(height: 4),
                        Watch((context) {
                          final total = dashboardSignals.weeklyData.value.fold(0.0, (sum, d) => sum + (d['revenue'] as double));
                          return Text(currencyFormat.format(total), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold));
                        }),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: BentoCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('7D Profit', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                        const SizedBox(height: 4),
                        Watch((context) {
                          final total = dashboardSignals.weeklyData.value.fold(0.0, (sum, d) => sum + (d['profit'] as double));
                          return Text(currencyFormat.format(total), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.success));
                        }),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Performance Trend
            Text('Revenue Trend (7-Day)', style: AppTheme.darkTheme.textTheme.titleLarge),
            const SizedBox(height: 16),
            BentoCard(
              height: 250,
              padding: const EdgeInsets.fromLTRB(10, 30, 30, 20),
              child: Watch((context) {
                if (dashboardSignals.isLoadingAnalytics.value) {
                  return const Center(child: CircularProgressIndicator());
                }

                final data = dashboardSignals.weeklyData.value;
                if (data.isEmpty) return const Center(child: Text('Insufficient data'));

                return LineChart(
                  LineChartData(
                    gridData: const FlGridData(show: false),
                    titlesData: FlTitlesData(
                      leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (val, meta) {
                            if (val < 0 || val >= data.length) return const Text('');
                            return Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: Text(data[val.toInt()]['day'], style: const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
                            );
                          },
                        ),
                      ),
                    ),
                    borderData: FlBorderData(show: false),
                    lineBarsData: [
                      LineChartBarData(
                        spots: data.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value['revenue'] / 1000)).toList(),
                        isCurved: true,
                        color: AppTheme.accentBlue,
                        barWidth: 3,
                        isStrokeCapRound: true,
                        dotData: const FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: AppTheme.accentBlue.withOpacity(0.1),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),

            const SizedBox(height: 24),

            // Growth Info
            const BentoCard(
              child: Row(
                children: [
                  Icon(LucideIcons.zap, color: AppTheme.warning),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Optimization Tip', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        SizedBox(height: 2),
                        Text(
                          'You are selling more Apple devices this week. Focus on accessories to boost margin.',
                          style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
