import { fetchCurrentUser } from '@/src/apis/authApi';
import { fetchOrganization } from '@/src/apis/organizationApi';
import { initI18n } from "@/src/locales/i18n";
import { setOrganization } from '@/src/redux/slices/organizationSlice';
import { AppDispatch, RootState } from '@/src/redux/store/myStore';
import { bootstrapAuth } from '@/src/redux/thunks/auth-thunk';
import { requestNotificationPermission, setupNotificationChannel } from '@/src/services/notificationService';
import NetInfo from "@react-native-community/netinfo";
import * as Notifications from "expo-notifications";
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

const AppContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const orgId = useSelector((state: RootState) => state.organizationReducer.data?.id);

    useEffect(() => {
        const init = async () => {
            Promise.all([await initI18n(),
            await dispatch(bootstrapAuth()),
            await dispatch(fetchCurrentUser())]);
            requestNotificationPermission();
            setupNotificationChannel();
        }

        init();
    }, [])

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected === false) {
                router.replace("/screens/no-internetScreen")
            }
        });
        return unsubscribe;
    }, []);


    useEffect(() => {
        const loadOrganization = async () => {
            try {
                if (!orgId) return;

                const res = await fetchOrganization(orgId);

                if (res?.data) {
                    dispatch(setOrganization(res.data));
                }

            } catch (error: any) {
                throw error;
            }
        };

        loadOrganization();
    }, [orgId]);


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="no-internetScreen" options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView>
    )
}

export default AppContent