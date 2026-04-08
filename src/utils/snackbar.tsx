import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { mVs } from './scale';

interface snackbarProps {
    message: string,
    duration?: number,
    type: 'success' | 'error' | 'info',
    onDismiss: () => void,
}

const colors = {
    success: '#2DC653',
    info: '#F4A261',
    error: '#E63946',
}

const SnackBar = ({ message, onDismiss, duration = 3000, type }: snackbarProps) => {

    const [visible, setVisible] = useState(false);
    const translateY = new Animated.Value(50);

    useEffect(() => {
        setVisible(true);
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            hideSnackBar();
        }, duration);

        return () => clearTimeout((timer));
    }, [message]);

    const hideSnackBar = () => {
        Animated.timing(translateY, {
            toValue: 50,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
            onDismiss && onDismiss();
        });
    };

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { backgroundColor: colors[type], transform: [{ translateY }] }]}>
            <Text style={[styles.message]}>{message}</Text>
            <TouchableOpacity onPress={onDismiss}>
                <Text style={[styles.dismiss]}>X</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default SnackBar

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: mVs(70),
        left: 20,
        right: 20,
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        opacity: .7
    },
    message: {
        color: '#ffff',
        flex: 1
    },
    dismiss: {
        color: '#ffff',
        fontWeight: 'bold',
        marginLeft: 10
    }
})