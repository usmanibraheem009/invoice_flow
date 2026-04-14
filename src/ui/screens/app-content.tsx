import { fetchCurrentUser, isTokenExpired } from '@/src/apis/authApi';
import { fetchOrganization } from '@/src/apis/organizationApi';
import { loadSessionFromStore, setSession } from '@/src/redux/slices/authSlice';
import { setOrganization } from '@/src/redux/slices/organizationSlice';
import { refreshAccessToken } from '@/src/services/tokenService';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

const AppContent = () => {


    const dispatch = useDispatch();

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
            const res = await fetchOrganization('ed947957-9fc9-4e46-9a4b-6bc9cd1ed297');
            dispatch(setOrganization(res.data))
          }catch(error: any){
            console.log(error);
          }
        };
    
        loadOrganization();
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