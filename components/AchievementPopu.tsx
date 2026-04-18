import { Trophy } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Colors, useUserStore } from '../store/useUserStore';


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
                    <View style={styles.iconContainer}>
                        <Trophy color="#FFD700" size={80} />
                    </View>

                    <Text style={[styles.congratsText, { color: currentColors.text }]}>New achievement!</Text>
                    <Text style={[styles.title, { color: currentColors.text }]}>
                        {newlyUnlockedAchievement.title}
                    </Text>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20
    },
    iconContainer: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#FFF9C4',
        borderRadius: 60
    },
    congratsText: { 
        fontSize: 14, 
        fontWeight: '600', 
        opacity: 0.6, 
        textTransform: 'uppercase' 
    },
    title: { 
        fontSize: 26, fontWeight: '800', textAlign: 'center', marginVertical: 10 
    },
})