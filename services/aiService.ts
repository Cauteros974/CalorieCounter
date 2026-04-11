import * as ImageManipulator from 'expo-image-manipulator';

const API_KEY = 'AIzaSyChCWipmZL48-3a72Z6TdqT-tmud4j5YvI';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const analyzeFoodImage = async(uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 512 } }], // Reduce to 512px for speed
        { base64: true, compress: 0.7 }
    );

    const base64Data = manipulatedImage.base64;
}