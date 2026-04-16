import { Flame } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Colors, useUserStore } from '../store/useUserStore';

export default function AchievementsScreen() {
    const {achievements, level, xp, streak, theme} = useUserStore();
    const currentColors = Colors[theme];

    return(
        <View style={[styles.container, {backgroundColor: currentColors.background}]}>
            {/*Level and Progression Section*/}
            <View style={[styles.profileHeader, { backgroundColor: currentColors.card }]}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{level}</Text>
                </View>
                <View style={{flex: 1, marginLeft: 15}}>
                    <Text style={[styles.levelTitle, { color: currentColors.text }]}>Level {level}</Text>
                    <View style={styles.xpBarBg}>
                        <View style={[styles.xpBarFill, { width: `${(xp / (level * 1000)) * 100}%` }]} />
                    </View>
                    <Text style={[styles.xpText]}>{level * 1000} XP</Text>
                </View>
                <View style={styles.streakInfo}>
                    <Flame color="#FF5722" size={24} />
                    <Text style={styles.streakText}>{streak}</Text>
                </View>
            </View>

            <FlatList
                data={achievements}
                numColumns={10}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[
                      styles.badgeCard, 
                      { backgroundColor: currentColors.card, opacity: item.isUnlocked ? 1 : 0.4 }
                    ]}>
                      <View style={[styles.iconCircle, { backgroundColor: item.isUnlocked ? '#FFF9C4' : '#E0E0E0' }]}>
                         <Trophy color={item.isUnlocked ? '#FBC02D' : '#9E9E9E'} size={32} />
                      </View>
                      
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {padding: 20},
    profileHeader: {
        marginTop: 40, 
        padding: 20, 
        borderRadius: 24, 
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 30,
        elevation: 2
    },
    levelBadge: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
    levelText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    xpBarBg: { height: 8, backgroundColor: '#EFEFEF', borderRadius: 4, marginTop: 8, overflow: 'hidden' },
    xpBarFill: { height: '100%', backgroundColor: '#4CAF50' },
    levelTitle: { fontSize: 18, fontWeight: '700' },
    xpText: {fontSize: 12, color: '#888', marginTop: 4},
    streakInfo: {padding: 10, alignItems: 'center'},
    streakText: {fontWeight: 'bold', color: '#FF5722'},
    badgeCard: {
        flex: 1,
        margin: 0,
        borderRadius: 20,
        padding: 15,
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center'
    }
})