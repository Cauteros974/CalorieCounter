import { useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from "react";
import { View } from 'react-native';
import { analyzeFoodImage } from '../services/aiService';
import { useUserStore } from "../store/useUserStore";

export default function CameraScreen({onClose}: {onClose: () => void}) {
    const [permision, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<any>(null);
    const addCalories = useUserStore(state => state.addCalories);

    if(!permision) return <View />

    const takePhoto = async () => {
        if(cameraRef.current) {
            setLoading(true);
            const photo = await cameraRef.current.takePictureAsync();
            const result = await analyzeFoodImage(photo.uri);

            if(result) {
                addCalories(result.calories);
                alert(`Added: ${result.dishName} (${result.calories} kcal)`);
                onClose();
            }
        }
    }
}
