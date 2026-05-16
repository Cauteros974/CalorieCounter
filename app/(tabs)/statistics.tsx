import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { Colors, useUserStore } from '../../store/useUserStore';

const W = Dimensions.get('window').width - 40;
const H = 200;
const PADDING = { top: 20, bottom: 30, left: 40, right: 20 };


const weekData = [
  { day: 'Mon', cal: 1800 },
  { day: 'Tue', cal: 2100 },
  { day: 'Wed', cal: 1950 },
  { day: 'Thu', cal: 2400 },
  { day: 'Fri', cal: 1700 },
  { day: 'Sat', cal: 2000 },
  { day: 'Sun', cal: 2200 },
];

function SimpleLineChart({color} : {color: string}) {
    const chartW = W - PADDING.left - PADDING.right;
    const chartH = H - PADDING.top - PADDING.bottom;

    const values = weekData.map(d => d.cal);
    const minV = Math.min(...values) - 200;
    const maxV = Math.max(...values) + 200;

    const toX = (i: number) => PADDING.left + (i / (weekData.length - 1)) * chartW;
    const toY = (v: number) => PADDING.top + chartH - ((v - minV) / (maxV - minV)) * chartH;
    
    const points = weekData.map((d, i) => ({ x: toX(i), y: toY(d.cal) }));

    // Smooth path
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++ ) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpX = (prev.x + curr.x) / 2;
        d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return(
        <Svg width={W} height={H}>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                const y = PADDING.top + t * chartH;
                const val = Math.round(maxV - t * (maxV - minV));
                return(
                    <React.Fragment key={i}>
                        <Line
                            x1={PADDING.left} y1={y}
                            x2={W - PADDING.right} y2={y}
                            stroke="#F0F0F0" strokeWidth={1}
                        />
                        <SvgText
                            x={PADDING.left - 5} y={y + 4}
                            fontSize={9} fill="#BBB" textAnchor="end"
                        >
                            {val}
                        </SvgText>
                    </React.Fragment>
                );
            })}

            {/* Line */}
            <Path d={d} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />

            {points.map((p, i) => (
                <React.Fragment key={i}>
                    <Circle cx={p.x} cy={p.y} r={5} fill={color} />
                    <SvgText x={p.x} y={H - 5} fontSize={10} fill="#999" textAnchor="middle">
                        {weekData[i].day}
                    </SvgText>
                </React.Fragment>
            ))}
        </Svg>
    );
}

export default function StatisticsScreen() {
    const { theme } = useUserStore();
    const currentColors = Colors[theme || 'light'];

    const avg = Math.round(weekData.reduce((s, d) => s + d.cal, 0) / weekData.length);

    return(
        <ScrollView
            style={{flex: 1, backgroundColor: currentColors.background}}
            contentContainerStyle={styles.container}
        >
            <Text style={[styles.title, { color: currentColors.text }]}>Weekly Statistics</Text>

            <View style={[styles.card, { backgroundColor: currentColors.card }]}>
                <Text style={[styles.cardTitle, { color: currentColors.text }]}>Calorie Consumption</Text>
                <SimpleLineChart color={currentColors.primary || '#4CAF50'} />
            </View>

             <View style={styles.row}>
                <View style={[styles.statBox, { backgroundColor: currentColors.card }]}>
                    <Text style={{ color: currentColors.subText, fontSize: 13 }}>Average</Text>
                    <Text style={[styles.statValue, { color: currentColors.text }]}>{avg}</Text>
                    <Text style={{ color: '#4CAF50', fontSize: 12 }}>kcal/day</Text>
                </View>
             </View>

        </ScrollView>
    )
}