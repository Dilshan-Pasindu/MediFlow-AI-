import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:flutter/material.dart';

/// Logo variants corresponding to the official MediFlow brand asset.
enum MediFlowLogoVariant {
  /// The official medical cross with heartbeat ECG line and flowing seafoam wave.
  mark,

  /// Horizontal lockup: Icon mark on the left, "MediFlow" wordmark on the right.
  /// Ideal for AppBars, navigation headers, and compact horizontal spaces.
  horizontal,

  /// Full stacked lockup: Icon mark on top, "MediFlow" wordmark below.
  /// Ideal for Splash screens, Get Started screen, and hero brand displays.
  full,

  /// White horizontal lockup — same shape as [horizontal] but fully white.
  /// Use on dark/gradient backgrounds (e.g. the dashboard header).
  white,
}

/// Official MediFlow Brand Logo for Flutter.
///
/// Strictly uses the official brand asset, preserving colors, typography,
/// proportions, and aspect ratio.
class MediFlowLogo extends StatelessWidget {
  const MediFlowLogo({
    super.key,
    this.variant = MediFlowLogoVariant.horizontal,
    this.height,
    this.width,
    this.fit = BoxFit.contain,
  });

  /// The visual variant of the official logo.
  final MediFlowLogoVariant variant;

  /// Optional height constraint. Maintains original aspect ratio.
  final double? height;

  /// Optional width constraint. Maintains original aspect ratio.
  final double? width;

  /// Box fit for rendering.
  final BoxFit fit;

  String get _assetPath {
    switch (variant) {
      case MediFlowLogoVariant.mark:
        return 'assets/images/mediflow_logo_mark.png';
      case MediFlowLogoVariant.horizontal:
        return 'assets/images/mediflow_logo_horizontal.png';
      case MediFlowLogoVariant.full:
        return 'assets/images/mediflow_logo_full.png';
      case MediFlowLogoVariant.white:
        return 'assets/images/mediflow_logo_white.jpg';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      _assetPath,
      height: height,
      width: width,
      fit: fit,
      filterQuality: FilterQuality.high,
      errorBuilder: (context, error, stackTrace) {
        // High-fidelity fallback matching the official mark's exact colors
        final h = height ?? 40.0;
        return Container(
          height: h,
          width: h,
          decoration: BoxDecoration(
            color: const Color(0xFF0F6B8A),
            borderRadius: BorderRadius.circular(h * 0.25),
          ),
          child: Icon(
            LucideIcons.stethoscope,
            color: Colors.white,
            size: h * 0.55,
          ),
        );
      },
    );
  }
}

/// Official MediFlow Animated Logo with subtle, professional heartbeat pumping motion.
///
/// Motion pattern:
/// 1.00x → 1.04x (gentle expansion) → 1.00x (gentle contraction) → pause → repeat.
///
/// Uses native Flutter [AnimationController] and [ScaleTransition] for optimal 60/120fps
/// rendering performance without triggering widget rebuilds.
class MediFlowAnimatedLogo extends StatefulWidget {
  const MediFlowAnimatedLogo({
    super.key,
    this.variant = MediFlowLogoVariant.full,
    this.height,
    this.width,
    this.fit = BoxFit.contain,
    this.duration = const Duration(milliseconds: 2200),
  });

  final MediFlowLogoVariant variant;
  final double? height;
  final double? width;
  final BoxFit fit;
  final Duration duration;

  @override
  State<MediFlowAnimatedLogo> createState() => _MediFlowAnimatedLogoState();
}

class _MediFlowAnimatedLogoState extends State<MediFlowAnimatedLogo>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: widget.duration);

    // Heartbeat pumping sequence:
    // 1.00x -> 1.04x (18% of duration, easeInOut)
    // 1.04x -> 1.00x (18% of duration, easeInOut)
    // 1.00x pause    (64% of duration)
    _scale = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 1.04)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 18.0,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.04, end: 1.0)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 18.0,
      ),
      TweenSequenceItem(
        tween: ConstantTween<double>(1.0),
        weight: 64.0,
      ),
    ]).animate(_ctrl);

    _ctrl.repeat();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scale,
      child: MediFlowLogo(
        variant: widget.variant,
        height: widget.height,
        width: widget.width,
        fit: widget.fit,
      ),
    );
  }
}
