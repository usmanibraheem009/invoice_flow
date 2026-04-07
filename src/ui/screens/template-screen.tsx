import { classicTemplate } from '@/src/components/invoice/templates/classicTemplate';
import { modernTemplate } from '@/src/components/invoice/templates/modernTemplate';
import { loadPersistedTemp, persistTemplate, setRememberChoice, setTemplateId } from '@/src/redux/slices/templateSlice';
import { mVs } from '@/src/utils/scale';
import * as Print from 'expo-print';
import { useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useMemo } from 'react';
import { Button, FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';

const templateData = [
  { id: 'template1', name: 'Classic Template' },
  { id: 'template2', name: 'Modern Template' },
  { id: 'template3', name: 'Professional Template' },
];

const TemplateScreen = () => {
  const dispatch = useDispatch<any>();

  const { selectedTemplateId, rememberChoice } =
    useSelector((state: any) => state.templateReducer);

  // ✅ Load saved template on mount
  useEffect(() => {
    dispatch(loadPersistedTemp());
  }, []);

  // ✅ Get params safely
  const params = useLocalSearchParams();

  // ✅ Parse invoice safely (memoized)
  const parsedInvoiceData = useMemo(() => {
    try {
      if (params.invoiceData) {
        return JSON.parse(params.invoiceData as string);
      }
      return null;
    } catch (error) {
      console.log('Invoice parse error:', error);
      return null;
    }
  }, [params.invoiceData]);

  // ✅ Safety guard
  if (!parsedInvoiceData) {
    return (
      <View style={styles.center}>
        <Text>No invoice data available</Text>
      </View>
    );
  }

  // Template select
  const handleSelectTemplate = (templateId: string) => {
    dispatch(setTemplateId(templateId));

    if (rememberChoice) {
      dispatch(
        persistTemplate({
          selectedTemplateId: templateId,
          rememberChoice,
        })
      );
    }
  };

  // Remember toggle
  const handleToggleRemember = (value: boolean) => {
    dispatch(setRememberChoice(value));

    if (value && selectedTemplateId) {
      dispatch(
        persistTemplate({
          selectedTemplateId,
          rememberChoice: value,
        })
      );
    }
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    const html = classicTemplate(parsedInvoiceData);

    const { uri } = await Print.printToFileAsync({
      html,
    });

    alert(`PDF saved at ${uri}`);
  };

  // Share PDF
  const handleSharePDF = async () => {
    const html = classicTemplate(parsedInvoiceData);

    const { uri } = await Print.printToFileAsync({
      html,
    });

    await Sharing.shareAsync(uri);
  };

  const getTemplateHtml = (templateId: string, data: any) => {
    switch(templateId){
      case 'template1':
        return classicTemplate(data);
      case 'template2' :
        return modernTemplate(data);
      case 'template3' :
        // return professionalTemplate(data);
      default :
        return classicTemplate(data);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Select Invoice Template
      </Text>

        <FlatList
          data={templateData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={{ flex: 1, width: 300, height: 300, marginTop: mVs(20), borderWidth: 1, borderColor: '#ccc', borderRadius: 8, overflow: 'hidden' }}>
              <Text style={{ fontWeight: '600', marginBottom: mVs(8) }}>Preview</Text>

              <WebView
                originWhitelist={['*']}
                source={{ html: getTemplateHtml(item.id, parsedInvoiceData) }}
                style={{ height: 400, }}
              />
            </View>

          )}
        />

      {/* Remember Choice */}
      <View style={styles.rememberContainer}>
        <Text style={styles.rememberText}>
          Remember my choice
        </Text>

        <Switch
          value={rememberChoice}
          onValueChange={handleToggleRemember}
        />
      </View>

      {/* Actions */}
      <View style={styles.buttons}>
        <Button
          title="Download PDF"
          onPress={handleDownloadPDF}
        />

        <View style={{ height: mVs(10) }} />

        <Button
          title="Share PDF"
          onPress={handleSharePDF}
        />
      </View>
    </View>
  );
};

export default TemplateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: mVs(16),
  },

  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: mVs(12),
  },

  list: {
    paddingVertical: mVs(8),
  },

  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: mVs(16),
    justifyContent: 'space-between',
  },

  rememberText: {
    fontSize: 16,
  },

  buttons: {},

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});