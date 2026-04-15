import FilterButton from '@/src/components/invoice/filter-button'
import InvoiceCard from '@/src/components/invoice/invoice-card'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import FloatingButton from '@/src/components/primitives/floating-button'
import { fetchInvoices } from '@/src/redux/slices/invoiceListSlice'
import { AppDispatch } from '@/src/redux/store/myStore'
import AuthHeader from '@/src/ui/components/screen-header'
import { dateformatter } from '@/src/utils/date-formatter'
import { selectEnrichedInvoices } from '@/src/utils/invoiceSelectors'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
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
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const invoices = useSelector(selectEnrichedInvoices);

  useEffect(() => {
    dispatch(fetchInvoices({ page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(
        item => item.status === activeFilter
      );
      setFilteredInvoices(filtered);
    }
  }, [activeFilter, invoices]);

  // const fetchInvoices = async ({ page, limit }: paginationResponse) => {
  //   try {
  //     const response = await getInvoices({ page, limit });
  //     const invoicesList = response.data.data;
  //     console.log("fetched lists: ", invoicesList);
  //     setFilteredInvoices(invoicesList);
  //     dispatch(showSnackbar({ message: response.message, type: 'success' }));
  //   } catch (error: any) {
  //     dispatch(showSnackbar({ message: error.message, type: 'error' }));
  //   }
  // }


  const handleOnPress = () => {
    router.push('/screens/invoice-details');
  }

  return (
    <ScreenWrapper>
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
          <InvoiceCard title={item.clientName} status={item.status} price={item.price} issueDate={dateformatter(item.issueDate)} onPress={handleOnPress} />
        )}
      />

      <FloatingButton icon='add' onPress={() => { router.push('/screens/add-invoice') }} />
    </ScreenWrapper>
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