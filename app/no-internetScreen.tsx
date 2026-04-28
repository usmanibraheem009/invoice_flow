import { Screen } from "@/src/components/layout";
import SimpleButton from "@/src/components/primitives/simple-button";
import { useTheme } from "@/src/hooks/useTheme";
import { showSnackbar } from "@/src/redux/slices/snackbarSlice";
import { AppDispatch } from "@/src/redux/store/myStore";
import { bootstrapAuth } from "@/src/redux/thunks/auth-thunk";
import NetInfo from "@react-native-community/netinfo";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function NoInternetScreen() {
    const { theme } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);

    const handleRetry = async () => {
        setLoading(true);
        console.log("set loading: true");
        try {
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                dispatch(bootstrapAuth() as any)
            } else {
                dispatch(showSnackbar({ message: 'No internet connection', type: 'error' }));
            }
        } catch (error: any) {
            dispatch(showSnackbar({ message: error.message, type: 'error' }));
        } finally {
            setLoading(false);
            console.log("set loading: false");
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
                    btnText={"Retry"}
                    onPress={handleRetry}
                    loading={loading}
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