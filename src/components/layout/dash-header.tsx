import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import UserAvatar from '../primitives/user-avatar'

const DashHeader = () => {
    const {theme} = useTheme();

    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.greeting, {color: theme.text.secondary}]}>GOOD MORNING,</Text>
                <Text style={[styles.userName,{color: theme.text.primary}]}>Sarah Jenkins</Text>
            </View>
           <View style={styles.rightContainer}>
             <Ionicons name='notifications-outline' size={mVs(30)} color={theme.text.primary}/>
             <UserAvatar />
           </View>
            
        </View>
    )
}

export default DashHeader

const styles = StyleSheet.create({
    container: {
        height: mVs(90),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    greeting: {
        fontSize: mVs(16),
        fontWeight: 500,
    },
    userName: {
        fontSize: mVs(24),
        fontWeight: 'bold',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13
    }
    
})