import { Flame, Star } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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

function XpBar ({xp, level}: {xp: number; level: number}) {
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 20 },
    header: { marginTop: 60, marginBottom: 20 },
    greeting: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
    subGreeting: { fontSize: 16, color: '#666', marginTop: 4 },

    xpCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
    xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    xpLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    xpLevel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
    xpCount: { fontSize: 12, color: '#888' },
    xpTrack: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
    xpFill: { height: '100%', backgroundColor: '#FFD740', borderRadius: 4 },
})