import FilterButton from '@/src/components/invoice/filter-button'
import InvoiceCard from '@/src/components/invoice/invoice-card'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import FloatingButton from '@/src/components/primitives/floating-button'
import AuthHeader from '@/src/ui/components/screen-header'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

const Invoices = () => {

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Drafts', value: 'DRAFT' },
  ];

  const invoices = [
    { id: '1', title: 'Invoice #001', status: 'PAID', price: 3400, issueDate: '30-OCT-2024' },
    { id: '2', title: 'Invoice #002', status: 'PENDING', price: 3080, issueDate: '01-DEC-2024' },
    { id: '3', title: 'Invoice #003', status: 'OVERDUE', price: 2810, issueDate: '07-FEB-2025' },
    { id: '4', title: 'Invoice #004', status: 'DRAFT', price: 3570, issueDate: '16-NOV-2025' },
    { id: '5', title: 'Invoice #005', status: 'DRAFT', price: 3570, issueDate: '16-NOV-2025' },
    { id: '6', title: 'Invoice #006', status: 'PAID', price: 3570, issueDate: '16-NOV-2025' },
  ];

  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(
        item => item.status === activeFilter
      );
      setFilteredInvoices(filtered);
    }
  }, [activeFilter]);

  return (
    <ScreenWrapper>
      <AuthHeader title='Invoices' trailingIcon='funnel-outline' />

      <View style={{height: 70}}>
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
        contentContainerStyle={{gap: 12, paddingHorizontal: 20, paddingBottom: 10}}
        renderItem={({ item }) => (
          <InvoiceCard title={item.title} status={item.status} price={item.price} issueDate={item.issueDate} />
        )}
      />

      <FloatingButton icon='add' onPress={() => {router.push('/screens/add-invoice')}} />
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