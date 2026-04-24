import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    View
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CalorieRing({progress}: {progress: number}){
    const animatedValue = useRef(new Animated.Value(0)).current;
    const SIZE = 160;
    const STROKE = 12;
    const R = (SIZE - STROKE) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * R;

    useEffect (() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCUMFERENCE, 0],
    });

    return(
        <View style={{ alignItems: 'center', justifyContent: 'center', width: SIZE, height: SIZE }}>
            <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
                {/*Track */}
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    stroke="#F0F0F0"
                    strokeWidth={STROKE}
                    fill="none"
                />

                <AnimatedCircle 
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    stroke="#4CAF50"
                    strokeWidth={STROKE}
                    fill="none"
                    strokeDasharray={`${CIRCUMFERENCE}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${SIZE / 2}, ${SIZE / 2}`}
                />
            </Svg>
        </View>
    )
}