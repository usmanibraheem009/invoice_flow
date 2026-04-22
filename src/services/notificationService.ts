import { isDevice } from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const requestNotificationPermission = async (): Promise<void> => {
    if (!isDevice) {
        console.log("Must use physical device for notifications");
        return;
    }

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } =
            await Notifications.requestPermissionsAsync();

        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        alert("Permission for notifications not granted!");
        return;
    }

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
            "default",
            {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
            }
        );
    }
};

export const setupNotificationChannel = async () => {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "Default",
            importance: Notifications.AndroidImportance.MAX,
            sound: "default",
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }
};