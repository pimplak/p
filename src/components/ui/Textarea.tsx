import { Textarea as MantineTextarea, type TextareaProps } from '@mantine/core';
import { forwardRef } from 'react';

interface CustomTextareaProps extends TextareaProps {
  variant?: 'default' | 'filled' | 'unstyled';
  hasError?: boolean;
  hasSuccess?: boolean;
  showAutoSave?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  ({ variant = 'default', hasError, hasSuccess, showAutoSave, style, styles, ...props }, ref) => {
    const getVariantStyles = () => {
      const baseStyles = {
        minHeight: '88px', // Double the input height for textarea
        fontSize: '1rem',
        fontWeight: 400,
        borderRadius: '8px',
        transition: 'all 200ms ease-out',
        lineHeight: '1.6',
        resize: 'vertical' as const,
      };

      if (hasError) {
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--danger)',
          '&:focus, &:focus-within': {
            borderColor: 'var(--danger)',
            boxShadow: '0 0 0 1px var(--danger)',
            outline: 'none',
          }
        };
      }

      if (hasSuccess) {
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--success)',
          '&:focus, &:focus-within': {
            borderColor: 'var(--success)',
            boxShadow: '0 0 0 1px var(--success)',
            outline: 'none',
          }
        };
      }

      switch (variant) {
        case 'filled':
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-primary)',
            color: 'var(--color-text)',
            '&:focus, &:focus-within': {
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-primary)',
              boxShadow: '0 0 0 1px var(--color-primary)',
              outline: 'none',
            },
            '&:hover:not(:focus):not(:focus-within)': {
              borderColor: 'var(--color-primary-light)',
            }
          };

        case 'unstyled':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '2px solid var(--color-text-muted)',
            borderRadius: '0',
            '&:focus, &:focus-within': {
              borderBottomColor: 'var(--color-primary)',
              outline: 'none',
            }
          };

        default:
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-primary)',
            color: 'var(--color-text)',
            '&:focus, &:focus-within': {
              borderColor: 'var(--color-primary)',
              boxShadow: '0 0 0 1px var(--color-primary)',
              outline: 'none',
            },
            '&:hover:not(:focus):not(:focus-within)': {
              borderColor: 'var(--color-primary-light)',
            }
          };
      }
    };

    return (
      <div style={{ position: 'relative' }}>
        <MantineTextarea
          ref={ref}
          radius="md"
          size="md"
          style={style}
          styles={{
            input: getVariantStyles(),
                      label: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text)',
            marginBottom: '6px',
          },
            error: {
              fontSize: '0.875rem',
              color: 'var(--danger)',
              marginTop: '4px',
            },
            description: {
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
            },
            ...styles,
          }}
          {...props}
        />
        
        {/* Auto-save indicator */}
        {showAutoSave && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                animation: 'pulse 2s infinite',
              }}
            />
            Zapisano automatycznie
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea'; 