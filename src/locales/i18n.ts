import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import en from "./en";
import hi from "./hi";
import ur from "./ur";
import zh from "./zh";

export const LANGUAGE_KEY = "app_language";

export const LANGUAGES = [
    { code: "en", label: "English", nativeLabel: "English", isRTL: false },
    { code: "ur", label: "Urdu", nativeLabel: "اردو", isRTL: true },
    { code: "zh", label: "Chinese", nativeLabel: "中文", isRTL: false },
    { code: "hi", label: "Hindi", nativeLabel: "हिंदी", isRTL: false },
];

export const initI18n = async () => {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);

    await i18n
        .use(initReactI18next)
        .init({
            resources: {
                en: { translation: en },
                ur: { translation: ur },
                zh: { translation: zh },
                hi: { translation: hi },
            },
            lng: savedLang ?? "en",
            fallbackLng: "en",
            interpolation: {
                escapeValue: false,
            },
        });

    // Apply RTL if saved language is RTL
    const isRTL = savedLang === "ur";

    if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
    }
};

export const changeLanguage = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    await AsyncStorage.setItem(LANGUAGE_KEY, langCode);

    const lang = LANGUAGES.find((l) => l.code === langCode);
    const isRTL = lang?.isRTL ?? false;

    if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        // Note: RTL change requires app restart to take full effect
        // You can use expo-updates or RNRestart to handle this
    }
};

export const getCurrentLanguage = () => i18n.language;

export const getTranslations = (lang?: string) => {
    const resources: Record<string, any> = { en, ur, zh, hi };
    return resources[lang ?? i18n.language] ?? en;
};

export default i18n;