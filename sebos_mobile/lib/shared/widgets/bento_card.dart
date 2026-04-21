import 'package:flutter/material.dart';
import 'package:sebos_book/core/theme/app_theme.dart';

class BentoCard extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final bool isAccent;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;

  const BentoCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.isAccent = false,
    this.padding,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        height: height,
        padding: padding ?? const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: isAccent ? AppTheme.accentBlue : AppTheme.cardBg,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isAccent ? Colors.white.withOpacity(0.1) : const Color(0x1AFFFFFF),
            width: 1,
          ),
          boxShadow: [
            if (isAccent)
              BoxShadow(
                color: AppTheme.accentBlue.withOpacity(0.3),
                blurRadius: 20,
                offset: const Offset(0, 10),
              )
            else
              const BoxShadow(
                color: Colors.black26,
                blurRadius: 10,
                offset: Offset(0, 4),
              ),
          ],
        ),
        child: child,
      ),
    );
  }
}
