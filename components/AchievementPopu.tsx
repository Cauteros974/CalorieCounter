import { Colors, useUserStore } from '@/store/useUserStore';
import { useRef } from 'react';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function AchievementPopup() {
    const { newlyUnlockedAchievement, closeCongratulation, theme } = useUserStore();
    const currentColors = Colors[theme];
    const confettiRef = useRef<any>(null);
}