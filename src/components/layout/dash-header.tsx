import { useTheme } from '@/src/hooks/useTheme'
import { RootState } from '@/src/redux/store/myStore'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import UserAvatar from '../client/user-avatar'

const DashHeader = ({ greeting }: { greeting: string }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const user = useSelector((state: RootState) => state.userReducer.user);

    const underDev = () => {
        Alert.alert(`${t('common.warning')}`, `${t('common.underDevelopment')}`, [
            { text: `${t('common.ok')}` }
        ])
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.greeting, { color: theme.text.secondary }]}>{greeting},</Text>
                <Text style={[styles.userName, { color: theme.text.primary }]}>{user?.fullName}</Text>
            </View>
            <View style={styles.rightContainer}>
                <Ionicons name='notifications-outline' size={mVs(30)} color={theme.text.primary} onPress={() => underDev()} />
                <UserAvatar name={user?.fullName || 'NA'} />
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