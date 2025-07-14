import { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface DrawerOverlayProps {
  isVisible: boolean;
  progress: number; // 0-1
}

export const DrawerOverlay: React.FC<DrawerOverlayProps> = ({
  isVisible,
  progress,
}) => {
  const { currentPalette } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        transition: 'opacity 200ms ease-out',
        opacity: progress * 0.3,
        backgroundColor: currentPalette.background,
      }}
    >
      {/* Swipe indicator */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          width: '4px',
          height: '60px',
          backgroundColor: currentPalette.primary,
          borderRadius: '2px',
          opacity: progress,
          transition: 'all 200ms ease-out',
        }}
      />
      
      {/* Swipe text */}
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '40px',
          transform: 'translateY(-50%)',
          color: currentPalette.primary,
          fontSize: '14px',
          fontWeight: 500,
          opacity: progress,
          transition: 'all 200ms ease-out',
        }}
      >
        Swipe to open menu
      </div>
    </div>
  );
}; 