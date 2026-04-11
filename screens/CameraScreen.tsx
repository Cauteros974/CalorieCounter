import { useCameraPermissions } from 'expo-camera';
import { useState } from "react";

export default function CameraScreen({onClose}: {onClose: () => void}) {
    const [permision, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
}
