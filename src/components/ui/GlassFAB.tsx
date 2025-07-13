import { useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';
import { useTheme } from '../../hooks/useTheme';

interface GlassFABProps {
  icon: Icon;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  animate?: boolean;
}

export const GlassFAB: React.FC<GlassFABProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'primary',
  size = 'lg',
  position = 'bottom-right',
  animate = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentPalette } = useTheme();

  const getPositionStyles = () => {
    const baseSpacing = '24px';

    switch (position) {
      case 'bottom-left':
        return { bottom: baseSpacing, left: baseSpacing };
      case 'top-right':
        return { top: baseSpacing, right: baseSpacing };
      case 'top-left':
        return { top: baseSpacing, left: baseSpacing };
      default:
        return { bottom: baseSpacing, right: baseSpacing };
    }
  };

  const getVariantStyles = () => {
    const variants = {
      primary: {
        background: `linear-gradient(135deg, ${currentPalette.primary} 0%, ${currentPalette.accent} 100%)`,
        shadow: `0 8px 24px ${currentPalette.primary}50`,
        hoverShadow: `0 12px 32px ${currentPalette.primary}60`,
      },
      secondary: {
        background: `linear-gradient(135deg, ${currentPalette.accent} 0%, ${currentPalette.primary} 100%)`,
        shadow: `0 8px 24px ${currentPalette.accent}50`,
        hoverShadow: `0 12px 32px ${currentPalette.accent}60`,
      },
      success: {
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        shadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
        hoverShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
      },
      warning: {
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        shadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
        hoverShadow: '0 12px 32px rgba(245, 158, 11, 0.4)',
      },
    };

    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: { width: '48px', height: '48px', iconSize: 20 },
      md: { width: '56px', height: '56px', iconSize: 24 },
      lg: { width: '64px', height: '64px', iconSize: 28 },
    };

    return sizes[size];
  };

  const positionStyles = getPositionStyles();
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Tooltip
      label={label}
      position='left'
      withArrow
      styles={{
        tooltip: {
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      }}
    >
      <ActionIcon
        size={sizeStyles.width}
        radius='xl'
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          ...positionStyles,
          background: variantStyles.background,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isHovered
            ? variantStyles.hoverShadow
            : variantStyles.shadow,
          color: 'white',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: `translateY(${isHovered ? '-2px' : '0'}) scale(${isHovered ? '1.05' : '1'})`,
          willChange: 'transform, box-shadow',
          ...(animate && {
            animation: 'liquid-float 6s ease-in-out infinite',
          }),
        }}
        styles={{
          root: {
            '&:active': {
              transform: 'translateY(0) scale(0.95)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              backgroundSize: '200% 100%',
              borderRadius: 'inherit',
              opacity: isHovered ? 1 : 0,
              animation: isHovered ? 'glass-shimmer 2s infinite' : 'none',
              transition: 'opacity 300ms ease',
            },
          },
        }}
      >
        <Icon
          size={sizeStyles.iconSize}
          stroke={1.5}
          style={{
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
          }}
        />
      </ActionIcon>
    </Tooltip>
  );
};
