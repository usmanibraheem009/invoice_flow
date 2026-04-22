import { Screen } from "@/src/components/layout";
import SimpleButton from "@/src/components/primitives/simple-button";
import { useTheme } from "@/src/hooks/useTheme";
import { setLoading } from "@/src/redux/slices/loadingSlice";
import { showSnackbar } from "@/src/redux/slices/snackbarSlice";
import { AppDispatch, RootState } from "@/src/redux/store/myStore";
import { bootstrapAuth } from "@/src/redux/thunks/auth-thunk";
import NetInfo from "@react-native-community/netinfo";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function NoInternetScreen() {
    const { theme } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector((state: RootState) => state.loadingReducer.loading);

    const handleRetry = async () => {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            dispatch(setLoading(true));
            try {
                dispatch(bootstrapAuth() as any)
            } catch (error: any) {
                dispatch(showSnackbar({ message: error.message, type: 'error' }));
            } finally {
                dispatch(setLoading(false));
            }
        } else {
            dispatch(showSnackbar({ message: 'No internet connection', type: 'error' }));
            dispatch(setLoading(false))
        }
    };

    return (
        <Screen>
            <View style={styles.container}>
                <Text style={[styles.title, { color: theme.text.primary }]}>
                    No Internet Connection
                </Text>

                <Text style={[styles.subtitle, { color: theme.text.primary }]}>
                    Please check your internet and try again.
                </Text>

                <SimpleButton
                    btnText={loading ? <ActivityIndicator size={'large'} color="#ffff" /> : "Retry"}
                    onPress={handleRetry}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        textAlign: "center",
        marginBottom: 20,
    },
});