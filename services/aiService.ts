import * as ImageManipulator from 'expo-image-manipulator';

const API_KEY = 'AIzaSyChCWipmZL48-3a72Z6TdqT-tmud4j5YvI';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

type FoodAnalysisResult = {
    calories: number;
    dishName: string;
};

export const analyzeFoodImage = async(uri: string) => {
    //Compress photos before sending
    const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 512 } }], // Reduce to 512px for speed
        { base64: true, compress: 0.7 }
    );
    const base64Data = manipulatedImage.base64;

    const promt = "Identify this dish. Return ONLY the JSON object: { 'dishName': 'name', 'calories': number, 'protein': number, 'carbs': number, 'fat': number }. Estimate the calorie content of a serving by eye.";

    try{
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                contents: [{
                    parts: [
                      { text: prompt },
                      { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                    ]
                }]
            })
        });
    } catch (error) {
        console.error("AI Analysis Error:", error);
        return null;
    }
};