import { classicTemplate } from '@/src/components/invoice/templates/classicTemplate';
import { modernTemplate } from '@/src/components/invoice/templates/modernTemplate';
import { professionalTemplate } from '@/src/components/invoice/templates/professionalTemplate';
import { Screen } from '@/src/components/layout';
import SimpleButton from '@/src/components/primitives/simple-button';
import { useTheme } from '@/src/hooks/useTheme';
import { persistTemplate, setRememberChoice, setTemplateId } from '@/src/redux/slices/templateSlice';
import { AppDispatch, RootState } from '@/src/redux/store/myStore';
import { selectEnrichedInvoiceById } from '@/src/utils/invoiceSelectors';
import { mVs } from '@/src/utils/scale';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import AuthHeader from '../components/screen-header';

const templateData = [
    { id: 'template1', name: 'Classic Template' },
    { id: 'template2', name: 'Modern Template' },
    { id: 'template3', name: 'Professional Template' },
];

const InvoiceDefaults = () => {

    const { theme } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { invoiceId } = useLocalSearchParams();
    const invoiceData = useSelector(selectEnrichedInvoiceById(invoiceId as string));

    const { selectedTemplateId, rememberChoice } = useSelector((state: RootState) => state.templateReducer);

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

    const getTemplateHtml = (
        templateId: string,
        data: any
    ) => {

        if (!data || !data.lineItems) {
            return `<html><body><p>Loading preview...</p></body></html>`;
        }
        switch (templateId) {
            case 'template1':
                return classicTemplate(data);

            case 'template2':
                return modernTemplate(data);

            case 'template3':
            default:
                return professionalTemplate(data);
        }
    };

    return (
        <Screen>
            <AuthHeader arrowBack title='Invoice Template' />

            <Text style={[styles.heading, { color: theme.text.primary }]}>Preview</Text>

            <View style={styles.container}>

                <FlatList
                    data={templateData}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={[styles.invoicePreview, { borderColor: selectedTemplateId === item.id ? theme.border.tertiary : '#cccc', }]}>
                            <Pressable style={{ flex: 1 }} onPress={() => handleSelectTemplate(item.id)}>
                                <WebView originWhitelist={['*']}
                                    source={{ html: getTemplateHtml(item.id, invoiceData) }}
                                    style={{ height: 400, }} />
                            </Pressable>
                        </View>

                    )}
                />

                <View style={styles.rememberContainer}>
                    <Text style={[styles.rememberText, { color: theme.text.primary }]}>Remember my choice</Text>

                    <Switch value={rememberChoice} onValueChange={handleToggleRemember} />
                </View>


                <View style={styles.buttons}>
                    <SimpleButton btnText='Done' onPress={() => router.back()} />
                </View>
            </View>
        </Screen>
    )
}

export default InvoiceDefaults

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
})