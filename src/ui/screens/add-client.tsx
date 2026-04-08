import ScreenWrapper from '@/src/components/layout/screen-wrapper';
import InputTab from '@/src/components/primitives/input-tab';
import LocationModal from '@/src/components/primitives/location-modal';
import SimpleButton from '@/src/components/primitives/simple-button';
import useTheme from '@/src/hooks/useTheme';
import { addClient } from '@/src/redux/slices/clientsSlice';
import { clearProfileImage, setProfileImage } from '@/src/redux/slices/imageSlice';
import { fetchCities, fetchCountries, fetchStates } from '@/src/redux/slices/locationSlice';
import { initialValues, validationSchema } from '@/src/utils/auth-form';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';
import ErrorText from '../components/error-text';
import AuthHeader from '../components/screen-header';

const AddClient = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<any>();
  const imageUrl = useSelector((state: any) => state.imageReducer.imageUrl);
  const { countries, states, cities } = useSelector((state: any) => state.locationReducer);

  const [showCountry, setShowCountry] = useState(false);
  const [showState, setShowState] = useState(false);
  const [showCity, setShowCity] = useState(false);

  // Load countries on mount
  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  const OpenImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(setProfileImage(result.assets[0].uri));
    }
  };

  // Submit handler
  const onSubmitFunc = (values: any) => {
    const newClient = {
      id: uuid.v4().toString(),
      clientName: values.clientName,
      clientEmail: values.clientEmail,
      phone: values.phone,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      orgName: values.orgName,
      country: values.country,
      state: values.state,
      city: values.city,
      postalCode: values.postalCode || '',
      profileImage: imageUrl || '',
    }
    setShowCountry(false);
    setShowState(false);
    setShowCity(false);

    dispatch(addClient(newClient));
    dispatch(clearProfileImage());
    router.replace('/(tabs)/clients');
  };

  return (
    <ScreenWrapper scrollable keyboardAvoidingView>
      <AuthHeader arrowBack title="Client Details" />

      <View style={{ paddingHorizontal: mVs(20) }}>
        <Formik
          initialValues={initialValues.addNewClient}
          validationSchema={validationSchema.addNewClient}
          onSubmit={onSubmitFunc}
        >
          {({ errors, values, touched, handleSubmit, handleChange, setFieldValue }: any) => (
            <View style={{ gap: 12, paddingBottom: 20 }}>
              <Pressable onPress={OpenImagePicker} style={[styles.imageContainer, { backgroundColor: imageUrl ? 'transparent' : 'grey' }]}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.userAvatar} />
                ) : (
                  <Ionicons name="camera" size={24} />
                )}
              </Pressable>

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

              <SimpleButton btnText="Add Client" onPress={handleSubmit} />
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