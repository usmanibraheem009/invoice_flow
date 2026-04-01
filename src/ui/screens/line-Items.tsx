import ProductCard from '@/src/components/invoice/product-card'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const LineItems = () => {

    const { theme } = useTheme();

    const services = [
        { id: '1', title: 'Software Consulting', pricePerHour: 150 },
        { id: '2', title: 'UI Design Kit', pricePerHour: 450 },
        { id: '7', title: 'UI Design Kit', pricePerHour: 450 },
        { id: '8', title: 'UI Design Kit', pricePerHour: 450 },
        { id: '3', title: 'Software Development', pricePerHour: 250 },
        { id: '4', title: 'Food Web', pricePerHour: 150 },
        { id: '5', title: 'Food Web', pricePerHour: 150 },
        { id: '6', title: 'Food Web', pricePerHour: 150 },
    ]

    const submitFunc = async () => {

    };

    return (
        <ScreenWrapper keyboardAvoidingView >

            <AuthHeader arrowBack title='Step 2 of 3' />

            <View style={{ flex: 1, backgroundColor: theme.background.primary, paddingHorizontal: 20, maxHeight: 500 }}>
                <Text style={[styles.title, { color: theme.text.primary }]} > Line Items </Text>
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap: 12, marginTop: 20, paddingBottom: 20 }}
                    renderItem={({ item }) => {
                        return (
                            <ProductCard title={item.title} price={item.pricePerHour} hours={4} />
                        )
                    }}>
                </FlatList>
            </View>

            <Pressable onPress={() => { }} style={[styles.addItemContainer, { borderBottomColor: theme.border.secondary }]}>
                <Text style={[styles.addItem, { color: theme.text.secondary }]}>+ Add New Item</Text>
            </Pressable>

            <View style={styles.statsBox}>
                <Text style={[styles.subtotal, { color: theme.text.secondary }]}>SUBTOTAL ESTIMATE</Text>
                <Text style={[styles.totalPrice]}>$6450.00</Text>
            </View>

            <ScreenFooter backButton>
                <SimpleButton btnText='NEXT STEP' onPress={() => { router.push('/screens/preview-screen') }} />
            </ScreenFooter>
        </ScreenWrapper>
    )
}

export default LineItems

const styles = StyleSheet.create({
    title: {
        fontSize: mVs(26),
        fontWeight: 'bold',
        marginTop: mVs(20),
    },
    label: {
        fontSize: mVs(14),
        fontWeight: '500',
        marginTop: mVs(20),
        marginBottom: mVs(3),
    },
    bottomNav: {
        height: 100,
        width: '100%',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        position: 'absolute',
        padding: 16,
        bottom: 0,
        right: 0,
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    addItemContainer: {
        marginTop: mVs(20),
        marginHorizontal: mVs(20),
        paddingBottom: mVs(20),
        borderBottomWidth: 1,
    },
    addItem: {
        fontSize: mVs(18),
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    subtotal: {
        fontSize: mVs(14),
        fontWeight: 600,
    },
    totalPrice: {
        fontSize: mVs(26),
        fontWeight: 600,
        color: '#00A896'
    },
    statsBox: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        marginHorizontal: mVs(20),
        marginTop: mVs(20),
    },
    backButton: {
        height: mVs(50),
        width: mVs(90),
        borderRadius: 30,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    back: {
        fontSize: mVs(18),
        fontWeight: 'bold',
    }
})