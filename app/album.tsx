import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Image,
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
                    <TouchableOpacity style={styles.goBtn} onPress={() => router.push('/')}>
                        <Text style={styles.gotBtnText}>
                            Go scan a meal
                        </Text>
                    </TouchableOpacity>
                </View>
            ):(
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.grid}
                >
                    <Text style={styles.count}>{photoAlbum.length} meals scanned</Text>
                    <View style={styles.row}>
                        {photoAlbum.map((photo, i) => (
                            <View style={styles.card}>
                                <Image 
                                style={styles.photo} 
                                source={{url: photo.uri}}
                                resizeMode="cover"
                                />
                                <View style={styles.cardInfo}>
                                    <Text style={styles.dishName} numberOfLines={1}>{photo.dishName}</Text>
                                    <Text style={styles.cardCals}>{photo.calories} kcal</Text>
                                    <Text style={styles.cardDate}>{photo.date}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
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
        fontSize: 20, fontWeight: '800', color: '#1A1A1A', marginBottom: 0, marginTop: 20
    },
    emptyDesc: {
        fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20
    },
    goBtn:{
        marginTop: 24, backgroundColor: '#4CAF50', borderRadius: 14,
        paddingHorizontal: 28, paddingVertical: 14,
    },
    gotBtnText: {
        color: '#fff', 
    },
    grid: {
        paddingHorizontal: 20, paddingBottom: 100
    },
    count: { fontSize: 13, color: '#888', marginBottom: 16 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
    card: {
        width: CARD_W, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    },
    photo: { width: CARD_W, height: CARD_W },
    cardInfo: { padding: 10 },
    dishName: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
    cardCals: { fontSize: 12, color: '#4CAF50', fontWeight: '600', marginTop: 2 },
    
})