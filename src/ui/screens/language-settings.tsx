import { useTheme } from '@/src/hooks/useTheme';
import { changeLanguage, getCurrentLanguage, LANGUAGES } from '@/src/locales/i18n';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

const LanguageScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selected, setSelected] = useState(getCurrentLanguage());
  const [loading, setLoading] = useState(false);

  const handleSelectLanguage = async (langCode: string) => {
    if (langCode === selected) return;
    setSelected(langCode);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await changeLanguage(selected);
    } catch (error) {
      Alert.alert('Error', 'Failed to change language');
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border.primary }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={mVs(24)} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
          {t('settings.selectLanguage')}
        </Text>
        <View style={{ width: mVs(24) }} />
      </View>

      {/* Language List */}
      <View style={styles.list}>
        {LANGUAGES.map((lang) => {
          const isSelected = selected === lang.code;
          return (
            <Pressable
              key={lang.code}
              style={[
                styles.langItem,
                {
                  backgroundColor: isSelected ? theme.background.secondary : theme.background.primary,
                  borderColor: isSelected ? theme.border.tertiary : theme.border.secondary,
                }
              ]}
              onPress={() => handleSelectLanguage(lang.code)}
            >
              <View style={styles.langInfo}>
                <Text style={[styles.nativeLabel, { color: theme.text.primary }]}>
                  {lang.nativeLabel}
                </Text>
                <Text style={[styles.langLabel, { color: theme.text.secondary }]}>
                  {lang.label}
                </Text>
              </View>

              {isSelected && (
                <Ionicons name="checkmark-circle" size={mVs(24)} color={theme.border.tertiary} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Save Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.saveBtn, { backgroundColor: theme.border.tertiary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>
            {loading ? t('common.loading') : t('common.save')}
          </Text>
        </Pressable>
      </View>

    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: mVs(20),
    paddingTop: mVs(50),
    paddingBottom: mVs(16),
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: mVs(4),
  },
  headerTitle: {
    fontSize: mVs(18),
    fontWeight: '600',
  },
  list: {
    flex: 1,
    padding: mVs(20),
    gap: mVs(12),
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: mVs(16),
    borderRadius: mVs(12),
    borderWidth: 1.5,
  },
  langInfo: {
    gap: mVs(4),
  },
  nativeLabel: {
    fontSize: mVs(18),
    fontWeight: '600',
  },
  langLabel: {
    fontSize: mVs(13),
    fontWeight: '400',
  },
  footer: {
    padding: mVs(20),
    paddingBottom: mVs(36),
  },
  saveBtn: {
    padding: mVs(16),
    borderRadius: mVs(12),
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: mVs(16),
    fontWeight: '700',
  },
});
