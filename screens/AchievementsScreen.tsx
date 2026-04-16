import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Colors, useUserStore } from "@/store/useUserStore";
import { Trophy, Star, Flame } from 'lucide-react-native';

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
    levelBadge:{
        width: 50,
    },
    levelText{
        color: '#fff',
    }
})