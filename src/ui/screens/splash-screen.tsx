import { useTheme } from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const SplashScreen = () => {
    const { theme } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.surface.secondary }]}>
            <Image source={require('../../../assets/images/icon.png')}
                style={styles.image}
            />
            <ActivityIndicator color='#fff' size={'large'} />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: mVs(250),
        height: mVs(250),
        resizeMode: 'contain',
        marginBottom: 20
    }
})