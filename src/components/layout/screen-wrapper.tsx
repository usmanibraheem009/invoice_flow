import useTheme from '@/src/hooks/useTheme'
import React, { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
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

    const {theme} = useTheme();
    
    const bgColor = backgroundColor || theme.background.primary;
    const insets = useSafeAreaInsets()

    const content = (
        <View style={[styles.container, {
            backgroundColor: bgColor,
            paddingHorizontal,
            paddingTop: safeArea ? insets.top + paddingVertical : paddingVertical,
            paddingBottom: safeArea ? insets.bottom + paddingVertical : paddingVertical
        }]}>
            {children}
        </View>
    );

    if (scrollable) {
        const scrollContent = (
            <ScrollView style={[styles.scrollView, { backgroundColor: bgColor }]}
                contentContainerStyle={[styles.scrollContent, {
                    paddingHorizontal,
                    paddingTop: safeArea ? insets.top + paddingVertical : paddingVertical,
                    paddingBottom: safeArea ? insets.bottom + paddingVertical : paddingVertical,
                    flexGrow: 1
                }]}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>
                {children}
            </ScrollView>
        );

        if (keyboardAvoidingView) {
            return (
                <KeyboardAvoidingView style={[styles.keyboardAvoiding, { backgroundColor: bgColor }]}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    {scrollContent}
                </KeyboardAvoidingView>
            )
        };
        return scrollContent;
    }

    if (keyboardAvoidingView) {
        return (
            <KeyboardAvoidingView style={[styles.keyboardAvoiding, { backgroundColor: bgColor }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    {content}
            </KeyboardAvoidingView>
        )
    };

    return content;
}

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
    scrollContent:{ 
        flexGrow: 1
    }
});