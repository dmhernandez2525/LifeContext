import { View, ViewProps } from 'react-native';
import { ReactNode } from 'react';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-dark-surface border border-dark-border',
    elevated: 'bg-dark-surface shadow-lg shadow-black/20',
    outlined: 'bg-transparent border-2 border-dark-border',
  };

  return (
    <View
      className={`rounded-xl p-4 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
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
    <View className={`mt-3 pt-3 border-t border-dark-border ${className}`}>
      {children}
    </View>
  );
}
