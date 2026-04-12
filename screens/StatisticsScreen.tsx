import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors, useUserStore } from '../store/useUserStore';

export default function StatisticsScreen() {export default function StatisticsScreen() {
    const { theme } = useUserStore();
    const currentColors = Colors[theme];
  
    // Example data for a week
    const data = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [1800, 2100, 1950, 2400, 1700, 2000, 2200],
          color: (opacity = 1) => currentColors.primary, 
          strokeWidth: 3 
        }
      ],
      legend: ["Calorie consumption"]
    };
  
    const chartConfig = {
      backgroundColor: currentColors.card,
      backgroundGradientFrom: currentColors.card,
      backgroundGradientTo: currentColors.card,
      decimalPlaces: 0,
      color: (opacity = 1) => currentColors.text,
      labelColor: (opacity = 1) => currentColors.subText,
      style: { borderRadius: 16 },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: currentColors.primary
    }
};
return(
    <ScrollView style={[styles.container, { backgroundColor: currentColors.background }]}>
        <Text style={[styles.title, { color: currentColors.text }]}>Statistics of the week</Text>

        <View style={[styles.chartCard, { backgroundColor: currentColors.card }]}>
        <LineChart
          data={data}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier // Makes the line smooth
          style={styles.chart}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: currentColors.card }]}>
            <Text style={{ color: currentColors.subText }}>Average</Text>
            <Text style={[styles.statValue, { color: currentColors.text }]}>2021</Text>
            
        </View>
      </View>
    </ScrollView>
)