import { useRef } from 'react';
import { Animated } from 'react-native';

const ICON_MAP: Record<string, string> = {
    droplet: '💧',
    target: '🎯',
    camera: '📸',
}

function AchievementCard({ achivement, index }: {achivement: any; index: number}) {
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0)).current;
}