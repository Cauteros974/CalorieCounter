import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

const COL = 2;
const GAP = 12;
const CARD_W = (Dimensions.get('window').width - 40 - GAP) / COL;

export default function AlbumScreen() {
    const {photoAlbum} = useUserStore;

    return(
        <View style = {styles.container}>
            <View style = {styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft color="#1A1A1A" size={20} />
                </TouchableOpacity>
                <Text style={styles.title}>Photo Album</Text>
                <View style={{ width: 40 }} />
            </View>

            {photoAlbum.length === 0 ? (
                <View style={styles.empty}>
                    <Camera color="#CCC" size={64} />
                    <Text style={styles.emptyTitle}>No photos yet</Text>
                    <Text style={styles.emptyDesc}>
                        Scan your meals with the camera on the home screen and they'll appear here
                    </Text>
                </View>
            ):(
                <ScrollView>

                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
        backgroundColor: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, marginBottom: 20,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F5F5', 
        alignItems: 'center', justifyContent: 'center' 
    },
    title: {
        fontSize: 18, fontWeight: '800', color: '#1A1A1A'
    },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyTitle: {

    }
})