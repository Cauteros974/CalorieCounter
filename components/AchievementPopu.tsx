import { Colors, useUserStore } from '@/store/useUserStore';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, View } from 'react-native';

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

    return(
        <Modal visible={true} transparent={true} animationType="fade">
            <View style={styles.overlay}>

            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    overlay:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)', 
        justifyContent: 'center',
    }
})