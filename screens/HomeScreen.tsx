import { useRef } from 'react';
import {
    Animated
} from 'react-native';
import { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CalorieRing({progress}: {progress: number}){
    const animatedValue = useRef(new Animated.Value(0)).current;
    const SIZE = 160;
    const STROKE = 12;
}