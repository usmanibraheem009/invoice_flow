// ScrollScreen.tsx
import { useTheme } from '@/src/hooks/useTheme';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    children: React.ReactNode;
    backgroundColor?: string;
    paddingHorizontal?: number;
    paddingVertical?: number;
};

const ScrollScreen = ({
    children,
    backgroundColor,
    paddingHorizontal,
    paddingVertical = 0,
}: Props) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const bg = backgroundColor || theme.background.primary;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: bg }]}
            contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal,
                paddingTop: insets.top + paddingVertical,
                paddingBottom: insets.bottom + paddingVertical,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {children}
        </ScrollView>
    );
};

export default ScrollScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});