import { Camera, Droplets, Plus, Utensils } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
                <View style={[styles.smallCard, {flex: 1}]}>
                    <Droplets color="#2196F3" size={24} />
                    <Text style={styles.smallCardValue}>{consumedWater} l / {dailyWater} l</Text>
                    <TouchableOpacity style={styles.plusBtn} onPress={() => addWater(0.25)}>
                        <Plus color="#fff" size={20} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.cameraCard}>
                    <Camera color="#fff" size={28} />
                    <Text style={styles.cameraText}>Take a photo</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Meals</Text>
            {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                <TouchableOpacity key={meal} style={styles.mealItem}>
                    <View style={styles.mealIconPlaceholder}>
                        <Utensils color="#888" size={20} />
                    </View>
                </TouchableOpacity>
            ))}
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
    mealIconPlaceholder: {width: 45, height: 45, backgroundColor: '#F0F0F0', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15}
})