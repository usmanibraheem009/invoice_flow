import { mVs } from '@/src/utils/scale'; // your scaling utils
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TemplateCardProps {
  templateId: string;
  templateName: string;
  invoiceData: any;
  selected: boolean;
  onSelect: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ templateId, templateName, invoiceData, selected, onSelect }) => {
    console.log('invoiceData:' ,invoiceData);
    console.log('clientName:' , invoiceData.clientName);
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onSelect(templateId)}
      activeOpacity={0.8}
    >
      <Text style={styles.title}>{templateName}</Text>
      <View style={styles.preview}>
        <Text style={styles.client}>{invoiceData.clientName}</Text>
        <Text style={styles.total}>Total: ${invoiceData.subTotal}</Text>
      </View>
      <Text>{invoiceData.notes}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    padding: mVs(12),
    borderRadius: 12,
    backgroundColor: '#fff',
    marginHorizontal: mVs(8),
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  title: {
    fontWeight: '600',
    marginBottom: mVs(6),
  },
  preview: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: mVs(6),
  },
  client: {
    fontSize: 12,
    fontWeight: '500',
  },
  total: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: mVs(4),
  },
});

export default TemplateCard;