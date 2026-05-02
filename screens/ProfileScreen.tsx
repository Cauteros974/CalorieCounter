import { useRef } from 'react';
import { Animated } from 'react-native';
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
    const borderAnim = useRef(new Animated.Value(0)).current
}