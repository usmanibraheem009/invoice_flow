import { createOrganization, updateOrganization } from '@/src/apis/organizationApi'
import { ScrollScreen } from '@/src/components/layout'
import ModalWrapper from '@/src/components/layout/modal-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { setLoading } from '@/src/redux/slices/loadingSlice'
import { setOrganization } from '@/src/redux/slices/organizationSlice'
import { showSnackbar } from '@/src/redux/slices/snackbarSlice'
import { RootState } from '@/src/redux/store/myStore'
import { CountryCurrency, fetchCountries } from '@/src/services/countryService'
import { initialValues, validationSchema } from '@/src/utils/auth-form'
import { mVs } from '@/src/utils/scale'
import { router, useLocalSearchParams } from 'expo-router'
import { Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ErrorText from '../components/error-text'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const AddOrganization = () => {

    const { editable } = useLocalSearchParams();
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [countries, setCountries] = useState<CountryCurrency[]>([]);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const formikRef = useRef<any>(null);
    const currentOrg = useSelector((state: RootState) => state.userReducer.user?.currentOrganization ?? null);


    useEffect(() => {
        loadCountries()
    }, []);

    const loadCountries = async () => {
        try {
            const data = await fetchCountries();
            setCountries(data);
        } catch (error: any) {
            dispatch(showSnackbar({ message: error.message, type: error.type }))
        }
    }

    const onSubmitFunc = async (payload: any) => {
        dispatch(setLoading(true));

        try {
            let res;

            if (currentOrg?.id) {
                res = await updateOrganization(currentOrg.id, payload);
                dispatch(showSnackbar({ message: `${t('common.updatedMsg', { param: `${t('organization.title')}` })}`, type: 'success' }))
                Alert.alert(`${t('common.restartTitle')}`, `${t('common.restartBody')}`, [
                    { text: `${t('common.ok')}`, style: 'default', },
                ]);
                router.back();
            } else {
                res = await createOrganization(payload);
                dispatch(showSnackbar({
                    message: `${t('common.createdMsg', { param: `${t('organization.title')}` })}`,
                    type: "success",
                }));
                router.back();
            }
            dispatch(setOrganization(res.data));

        } catch (error: any) {
            dispatch(showSnackbar({ message: error?.message || "Something went wrong", type: "error", }));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const editableInitials = {
        legalName: currentOrg?.legalName || '',
        organizationId: currentOrg?.id || '',
        taxId: currentOrg?.taxId || '',
        homeCurrency: currentOrg?.homeCurrency || ''
    }

    return (
        <>
            <ScrollScreen >
                <AuthHeader title={editable ? `${t('organization.editOrganization')}` : `${t('organization.addOrganization')}`} arrowBack />

                <View>
                    <Formik innerRef={formikRef} initialValues={editable ? editableInitials : initialValues.addOrganization} validationSchema={validationSchema.addOrganization} onSubmit={onSubmitFunc} >
                        {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }: any) => (
                            <View style={styles.container}>

                                <Text style={[styles.labelText, { color: theme.text.secondary }]}> {t('organization.OrganizationName')} </Text>
                                <InputTab placeholder={t('organization.organizationName')} value={values.legalName} onChangeText={handleChange('legalName')} />
                                {touched.legalName && errors.legalName && (<ErrorText errorText={errors.legalName} />)}

                                <Text style={[styles.labelText, { color: theme.text.secondary }]}> {t('organization.TaxId')} </Text>
                                <InputTab placeholder={t('organization.taxId')} value={values.taxId} onChangeText={handleChange('taxId')} />
                                {touched.taxId && errors.taxId && (<ErrorText errorText={errors.taxId} />)}

                                <Text style={[styles.labelText, { color: theme.text.secondary }]}> {t('organization.HomeCurrency')} </Text>
                                <Pressable onPress={() => setShowCurrencyModal(true)}>
                                    <InputTab placeholder={t('organization.homeCurrency')} value={values.homeCurrency || ''} editable={false} />
                                    {touched.homeCurrency && errors.homeCurrency && (<ErrorText errorText={errors.homeCurrency} />)}
                                </Pressable>


                                <ModalWrapper visible={showCurrencyModal} onClose={() => setShowCurrencyModal(false)} modalTitle={t('organization.homeCurrency')} searchBar={true}
                                    labelKey={'label'} valueKey={'value'} data={countries} onItemPress={(item: CountryCurrency) => {
                                        setFieldValue('homeCurrency', item.currencyCode);
                                        console.log('selected currency: ', item);
                                        setShowCurrencyModal(false);
                                    }} />

                            </View>
                        )}
                    </Formik>
                </View>

            </ScrollScreen>
            <ScreenFooter>
                <SimpleButton btnText={editable ? `${t('organization.editOrganization')}` : `${t('organization.addOrganization')}`} onPress={() => { formikRef.current?.handleSubmit() }} />
            </ScreenFooter>
        </>
    )
}

export default AddOrganization

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: mVs(20)
    },
    labelText: {
        fontSize: mVs(14),
        fontWeight: 500,
        marginTop: mVs(15),
        marginBottom: mVs(5)
    },

})