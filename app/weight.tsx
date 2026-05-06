import { useUserStore } from '@/store/useUserStore';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View
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
}

const styles =  StyleSheet.create({

})