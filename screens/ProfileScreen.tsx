import React, { useRef } from 'react';
import {
    Animated, Easing,
    StyleSheet,
    Text, TextInput,
    View
} from 'react-native';
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
    const labelSize = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
    const labelY = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 8] });

    return(
        <View style = {inputStyles.wrapper}>
            <Animated.View style={[inputStyles.box, { borderColor }]}>
                <View style={inputStyles.iconWrap}>{icon}</View>
                <View style={{ flex: 1, height: 56, justifyContent: 'flex-end' }}>
                    <Animated.Text
                        pointerEvents="none"
                        style={[inputStyles.floatingLabel, {
                            color: labelColor, fontSize: labelSize,
                            position: 'absolute', top: labelY, left: 0,
                        }]}
                    >
                        {label}
                    </Animated.Text>
                    <TextInput
                        style={inputStyles.input}
                        keyboardType={keyboardType}
                        onChangeText={onChange}
                        value={value}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                </View>
            </Animated.View>
            {error && <Text style={inputStyles.errorText}>{error}</Text>}
        </View>
    );
}

const inputStyles = StyleSheet.create({
    wrapper: {marginBottom: 16},
    box: {
        flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
        borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#FAFAFA', height: 64,
    },
    iconWrap: { marginRight: 12 },
    floatingLabel: { fontWeight: '600' },
    input: { fontSize: 16, color: '#1A1A1A', paddingBottom: 4, height: 30 },
    errorText: { color: '#FF5252', fontSize: 12, marginTop: 4, marginLeft: 16 },
})