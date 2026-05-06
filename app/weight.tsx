import React from 'react';
import {
    Dimensions,
    Text,
    View
} from 'react-native';

const W = Dimensions.get('window').width - 80;
const H = 160;
const PADDING_LEFT = 40;

function WeightChart({data} : {data: {data: string; value: number}[]}) {
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
}