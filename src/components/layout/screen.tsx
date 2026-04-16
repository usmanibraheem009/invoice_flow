// Screen.tsx
import { useTheme } from '@/src/hooks/useTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    children: React.ReactNode;
    backgroundColor?: string;
    paddingHorizontal?: number;
    paddingVertical?: number;
};

const Screen = ({
    children,
    backgroundColor,
    paddingHorizontal,
    paddingVertical = 0,
}: Props) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const bg = backgroundColor || theme.background.primary;

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: bg,
                    paddingHorizontal,
                    paddingTop: insets.top + paddingVertical,
                    paddingBottom: insets.bottom + paddingVertical,
                },
            ]}
        >
            {children}
        </View>
    );
};

export default Screen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});