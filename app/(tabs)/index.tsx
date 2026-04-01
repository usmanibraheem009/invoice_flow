import InvoiceCard from '@/src/components/invoice/invoice-card'
import ReportCard from '@/src/components/invoice/report-card'
import DashHeader from '@/src/components/layout/dash-header'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import FloatingButton from '@/src/components/primitives/floating-button'
import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const index = () => {

  const mode = useSelector((state: any) => state.themeReducer.currentMode);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const invoices = [
    { id: '1', title: 'Invoice #001', status: 'PAID', price: 3400, issueDate: '30-OCT-2024' },
    { id: '2', title: 'Invoice #002', status: 'PENDING', price: 3080, issueDate: '01-DEC-2024' },
    { id: '3', title: 'Invoice #003', status: 'OVERDUE', price: 2810, issueDate: '07-FEB-2025' },
    
  ];

  return (
    <ScreenWrapper paddingHorizontal={16} safeArea>
      <DashHeader />

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
        contentContainerStyle={{gap: 12, marginTop: mVs(20)}}
        renderItem={({ item }) => (
          <InvoiceCard title={item.title} status={item.status} price={item.price} issueDate={item.issueDate} />
        )}
      />

      <FloatingButton icon='add' onPress={() => {router.push('/screens/add-invoice')}} />

    </ScreenWrapper>
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