import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ReactNode } from 'react';

interface ButtonProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  onPress,
  className = '',
  ...props
}: ButtonProps) {
  const handlePress = (e: any) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const variantStyles = {
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-dark-surface border border-dark-border active:bg-slate-700',
    ghost: 'bg-transparent active:bg-slate-800',
    destructive: 'bg-red-600 active:bg-red-700',
  };

  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const textColorStyles = {
    primary: 'text-white',
    secondary: 'text-dark-text-primary',
    ghost: 'text-dark-text-primary',
    destructive: 'text-white',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      className={`
        rounded-xl
        flex-row items-center justify-center
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' || variant === 'ghost' ? '#f8fafc' : '#ffffff'}
          size="small"
        />
      ) : typeof children === 'string' ? (
        <Text
          className={`font-semibold ${textSizeStyles[size]} ${textColorStyles[variant]}`}
          style={{ fontFamily: 'Inter_600SemiBold' }}
        >
          {children}
        </Text>

      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
