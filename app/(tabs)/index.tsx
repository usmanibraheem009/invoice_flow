import InvoiceCard from '@/src/components/invoice/invoice-card'
import ReportCard from '@/src/components/invoice/report-card'
import { Screen } from '@/src/components/layout'
import DashHeader from '@/src/components/layout/dash-header'
import FloatingButton from '@/src/components/primitives/floating-button'
import { useTheme } from '@/src/hooks/useTheme'
import { fetchInvoices } from '@/src/redux/slices/invoiceListSlice'
import { AppDispatch } from '@/src/redux/store/myStore'
import { dateformatter } from '@/src/utils/date-formatter'
import { selectEnrichedInvoices } from '@/src/utils/invoiceSelectors'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const index = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const [greetings, setGreetings] = useState('');

  useEffect(() => {
    setGreetings(getGreetings());
  }, []);

  useEffect(() => {
    dispatch(fetchInvoices({ page: 1, limit: 3 }));
  }, []);

  useEffect(() => {

    const updateGreeting = () => {
      setGreetings(getGreetings());
    };

    updateGreeting();

    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);

  }, []);

  const getGreetings = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'GOOD MORNING ☀️';
    } else if (currentHour < 16) {
      return 'GOOD NOON 🌤️'
    } else if (currentHour < 18) {
      return 'GOOD AFTERNOON 🌤️'
    } else if (currentHour >= 18 && currentHour < 20) {
      return 'GOOD EVENING 🌙';
    } else {
      return 'GOOD NIGHT 🌙';
    }
  };

  const invoices = useSelector(selectEnrichedInvoices);

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
        <Text style={[styles.invoiceText, { color: theme.text.primary }]}>Recent Invoices</Text>
        <Pressable onPress={() => router.push('/(tabs)/invoices')}><Text style={[styles.seeAll, { color: theme.text.tertiary }]}>See all</Text></Pressable>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, marginTop: mVs(20) }}
        renderItem={({ item }) => (
          <InvoiceCard title={item.clientName} invoiceNumber={item.invoiceNumber} status={item.status} price={item.price} issueDate={dateformatter(item.issueDate)} onPress={() => handleOnPress(item.id)} />
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
    paddingRight: mVs(100),
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  floatingButton: {
    height: 60,
    width: 60,
    borderRadius: 60,
    position: 'absolute',
    right: 30,
    bottom: 20,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
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
  }
})