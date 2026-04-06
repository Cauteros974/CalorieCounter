import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, TextInput, View } from 'react-native';
import * as z from 'zod';
import { useUserStore } from '../store/useUserStore';

//Validation Scheme
const profileSchema = z.object ({
    fullName: z.string().min(1, 'The name is too short'),
    weight: z.string().transform(Number).pipe(z.number().min(30).max(300)),
    height: z.string().transform(Number).pipe(z.number().min(100).max(250)),
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
                      placeholder="Иван Иванов" 
                      onChangeText={onChange} 
                      value={value} 
                    />
                )}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

            <Text>
                <Controller

                />

                
            </Text>
            
        </View>
    )
}