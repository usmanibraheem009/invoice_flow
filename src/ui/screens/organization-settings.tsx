import { deleteOrganization } from '@/src/apis/organizationApi'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { clearOrganization } from '@/src/redux/slices/organizationSlice'
import { clearSnackBar, setSnackBar } from '@/src/redux/slices/snackbarSlice'
import { RootState } from '@/src/redux/store/myStore'
import { mVs } from '@/src/utils/scale'
import SnackBar from '@/src/utils/snackbar'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import AuthHeader from '../components/screen-header'

const OrganizationSettings = () => {

    const organization = useSelector((state: RootState) => state.organizationReducer.data);
    const snackbar = useSelector((state: RootState) => state.snackbarReducer);
    console.log('organization data: ', organization)
    const [edit, setEdit] = useState(false);
    const { theme } = useTheme();
    const dispatch = useDispatch();

    const deleteOrg = async (id: string) => {
        Alert.alert('Warning', 'Are you sure you want to delete organization?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes', onPress: async () => {
                        await deleteOrganization(id);
                        dispatch(setSnackBar({ message: 'Organization Deleted successfully', type: 'success' }));
                        dispatch(clearOrganization());
                    }
                }
            ]
        );

    };

    if (!organization) {
        return (
            <ScreenWrapper>
                <AuthHeader arrowBack title="Organization" />

                <Pressable onPress={() => router.push('/screens/add-organization')} style={{ paddingHorizontal: mVs(20) }}>
                    <InputTab
                        placeholder=" + Add new organization"
                        editable={false}
                        centerAlign
                    />
                </Pressable>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <AuthHeader arrowBack title='Organization' />

            {!organization?.id ? (<Pressable onPress={() => { router.push('/screens/add-organization') }} >
                <InputTab placeholder=' + Add new organization' editable={false} centerAlign={true} />
            </Pressable>) :
                (
                    <View style={styles.container}>
                        <Text style={[styles.labelText, { color: theme.text.secondary }]}>ORGANIZATION IFNROMATION</Text>
                        <InputTab placeholder={'Enter legal name'} value={organization?.legalName || ''} editable={edit} />

                        <Text style={[styles.labelText, { color: theme.text.secondary }]}>TAX ID</Text>
                        <InputTab placeholder={'Enter Tax Id'} value={organization?.taxId || ''} editable={edit} />

                        <Text style={[styles.labelText, { color: theme.text.secondary }]}>HOME CURRENCY</Text>
                        <InputTab placeholder={'Enter home currency'} value={organization?.homeCurrency || ''} editable={edit} />
                    </View>
                )
            }
            <View style={styles.btnContainer}>
                <SimpleButton btnText='Edit Info' onPress={() => {
                    router.push({
                        pathname: '/screens/add-organization',
                        params: { editable: 'true' }
                    });
                }} />

                <SimpleButton btnText='Delete organization' onPress={() => deleteOrg(organization!.id)} />
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

export default OrganizationSettings

const styles = StyleSheet.create({
    editText: {
        fontSize: mVs(18),
        fontWeight: 500
    },
    container: {
        paddingHorizontal: mVs(20),
        alignItems: 'center',
        marginTop: mVs(20)
    },
    labelText: {
        fontSize: mVs(14),
        fontWeight: 500,
        alignSelf: 'flex-start',
        marginBottom: mVs(10),
        marginTop: mVs(20)
    },
    btnContainer: {
        gap: mVs(10),
        position: 'absolute',
        bottom: 30,
        paddingHorizontal: mVs(20),
        left: 10,
        right: 10
    }
})