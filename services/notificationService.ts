import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
});

export async function requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function scheduleWaterReminder() {
    const granted = await requestPermissions();

    if(!granted) {
        console.log('Permision not granted');
        return;
    }

    //Clean old notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "It's time to drink some water! 💧",
            body: "Maintain hydration for optimal well-being",
        },
        trigger: {
            seconds: 7200, //2 hours
            repeats: true,
        } as Notifications.TimeIntervalTriggerInput,
    });
}