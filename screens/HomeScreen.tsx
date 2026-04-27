import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Camera, Droplets, Flame, Plus, Star, Utensils } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, useUserStore } from '../store/useUserStore';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CalorieRing({progress}: {progress: number}){
    const animatedValue = useRef(new Animated.Value(0)).current;
    const SIZE = 160;
    const STROKE = 12;
    const R = (SIZE - STROKE) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * R;

    useEffect (() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCUMFERENCE, 0],
    });

    return(
        <View style={{ alignItems: 'center', justifyContent: 'center', width: SIZE, height: SIZE }}>
            <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
                {/*Track */}
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    stroke="#F0F0F0"
                    strokeWidth={STROKE}
                    fill="none"
                />

                <AnimatedCircle 
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    stroke="#4CAF50"
                    strokeWidth={STROKE}
                    fill="none"
                    strokeDasharray={`${CIRCUMFERENCE}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${SIZE / 2}, ${SIZE / 2}`}
                />
            </Svg>
        </View>
    );
}

function XPBar ({xp, level}: {xp: number; level: number}) {
    const animWidth = useRef(new Animated.Value(0)).current;
    const XP_MAX = 1000;
    const progress = Math.min(xp / XP_MAX, 1);

    useEffect(() => {
        Animated.timing(animWidth, {
            toValue: progress,
            duration: 1000,
            delay: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false
        }).start();
    }, [xp]);

    return(
        <View style={styles.xpCard}>
            <View style={styles.xpHeader}>
                <View style={styles.xpLeft}>
                    <Star color="#FFD740" size={18} fill="#FFD740" />
                    <Text style={styles.xpLevel}>Level {level}</Text>
                </View>
                <Text style={styles.xpCount}>{xp} / {XP_MAX} XP</Text>
            </View>
            <View style={styles.xpTrack}>
                <Animated.View
                    style={[
                        styles.xpFill,
                        {
                            width: animWidth.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                    ]}
                />
            </View>
        </View>
    );
}

function StreakCard({ streak }: {streak : number}) {
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect (() => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                friction: 4,
                tension: 120,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const flameScale = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(flameScale, { toValue: 1.2, duration: 600, useNativeDriver: true }),
                Animated.timing(flameScale, { toValue: 1.0, duration: 600, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return(
        <Animated.View style={[styles.streakCard, { opacity, transform: [{ scale }] }]}>
            <Animated.View style={{ transform: [{ scale: flameScale }] }}>
                <Flame color="#FF6B35" size={28} fill="#FF6B35" />
            </Animated.View>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
        </Animated.View>
    );
}

function FadeInView({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                delay,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return(
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
            {children}
        </Animated.View>
    );
}

export default function HomeScreen() {
    const { fullName, dailyCalories, consumedCalories, dailyWater, consumedWater, addWater, xp, level, streak, consumed, targets, theme,} = useUserStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCamera, setShowCamera] = useState(false);

    const calProgress = Math.min(consumedCalories / dailyCalories, 1) || 0;
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
    const currentColors = Colors[theme];

    const MacroBar = ({ label, current, target, color }: any) => {
        const animWidth = useRef(new Animated.Value(0)).current;
        const progress = Math.min(current / target, 1);

        useEffect(() => {
            Animated.timing(animWidth, {
                toValue: progress,
                duration: 900,
                delay: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        }, [current]);

        return(
            <View style={{flex: 1, marginHorizontal: 5}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: currentColors.subText }}>{label}</Text>
                    <Text style={{ fontSize: 12, color: currentColors.text }}>{current}g</Text>
                </View>
                <View style={{height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, overflow: 'hidden'}}>
                    <Animated.View 
                        style={{
                            height: '100%',
                            width: animWidth.interpolate({inputRange: [0,1], outputRange: ['0%', '100%']}),
                            backgroundColor: color,
                            borderRadius: 3,
                        }}
                    />
                </View>
                <Text style={{ fontSize: 10, color: '#BBB', marginTop: 2, textAlign: 'right' }}>target {target}g</Text>
             </View>
        );
    };

    return(
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <FadeInView delay={0}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Hello, {fullName || 'User'} 👋</Text>
                        <Text style={styles.subGreeting}>Your progress today:</Text>
                    </View>
                </FadeInView>

                 {/* XP Bar */}
                <FadeInView delay={100}>
                    <XPBar xp={xp} level={level} />
                </FadeInView>

                {/* Calendar */}
                <FadeInView delay={150}>
                     <View style={styles.calendarContainer}>
                        <Text style={styles.monthText}>
                            {format(selectedDate, 'LLLL yyyy', { locale: enUS })}
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
                            {weekDays.map((day) => {
                                const isSelected = isSameDay(day, selectedDate);
                                return(
                                    <TouchableOpacity
                                        key={day.toString()}
                                        style={[styles.dayCard, isSelected && styles.selectedDayCard]}
                                        onPress={() => setSelectedDate(day)}
                                    >
                                        <Text style={[styles.dayName, isSelected && styles.selectedDayCard]}>
                                            {format(day, 'eee', {locale: enUS})}
                                        </Text>
                                        <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
                                            {format(day, 'd')}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                     </View>
                </FadeInView>

                {/* Calories — ring + macros */}
                <FadeInView delay={200}>
                    <View style={styles.mainCard}>
                        <View style={styles.ringRow}>
                            {/*Ring */}
                            <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                                <CalorieRing progress={calProgress} />
                                <View style={styles.ringCenter}>
                                    <Utensils color="#4CAF50" size={20} />
                                    <Text style={styles.ringKcal}>{dailyCalories - consumedCalories}</Text>
                                    <Text style={styles.ringLabel}>kcal left</Text>
                                </View>
                            </View>

                            {/* Stats beside ring */}
                            <View style={styles.ringStats}>
                                <View style={styles.ringStatItem}>
                                    <Text style={styles.ringStatValue}>{consumedCalories}</Text>
                                    <Text style={styles.ringStatLabel}>eaten</Text>
                                </View>
                                <View style={[styles.ringStatDivider]}/>
                                <View style={styles.ringStatItem}>
                                    <Text style={styles.ringStatValue}>{dailyCalories}</Text>
                                    <Text style={styles.ringStatLabel}>goal</Text>
                                </View>
                            </View>
                        </View>
                        {/* Macro bars */}
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <MacroBar label="Proteins" current={consumed.protein} target={targets.protein} color="#FF5252" />
                            <MacroBar label="Fats" current={consumed.fat} target={targets.fat} color="#FFD740"/>
                            <MacroBar label="Carbs" current={consumed.carbs} target={targets.carbs} color="#448AFF"/>
                        </View>
                    </View>
                </FadeInView>

                {/* Water + Camera + Streak */}
                <FadeInView delay={300}>
                    <View style={styles.waterRow}>
                        <View style={[styles.smallCard]}>
                            <Droplets color="#2196F3" size={24} />
                            <Text style={styles.smallCardValue}>{consumedWater} l / {dailyWater} l</Text>
                            <TouchableOpacity style={styles.plusBtn} onPress={() => addWater(0.25)}>
                                <Plus color="#fff" size={20} />
                            </TouchableOpacity>
                        </View>
                        <StreakCard streak={streak} />
                        
                        <TouchableOpacity
                            style={styles.cameraCard}
                            onPress={() => setShowCamera(true)}
                        >
                            <Camera color="#fff" size={28} />
                            <Text style={styles.cameraText}>Photo</Text>
                        </TouchableOpacity>
                    </View>
                </FadeInView>

                {/* Meals */}
                <FadeInView delay={200}>
                    <View style={styles.mealsHeaderRow}>
                        <Text style={styles.sectionTitle}>Meals</Text>
                        <Text style={styles.totalStats}>Total: {consumedCalories} kcal</Text>
                    </View>
                </FadeInView>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 20 },
    header: { marginTop: 60, marginBottom: 20 },
    greeting: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
    subGreeting: { fontSize: 16, color: '#666', marginTop: 4 },

    //XP
    xpCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
    xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    xpLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    xpLevel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
    xpCount: { fontSize: 12, color: '#888' },
    xpTrack: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
    xpFill: { height: '100%', backgroundColor: '#FFD740', borderRadius: 4 },

    //Calendar
    streakCard: { flex: 1, backgroundColor: '#FFF3EE', borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
    streakNumber: { fontSize: 24, fontWeight: '900', color: '#FF6B35', marginTop: 4 },
    streakLabel: { fontSize: 11, color: '#FF9068', fontWeight: '600' },

    calendarContainer: { marginVertical: 20 },
    monthText: {fontSize: 16, fontWeight: '600'},
    calendarScroll: {gap: 10},
    dayCard: { width: 60, height: 80, backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    selectedDayCard: {backgroundColor: '#4CAF50'},
    dayName: {fontSize: 12, color: '#666'},
    dayNumber: {fontSize: 10, fontWeight: '700'},
    selectedText: {color: '#fff'},

    //Main calorie card
    mainCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 20 },
    ringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    ringCenter: { position: 'absolute', alignItems: 'center' },
    ringKcal: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginTop: 2 },
    ringLabel: {fontSize: 11, color: '#888'},
    ringStats: {flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', },
    ringStatItem: { alignItems: 'center' },
    ringStatValue: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
    ringStatLabel: {fontSize: 12, color: '#888', marginTop: 2},
    ringStatDivider: {width: 1, height: 40, backgroundColor: '#EFEFEF'},

    //Water row
    waterRow: {flexDirection: 'row', gap: 12, marginBottom: 30},
    smallCard: { backgroundColor: '#fff', borderRadius: 20, padding: 10, alignItems: 'center', justifyContent: 'center' },
    smallCardValue: { fontSize: 13, fontWeight: '600', marginVertical: 8, textAlign: 'center' },
    plusBtn: { backgroundColor: '#2196F3', padding: 5, borderRadius: 10 },
    cameraCard: { flex: 1, backgroundColor: '#1A1A1A', borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
    cameraText: { color: '#fff', fontSize: 13, fontWeight: '600', marginTop: 6 },

    mealsHeaderRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15},
    sectionTitle: { fontSize: 18, fontWeight: '700' },
    totalStats: { fontSize: 14, color: '#888', fontWeight: '500' },
})