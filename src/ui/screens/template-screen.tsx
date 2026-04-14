import { classicTemplate } from '@/src/components/invoice/templates/classicTemplate';
import { modernTemplate } from '@/src/components/invoice/templates/modernTemplate';
import ScreenWrapper from '@/src/components/layout/screen-wrapper';
import SimpleButton from '@/src/components/primitives/simple-button';
import { useTheme } from '@/src/hooks/useTheme';
import { loadPersistedTemp, persistTemplate, setRememberChoice, setTemplateId } from '@/src/redux/slices/templateSlice';
import { AppDispatch, RootState } from '@/src/redux/store/myStore';
import { mVs } from '@/src/utils/scale';
import SnackBar from '@/src/utils/snackbar';
import * as Print from 'expo-print';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import AuthHeader from '../components/screen-header';

const templateData = [
  { id: 'template1', name: 'Classic Template' },
  { id: 'template2', name: 'Modern Template' },
  { id: 'template3', name: 'Professional Template' },
];

const TemplateScreen = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { selectedTemplateId, rememberChoice } = useSelector((state: RootState) => state.templateReducer);
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [snackbar, setSnackbar] = useState<{ message: string, type: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    dispatch(loadPersistedTemp());
  }, [dispatch]);


  const displayTemplates = useMemo(() => {
    if (rememberChoice && selectedTemplateId) {
      const selected = templateData.find((t) => t.id === selectedTemplateId);
      return selected ? [selected] : templateData;
    }

    return templateData;
  }, [rememberChoice, selectedTemplateId]);



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


  if (!parsedInvoiceData) {
    return (
      <View style={styles.center}>
        <Text>No invoice data available</Text>
      </View>
    );
  }

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

  const handleDownloadPDF = async () => {
    try {
      const html = getTemplateHtml(selectedTemplateId!, rememberChoice);
      const { uri } = await Print.printToFileAsync({ html, });
      alert(`PDF saved at ${uri}`);
    } catch (error: any) {
      setSnackbar({ message: error, type: 'error' })
    }
  };

  const handleSharePDF = async () => {
    try {
      const html = getTemplateHtml(selectedTemplateId!, parsedInvoiceData);
      const { uri } = await Print.printToFileAsync({ html, });

      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Sharing not available')
      }
    } catch (error: any) {
      setSnackbar({ message: error, type: 'error' })
    }
  };

  const getTemplateHtml = (
    templateId: string,
    data: any
  ) => {
    switch (templateId) {
      case 'template1':
        return classicTemplate(data);

      case 'template2':
        return modernTemplate(data);

      case 'template3':
      default:
        return classicTemplate(data);
    }
  };

  return (
    <ScreenWrapper>
      <AuthHeader arrowBack title='Invoice Template' />

      <Text style={[styles.heading, { color: theme.text.primary }]}>Preview</Text>

      <View style={styles.container}>

        <FlatList
          data={displayTemplates}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.invoicePreview, { borderColor: selectedTemplateId === item.id ? theme.border.tertiary : '#cccc', }]}>
              <Pressable style={{ flex: 1 }} disabled={rememberChoice} onPress={() => handleSelectTemplate(item.id)}>
                <WebView originWhitelist={['*']}
                  source={{ html: getTemplateHtml(item.id, parsedInvoiceData) }}
                  style={{ height: 400, }} />
              </Pressable>
            </View>

          )}
        />

        {selectedTemplateId === null ? (
          <View style={styles.rememberContainer}>
            <Text style={[styles.rememberText, { color: theme.text.primary }]}>Remember my choice</Text>

            <Switch value={rememberChoice} onValueChange={handleToggleRemember} />
          </View>
        ) : (
          <Pressable style={styles.rememberContainer} onPress={() => { router.push({ pathname: '/screens/invoice-defaults', params: { invoiceData: JSON.stringify(parsedInvoiceData) } }) }}>
            <Text style={[styles.rememberText, { color: theme.text.primary }]}>Selected another template</Text>
          </Pressable>

        )}

        <View style={styles.buttons}>
          <SimpleButton btnText='Download PDF' onPress={handleDownloadPDF} />
          <View style={{ height: mVs(10) }} />
          <SimpleButton btnText='Share PDF' onPress={handleSharePDF} />
          <View style={{ height: mVs(10) }} />
          <SimpleButton btnText='Done' onPress={() => router.replace('/(tabs)')} />
        </View>
      </View>
      {snackbar && (
        <SnackBar message={snackbar.message} type={snackbar.type} onDismiss={() => setSnackbar(null)} />
      )}
    </ScreenWrapper>
  );
};

export default TemplateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: mVs(16),
    paddingHorizontal: mVs(20)
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: mVs(20)
  },
  list: {
    paddingVertical: mVs(8),
    gap: mVs(15)
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
  invoicePreview: {
    flex: 1,
    width: 300,
    height: 300,
    marginTop: mVs(20),
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden'
  }
});