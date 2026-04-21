import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Colors - matching the Sebos Book Bento System
  static const Color primaryBg = Color(0xFF0F1117);
  static const Color secondaryBg = Color(0xFF161822);
  static const Color cardBg = Color(0xFF1C1F2E);
  static const Color cardHoverBg = Color(0xFF232738);
  
  static const Color accentBlue = Color(0xFF3B82F6);
  static const Color accentBlueLight = Color(0xFF60A5FA);
  
  static const Color textPrimary = Color(0xFFF1F3F8);
  static const Color textSecondary = Color(0xFF8B92A8);
  static const Color textMuted = Color(0xFF5A6178);

  static const Color success = Color(0xFF22C55E);
  static const Color warning = Color(0xFFF59E0B);
  static const Color danger = Color(0xFFEF4444);

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: primaryBg,
    
    colorScheme: const ColorScheme.dark(
      primary: accentBlue,
      secondary: accentBlueLight,
      surface: cardBg,
      background: primaryBg,
      error: danger,
    ),

    textTheme: GoogleFonts.interTextTheme().copyWith(
      displayLarge: GoogleFonts.inter(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: textPrimary,
        letterSpacing: -1.0,
      ),
      titleLarge: GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: 15,
        color: textPrimary,
      ),
      bodySmall: GoogleFonts.inter(
        fontSize: 13,
        color: textSecondary,
      ),
      labelSmall: GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        color: textMuted,
        letterSpacing: 0.5,
      ),
    ),

    cardTheme: CardTheme(
      color: cardBg,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: Color(0x1AFFFFFF), width: 1),
      ),
    ),

    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: secondaryBg.withOpacity(0.92),
      indicatorColor: accentBlue.withOpacity(0.1),
      labelTextStyle: MaterialStateProperty.resolveWith((states) {
        if (states.contains(MaterialState.selected)) {
          return const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: accentBlue);
        }
        return const TextStyle(fontSize: 10, color: textMuted);
      }),
      iconTheme: MaterialStateProperty.resolveWith((states) {
        if (states.contains(MaterialState.selected)) {
          return const IconThemeData(color: accentBlue, size: 24);
        }
        return const IconThemeData(color: textMuted, size: 24);
      }),
    ),

    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFF1A1D2B),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0x1AFFFFFF)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0x1AFFFFFF)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: accentBlue, width: 1.5),
      ),
      labelStyle: const TextStyle(color: textSecondary, fontSize: 13),
      hintStyle: const TextStyle(color: textMuted, fontSize: 13),
    ),

    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: accentBlue,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
      ),
    ),
  );
}
