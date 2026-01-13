import { View, ViewProps, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { BlurView } from 'expo-blur';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  className = '',
  style,
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-dark-surface border border-dark-border',
    elevated: 'bg-dark-surface shadow-2xl shadow-black/40 border border-white/5',
    outlined: 'bg-transparent border-2 border-dark-border',
    glass: 'bg-white/5 border border-white/10 overflow-hidden',
  };

  return (
    <View
      className={`rounded-2xl ${variantStyles[variant]} ${className}`}
      style={style}
      {...props}
    >
      {variant === 'glass' && (
        <BlurView
          intensity={40}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      )}
      <View className="p-4">
        {children}
      </View>
    </View>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <View className={`mb-3 ${className}`}>
      {children}
    </View>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <View className={className}>
      {children}
    </View>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <View className={className}>
      {children}
    </View>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <View className={`mt-3 pt-3 border-t border-white/5 ${className}`}>
      {children}
    </View>
  );
}

