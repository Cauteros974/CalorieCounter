import * as Notifications from 'expo-notifications';

export async function requestPermissions() {
    const {status} = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function scheduleWaterRemindername() {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "It's time to drink some water! 💧",
            body: "Maintain hydration for optimal well-being",
        },
        trigger: {seconds: 7200, repeats: true},
    });
}