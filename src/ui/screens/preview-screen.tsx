import { createInvoice, updateInvoice } from '@/src/apis/invoiceApi'
import InvoiceStatus from '@/src/components/invoice/invoice-status'
import ModalWrapper from '@/src/components/layout/modal-wrapper'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { clearInvoiceDraft, incrementInvoiceNumber, setInvoiceStatus, setNotes } from '@/src/redux/slices/invoiceSlice'
import { setLoading } from '@/src/redux/slices/loadingSlice'
import { showSnackbar } from '@/src/redux/slices/snackbarSlice'
import { RootState } from '@/src/redux/store/myStore'
import { cancelInvoiceReminder, scheduleInvoiceReminder, storeNotificationMapping } from '@/src/services/reminderService'
import { formatCurrency } from '@/src/utils/helper'
import { getClientById, mapInvoiceToApi, selectInvoiceGrandTotal, selectInvoiceStatus } from '@/src/utils/invoiceSelectors'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import { router } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const status = [
  { name: 'PAID', value: 'PAID' },
  { name: 'OVERDUE', value: 'OVERDUE' },
  { name: 'DRAFT', value: 'DRAFT' },
  { name: 'PENDING', value: 'PENDING' },
]


const formatTime = (hour: number, minute: number) => {
  const date = new Date()
  date.setHours(hour, minute)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const PreviewScreen = () => {

  const { theme } = useTheme()
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const draft = useSelector((state: RootState) => state.invoiceReducer.draft)
  const invoStatus = useSelector(selectInvoiceStatus)

  const daysOptions = [
    { name: `1 ${t('common.daysBefore')}`, value: '1' },
    { name: `2 ${t('common.daysBefore')}`, value: '2' },
    { name: `3 ${t('common.daysBefore')}`, value: '3' },
    { name: `5 ${t('common.daysBefore')}`, value: '5' },
  ];
  const [reminderEnabled, setReminderEnabled] = useState(invoStatus !== 'PAID')
  const [daysBefore, setDaysBefore] = useState(1)
  const [reminderTime, setReminderTime] = useState<{ hour: number; minute: number }>({ hour: 9, minute: 0 })
  const [statusModal, setStatusModal] = useState(false)
  const [timeModal, setTimeModal] = useState(false)
  const [daysModal, setDaysModal] = useState(false)

  const notes = draft.notes
  const isEditMode = Boolean(draft.invoiceId)
  const finalData = React.useMemo(() => mapInvoiceToApi(draft), [draft])
  const clientName = useSelector(getClientById)
  const grandTotal = useSelector(selectInvoiceGrandTotal)

  const reminderDate = useMemo(() => {
    const date = new Date()
    date.setHours(reminderTime.hour, reminderTime.minute, 0, 0)
    return date
  }, [reminderTime])

  const handleStatusChange = (item: any) => {
    setStatusModal(false)
    dispatch(setInvoiceStatus(item.value))
    if (item.value === 'PAID') {
      setReminderEnabled(false)
      cancelInvoiceReminder(draft.invoiceId!)
    } else {
      setReminderEnabled(true)
    }
  }

  const handleSubmit = async (values: any) => {
    dispatch(setLoading(true))
    try {
      let response
      if (isEditMode) {
        response = await updateInvoice(draft.invoiceId!, draft)
        dispatch(showSnackbar({ message: `${t('common.updatedMessage', { param: `${t('invoice.title')}` })}`, type: 'success' }))
      } else {
        response = await createInvoice(finalData)
        if (response?.success) {
          dispatch(incrementInvoiceNumber());
          dispatch(clearInvoiceDraft())
        }
      }

      if (reminderEnabled) {
        const invoiceId = isEditMode ? draft.invoiceId : response.data.id
        const notificationId = await scheduleInvoiceReminder(
          invoiceId,
          draft.invoiceNumber,
          draft.dueDate,
          daysBefore,
          reminderTime
        )
        if (notificationId) {
          await storeNotificationMapping(invoiceId, notificationId)
        }
      }

      dispatch(showSnackbar({ message: `${t('common.createdMsg', { param: `${t('invoice.title')}` })}`, type: 'success' }))
      router.replace('/(tabs)/invoices')
      await AsyncStorage.setItem('lastInvoiceNumber', values.invoiceNumber)
    } catch (error: any) {
      dispatch(showSnackbar({ message: error.message, type: 'error' }))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <View style={{ flexGrow: 1 }}>
      <ScreenWrapper scrollable paddingVertical={10} keyboardAvoidingView>
        <AuthHeader arrowBack title={t('invoice.step3')} />

        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.text.primary }]}>{t('common.preview')}</Text>

          <View style={[styles.invoiceContainer, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
            <View style={[styles.insideContainer, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
              <View>
                <Text style={[styles.invoiceNumber, { color: theme.text.primary }]}>{draft.invoiceNumber}</Text>
                <Text style={[styles.user, { color: theme.text.primary }]}>{t('invoice.to')}: {clientName}</Text>
              </View>
              <View style={{ gap: 10, alignItems: 'flex-end' }}>
                <InvoiceStatus status={invoStatus} />
              </View>
            </View>

            <View style={[styles.invoiceTemp, { borderBottomColor: theme.border.secondary }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.lineItems, styles.colItem, { color: theme.text.tertiary }]}>{t('invoice.item')}</Text>
                <Text style={[styles.lineItems, styles.colQty, { color: theme.text.tertiary }]}>{t('invoice.quantity')}</Text>
                <Text style={[styles.lineItems, styles.colPrice, { color: theme.text.tertiary }]}>{t('invoice.price')}</Text>
                <Text style={[styles.lineItems, styles.colTotal, { color: theme.text.tertiary }]}>{t('invoice.total')}</Text>
              </View>
              {draft.lineItems?.map((item: any) => (
                <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, width: '100%' }}>
                  <Text style={[styles.item, styles.colItem, { color: theme.text.primary }]} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
                  <Text style={[styles.item, styles.colQty, { color: theme.text.primary }]}>{item.type === 'Product' ? `${item.quantity}` : `${item.quantity}`}</Text>
                  <Text style={[styles.price, styles.colDataPrice, { color: theme.text.secondary }]}>{formatCurrency(Number(item.unitPrice), draft.currency)}</Text>
                  <Text style={[styles.colPrice, { color: theme.text.primary }]}>{formatCurrency(Number(item.quantity) * Number(item.unitPrice), draft.currency)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.billingBox}>
              <Text style={[styles.item, { color: theme.text.secondary }]}>{t('invoice.grandTotal')}</Text>
              <Text style={[styles.amount, { color: theme.text.secondary }]}>$ {grandTotal}</Text>
            </View>
          </View>

          <View style={styles.notesContainer}>
            <Text style={[styles.label, { color: theme.text.secondary }]}>{t('invoice.noteToClients')}</Text>
            <InputTab icon={<Ionicons name='pencil' color={theme.text.secondary} size={24} />} numberOfLines={2} multiline placeholder='Add a note...' value={notes} onChangeText={(text) => dispatch(setNotes(text))} />
          </View>

          <Text style={[styles.label, { color: theme.text.secondary, marginTop: mVs(20), marginBottom: mVs(10) }]}>{t('invoice.invoiceStatus')}</Text>
          <Pressable onPress={() => setStatusModal(true)}>
            <InputTab placeholder='Select Status' value={invoStatus} editable={false} />
          </Pressable>

          <View style={[styles.reminderCard, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>

            <View style={styles.reminderToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.reminderTitle, { color: theme.text.primary }]}>{t('invoice.reminder')}</Text>
                <Text style={[styles.reminderSubtitle, { color: theme.text.secondary }]}>
                  {reminderEnabled ? t('invoice.reminderScheduled') : t('invoice.noReminder')}
                </Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={(val) => {
                  if (invoStatus === 'PAID') return
                  setReminderEnabled(val)
                }}
                trackColor={{ false: theme.border.secondary, true: theme.border.secondary }}
                thumbColor={reminderEnabled ? theme.text.secondary : theme.text.secondary}
                disabled={invoStatus === 'PAID'}
              />
            </View>

            {reminderEnabled && (
              <View style={[styles.reminderPickersRow, { borderTopColor: theme.border.secondary }]}>
                <Pressable style={{ flex: 1 }} onPress={() => setDaysModal(true)}>
                  <InputTab
                    placeholder='Days before due'
                    value={daysOptions.find(d => Number(d.value) === daysBefore)?.name ?? ''}
                    editable={false}
                  />
                </Pressable>
                <Pressable style={{ flex: 1 }} onPress={() => setTimeModal(true)}>
                  <InputTab
                    placeholder='Reminder time'
                    value={formatTime(reminderTime.hour, reminderTime.minute)}
                    editable={false}
                  />
                </Pressable>
              </View>
            )}
          </View>

          {timeModal && (
            <DateTimePicker
              value={reminderDate}
              mode='time'
              display='spinner'
              onChange={(event, selectedDate) => {
                if (event.type === 'dismissed') {
                  setTimeModal(false)
                  return
                }
                if (selectedDate) {
                  setReminderTime({
                    hour: selectedDate.getHours(),
                    minute: selectedDate.getMinutes(),
                  })
                  setTimeModal(false)
                }
              }}
            />
          )}

        </View>
      </ScreenWrapper>

      <ModalWrapper visible={statusModal} modalTitle='Select status' data={status} labelKey='name' valueKey='value'
        onClose={() => setStatusModal(false)} onItemPress={handleStatusChange} />

      <ModalWrapper visible={daysModal} modalTitle={t('common.remindMe')} data={daysOptions} labelKey='name' valueKey='value'
        onClose={() => setDaysModal(false)}
        onItemPress={(item) => { setDaysBefore(Number(item.value)); setDaysModal(false) }} />

      <ScreenFooter leadingButton>
        <SimpleButton btnText={t('common.confirm')} onPress={() => handleSubmit(finalData)} />
      </ScreenFooter>
    </View>
  )
}

export default PreviewScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: mVs(20),
  },
  title: {
    fontSize: mVs(26),
    fontWeight: 'bold',
    marginTop: mVs(20),
  },
  invoiceContainer: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: mVs(20),
    marginTop: mVs(30),
  },
  insideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceNumber: {
    fontSize: mVs(24),
    fontWeight: '600',
  },
  user: {
    fontSize: mVs(16),
    fontWeight: 'bold',
    marginTop: mVs(15),
  },
  amount: {
    fontSize: mVs(14),
    fontWeight: '500',
    marginTop: mVs(5),
  },
  label: {
    fontSize: mVs(14),
    fontWeight: '500',
  },
  lineItems: {
    fontSize: mVs(18),
    fontWeight: 'bold',
  },
  notesContainer: {
    marginTop: mVs(40),
    gap: 8,
  },
  item: {
    fontSize: mVs(14),
    fontWeight: '500',
  },
  price: {
    fontSize: mVs(14),
    fontWeight: '500',
  },
  billingBox: {
    marginTop: mVs(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colItem: { width: '40%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  colDataPrice: { width: '20%', textAlign: 'center' },
  colTotal: { width: '25%', textAlign: 'right' },
  invoiceTemp: {
    marginTop: 30,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  // Reminder card styles
  reminderCard: {
    marginTop: mVs(20),
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  reminderToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: mVs(16),
  },
  reminderTitle: {
    fontSize: mVs(14),
    fontWeight: '600',
  },
  reminderSubtitle: {
    fontSize: mVs(12),
    marginTop: 2,
  },
  reminderPickersRow: {
    gap: mVs(10),
    padding: mVs(16),
    borderTopWidth: 1,
  },
})

function useTranlation(): { t: any } {
  throw new Error('Function not implemented.')
}
