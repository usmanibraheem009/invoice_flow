import { deleteOrganization } from '@/src/apis/organizationApi'
import UserAvatar from '@/src/components/client/user-avatar'
import { Screen } from '@/src/components/layout'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { setLoading } from '@/src/redux/slices/loadingSlice'
import { clearOrganization } from '@/src/redux/slices/organizationSlice'
import { showSnackbar } from '@/src/redux/slices/snackbarSlice'
import { RootState } from '@/src/redux/store/myStore'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import AuthHeader from '../components/screen-header'

const OrganizationSettings = () => {

    const organization = useSelector((state: RootState) => state.organizationReducer.data);
    const [edit, setEdit] = useState(false);
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const deleteOrg = async (id: string) => {
        Alert.alert(`${t('common.warning')}`, `${t('common.areYouSure', { param: `${t('organization.title')}` })}`,
            [
                { text: `${t('common.cancel')}`, style: 'cancel' },
                {
                    text: `${t('common.yes')}`, onPress: async () => {
                        dispatch(setLoading(true));
                        try {
                            await deleteOrganization(id);
                            dispatch(showSnackbar({ message: `${t('organization.organizationDeleted')}`, type: 'success' }));
                            dispatch(clearOrganization());
                        } catch (error: any) {
                            dispatch(showSnackbar({ message: error.message, type: error.type }));
                        } finally {
                            dispatch(setLoading(false));
                        }
                    }
                }
            ]
        );

    };

    if (!organization) {
        return (
            <Screen>
                <AuthHeader arrowBack title={t('organization.title')} />

                <Pressable onPress={() => router.push('/screens/add-organization')} style={{ paddingHorizontal: mVs(20) }}>
                    <InputTab
                        placeholder={t('organization.addNewOrganization')}
                        editable={false}
                        centerAlign
                    />
                </Pressable>
            </Screen>
        );
    }

    return (
        <ScreenWrapper>
            <AuthHeader arrowBack title={t('organization.title')} />
            <View style={[styles.container, { borderColor: theme.border.secondary }]}>

                <UserAvatar name={organization?.legalName} />
                <Text style={[styles.labelText, { color: theme.text.secondary }]}>{t('organization.OrganizationName')}</Text>
                <InputTab placeholder={'Enter legal name'} value={organization?.legalName || ''} editable={edit} />

                <Text style={[styles.labelText, { color: theme.text.secondary }]}>{t('organization.TaxId')}</Text>
                <InputTab placeholder={'Enter Tax Id'} value={organization?.taxId || ''} editable={edit} />

                <Text style={[styles.labelText, { color: theme.text.secondary }]}>{t('organization.HomeCurrency')}</Text>
                <InputTab placeholder={'Enter home currency'} value={organization?.homeCurrency || ''} editable={edit} />
            </View>

            <View style={styles.btnContainer}>
                <SimpleButton btnText={t('organization.editOrganization')} onPress={() => {
                    router.push({
                        pathname: '/screens/add-organization',
                        params: { editable: 'true' }
                    });
                }} />

                <SimpleButton btnText={t('organization.deleteOrganization')} onPress={() => deleteOrg(organization!.id)} backgroundColor={theme.surface.tertiary} />
            </View>
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
        padding: mVs(20),
        alignItems: 'center',
        marginTop: mVs(20),
        borderWidth: 2,
        marginHorizontal: mVs(20),
        borderRadius: mVs(20),
    },
    labelText: {
        fontSize: mVs(14),
        fontWeight: 500,
        alignSelf: 'flex-start',
        marginBottom: mVs(5),
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