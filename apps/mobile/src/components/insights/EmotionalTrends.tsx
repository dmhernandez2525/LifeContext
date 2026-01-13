import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { getJournalEntries } from '../../lib/storage';

const screenWidth = Dimensions.get('window').width;

export function EmotionalTrends() {
  const entries = useMemo(() => getJournalEntries(), []);
  
  // Process data: Group averages by date or just take last N entries
  const chartData = useMemo(() => {
    // Sort by date ascending
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Take last 7 days with mood (default 3 if not set)
    const recent = sorted.filter(e => e.mood !== undefined).slice(-7);
    
    if (recent.length === 0) return [];

    return recent.map(e => ({
        value: e.mood || 3,
        label: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' }),
        dataPointText: (e.mood || 3).toString(),
    }));
  }, [entries]);

  if (chartData.length < 2) {
      return (
          <View className="bg-slate-900 rounded-2xl p-6 border border-white/5 items-center justify-center h-48">
              <Text className="text-slate-500 font-medium">Not enough data for trends</Text>
              <Text className="text-slate-600 text-xs mt-2">Log at least 2 entries to see chart</Text>
          </View>
      );
  }

  return (
    <View className="bg-slate-900 rounded-2xl p-4 border border-white/5 pb-2">
      <View className="flex-row justify-between items-center mb-6 pl-2">
        <Text className="text-white font-bold text-lg">Emotional Trends</Text>
        <View className="bg-green-500/20 px-2 py-1 rounded-md">
            <Text className="text-green-400 text-xs font-bold">+12% vs last week</Text>
        </View>
      </View>
      
      <LineChart
        data={chartData}
        color="#a855f7"
        thickness={3}
        dataPointsColor="#a855f7"
        textColor="white"
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: '#64748b', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: '#64748b', fontSize: 10 }}
        hideRules
        curved
        areaChart
        startFillColor="rgba(168, 85, 247, 0.3)"
        endFillColor="rgba(168, 85, 247, 0.0)"
        startOpacity={0.9}
        endOpacity={0.0}
        initialSpacing={10}
        maxValue={5}
        noOfSections={4}
        width={screenWidth - 80}
        height={180}
        pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: 'rgba(255,255,255, 0.2)',
            pointerStripWidth: 2,
            strokeDashArray: [2, 5],
            radius: 4,
            pointerLabelWidth: 100,
            pointerLabelHeight: 120,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: true,
        }}
        />
        
        <View className="flex-row justify-between mt-4 border-t border-white/5 pt-4">
             <View>
                 <Text className="text-slate-500 text-xs uppercase font-bold">Average Mood</Text>
                 <Text className="text-white font-bold text-xl mt-1">
                     {(chartData.reduce((acc, curr) => acc + curr.value, 0) / chartData.length).toFixed(1)}
                 </Text>
             </View>
             <View>
                 <Text className="text-slate-500 text-xs uppercase font-bold text-right pt-2 pb-2">Trend</Text>
                 <Text className="text-purple-400 font-bold text-sm text-right">Improving</Text>
             </View>
        </View>
    </View>
  );
}
