import { useUserStore } from "@/store/useUserStore";
import React from "react";
import { ScrollView } from "react-native";

export default function HomeScreen() {
    const { fullName, dailyCalories, consumedCalories, dailyWater, consumedWater, addWater } = useUserStore();
    
    const calProgress = Math.min(consumedCalories / dailyCalories, 1) || 0;
    const waterProgress = Math.min(consumedWater / dailyWater, 1) || 0;

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Привет, {fullName || 'User'} 👋</Text>
                <Text style={styles.subGreeting}>Your progress today:</Text>
            </View>
        </ScrollView>
    )
}