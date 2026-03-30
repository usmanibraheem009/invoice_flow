import useTheme from '@/src/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';

const ArrowBack = () => {

    const {theme} = useTheme();

  return (
    <Ionicons name='arrow-back' size={24} onPress={() => router.back()} color={theme.colors.textPrimary} />
  )
}

export default ArrowBack
