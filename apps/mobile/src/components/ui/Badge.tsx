import { View, Text, ViewProps } from 'react-native';
import { ReactNode } from 'react';

interface BadgeProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-700 border-slate-600',
    primary: 'bg-primary-600/20 border-primary-500',
    success: 'bg-green-600/20 border-green-500',
    warning: 'bg-yellow-600/20 border-yellow-500',
    danger: 'bg-red-600/20 border-red-500',
    purple: 'bg-accent-purple/20 border-accent-purple',
    green: 'bg-accent-green/20 border-accent-green',
    yellow: 'bg-accent-yellow/20 border-accent-yellow',
  };

  const textColorStyles = {
    default: 'text-slate-300',
    primary: 'text-primary-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    purple: 'text-accent-purple',
    green: 'text-accent-green',
    yellow: 'text-accent-yellow',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5',
    md: 'px-2.5 py-1',
    lg: 'px-3 py-1.5',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <View
      className={`
        inline-flex items-center justify-center
        rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          className={`font-medium ${textSizeStyles[size]} ${textColorStyles[variant]}`}
          style={{ fontFamily: 'Inter_600SemiBold' }}
        >
          {children}
        </Text>

      ) : (
        children
      )}
    </View>
  );
}
