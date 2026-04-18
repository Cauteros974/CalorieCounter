import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Camera, Droplets, Plus, Utensils } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserStore } from '../store/useUserStore';
import CameraScreen from './CameraScreen';

export default function HomeScreen() {
    const { fullName, dailyCalories, consumedCalories, dailyWater, consumedWater, addWater } = useUserStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCamera, setShowCamera] = useState(false);
    
    const calProgress = Math.min(consumedCalories / dailyCalories, 1) || 0;

    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));


    return (
        <View style={{ flex: 1 }}>
            
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, {fullName || 'User'} 👋</Text>
                    <Text style={styles.subGreeting}>Your progress today:</Text>          
                </View>

                {/* Calendar */}
                <View style={styles.calendarContainer}>
                    <Text style={styles.monthText}>
                        {format(selectedDate, 'LLLL yyyy', { locale: enUS })}
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
                        {weekDays.map((day) => {
                            const isSelected = isSameDay(day, selectedDate);

                            return (
                                <TouchableOpacity
                                    key={day.toString()}
                                    style={[styles.dayCard, isSelected && styles.selectedDayCard]}
                                    onPress={() => setSelectedDate(day)}
                                >
                                    <Text style={[styles.dayName, isSelected && styles.selectedText]}>
                                        {format(day, 'eee', { locale: enUS })}
                                    </Text>
                                    <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
                                        {format(day, 'd')}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Calories */}
                <View style={styles.mainCard}>
                    <View style={styles.cardInfo}>
                        <View>
                            <Text style={styles.cardLabel}>There are left to eat</Text>
                            <Text style={styles.caloriesCount}>
                                {dailyCalories - consumedCalories} kcal
                            </Text>
                        </View>
                        <Utensils color="#4CAF50" size={32} />
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${calProgress * 100}%` }]} />
                    </View>

                    <Text style={styles.progressText}>
                        {consumedCalories} / {dailyCalories} kcal
                    </Text>
                </View>

                {/* Water */}
                <View style={styles.waterRow}>
                    <View style={[styles.smallCard, { flex: 1 }]}>
                        <Droplets color="#2196F3" size={24} />
                        <Text style={styles.smallCardValue}>
                            {consumedWater} l / {dailyWater} l
                        </Text>
                        <TouchableOpacity style={styles.plusBtn} onPress={() => addWater(0.25)}>
                            <Plus color="#fff" size={20} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={styles.cameraCard}
                        onPress={() => setShowCamera(true)}
                    >
                        <Camera color="#fff" size={28} />
                        <Text style={styles.cameraText}>Take a photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.mealsHeaderRow}>
                    <Text style={styles.sectionTitle}>Meals</Text>
                    <Text style={styles.totalStats}>Total: {consumedCalories} kcal</Text>
                </View>

                {[
                    { id: 'breakfast', title: 'Breakfast', time: '08:00 - 10: 00', icon: 'coffee', cals: 450, color: '#FF9800'},
                    { id: 'lunch', title: 'Lunch', time: '12:00 - 14:00', icon: 'utensils', cals: 700, color: '#2196F3' },
                    { id: 'dinner', title: 'Dinner', time: '18:00 - 20:00', icon: 'moon', cals: 500, color: '#9C27B0' }, 
                ].map((meal) => {
                    <TouchableOpacity key={meal.id} style={[styles.mealCard, {borderLeftColor: meal.color}]}>
                        <View style={styles.mealInfo}>
                            <Text style={styles.mealTitle}>{meal.title}</Text>
                            <Text style={styles.mealTime}>{meal.time}</Text>
                        </View>
                        <View style={styles.mealData}>
                            <Text style={styles.mealCals}>{meal.cals} kcal</Text>
                            <Plus size={20} color={currentColors.subText} />
                        </View>
                    </TouchableOpacity>
                })}
                
                <View style={[styles.tipCard, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={styles.tipTitle}>💡 Tip of the day</Text>
                    <Text style={styles.tiptext}>
                        Try drinking a glass of water 20 minutes before meals. This improves digestion and helps prevent overeating.
                    </Text>
                </View>

                {/* Meals */}
                <Text style={styles.sectionTitle}>Meals</Text>

                {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                    <TouchableOpacity key={meal} style={styles.mealItem}>
                        <View style={styles.mealIconPlaceholder}>
                            <Utensils color="#888" size={20} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.mealName}>{meal}</Text>
                            <Text style={styles.mealStatus}>Click here to add photo</Text>
                        </View>
                        <Plus color="#ccc" size={20} />
                    </TouchableOpacity>
                ))}

            </ScrollView>

            {/* Camera Modal */}
            <Modal visible={showCamera} animationType="slide">
                <CameraScreen onClose={() => setShowCamera(false)} />
            </Modal>
        </View>
    );
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
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 20
    },
    cardInfo:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    cardLabel: { fontSize: 14, color: '#888', fontWeight: '500' },
    caloriesCount: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
    progressBarBg: { height: 10, backgroundColor: '#EFEFEF', borderRadius: 5, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 5 },
    progressText: { fontSize: 12, color: '#888', marginTop: 8, textAlign: 'right' },
    waterRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
    smallCard: {backgroundColor: '#fff', borderRadius: 20, padding: 10, alignItems: 'center', justifyContent: 'center'},
    smallCardValue: { fontSize: 14, fontWeight: '600', marginVertical: 8 },
    plusBtn: { backgroundColor: '#2196F3', padding: 5, borderRadius: 10 },
    cameraCard: { flex: 1, backgroundColor: '#1A1A1A', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    cameraText: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
    mealItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 18, 
        marginBottom: 12,
    },
    mealIconPlaceholder: {width: 45, height: 45, backgroundColor: '#F0F0F0', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15},
    mealName: { fontSize: 16, fontWeight: '600' },
    mealStatus: { fontSize: 13, color: '#AAA' },
    calendarContainer: { marginVertical: 20 },
    monthText: { fontSize: 16, fontWeight: '600', marginBottom: 10, textTransform: 'capitalize' },
    calendarScroll: {gap: 10},
    dayCard: { width: 60, height: 80, backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    selectedDayCard: { backgroundColor: '#4CAF50' },
    dayName: { fontSize: 12, color: '#666' },
    dayNumber: { fontSize: 18, fontWeight: '700' },
    selectedText: { color: '#fff' },
    mealsHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 15
    },
    totalStats: {
        fontSize: 14, 
        color: '#888', 
        fontWeight: '500'
    },
    mealCard: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderLeftWidth: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    mealTitle: {
        fontSize: 16, 
        fontWeight: '700'
    },
    mealTime: { 
        fontSize: 12, 
        color: '#AAA', 
        marginTop: 2 
    },
    mealData: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10 
    },
    mealCals: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#444' 
    },
    tipCard: {
        padding: 20,
        borderRadius: 20,
        marginTop: 20,
        marginBottom: 100,
    },
    tipTitle: { 
        fontSize: 16, 
        fontWeight: '800', 
        color: '#2E7D32', 
        marginBottom: 5 
    },
    tipText: { 
        fontSize: 14, 
        color: '#4E342E', 
        lineHeight: 20 
    },
});