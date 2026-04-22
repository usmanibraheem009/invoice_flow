import { fetchCurrentUser, isTokenExpired } from '@/src/apis/authApi';
import { fetchOrganization } from '@/src/apis/organizationApi';
import { loadSessionFromStore, setSession } from '@/src/redux/slices/authSlice';
import { setOrganization } from '@/src/redux/slices/organizationSlice';
import { RootState } from '@/src/redux/store/myStore';
import { requestNotificationPermission, setupNotificationChannel } from '@/src/services/notificationService';
import { refreshAccessToken } from '@/src/services/tokenService';
import * as Notifications from "expo-notifications";
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

const AppContent = () => {


    const dispatch = useDispatch();
    const organization = useSelector((state: RootState) => state.organizationReducer.data);
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });

    useEffect(() => {
        const bootstrapAuth = async () => {
            const session = await loadSessionFromStore();

            if (!session?.isLoggedIn) {
                router.replace('/screens/login-screen');
                return;
            }

            const expired = await isTokenExpired();
            if (expired) {
                const newToken = await refreshAccessToken();

                if (!newToken) {
                    router.replace('/screens/login-screen');
                    return;
                }
            };

            dispatch(setSession(session));

            setTimeout(() => {
                router.replace('/(tabs)');
            }, 3000)
        };

        bootstrapAuth();
    }, []);

    useEffect(() => {
        dispatch(fetchCurrentUser() as any);
    }, []);

    useEffect(() => {
        const loadOrganization = async () => {
            try {
                if (!organization?.id) return; // ✅ GUARD

                const res = await fetchOrganization(organization.id);

                if (res?.data) {
                    dispatch(setOrganization(res.data));
                }

            } catch (error: any) {
                console.log("Error loading org: ", error);
            }
        };

        loadOrganization();
    }, [organization?.id]);

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    useEffect(() => {
        setupNotificationChannel();
    }, []);

    return (
        <GestureHandlerRootView>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView>
    )
}

export default AppContent