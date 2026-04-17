import FilterButton from '@/src/components/invoice/filter-button'
import InvoiceCard from '@/src/components/invoice/invoice-card'
import { Screen } from '@/src/components/layout'
import LoadingIndicator from '@/src/components/layout/loading-indicator'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import FloatingButton from '@/src/components/primitives/floating-button'
import { fetchInvoices } from '@/src/redux/slices/invoiceListSlice'
import { AppDispatch, RootState } from '@/src/redux/store/myStore'
import AuthHeader from '@/src/ui/components/screen-header'
import { dateformatter } from '@/src/utils/date-formatter'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const Invoices = () => {

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Drafts', value: 'DRAFT' },
  ];


  const [activeFilter, setActiveFilter] = useState('all');
  const dispatch = useDispatch<AppDispatch>();
  const invoices = useSelector((state: RootState) => state.invoicesListReducer.invoices);


  useEffect(() => {
    dispatch(fetchInvoices({ page: 1, limit: 10 }));
  }, []);

  const filteredInvoices = useMemo(() => {
    if (!invoices) return;

    if (activeFilter === 'all') {
      return invoices;
    }
    return invoices.filter((invoice) => invoice.status === activeFilter)
  }, [invoices, activeFilter]);



  const handleOnPress = (invoiceId: string) => {
    router.push({
      pathname: '/screens/invoice-details',
      params: { invoiceId: invoiceId }
    });
  };

  if (!invoices) {
    return (
      <ScreenWrapper>
        <LoadingIndicator />
      </ScreenWrapper>
    );
  }

  return (
    <Screen>
      <AuthHeader title='Invoices' trailingIcon='funnel-outline' />

      <View style={{ height: 70 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ paddingVertical: 10, height: 60, paddingLeft: 15 }}
          renderItem={({ item }) => {

            return (
              <FilterButton label={item.label} value={item.value} activeValue={activeFilter} onPress={setActiveFilter} />
            );
          }}
        />
      </View>

      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <InvoiceCard title={item.client?.name || 'Deleted Client'} invoiceNumber={item.invoiceNumber} status={item.status} price={Number(item.totalAmount)} issueDate={dateformatter(item.issueDate)} onPress={() => handleOnPress(item.id)} />
        )}
      />

      <FloatingButton icon='add' onPress={() => { router.push('/screens/add-invoice') }} />
    </Screen>
  )
}

export default Invoices

const styles = StyleSheet.create({
  filterSection: {
    height: mVs(20),
    width: 'auto',
    paddingLeft: mVs(50)
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#eee',
  },

  activeFilterButton: {
    backgroundColor: '#1B5E20',
  },

  filterText: {
    color: '#333',
  },

  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },

  invoiceCard: {
    padding: 16,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
});