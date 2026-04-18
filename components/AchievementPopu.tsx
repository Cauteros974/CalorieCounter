import { Star, Trophy } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
                    <Text style={styles.description}>
                        {newlyUnlockedAchievement.description}
                    </Text>

                    <View style={styles.xpBadge}>
                        <Star color="#4CAF50" size={16} />
                        <Text style={styles.xpText}>+100 XP</Text>
                    </View>

                    <TouchableOpacity

                    >
                        <Text style={styles.buttonText}>Super!</Text>
                    </TouchableOpacity>
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
        fontSize: 26, 
        fontWeight: '800', 
        textAlign: 'center', 
        marginVertical: 10 
    },
    description: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20
    },
    xpBadge: {
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#E8F5E9', 
        paddingHorizontal: 15, 
        paddingVertical: 5, 
        borderRadius: 20,
        marginBottom: 25
    },
    xpText: { 
        color: '#4CAF50', 
        fontWeight: '700', 
        marginLeft: 5 
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500'
    }
})