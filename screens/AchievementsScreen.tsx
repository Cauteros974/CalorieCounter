import { Colors, useUserStore } from "@/store/useUserStore";
import React from "react";
import { StyleSheet, View } from 'react-native';

export default function AchievementsScreen() {
    const {achievements, level, xp, streak, theme} = useUserStore();
    const currentColors = Colors[theme];

    return(
        <View style={[styles.container, {backgroundColor: currentColors.background}]}>
            <View style={[styles.profileHeader, {backgroundColor: currentColors.background}]}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {padding: 20},
    profileHeader: {
        margin: 40,
        padding: 20,
        borderRadius: 24,
    }
})