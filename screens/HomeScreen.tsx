import { Utensils } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useUserStore } from '../store/useUserStore';

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
            
            {/*Basic Calorie Card */}
            <View style={styles.mainCard}>
                <View style={styles.cardInfo}>
                    <View>
                        <Text style={styles.cardLabel}>There are left to eat</Text>
                        <Text style={styles.caloriesCount}>{dailyCalories - consumedCalories} kcal</Text>
                    </View>
                    <Utensils color="#4CAF50" size={32} />
                </View>

                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${calProgress * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{consumedCalories} / {dailyCalories} kcal</Text>
            </View>

            {/*Water block*/}
            <View style={styles.waterRow}>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 20 },
    header: { marginTop: 60, marginBottom: 20 },
    greeting: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
    subGreeting: { fontSize: 16, color: '#666', marginTop: 4 },
    mainCard:{
        backgroundColor: '#fff', 
        borderRadius: 24, 
        padding: 24, 
        shadowColor: '#000',
    }
})