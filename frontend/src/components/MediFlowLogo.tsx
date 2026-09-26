import React from 'react';

export type LogoVariant = 'horizontal' | 'mark' | 'full';

export interface MediFlowLogoProps {
  /**
   * 'horizontal' (default for navbars and headers)
   * 'mark' (icon cross/wave only)
   * 'full' (stacked icon + text)
   */
  variant?: LogoVariant;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  /** Force animation or use MediFlowLogoAnimated directly */
  animated?: boolean;
}

const logoSrcMap: Record<LogoVariant, string> = {
  horizontal: '/mediflow_logo_horizontal.png',
  mark: '/mediflow_logo_mark.png',
  full: '/mediflow_logo_full.png',
};

/**
 * Official MediFlow Brand Logo component for the Web Application.
 * Preserves the authentic logo proportions, typography, and colors.
 */
export const MediFlowLogo: React.FC<MediFlowLogoProps> = ({
  variant = 'horizontal',
  height = 36,
  width,
  className = '',
  style,
  alt = 'MediFlow AI Official Logo',
  animated = false,
}) => {
  const src = logoSrcMap[variant] || logoSrcMap.horizontal;
  const animClass = animated ? 'mediflow-logo-animated' : '';

  return (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={`mediflow-logo ${animClass} ${className}`.trim()}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        ...style,
      }}
      loading="eager"
      decoding="async"
    />
  );
};

/**
 * Animated MediFlow Logo with subtle, professional heartbeat pumping motion.
 * Respects user's reduced-motion preferences.
 */
export const MediFlowLogoAnimated: React.FC<MediFlowLogoProps> = (props) => {
  return <MediFlowLogo {...props} animated={true} />;
};

export default MediFlowLogo;
