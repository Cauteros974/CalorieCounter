import { Colors, useUserStore } from "@/store/useUserStore";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';

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
                    <View style={styles.xpBarBg}>
                        <View style={[styles.xpBarFill, { width: `${(xp / (level * 1000)) * 100}%` }]} />
                    </View>
                </View>
            </View>
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
})