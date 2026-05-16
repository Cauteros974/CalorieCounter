import { Colors, useUserStore } from '@/store/useUserStore';
import { ChevronRight, Clock } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlanScreen() {
    const { theme } = useUserStore();
    const currentColors = Colors[theme];

    const routines = [
        { id: '1', time: '08:30', title: 'Breakfast', desc: 'Oatmeal with berries + coffee', cals: '400 kcal' },
        { id: '2', time: '11:00', title: 'Snack', desc: 'Handful of almonds or an apple', cals: '150 kcal' },
        { id: '3', time: '13:30', title: 'Lunch', desc: 'Chicken breast with rice', cals: '650 kcal' },
        { id: '4', time: '19:00', title: 'Dinner', desc: 'Tuna salad', cals: '400 kcal' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: currentColors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: currentColors.text }]}>Meal plan</Text>
                <Text style={styles.subtitle}>Your ideal diet for today</Text>
            </View>

            <View style={styles.timeline}>
                {routines.map((item, index) => (
                    <TouchableOpacity key={item.id} style={styles.planCard}>
                        <View style={styles.timeLineContainer}>
                            <View style={styles.dot} />
                            {index !== routines.length - 1 && <View style={styles.line} />}
                        </View>
                        
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={styles.timeRow}>
                                    <Clock size={14} color="#888" />
                                    <Text style={styles.timeText}>{item.time}</Text>
                                </View>
                                <Text style={styles.calText}>{item.cals}</Text>
                            </View>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemDesc}>{item.desc}</Text>
                        </View>
                        <ChevronRight size={20} color="#CCC" />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { marginTop: 50, marginBottom: 30 },
    title: { fontSize: 28, fontWeight: '800' },
    subtitle: { fontSize: 16, color: '#888', marginTop: 5 },
    timeline: { paddingLeft: 10 },
    planCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    timeLineContainer: { alignItems: 'center', marginRight: 20 },
    dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50', zIndex: 1 },
    line: { width: 2, height: 100, backgroundColor: '#EFEFEF', position: 'absolute', top: 12 },
    cardContent: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    timeText: { fontSize: 12, color: '#888', fontWeight: '600' },
    calText: { fontSize: 12, color: '#4CAF50', fontWeight: '700' },
    itemTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
    itemDesc: { fontSize: 14, color: '#666', marginTop: 2 }
});