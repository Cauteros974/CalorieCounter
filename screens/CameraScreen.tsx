import { CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { analyzeFoodImage } from '../services/aiService';
import { useUserStore } from '../store/useUserStore';

export default function CameraScreen({onClose}: {onClose: () => void}) {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<any>(null);
    const addCalories = useUserStore(state => state.addCalories);

    if(!permission) return <View />
    if (!permission.granted) {
        return (
          <View style={styles.container}>
            <Text>Need access to camera</Text>
            <TouchableOpacity onPress={requestPermission}><Text>Allow</Text></TouchableOpacity>
          </View>
        );
      }

    const takePhoto = async () => {
        if(cameraRef.current) {
            setLoading(true);
            const photo = await cameraRef.current.takePictureAsync();
            const result = await analyzeFoodImage(photo.uri);

            if(result) {
                addCalories(result.calories);
                alert(`Added: ${result.dishName} (${result.calories} kcal)`);
                onClose();
            } else{
                alert("Failed to recognize food");
            }
            setLoading(false);
        }
    };

    return(
        <View style={styles.container}>
            <CameraView style={styles.camera} ref={cameraRef}>
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <X color="#fff" size={30} />
                    </TouchableOpacity>

                    {loading ? (
                        <ActivityIndicator size="large" color="#4CAF50"/>
                    ) : (
                        <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    )}
                </View>
            </CameraView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex: 2, backgroundColor: '#000'},
    camera: { flex: 1 },
    overlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 50 },
    closeBtn: { alignSelf: 'flex-start', marginLeft: 20 },
    captureBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
})
