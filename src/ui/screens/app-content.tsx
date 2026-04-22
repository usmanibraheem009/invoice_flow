import { fetchCurrentUser } from '@/src/apis/authApi';
import { fetchOrganization } from '@/src/apis/organizationApi';
import { setOrganization } from '@/src/redux/slices/organizationSlice';
import { RootState } from '@/src/redux/store/myStore';
import { bootstrapAuth } from '@/src/redux/thunks/auth-thunk';
import { requestNotificationPermission, setupNotificationChannel } from '@/src/services/notificationService';
import NetInfo from "@react-native-community/netinfo";
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
        const unsubscribe = NetInfo.addEventListener(state => {
            if (!state.isConnected) {
                router.replace("/screens/no-internetScreen")
            }
        });
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        dispatch(bootstrapAuth() as any);
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
                <Stack.Screen name="no-internetScreen" options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView>
    )
}

export default AppContent