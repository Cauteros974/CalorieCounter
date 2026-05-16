import { Colors, useUserStore } from '@/store/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import {
    Album, Award, Bell,
    Camera, ChevronRight,
    LogOut, Ruler, User, Weight
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Animated, Easing, Keyboard, KeyboardAvoidingView,
    Platform, ScrollView, StyleSheet,
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
function AnimatedInput({ label, icon, keyboardType = 'default', error, onChange, value, currentColors }: any) {
    const borderAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
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
        outputRange: [error ? '#FF5252' : '#E8E8E8', error ? '#FF5252' : currentColors.primary],
    });
    const labelColor = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [currentColors.subText, currentColors.primary] });
    const labelSize = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
    const labelY = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 8] });

    return (
        <View style={inputStyles.wrapper}>
            <Animated.View style={[inputStyles.box, { borderColor, backgroundColor: currentColors.card }]}>
                <View style={inputStyles.iconWrap}>{icon}</View>
                <View style={{ flex: 1, height: 56, justifyContent: 'flex-end' }}>
                    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                        <Animated.Text
                            style={[inputStyles.floatingLabel, {
                                color: labelColor, 
                                fontSize: labelSize,
                                position: 'absolute', 
                                top: labelY, 
                                left: 0,
                            }]}
                        >
                            {label}
                        </Animated.Text>
                    </View>
                    <TextInput
                        style={[inputStyles.input, { color: currentColors.text }]}
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

// ── Profile Dashboard ─────────────────────────────────────────────────────────
function ProfileDashboard({ onEdit, currentColors }: { onEdit: () => void; currentColors: any }) {
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
        { icon: <Weight color={currentColors.primary} size={20} />, label: 'My Weight', bg: '#E8F5E9', route: '/weight' },
        { icon: <Award color="#FFD740" size={20} />, label: 'My Achievements', bg: '#FFFDE7', route: '/achievements' },
        { icon: <Bell color="#2196F3" size={20} />, label: 'Reminders', bg: '#E3F2FD', route: '/reminders' },
        { icon: <Album color="#9C27B0" size={20} />, label: 'Photo Album', bg: '#F3E5F5', route: '/album' },
    ];

    const stats = [
        { label: 'Calories', value: `${consumedCalories ?? 0}`, sub: `/ ${dailyCalories ?? 2000} kcal`, color: currentColors.primary },
        { label: 'Water', value: `${consumedWater ?? 0}`, sub: `/ ${dailyWater ?? 2} l`, color: '#2196F3' },
        { label: 'Weight', value: `${weight ?? '--'}`, sub: 'kg', color: '#FF9800' },
        { label: 'Height', value: `${height ?? '--'}`, sub: 'cm', color: '#9C27B0' },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: currentColors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim }}>

                    {/* Header */}
                    <View style={[dashStyles.header, { backgroundColor: currentColors.card }]}>
                        <View style={dashStyles.avatarWrap}>
                            <View style={[dashStyles.avatar, { borderColor: currentColors.primary }]}>
                                <User color={currentColors.primary} size={40} />
                            </View>
                            <TouchableOpacity style={[dashStyles.cameraBtn, { backgroundColor: currentColors.primary }]}>
                                <Camera color="#fff" size={14} />
                            </TouchableOpacity>
                            <Text style={[dashStyles.editBtn, { color: currentColors.primary }]} onPress={onEdit}>Edit</Text>
                        </View>
                        <View style={dashStyles.headerInfo}>
                            <Text style={[dashStyles.name, { color: currentColors.text }]}>{fullName || "User"}</Text>
                            <Text style={[dashStyles.accountType, { color: currentColors.subText }]}>Account Type: Free</Text>
                            <View style={dashStyles.levelBadge}>
                                <Text style={dashStyles.levelText}>⭐ Level {level ?? 1}  🔥 {streak ?? 0} days</Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats grid */}
                    <View style={dashStyles.statsGrid}>
                        {stats.map((s) => (
                            <View key={s.label} style={[dashStyles.statCard, { backgroundColor: currentColors.card }]}>
                                <Text style={[dashStyles.statValue, { color: s.color }]}>{s.value}</Text>
                                <Text style={[dashStyles.statSub, { color: currentColors.subText }] ?? '/ 2000 kcal'}>{s.sub}</Text>
                                <Text style={[dashStyles.statLabel, { color: currentColors.text }]}>{s.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* XP bar */}
                    <View style={[dashStyles.xpCard, { backgroundColor: currentColors.card }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={[dashStyles.xpLabel, { color: currentColors.text }]}>⭐ Level {level ?? 1} progress</Text>
                            <Text style={[dashStyles.xpCount, { color: currentColors.primary }]}>{xp ?? 0} / 1000 XP</Text>
                        </View>
                        <View style={dashStyles.xpTrack}>
                            <View style={[dashStyles.xpFill, { width: `${Math.min((xp || 0) / 10, 100)}%` }]} />
                        </View>
                    </View>

                    {/* Menu Items */}
                    <View style={[dashStyles.menuSection, { backgroundColor: currentColors.card }]}>
                        {menuItems.map((item, idx) => (
                            <TouchableOpacity 
                                key={idx} 
                                style={dashStyles.menuItem}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={[dashStyles.menuIconBg, { backgroundColor: item.bg }]}>
                                    {item.icon}
                                </View>
                                <Text style={[dashStyles.menuLabel, { color: currentColors.text }]}>{item.label}</Text>
                                <ChevronRight color="#CCC" size={20} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity style={[dashStyles.logoutBtn, { backgroundColor: currentColors.card, borderColor: '#FFEBEE' }]}>
                        <LogOut color="#FF5252" size={20} />
                        <Text style={dashStyles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

                </Animated.View>
            </ScrollView>
        </View>
    );
}

// ── Profile Editor / Registration ─────────────────────────────────────────────
interface ProfileEditorProps {
    onCancel: () => void;
    isRegistration: boolean;
    currentColors: any;
}

function ProfileEditor({ onCancel, isRegistration, currentColors }: ProfileEditorProps) {
    const { fullName, weight, height, setProfile } = useUserStore();
    
    const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: fullName || '',
            weight: weight ? String(weight) : '',
            height: height ? String(height) : '',
        }
    });

    const onSubmit = (data: ProfileFormData) => {
        const w = Number(data.weight);
        const h = Number(data.height);

        // Автоматический расчет стандартов для HomeScreen при регистрации
        const calculatedCalories = Math.round(10 * w + 6.25 * h - 5 * 25 + 5); 
        const calculatedWater = Number((w * 0.035).toFixed(1)); 

        if (typeof setProfile === 'function') {
            setProfile({
                fullName: data.fullName,
                weight: w,
                height: h,
                dailyCalories: calculatedCalories,
                dailyWater: calculatedWater,
                // Заполняем структуру targets, которую запрашивает HomeScreen
                targets: {
                    protein: Math.round(w * 2), 
                    fat: Math.round(w * 1),     
                    carbs: Math.round((calculatedCalories * 0.5) / 4), 
                }
            });
        }
        Keyboard.dismiss();
        onCancel(); 
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1, backgroundColor: currentColors.background }}
        >
            <ScrollView 
                contentContainerStyle={{ padding: 24, paddingTop: Platform.OS === 'ios' ? 70 : 50 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={editStyles.header}>
                    <Text style={[editStyles.title, { color: currentColors.text }]}>
                        {isRegistration ? "Personal account" : "Edit Profile"}
                    </Text>
                    {!isRegistration && (
                        <Text style={[editStyles.subtitle, { color: currentColors.subText }]}>
                            Update your personal metrics for accurate tracking
                        </Text>
                    )}
                </View>

                <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, value } }) => (
                        <AnimatedInput
                            label="Full Name"
                            icon={<User color={currentColors.primary} size={20} />}
                            onChange={onChange}
                            value={value}
                            error={errors.fullName?.message}
                            currentColors={currentColors}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="height"
                    render={({ field: { onChange, value } }) => (
                        <AnimatedInput
                            label="Height (cm)"
                            icon={<Ruler color={currentColors.primary} size={20} />}
                            keyboardType="numeric"
                            onChange={onChange}
                            value={value}
                            error={errors.height?.message}
                            currentColors={currentColors}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="weight"
                    render={({ field: { onChange, value } }) => (
                        <AnimatedInput
                            label="Weight (kg)"
                            icon={<Weight color={currentColors.primary} size={20} />}
                            keyboardType="numeric"
                            onChange={onChange}
                            value={value}
                            error={errors.weight?.message}
                            currentColors={currentColors}
                        />
                    )}
                />

                {isRegistration ? (
                    <TouchableOpacity style={[editStyles.calculateBtn, { backgroundColor: currentColors.primary }]} onPress={handleSubmit(onSubmit)}>
                        <Text style={editStyles.calculateBtnText}>Calculate the standards</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={editStyles.btnGroup}>
                        <TouchableOpacity style={[editStyles.cancelBtn, { backgroundColor: currentColors.card }]} onPress={onCancel}>
                            <Text style={[editStyles.cancelBtnText, { color: currentColors.subText }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[editStyles.saveBtn, { backgroundColor: currentColors.primary }]} onPress={handleSubmit(onSubmit)}>
                            <Text style={editStyles.saveBtnText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
    const { fullName, weight, height, theme } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);

    // Подтягиваем текущую палитру из твоего стора
    const currentColors = Colors[theme || 'light'] || Colors.light;

    const isRegistered = !!fullName && !!weight && !!height;

    if (!isRegistered || isEditing) {
        return (
            <ProfileEditor 
                isRegistration={!isRegistered} 
                onCancel={() => setIsEditing(false)} 
                currentColors={currentColors}
            />
        );
    }

    return <ProfileDashboard onEdit={() => setIsEditing(true)} currentColors={currentColors} />;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const inputStyles = StyleSheet.create({
    wrapper: { marginBottom: 16 },
    box: {
        flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
        borderRadius: 16, paddingHorizontal: 16, height: 64,
    },
    iconWrap: { marginRight: 12 },
    floatingLabel: { fontWeight: '600' },
    input: { fontSize: 16, paddingBottom: 4, height: 30 },
    errorText: { color: '#FF5252', fontSize: 12, marginTop: 4, marginLeft: 16 },
});

const dashStyles = StyleSheet.create({
    header: {
        flexDirection: 'row', padding: 20, borderRadius: 24, marginTop: Platform.OS === 'ios' ? 40 : 20,
        marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    },
    avatarWrap: { alignItems: 'center', position: 'relative' },
    avatar: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9',
        justifyContent: 'center', alignItems: 'center', borderWidth: 2,
    },
    cameraBtn: {
        position: 'absolute', bottom: 20, right: 0,
        width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: '#FFF',
    },
    editBtn: { fontWeight: '700', marginTop: 8, fontSize: 14, textAlign: 'center' },
    headerInfo: { flex: 1, marginLeft: 20, justifyContent: 'center' },
    name: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    accountType: { fontSize: 13, marginBottom: 6 },
    levelBadge: {
        backgroundColor: '#FFF8E1', paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 20, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#FFE082',
    },
    levelText: { fontSize: 12, fontWeight: '600', color: '#FFB300' },
    statsGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'space-between', marginBottom: 10,
    },
    statCard: {
        width: '47%', padding: 16, borderRadius: 20,
        marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    statValue: { fontSize: 20, fontWeight: '800' },
    statSub: { fontSize: 12, marginTop: 2, marginBottom: 8 },
    statLabel: { fontSize: 13, fontWeight: '600' },
    xpCard: {
        marginHorizontal: 0, padding: 16, borderRadius: 20,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 16,
    },
    xpLabel: { fontSize: 13, fontWeight: '600' },
    xpCount: { fontSize: 13, fontWeight: '700' },
    xpTrack: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
    xpFill: { height: '100%', backgroundColor: '#FFD740', borderRadius: 4 },
    menuSection: {
        borderRadius: 20, paddingVertical: 8, shadowColor: '#000',
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuIconBg: {
        width: 36, height: 36, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginRight: 14,
    },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        height: 56, borderRadius: 20, borderWidth: 1.5, marginBottom: 40
    },
    logoutText: { color: '#FF5252', fontSize: 16, fontWeight: '700', marginLeft: 8 },
});

const editStyles = StyleSheet.create({
    header: { marginBottom: 32, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
    subtitle: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
    btnGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    cancelBtn: {
        flex: 1, marginRight: 12, height: 56, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8'
    },
    cancelBtnText: { fontSize: 16, fontWeight: '600' },
    saveBtn: {
        flex: 2, height: 56, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
    },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    calculateBtn: {
        height: 56, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginTop: 24,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
    },
    calculateBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});