import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

const ICON_MAP: Record<string, string> = {
    droplet: '💧',
    target: '🎯',
    camera: '📸',
}

function AchievementCard({ achievement, index }: {achievement: any; index: number}) {
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1, duration: 400,
                delay: index * 100, useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1, friction: 6, tension: 100,
                delay: index * 100, useNativeDriver: true,
            } as any),
        ]).start();
    }, []);

    return(
        <Animated.View style={[
            styles.achCard,
            !achievement.isUnlocked && styles.achCardLocked,
            { opacity, transform: [{ scale }] }
        ]}>
            <View style={{ flex: 1}}>
                <Text style={[styles]}></Text>
            </View>
        </Animated.View>
    )
}