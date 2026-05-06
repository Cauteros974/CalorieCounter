import { useUserStore } from '@/store/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import {
    Album, Award, Bell,
    Camera, ChevronRight,
    Edit3, Ruler, User, Weight
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Animated, Easing, Keyboard, KeyboardAvoidingView,
    Platform, Pressable, ScrollView, StyleSheet,
    Text, TextInput, TouchableOpacity, View,
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

// ── Animated Input ────────────────────────────────────────────────────────────
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
        Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
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

    return (
        <View style={inputStyles.wrapper}>
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
    wrapper: { marginBottom: 16 },
    box: {
        flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
        borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#FAFAFA', height: 64,
    },
    iconWrap: { marginRight: 12 },
    floatingLabel: { fontWeight: '600' },
    input: { fontSize: 16, color: '#1A1A1A', paddingBottom: 4, height: 30 },
    errorText: { color: '#FF5252', fontSize: 12, marginTop: 4, marginLeft: 16 },
});

// ── Profile Dashboard ─────────────────────────────────────────────────────────
function ProfileDashboard({ onEdit }: { onEdit: () => void }) {
    const {
        fullName, weight, height,
        dailyCalories, dailyWater,
        consumedCalories, consumedWater,
        xp, level, streak
    } = useUserStore();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    const menuItems = [
        { icon: <Weight color="#4CAF50" size={20} />, label: 'My Weight', bg: '#E8F5E9', route: '/weight' },
        { icon: <Award color="#FFD740" size={20} />, label: 'My Achievements', bg: '#FFFDE7', route: '/achievements' },
        { icon: <Bell color="#2196F3" size={20} />, label: 'Reminders', bg: '#E3F2FD', route: '/reminders' },
        { icon: <Album color="#9C27B0" size={20} />, label: 'Photo Album', bg: '#F3E5F5', route: '/album' },
    ];

    const stats = [
        { label: 'Calories', value: `${consumedCalories}`, sub: `/ ${dailyCalories} kcal`, color: '#4CAF50' },
        { label: 'Water', value: `${consumedWater}`, sub: `/ ${dailyWater} l`, color: '#2196F3' },
        { label: 'Weight', value: `${weight}`, sub: 'kg', color: '#FF9800' },
        { label: 'Height', value: `${height}`, sub: 'cm', color: '#9C27B0' },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim }}>

                    {/* Header */}
                    <View style={dashStyles.header}>
                        <View style={dashStyles.avatarWrap}>
                            <View style={dashStyles.avatar}>
                                <User color="#4CAF50" size={40} />
                            </View>
                            <TouchableOpacity style={dashStyles.cameraBtn}>
                                <Camera color="#fff" size={14} />
                            </TouchableOpacity>
                            <Text style={dashStyles.editBtn} onPress={onEdit}>Edit</Text>
                        </View>
                        <View style={dashStyles.headerInfo}>
                            <Text style={dashStyles.name}>{fullName}</Text>
                            <Text style={dashStyles.accountType}>Account Type: Free</Text>
                            <View style={dashStyles.levelBadge}>
                                <Text style={dashStyles.levelText}>⭐ Level {level}  🔥 {streak} days</Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats grid */}
                    <View style={dashStyles.statsGrid}>
                        {stats.map((s) => (
                            <View key={s.label} style={dashStyles.statCard}>
                                <Text style={[dashStyles.statValue, { color: s.color }]}>{s.value}</Text>
                                <Text style={dashStyles.statSub}>{s.sub}</Text>
                                <Text style={dashStyles.statLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* XP bar */}
                    <View style={dashStyles.xpCard}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={dashStyles.xpLabel}>⭐ Level {level} progress</Text>
                            <Text style={dashStyles.xpCount}>{xp} / 1000 XP</Text>
                        </View>
                        <View style={dashStyles.xpTrack}>
                            <View style={[dashStyles.xpFill, { width: `${Math.min(xp / 10, 100)}%` }]} />
                        </View>
                    </View>

                    {/* Menu */}
                    <View style={dashStyles.menuSection}>
                        {menuItems.map((item, i) => (
                            <TouchableOpacity
                                key={item.label}
                                style={[
                                    dashStyles.menuRow,
                                    i === menuItems.length - 1 && { borderBottomWidth: 0 }
                                ]}
                                activeOpacity={0.7}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={[dashStyles.menuIcon, { backgroundColor: item.bg }]}>
                                    {item.icon}
                                </View>
                                <Text style={dashStyles.menuLabel}>{item.label}</Text>
                                <ChevronRight color="#CCC" size={20} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Edit button */}
                    <TouchableOpacity style={dashStyles.editFullBtn} onPress={onEdit} activeOpacity={0.85}>
                        <Edit3 color="#fff" size={18} />
                        <Text style={dashStyles.editFullBtnText}>Edit Profile</Text>
                    </TouchableOpacity>

                </Animated.View>
            </ScrollView>
        </View>
    );
}

const dashStyles = StyleSheet.create({
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 24,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
        marginBottom: 20,
    },
    avatarWrap: { alignItems: 'center', marginRight: 20 },
    avatar: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#E8F5E9',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: '#4CAF50',
    },
    cameraBtn: {
        position: 'absolute', bottom: 22, right: -4,
        backgroundColor: '#4CAF50', borderRadius: 12, padding: 4,
    },
    editBtn: { color: '#4CAF50', fontSize: 13, fontWeight: '600', marginTop: 6 },
    headerInfo: { flex: 1 },
    name: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
    accountType: { fontSize: 13, color: '#AAA', fontStyle: 'italic', marginTop: 2 },
    levelBadge: {
        marginTop: 8, backgroundColor: '#F8F9FA',
        borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    levelText: { fontSize: 12, fontWeight: '600', color: '#555' },
    statsGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: 16, gap: 12, marginBottom: 16,
    },
    statCard: {
        width: '46%', backgroundColor: '#fff', borderRadius: 20,
        padding: 16, alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    statValue: { fontSize: 24, fontWeight: '900' },
    statSub: { fontSize: 12, color: '#AAA', marginTop: 2 },
    statLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 4 },
    xpCard: {
        marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 20,
        padding: 16, marginBottom: 16,
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    xpLabel: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
    xpCount: { fontSize: 12, color: '#888' },
    xpTrack: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
    xpFill: { height: '100%', backgroundColor: '#FFD740', borderRadius: 4 },
    menuSection: {
        marginHorizontal: 16, backgroundColor: '#fff',
        borderRadius: 20, overflow: 'hidden',
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
        marginBottom: 16,
    },
    menuRow: {
        flexDirection: 'row', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
    },
    menuIcon: {
        width: 40, height: 40, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', marginRight: 14,
    },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
    editFullBtn: {
        marginHorizontal: 16, backgroundColor: '#4CAF50', borderRadius: 16,
        padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        shadowColor: '#4CAF50', shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
    },
    editFullBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
    const setProfile = useUserStore((state) => state.setProfile);
    const fullName = useUserStore((state) => state.fullName);

    const [showDashboard, setShowDashboard] = useState(!!fullName);
    const buttonScale = useRef(new Animated.Value(1)).current;
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
        defaultValues: { fullName: '', weight: '', height: '' },
    });

    const onSubmit = (data: any) => {
        setProfile({
            fullName: data.fullName,
            weight: Number(data.weight),
            height: Number(data.height),
        });
        Animated.sequence([
            Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start(() => setShowDashboard(true));
    };

    if (showDashboard) {
        return <ProfileDashboard onEdit={() => setShowDashboard(false)} />;
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                <ScrollView
                    style={formStyles.container}
                    contentContainerStyle={formStyles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                        <View style={formStyles.header}>
                            <View style={formStyles.avatarCircle}>
                                <User color="#4CAF50" size={36} />
                            </View>
                            <Text style={formStyles.title}>Personal Profile</Text>
                            <Text style={formStyles.subtitle}>
                                Fill in your details so we can calculate your daily norms
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            name="fullName"
                            render={({ field: { onChange, value } }) => (
                                <AnimatedInput
                                    label="Full Name"
                                    icon={<User color="#4CAF50" size={20} />}
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

                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                style={formStyles.button}
                                onPress={handleSubmit(onSubmit)}
                                activeOpacity={0.85}
                            >
                                <Text style={formStyles.buttonText}>Calculate my norms</Text>
                            </TouchableOpacity>
                        </Animated.View>

                    </Animated.View>
                </ScrollView>
            </Pressable>
        </KeyboardAvoidingView>
    );
}

const formStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    content: { padding: 24, paddingTop: 80, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 40 },
    avatarCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
    button: {
        backgroundColor: '#4CAF50', padding: 18, borderRadius: 16,
        alignItems: 'center', marginTop: 12,
        shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
    },
    buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});