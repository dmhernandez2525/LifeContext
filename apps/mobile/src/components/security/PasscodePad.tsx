import { View, Text, Pressable } from 'react-native';

interface PasscodePadProps {
  value: string;
  length?: number;
  disabled?: boolean;
  onDigit: (digit: string) => void;
  onDelete: () => void;
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'] as const;

export function PasscodePad({
  value,
  length = 6,
  disabled = false,
  onDigit,
  onDelete,
}: PasscodePadProps) {
  const dots = Array.from({ length }, (_, index) => index < value.length);

  return (
    <View className="w-full items-center">
      <View className="mb-8 flex-row items-center justify-center">
        {dots.map((filled, index) => (
          <View
            key={index}
            className={`mx-2 h-4 w-4 rounded-full border ${filled ? 'border-primary-400 bg-primary-400' : 'border-slate-600 bg-transparent'}`}
          />
        ))}
      </View>

      <View className="w-full max-w-[300px] flex-row flex-wrap justify-center">
        {DIGITS.map((digit, index) => {
          if (digit === '') {
            return <View key={`empty-${index}`} className="m-2 h-16 w-16" />;
          }

          const isDelete = digit === 'delete';
          const label = isDelete ? '⌫' : digit;
          const handlePress = (): void => {
            if (disabled) {
              return;
            }
            if (isDelete) {
              onDelete();
              return;
            }
            onDigit(digit);
          };

          return (
            <Pressable
              key={`${digit}-${index}`}
              onPress={handlePress}
              className={`m-2 h-16 w-16 items-center justify-center rounded-full border border-white/10 ${disabled ? 'bg-slate-800/30' : 'bg-slate-900/70 active:bg-slate-800'}`}
            >
              <Text className="text-2xl font-semibold text-white" style={{ fontFamily: 'Inter_600SemiBold' }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
