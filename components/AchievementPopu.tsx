import { Colors, useUserStore } from '@/store/useUserStore';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

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
                <ConfettiCannon 
                    ref={confettiRef}
                    count={150} 
                    origin={{x: width / 2, y: -20}} 
                    autoStart={false}
                    fadeOut={true}
                />

                <Animated.View style = {[
                    styles.card,
                    {backgroundColor: currentColors.card, transform: [{scale}]}
                ]}>

                </Animated.View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)', 
        justifyContent: 'center',
    },
    card: {
        width: '85%',
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        elevation: 20,
    }
})