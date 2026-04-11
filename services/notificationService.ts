import * as Notifications from 'expo-notifications';

export async function requestPermissions() {
    const {status} = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}