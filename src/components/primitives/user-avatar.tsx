import { mVs } from '@/src/utils/scale'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const UserAvatar = () => {
    return (
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>JS</Text>
        </View>
    )
}

export default UserAvatar

const styles = StyleSheet.create({
    avatar: {
        height: mVs(55),
        width: mVs(55),
        borderRadius: mVs(50),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2E4057',
        borderWidth: 4,
        borderColor: 'grey'
    },
    avatarText: {
        fontSize: mVs(24),
        fontWeight: 'bold',
        color: '#ffff'
    }
})