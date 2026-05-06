import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert, Dimensions, ScrollView, StyleSheet,
    Text,
    TouchableOpacity, View
} from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';


const W = Dimensions.get('window').width - 80;
const H = 160;
const PADDING_LEFT = 40;

function WeightChart({data} : {data: {date: string; value: number}[]}) {
    if(data.length < 2) {
        return(
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ color: '#AAA', fontSize: 14 }}>Add at least 2 entries to see the chart</Text>
            </View>
        );
    }

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const points = data.map((d, i) => ({
        x: PADDING_LEFT + (i / (data.length - 1)) * (W - PADDING_LEFT),
        y: 10 + ((max - d.value) / range) * (H - 20),
        label: d.date,
        value: d.value,
    }));

    const pathD = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ');

    return(
        <Svg width={W + 20} height={H + 40}>
            {[0, 0.5, 1].map((t, i) => {
                const y = 10 + t * (H - 20);
                const val = (max - t * range).toFixed(1);
                return (
                    <React.Fragment key={i}>
                        <Line x1={PADDING_LEFT} y1={y} x2={W} y2={y} stroke="#F0F0F0" strokeWidth={1} />
                        <SvgText x={0} y={y + 4} fontSize={9} fill="#BBB">{val}</SvgText>
                    </React.Fragment>
                );
            })}
            <Path d={pathD} stroke="#4CAF50" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
                <React.Fragment key={1}>
                    <Circle cx={p.x} cy={p.y} r={5} fill="#4CAF50" />
                    <SvgText x={p.x} y={H + 20} fontSize={9} fill="#888" textAnchor="middle">
                        {p.label.split('/').slice(0, 2).join('/')}
                    </SvgText>
                    <SvgText x={p.x} y={p.y - 10} fontSize={9} fill="#4CAF50" textAnchor="middle">
                        {p.value}
                    </SvgText>
                </React.Fragment>
            ))}
        </Svg>
    );
}

export default function WeightScreen() {
    const { weight, weightHistory, addWeightEntry } = useUserStore();
    const [input, setInput] = useState('');

    const handleAdd = () => {
        const val = parseFloat(input);
        if (isNaN(val) || val < 30 || val > 300) {
            Alert.alert('Invalid value', 'Enter weight between 30 and 300 kg');
            return;
        }
        addWeightEntry(val);
        setInput('');
    };
    const current = weightHistory.length > 0
        ? weightHistory[weightHistory.length - 1].value
        : weight;

    const first = weightHistory.length > 1 ? weightHistory[0].value : null;
    const diff = first !== null ? (current - first).toFixed(1) : null;

    return(
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft color="#1A1A1A" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>My Weight</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.currentdCard}>
                    <Text style={styles.currentLabel}>Current weight</Text>
                    <Text style={styles.currentValue}>{current} <Text style={styles.currentUnit}>kg</Text></Text>
                    {diff !== null && (
                        <Text style={[styles.diff, { color: parseFloat(diff) <= 0 ? '#4CAF50' : '#FF5252' }]}>
                            {parseFloat(diff) > 0 ? '+' : ''}{diff} kg since start
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F8F9FA'},
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
        marginBottom: 20,
    },
    backBtn: {
        width: 40, 
        height: 40, 
        borderRadius: 12, 
        backgroundColor: '#F5F5F5', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    title: {fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
    currentdCard: {
        marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 24,
        padding: 24, alignItems: 'center', marginBottom: 16,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8
    },
    currentLabel: {fontSize: 14, color: '#888', marginBottom: 8},
    currentValue: { fontSize: 52, fontWeight: '900', color: '#1A1A1A' },
    currentUnit: { fontSize: 24, fontWeight: '600', color: '#888' },
})