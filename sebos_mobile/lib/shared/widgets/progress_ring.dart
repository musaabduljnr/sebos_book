import 'dart:math';
import 'package:flutter/material.dart';
import 'package:sebos_book/core/theme/app_theme.dart';

class ProgressRing extends StatelessWidget {
  final double value;
  final double max;
  final double size;
  final double strokeWidth;
  final String? label;

  const ProgressRing({
    super.key,
    required this.value,
    required this.max,
    this.size = 80,
    this.strokeWidth = 8,
    this.label,
  });

  @override
  Widget build(BuildContext context) {
    final double percentage = (value / max).clamp(0.0, 1.0);

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(
            size: Size(size, size),
            painter: _RingPainter(
              percentage: percentage,
              strokeWidth: strokeWidth,
              backgroundColor: Colors.white.withOpacity(0.1),
              progressColor: Colors.white,
            ),
          ),
          if (label != null)
            Text(
              label!,
              style: AppTheme.darkTheme.textTheme.labelSmall?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
        ],
      ),
    );
  }
}

class _RingPainter extends CustomPainter {
  final double percentage;
  final double strokeWidth;
  final Color backgroundColor;
  final Color progressColor;

  _RingPainter({
    required this.percentage,
    required this.strokeWidth,
    required this.backgroundColor,
    required this.progressColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    final bgPaint = Paint()
      ..color = backgroundColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    final progressPaint = Paint()
      ..color = progressColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, bgPaint);
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      2 * pi * percentage,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _RingPainter oldDelegate) {
    return oldDelegate.percentage != percentage;
  }
}
