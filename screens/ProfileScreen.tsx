import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';
import { useUserStore } from '../store/useUserStore';

//Validation Scheme
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

export default function profileScreen() {
    const setProfile = useUserStore((state) => state.setProfile);

    const {control, handleSubmit, formState: {errors} } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const onSubmit = (data: any) => {
        setProfile({
          fullName: data.fullName,
          weight: Number(data.weight),
          height: Number(data.height),
        });
        Alert.alert('Success', 'Data saved, norms calculated!');
    };

    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>Personal account</Text>

            <Text style = {styles.title}>Full Name</Text>
            <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, value } }) => (
                    <TextInput 
                      style={[styles.input, errors.fullName && styles.errorInput]} 
                      placeholder="Mike Henson" 
                      onChangeText={onChange} 
                      value={value} 
                    />
                )}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

            <Text style={styles.label}>Height(cm)</Text>
            <Controller
                control={control}
                name="height"
                render={({ field: {onChange, value }}) => (
                    <TextInput 
                        style={[styles.input, errors.height && styles.errorInput]} 
                        placeholder="180" 
                        keyboardType="numeric"
                        onChangeText={onChange} 
                        value={value} 
                    />
                )}
            />
            {errors.height && <Text style={styles.errorText}>Please enter the correct height</Text>}

            <Text style = {styles.label}>Weight(kg)</Text>
            <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                    <TextInput 
                      style={[styles.input, errors.weight && styles.errorInput]} 
                      placeholder="75" 
                      keyboardType="numeric"
                      onChangeText={onChange} 
                      value={value} 
                    />
                )}
            />
            {errors.weight && <Text style={styles.errorText}>Please enter the correct weight</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Calculate the standards</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    label: { fontSize: 16, marginBottom: 5, color: '#333' },
    input: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 15,
        fontSize: 16
    },
    errorInput: { borderColor: 'red' },
    errorText: { color: 'red', marginBottom: 10, fontSize: 12 },
    button: { 
        backgroundColor: '#4CAF50', 
        padding: 18, 
        borderRadius: 12, 
        alignItems: 'center',
        marginTop: 20 
    },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' }
});