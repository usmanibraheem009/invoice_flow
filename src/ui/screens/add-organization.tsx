import { createOrganization, updateOrganization } from '@/src/apis/organizationApi'
import ModalWrapper from '@/src/components/layout/modal-wrapper'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import { setLoading } from '@/src/redux/slices/loadingSlice'
import { setOrganization } from '@/src/redux/slices/organizationSlice'
import { clearSnackBar, setSnackBar } from '@/src/redux/slices/snackbarSlice'
import { RootState } from '@/src/redux/store/myStore'
import { CountryCurrency, fetchCountries } from '@/src/services/countryService'
import { initialValues, validationSchema } from '@/src/utils/auth-form'
import { mVs } from '@/src/utils/scale'
import SnackBar from '@/src/utils/snackbar'
import { router, useLocalSearchParams } from 'expo-router'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ErrorText from '../components/error-text'
import AuthHeader from '../components/screen-header'

const AddOrganization = () => {

    const { editable } = useLocalSearchParams();
    console.log(editable);
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [countries, setCountries] = useState<CountryCurrency[]>([]);
    const dispatch = useDispatch();
    const snackbar = useSelector((state: RootState) => state.snackbarReducer);
    const loading = useSelector((state: RootState) => state.loadingReducer.loading);
    const organization = useSelector((state: RootState) => state.organizationReducer.data);


    useEffect(() => {
        loadCountries()
    }, []);

    const loadCountries = async () => {
        try {
            const data = await fetchCountries();
            setCountries(data);
        } catch (error: any) {
            dispatch(setSnackBar({ message: error.message, type: error.type }))
        }
    }

    const onSubmitFunc = async (payload: any) => {
        dispatch(setLoading(true));

        try {
            let res;

            if (organization?.id) {
                res = await updateOrganization(organization.id, payload);
                dispatch(setSnackBar({
                    message: "Organization updated successfully",
                    type: "success"
                })
                );
            } else {
                res = await createOrganization(payload);

                dispatch(setSnackBar({
                    message: "Organization created successfully",
                    type: "success",
                })
                );
            }

            console.log("response:", res.data);

            dispatch(setOrganization(res.data));

        } catch (error: any) {

            dispatch(
                setSnackBar({
                    message: error?.message || "Something went wrong",
                    type: "error",
                })
            );

        } finally {
            dispatch(setLoading(false));
        }
    };

    const editableInitials = {
        legalName: organization?.legalName || '',
        id: organization?.id || '',
        taxId: organization?.taxId || '',
        homeCurrency: organization?.homeCurrency || ''
    }

    return (
        <ScreenWrapper scrollable>
            <AuthHeader title={editable ? 'Edit Organization' : 'Add Organization'} arrowBack />

            <View>
                <Formik initialValues={editable ? editableInitials : initialValues.addOrganization} validationSchema={validationSchema.addOrganization} onSubmit={onSubmitFunc} >
                    {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }: any) => (
                        <View style={styles.container}>
                            <InputTab placeholder='Enter organization name' value={values.legalName} onChangeText={handleChange('legalName')} />
                            {touched.legalName && errors.legalName && (<ErrorText errorText={errors.legalName} />)}

                            <InputTab placeholder='Enter Tax Id' value={values.taxId} onChangeText={handleChange('taxId')} />
                            {touched.taxId && errors.taxId && (<ErrorText errorText={errors.taxId} />)}

                            <Pressable onPress={() => setShowCurrencyModal(true)}>
                                <InputTab placeholder='Select home currency' value={values.homeCurrency || ''} editable={false} />
                                {touched.homeCurrency && errors.homeCurrency && (<ErrorText errorText={errors.homeCurrency} />)}
                            </Pressable>

                            <SimpleButton btnText={editable ? 'Update Organization' : 'Add Organization'} onPress={handleSubmit} />

                            <ModalWrapper visible={showCurrencyModal} onClose={() => setShowCurrencyModal(false)} modalTitle='Select home currency' searchBar={true}
                                labelKey={'label'} valueKey={'value'} data={countries} onItemPress={(item: CountryCurrency) => {
                                    setFieldValue('homeCurrency', item.currencyCode);
                                    console.log('selected currency: ', item);
                                    setShowCurrencyModal(false);
                                }} />

                        </View>
                    )}
                </Formik>
            </View>

            {snackbar?.message ? (
                <SnackBar message={snackbar.message} type={snackbar.type} onDismiss={() => {
                    dispatch(clearSnackBar());
                    router.back()
                }
                } />
            ) : null}
        </ScreenWrapper>
    )
}

export default AddOrganization

const styles = StyleSheet.create({
    container: {
        gap: mVs(15),
        paddingHorizontal: mVs(20)
    }
})