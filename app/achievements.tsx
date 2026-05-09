import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



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
            <View style={[styles.achIcon, { backgroundColor: achievement.isUnlocked ? '#E8F5E9' : '#F5F5F5' }]}>
                {achievement.isUnlocked
                    ? <Text style={{ fontSize: 28 }}>{ICON_MAP[achievement.icon] || '🏆'}</Text>
                    : <Lock color="#CCC" size={24} />
                }
            </View>
            <View style={{flex: 1}}>
                <Text style={[styles.achDesc, !achievement.isUnlocked && { color: '#CCC' }]}>
                    {achievement.title}
                </Text>
            </View>
            {achievement.isUnlocked && (
                <View style={styles.achBadge}>
                    <Text style={styles.achBadgeText}>✓</Text>
                </View>
            )}
        </Animated.View>
    );
}

export default function AchievementsScreen() {
    const { achievements } = useUserStore();
    const unlocked = achievements.filter(a => a.isUnlocked).length;

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft color="#1A1A1A" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>My Achievements</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Progress */}
                <View style={styles.progressCard}>
                    <Text style={styles.progressText}>
                        {unlocked} / {achievements.length} unlocked
                    </Text>
                    <View style={styles.progressTrack}>
                        <Animated.View
                            style={[styles.progressFill, {
                                width: `${(unlocked / achievements.length) * 100}%`
                            }]}
                        />
                    </View>
                </View>

                {/* Unlocked */}
                {unlocked > 0 && (
                    <>
                        <Text style={styles.sectionLabel}>🏆 Unlocked</Text>
                        {achievements.filter(a => a.isUnlocked).map((a, i) => (
                            <AchievementCard key={a.id} achievement={a} index={i} />
                        ))}
                    </>
                )}

                {/*Locked */}
                <Text style={styles.sectionLabel}>🔒 Locked</Text>
                {achievements.filter(a => !a.isUnlocked).map((a, i) => (
                    <AchievementCard key={a.id} achievement={a} index={i} />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
        backgroundColor: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, marginBottom: 20,
    },
    backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
    title: {fontSize: 18, fontWeight: '800', color: '#1A1A1A'},
    progressCard: {
        marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 20,
        padding: 20, marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    },
    processText: {
        fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 12, textAlign: 'center' 
    },
     progressTrack: { height: 10, backgroundColor: '#F0F0F0', borderRadius: 5, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#FFD740', borderRadius: 5 },
    sectionLabel: { fontSize: 14, fontWeight: '700', color: '#888', marginHorizontal: 20, marginBottom: 12 },
    achCard: {
        marginHorizontal: 20, marginBottom: 12, backgroundColor: '#fff',
        borderRadius: 20, padding: 20, flexDirection: 'row'
    }
})