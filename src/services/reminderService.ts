import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const STORAGE_KEY = "invoice_notifications";

export const scheduleInvoiceReminder = async (
    invoiceId: string,
    invoiceNumber: string,
    dueDate: string,
    daysBefore: number,
    reminderTime: { hour: number; minute: number }

): Promise<string | null> => {
    try {
        const [year, month, day] = dueDate.split("-").map(Number);
        if (!year || !month || !day) {
            console.log("Invalid dueDate format:", dueDate);
            return null;
        }

        const due = new Date(year, month - 1, day);

        if (isNaN(due.getTime())) {
            console.log("Invalid parsed dueDate:", dueDate);
            return null;
        }

        const reminderDate = new Date(due);
        reminderDate.setDate(reminderDate.getDate() - daysBefore);

        reminderDate.setHours(reminderTime.hour, reminderTime.minute);

        const now = new Date();

        if (reminderDate.getTime() <= now.getTime()) {
            console.log(
                "Reminder skipped (already in past):",
                reminderDate.toString()
            );
            return null;
        }

        let trigger: Notifications.NotificationTriggerInput;

        if (Platform.OS === "android") {
            const seconds = Math.max(
                Math.floor((reminderDate.getTime() - now.getTime()) / 1000),
                1
            );

            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds,
                repeats: false,
            };
        } else {
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                year: reminderDate.getFullYear(),
                month: reminderDate.getMonth() + 1,
                day: reminderDate.getDate(),
                hour: 14,
                minute: 44,
                second: 0,
                repeats: false,
            };
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Invoice Payment Reminder 💰",
                body: `Due date for ${invoiceNumber} is reaching soon.`,
                sound: true,
            },
            trigger,
        });

        await storeNotificationMapping(invoiceId, notificationId);

        return notificationId;
    } catch (error) {
        console.log("Reminder error:", error);
        return null;
    }
};

export const storeNotificationMapping = async (
    invoiceId: string,
    notificationId: string
) => {
    try {
        const existing = await AsyncStorage.getItem(STORAGE_KEY);

        const map: Record<string, string> = existing
            ? JSON.parse(existing)
            : {};

        map[invoiceId] = notificationId;

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch (error) {
        console.log("Storage error:", error);
    }
};

export const cancelInvoiceReminder = async (invoiceId: string) => {
    try {
        const existing = await AsyncStorage.getItem(STORAGE_KEY);
        if (!existing) return;

        const map: Record<string, string> = JSON.parse(existing);

        const notificationId = map[invoiceId];
        if (!notificationId) return;

        await Notifications.cancelScheduledNotificationAsync(notificationId);

        delete map[invoiceId];

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch (error) {
        console.log("Cancel reminder error:", error);
    }
};