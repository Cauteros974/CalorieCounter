import * as Notifications from 'expo-notifications';

export async function requestPermissions() {
    const {status} = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function scheduleWaterRemindername() {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Time to drink wate"
        }
    })
}