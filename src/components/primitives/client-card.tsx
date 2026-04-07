import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import UserAvatar from './user-avatar'

interface ClientCardProps{
    clientName: string,
    organizationName: string,
    totalRevenue: string,
    createdAt: string,
    onPressed: () => void,
}

const ClientCard = ({clientName, createdAt, organizationName, totalRevenue, onPressed}: ClientCardProps) => {

    const { theme } = useTheme();

    return (
        <Pressable style={[styles.container, { backgroundColor: theme.background.secondary, borderColor: theme.border.primary }]} onPress={onPressed}>
            <View style={styles.leftContainer}>
                <UserAvatar name={clientName}/>
                <View style={{alignItems: 'flex-start', gap: 12}}>
                    <Text style={[styles.title, { color: theme.text.primary }]}>{clientName}</Text>
                    <Text style={[styles.subTitle, { color: theme.text.tertiary }]}>{organizationName}</Text>
                </View>
            </View>

            <View style={styles.rightContainer}>
                <Text style={[styles.revenue, { color: theme.text.tertiary }]}>${totalRevenue}</Text>
                <Text style={[styles.subTitle, { color: theme.text.tertiary }]}>{createdAt}</Text>
            </View>
        </Pressable>
    )
}

export default ClientCard

const styles = StyleSheet.create({
    container: {
        height: mVs(100),
        borderRadius: mVs(10),
        padding: mVs(20),
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: mVs(15),
        alignItems: 'center',
    },
    title: {
        fontSize: mVs(22),
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: mVs(13),
        fontWeight: 400,
    },
    leftContainer: {
        flexDirection: 'row',
        gap: 15
    },
    rightContainer: {
        gap: 12,
    },
    revenue: {
        fontSize: mVs(18),
        fontWeight: 'bold',
    }
})