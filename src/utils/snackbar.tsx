import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { hideSnackbar } from '../redux/slices/snackbarSlice';
import { RootState } from '../redux/store/myStore';
import { mVs } from './scale';

const colors = {
    success: '#2DC653',
    info: '#F4A261',
    error: '#E63946',
    null: '#3333'
}

const SnackBar = () => {

    const translateY = new Animated.Value(50);
    const dispatch = useDispatch();
    const { visible, message, type } = useSelector((state: RootState) => state.snackbarReducer);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                dispatch(hideSnackbar());
            }, 2500);
            return () => clearTimeout((timer));
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { backgroundColor: colors[type], transform: [{ translateY }] }]}>
            <Text style={[styles.message]}>{message}</Text>
            <TouchableOpacity onPress={() => hideSnackbar()}>
                <Text style={[styles.dismiss]}>X</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default SnackBar

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: mVs(70),
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