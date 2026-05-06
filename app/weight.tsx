import { useUserStore } from '@/store/useUserStore';
import { ArrowLeft, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert, Dimensions, ScrollView, StyleSheet,
    Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { router } from 'expo-router';


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
        ? weightHistory(weightHistory.length - 1).value
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
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F8F9FA'}
    header: {}
})