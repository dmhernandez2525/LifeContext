import {
  TextInput,
  TextInputProps,
  View,
  Text,
} from 'react-native';
import { ReactNode } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props
}: InputProps) {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text 
          className="text-dark-text-primary text-sm font-medium mb-2"
          style={{ fontFamily: 'Inter_600SemiBold' }}
        >
          {label}
        </Text>
      )}

      <View
        className={`
          flex-row items-center
          bg-dark-surface
          border rounded-xl
          ${error ? 'border-red-500' : 'border-dark-border'}
          ${leftIcon ? 'pl-3' : ''}
          ${rightIcon ? 'pr-3' : ''}
        `}
      >
        {leftIcon && (
          <View className="mr-2">
            {leftIcon}
          </View>
        )}

        <TextInput
          className={`
            flex-1
            px-4 py-3
            text-dark-text-primary text-base
            ${className}
          `}
          placeholderTextColor="#94a3b8"
          style={{ fontFamily: 'Inter_400Regular' }}
          {...props}
        />

        {rightIcon && (
          <View className="ml-2">
            {rightIcon}
          </View>
        )}
      </View>

      {error && (
        <Text 
          className="text-red-400 text-sm mt-1"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text 
          className="text-dark-text-secondary text-sm mt-1"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
}
