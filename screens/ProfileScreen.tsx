import { useRef } from 'react';
import { Animated, Easing } from 'react-native';
import * as z from 'zod';

const profileSchema = z.object({
    fullName: z.string().min(1, 'The name is too short'),
    weight: z.string().refine(val => {
        const num = Number(val);
        return num >= 30 && num <= 300;
    }, 'Invalid weight'),
    height: z.string().refine(val => {
        const num = Number(val);
        return num >= 100 && num <= 250;
    }, 'Invalid height'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function AnimatedInput({ label, icon, keyboardType = 'default', error, onChange, value }: any) {
    const borderAnim = useRef(new Animated.Value(0)).current;
    const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
    
    const onFocus = () => {
        Animated.parallel([
            Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
            Animated.timing(labelAnim, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        ]).start();
    };

    const onBlur = () => {
        Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false}).start();
        if (!value) {
            Animated.timing(labelAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
        }
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? '#FF5252' : '#E8E8E8', error ? '#FF5252' : '#4CAF50'],
    });
    const labelColor = labelAnim.interpolate({ inputRange: [0, 1], outputRange: ['#AAA', '#4CAF50'] });
}