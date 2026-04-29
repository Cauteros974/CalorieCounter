import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Ruler, User, Weight } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Animated,
    Easing,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import * as z from 'zod';
import { useUserStore } from '../store/useUserStore';

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

// ── Animated Input Field ─────────────────────────────────────────────────────
function AnimatedInput({
    label,
    icon,
    placeholder,
    keyboardType = 'default',
    error,
    onChange,
    value,
}: any) {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;
    const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

    const onFocus = () => {
        setFocused(true);
        Animated.parallel([
            Animated.timing(borderAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(labelAnim, {
                toValue: 1,
                duration: 180,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }),
        ]).start();
    };

    const onBlur = () => {
        setFocused(false);
        Animated.timing(borderAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
        if (!value) {
            Animated.timing(labelAnim, {
                toValue: 0,
                duration: 180,
                useNativeDriver: false,
            }).start();
        }
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? '#FF5252' : '#E8E8E8', error ? '#FF5252' : '#4CAF50'],
    });

    const labelColor = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#AAA', '#4CAF50'],
    });

    const labelSize = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 11],
    });

    const labelY = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
    });

    return (
        <View style={inputStyles.wrapper}>
            <Animated.View style={[inputStyles.box, { borderColor }]}>
                <View style={inputStyles.iconWrap}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <Animated.Text style={[inputStyles.floatingLabel, { color: labelColor, fontSize: labelSize, transform: [{ translateY: labelY }] }]}>
                        {label}
                    </Animated.Text>
                    <TextInput
                        style={inputStyles.input}
                        placeholder=""
                        keyboardType={keyboardType}
                        onChangeText={onChange}
                        value={value}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </View>
            </Animated.View>
            {error && (
                <Text style={inputStyles.errorText}>{error}</Text>
            )}
        </View>
    );
}

const inputStyles = StyleSheet.create({
    wrapper: { marginBottom: 16 },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 8,
        backgroundColor: '#FAFAFA',
        minHeight: 64,
    },
    iconWrap: { marginRight: 12, marginTop: 10 },
    floatingLabel: { fontWeight: '600' },
    input: { fontSize: 16, color: '#1A1A1A', paddingTop: 2 },
    errorText: { color: '#FF5252', fontSize: 12, marginTop: 4, marginLeft: 16 },
});

// ── Success checkmark ────────────────────────────────────────────────────────
function SuccessTick() {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={{ alignItems: 'center', marginBottom: 32, transform: [{ scale }], opacity }}>
            <CheckCircle color="#4CAF50" size={64} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 12 }}>Saved!</Text>
            <Text style={{ fontSize: 14, color: '#888', marginTop: 4 }}>Your daily norms are calculated</Text>
        </Animated.View>
    );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
    const setProfile = useUserStore((state) => state.setProfile);
    const [submitted, setSubmitted] = useState(false);
    const buttonScale = useRef(new Animated.Value(1)).current;

    // Fade in on mount
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();
    }, []);

    const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const onSubmit = (data: any) => {
        setProfile({
            fullName: data.fullName,
            weight: Number(data.weight),
            height: Number(data.height),
        });
        // Button press animation
        Animated.sequence([
            Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start(() => setSubmitted(true));
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.avatarCircle}>
                                <User color="#4CAF50" size={36} />
                            </View>
                            <Text style={styles.title}>Personal Profile</Text>
                            <Text style={styles.subtitle}>Fill in your details so we can calculate your daily norms</Text>
                        </View>

                        {/* Success state */}
                        {submitted && <SuccessTick />}

                        {/* Form */}
                        <Controller
                            control={control}
                            name="fullName"
                            render={({ field: { onChange, value } }) => (
                                <AnimatedInput
                                    label="Full Name"
                                    icon={<User color="#4CAF50" size={20} />}
                                    placeholder="Mike Henson"
                                    onChange={onChange}
                                    value={value}
                                    error={errors.fullName?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="height"
                            render={({ field: { onChange, value } }) => (
                                <AnimatedInput
                                    label="Height (cm)"
                                    icon={<Ruler color="#2196F3" size={20} />}
                                    keyboardType="numeric"
                                    onChange={onChange}
                                    value={value}
                                    error={errors.height && 'Please enter a valid height (100–250)'}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="weight"
                            render={({ field: { onChange, value } }) => (
                                <AnimatedInput
                                    label="Weight (kg)"
                                    icon={<Weight color="#FF9800" size={20} />}
                                    keyboardType="numeric"
                                    onChange={onChange}
                                    value={value}
                                    error={errors.weight && 'Please enter a valid weight (30–300)'}
                                />
                            )}
                        />

                        {/* Button */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} activeOpacity={0.85}>
                                <Text style={styles.buttonText}>Calculate my norms</Text>
                            </TouchableOpacity>
                        </Animated.View>

                    </Animated.View>
                </ScrollView>
            </Pressable>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    content: { padding: 24, paddingTop: 80, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 40 },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
    button: {
        backgroundColor: '#4CAF50',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});