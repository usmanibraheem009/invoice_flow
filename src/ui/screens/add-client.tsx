import { createClient, updateClient } from '@/src/apis/clientApi';
import ScreenWrapper from '@/src/components/layout/screen-wrapper';
import InputTab from '@/src/components/primitives/input-tab';
import LocationModal from '@/src/components/primitives/location-modal';
import SimpleButton from '@/src/components/primitives/simple-button';
import { addClient, updateExistingClient } from '@/src/redux/slices/clientsSlice';
import { setLoading } from '@/src/redux/slices/loadingSlice';
import { fetchCities, fetchCountries, fetchStates } from '@/src/redux/slices/locationSlice';
import { showSnackbar } from '@/src/redux/slices/snackbarSlice';
import { initialValues, validationSchema } from '@/src/utils/auth-form';
import { mVs } from '@/src/utils/scale';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ErrorText from '../components/error-text';
import AuthHeader from '../components/screen-header';

const AddClient = () => {
  const { editable, clientData } = useLocalSearchParams();
  const parsedClientData = clientData ? JSON.parse(clientData as string) : null;
  const dispatch = useDispatch<any>();
  const { countries, states, cities } = useSelector((state: any) => state.locationReducer);
  const isEdit = editable === 'true' && parsedClientData?.id;

  const [showCountry, setShowCountry] = useState(false);
  const [showState, setShowState] = useState(false);
  const [showCity, setShowCity] = useState(false);

  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  const onSubmitFunc = async (values: any) => {
    dispatch(setLoading(true));

    try {
      const payload = {
        name: values.clientName,
        email: values.clientEmail,
        phone: values.phone,
        addressLine1: values.addressLine1,
        country: values.country,
        state: values.state,
        city: values.city,
        postalCode: values.postalCode || '',
      };

      setShowCountry(false);
      setShowState(false);
      setShowCity(false);

      let clientResponse;

      if (isEdit) {
        clientResponse = await updateClient(parsedClientData.id, payload);

        const client = clientResponse?.data;

        const updatedClient = {
          id: client.id,
          clientName: client.name,
          clientEmail: client.email,
          phone: client.phone,
          addressLine1: client.addressLine1,
          addressLine2: '',
          orgName: '',
          country: client.country,
          state: client.state,
          city: client.city,
          postalCode: client.postalCode,
        };

        dispatch(updateExistingClient(updatedClient));

        dispatch(
          showSnackbar({
            message: 'Client updated successfully',
            type: 'success',
          })
        );

      } else {
        clientResponse = await createClient(payload);

        const client = clientResponse;

        const newClient = {
          id: client.id,
          clientName: client.name,
          clientEmail: client.email || '',
          phone: client.phone || '',
          addressLine1: client.addressLine1 || '',
          addressLine2: '',
          orgName: '',
          country: client.country || '',
          state: client.state || '',
          city: client.city || '',
          postalCode: client.postalCode || '',
        };

        dispatch(addClient(newClient));

        dispatch(
          showSnackbar({
            message: 'Client created successfully',
            type: 'success',
          })
        );
      }

      router.replace('/(tabs)/clients');

    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: error?.message || 'Something went wrong',
          type: 'error',
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const editableValues = {
    clientName: parsedClientData?.name || '',
    clientEmail: parsedClientData?.email,
    phone: parsedClientData?.phone,
    addressLine1: parsedClientData?.addressLine1,
    country: parsedClientData?.country,
    state: parsedClientData?.state,
    city: parsedClientData?.city,
    postalCode: parsedClientData?.postalCode || '',
  }

  return (
    <ScreenWrapper scrollable keyboardAvoidingView>
      <AuthHeader arrowBack title="Client Details" />

      <View style={{ paddingHorizontal: mVs(20) }}>
        <Formik
          initialValues={editable === 'true' ? editableValues : initialValues.addNewClient}
          enableReinitialize={true}
          validationSchema={validationSchema.addNewClient}
          onSubmit={onSubmitFunc}
        >
          {({ errors, values, touched, handleSubmit, handleChange, setFieldValue }: any) => (
            <View style={{ gap: 12, paddingBottom: 20 }}>

              <InputTab placeholder="Enter your name" value={values.clientName} onChangeText={handleChange('clientName')} />
              {touched.clientName && errors.clientName && <ErrorText errorText={errors.clientName} />}

              <InputTab placeholder="Enter your Email" value={values.clientEmail} onChangeText={handleChange('clientEmail')} />
              {touched.clientEmail && errors.clientEmail && <ErrorText errorText={errors.clientEmail} />}

              <InputTab placeholder="Enter your phone" value={values.phone} onChangeText={handleChange('phone')} />
              {touched.phone && errors.phone && <ErrorText errorText={errors.phone} />}

              <InputTab placeholder="Address Line 1" value={values.addressLine1} onChangeText={handleChange('addressLine1')} />
              {touched.addressLine1 && errors.addressLine1 && <ErrorText errorText={errors.addressLine1} />}

              <InputTab placeholder="Address Line 2" value={values.addressLine2} onChangeText={handleChange('addressLine2')} />
              {touched.addressLine2 && errors.addressLine2 && <ErrorText errorText={errors.addressLine2} />}

              <InputTab placeholder="Organization Name" value={values.orgName} onChangeText={handleChange('orgName')} />
              {touched.orgName && errors.orgName && <ErrorText errorText={errors.orgName} />}

              <Pressable onPress={() => setShowCountry(true)}>
                <InputTab placeholder="Select your country" value={values.country} editable={false} />
                {touched.country && errors.country && <ErrorText errorText={errors.country} />}
              </Pressable>

              {showCountry && (
                <LocationModal
                  modalTitle="Select Country"
                  visible={showCountry}
                  onClose={() => setShowCountry(false)}
                  values={countries}
                  onSelected={(country: any) => {
                    setFieldValue('country', country.label);
                    setFieldValue('state', '');
                    setFieldValue('city', '');
                    dispatch(fetchStates(country.label));
                    setShowCountry(false);
                  }}
                />
              )}

              {/* State Selector */}
              <Pressable onPress={() => values.country && setShowState(true)}>
                <InputTab placeholder="Select your state" value={values.state} editable={false} />
                {touched.state && errors.state && <ErrorText errorText={errors.state} />}
              </Pressable>

              {showState && (
                <LocationModal
                  modalTitle="Select State"
                  visible={showState}
                  onClose={() => setShowState(false)}
                  values={states}
                  onSelected={(state: any) => {
                    setFieldValue('state', state.label);
                    setFieldValue('city', '');
                    dispatch(fetchCities({ country: values.country, state: state.label })).then((res: any) => {
                      if (res?.payload?.length) setShowCity(true); // automatically open city modal if cities exist
                    });
                    setShowState(false);
                  }}
                />
              )}

              {/* City Selector */}
              <Pressable onPress={() => cities?.length && setShowCity(true)}>
                <InputTab placeholder="Select your city" value={values.city} editable={false} />
                {touched.city && errors.city && <ErrorText errorText={errors.city} />}
              </Pressable>

              {showCity && cities?.length > 0 && (
                <LocationModal
                  modalTitle="Select City"
                  visible={showCity}
                  onClose={() => setShowCity(false)}
                  values={cities}
                  onSelected={(city: any) => {
                    setFieldValue('city', city.label);
                    setShowCity(false);
                  }}
                />
              )}

              <InputTab placeholder="Postal Code" value={values.postalCode} onChangeText={handleChange('postalCode')} />
              {touched.postalCode && errors.postalCode && <ErrorText errorText={errors.postalCode} />}

              <SimpleButton btnText={editable === 'true' ? "Update Client" : "Add Client"} onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    </ScreenWrapper>
  );
};

export default AddClient;

const styles = StyleSheet.create({
  imageContainer: {
    height: mVs(100),
    width: mVs(100),
    borderRadius: mVs(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: mVs(10),
  },
  userAvatar: {
    height: mVs(100),
    width: mVs(100),
    borderRadius: mVs(50),
  },
});