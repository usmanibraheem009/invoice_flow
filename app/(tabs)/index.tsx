import InvoiceCard from '@/src/components/invoice/invoice-card'
import ReportCard from '@/src/components/invoice/report-card'
import { Screen } from '@/src/components/layout'
import DashHeader from '@/src/components/layout/dash-header'
import FloatingButton from '@/src/components/primitives/floating-button'
import { useTheme } from '@/src/hooks/useTheme'
import { fetchInvoices } from '@/src/redux/slices/invoiceListSlice'
import { AppDispatch, RootState } from '@/src/redux/store/myStore'
import { dateformatter } from '@/src/utils/date-formatter'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const index = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [greetings, setGreetings] = useState('');

  useEffect(() => {
    dispatch(fetchInvoices({ page: 1, limit: 3 }));
  }, []);

  useEffect(() => {
    setGreetings(getGreetings())
    const updateGreeting = () => {
      setGreetings(getGreetings());
    };

    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);

  }, []);

  const getGreetings = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return `${t('greetings.goodMorning')} ☀️`;
    } else if (currentHour < 16) {
      return `${t('greetings.goodNoon')} 🌤️`
    } else if (currentHour < 18) {
      return `${t('greetings.goodAfternoon')} 🌤️`
    } else if (currentHour >= 18 && currentHour < 20) {
      return `${t('greetings.goodEvening')} 🌙`;
    } else {
      return `${t('greetings.goodNight')} 🌙`;
    }
  };

  const allInvoices = useSelector((state: RootState) => state.invoicesListReducer.invoices)
  const invoices = useMemo(() => allInvoices.slice(0, 3), [allInvoices]);

  const handleOnPress = (invoiceId: string) => {
    router.push({
      pathname: '/screens/invoice-details',
      params: { invoiceId: invoiceId }
    });
  };


  return (
    <Screen paddingHorizontal={16} >
      <DashHeader greeting={greetings} />

      <View style={styles.scrollView}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <ReportCard />
          <ReportCard />
          <ReportCard />
        </ScrollView>
      </View>

      <View style={styles.seeMore}>
        <Text style={[styles.invoiceText, { color: theme.text.primary }]}>{t('common.recentInvoices')}</Text>
        <Pressable onPress={() => router.push('/(tabs)/invoices')}><Text style={[styles.seeAll, { color: theme.text.tertiary }]}>{t('common.seeAll')}</Text></Pressable>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, marginTop: mVs(20) }}
        ListEmptyComponent={() => (<Text style={[styles.dummyText, { color: theme.text.secondary }]}>{t('common.dummyText', { param: t('invoice.invoices') })}</Text>)}
        renderItem={({ item }) => (
          <InvoiceCard title={item.client?.name ?? 'Deleted Client'} invoiceNumber={item.invoiceNumber} status={item.status} price={Number(item.totalAmount)} issueDate={dateformatter(item.issueDate)} onPress={() => handleOnPress(item.id)} />
        )}
      />

      <FloatingButton icon='add' onPress={() => { router.push('/screens/add-invoice') }} />

    </Screen>
  )
}

export default index

const styles = StyleSheet.create({
  scrollView: {
    height: 'auto',
    marginTop: mVs(30)
  },
  scrollContainer: {
    paddingRight: mVs(10),
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  seeMore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mVs(30)
  },
  invoiceSection: {
    marginTop: mVs(20),
  },
  invoiceText: {
    fontSize: mVs(22),
    fontWeight: 'bold'
  },
  seeAll: {
    fontSize: mVs(14),
    fontWeight: 'bold',
  },
  dummyText: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: mVs(16),
    fontWeight: 500
  }
})