import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors, useUserStore } from '../store/useUserStore';

export default function StatisticsScreen() {
    const {theme} = useUserStore();
    const currentColors = Colors[theme];

    const data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "San"],
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
}