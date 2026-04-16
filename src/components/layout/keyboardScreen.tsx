// KeyboardScreen.tsx
import { useTheme } from '@/src/hooks/useTheme';
import React from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    children: React.ReactNode;
    backgroundColor?: string;
    paddingHorizontal?: number;
    paddingVertical?: number;
};

const KeyboardScreen = ({
    children,
    backgroundColor,
    paddingHorizontal,
    paddingVertical = 0,
}: Props) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const bg = backgroundColor || theme.background.primary;

    return (
        <KeyboardAwareScrollView
            style={[styles.container, { backgroundColor: bg }]}
            contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal,
                paddingTop: insets.top + paddingVertical,
                paddingBottom: insets.bottom + paddingVertical,
            }}
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={20}
            showsVerticalScrollIndicator={false}
        >
            {children}
        </KeyboardAwareScrollView>
    );
};

export default KeyboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});