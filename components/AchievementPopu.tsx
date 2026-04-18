import { Colors, useUserStore } from '@/store/useUserStore';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function AchievementPopup() {
    const { newlyUnlockedAchievement, closeCongratulation, theme } = useUserStore();
    const currentColors = Colors[theme];
    const confettiRef = useRef<any>(null);

    //Appearance animation
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (newlyUnlockedAchievement){
            Animated.spring(scale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                confettiRef.current.start();
            }, 100);
        } else{
            scale.setValue(0);
        }
    }, [newlyUnlockedAchievement]);

    if(!newlyUnlockedAchievement) return null;
}