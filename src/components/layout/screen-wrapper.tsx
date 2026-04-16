import { useTheme } from '@/src/hooks/useTheme'
import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface screenWrapperProps {
    children: ReactNode,
    scrollable?: boolean,
    safeArea?: boolean,
    backgroundColor?: string,
    paddingHorizontal?: number,
    paddingVertical?: number,
    keyboardAvoidingView?: boolean,
}
const ScreenWrapper = ({
    children,
    scrollable = false,
    safeArea = false,
    backgroundColor,
    paddingHorizontal,
    paddingVertical = 0,
    keyboardAvoidingView = true
}: screenWrapperProps) => {

    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const bgColor = backgroundColor || theme.background.primary;

    const containerPadding = {
        paddingHorizontal,
        paddingTop: safeArea ? insets.top + paddingVertical : paddingVertical,
        paddingBottom: safeArea ? insets.bottom + paddingVertical : paddingVertical,
    };

    if (scrollable || keyboardAvoidingView) {
        return (
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: bgColor }}
                contentContainerStyle={[
                    {
                        flexGrow: 1,
                        ...containerPadding,
                    }
                ]}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </KeyboardAwareScrollView>
        );
    }

    return (
        <View style={[{ flex: 1, backgroundColor: bgColor }, containerPadding]}>
            {children}
        </View>
    );
};

export default ScreenWrapper

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    keyboardAvoiding: {
        flex: 1
    },
    scrollView: {
        flexGrow: 1,
    },
    scrollContent: {
        flexGrow: 1
    }
});