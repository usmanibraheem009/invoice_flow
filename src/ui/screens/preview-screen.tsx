import InvoiceStatus from '@/src/components/invoice/invoice-status'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const PreviewScreen = () => {

  const { theme } = useTheme();

  return (
    <ScreenWrapper>
      <AuthHeader arrowBack title='Step 3 of 3' />

      <View style={[styles.container]}>
        <Text style={[styles.title, { color: theme.text.primary }]} >Review & Send</Text>

        <View style={[styles.invoiceContainer, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
          <View>
            <Text style={[styles.invoiceNumber, { color: theme.text.primary }]}>INV-0043</Text>
            <Text style={[styles.user, { color: theme.text.primary }]}>To: Tony Stark</Text>
            <Text style={[styles.amount, { color: theme.text.secondary }]}>Amount: $6450.00</Text>
          </View>
          <View>
            <InvoiceStatus status='DRAFT' />
          </View>
        </View>

        <View style={styles.notesContainer}>
          <Text style={[styles.label, {color: theme.text.secondary}]}>NOTES TO CLIENT</Text>
          <InputTab icon={<Ionicons name='pencil' color={theme.text.secondary} size={24}/>} placeholder='Add a note...' />
        </View>

      </View>

      <ScreenFooter backButton>
        <SimpleButton btnText='Send Now' onPress={() => {router.replace('/(tabs)')}} />
      </ScreenFooter>

    </ScreenWrapper>
  )
}

export default PreviewScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: mVs(26),
    fontWeight: 'bold',
    marginTop: mVs(20),
  },
  invoiceContainer: {
    height: 'auto',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: mVs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: mVs(30)
  },
  invoiceNumber: {
    fontSize: mVs(24),
    fontWeight: 600,
  },
  user: {
    fontSize: mVs(16),
    fontWeight: 'bold',
    marginTop: mVs(15)
  },
  amount: {
    fontSize: mVs(12),
    fontWeight: 500,
    marginTop: mVs(5)
  },
  label: {
    fontSize: mVs(14),
    fontWeight: 500,
  },
  notesContainer:{
    marginTop: mVs(40),
    gap: 8
  }
})