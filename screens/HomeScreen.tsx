import { Star } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
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
            })
        ])
    }) 
}