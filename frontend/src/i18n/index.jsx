import { createContext, useContext, useState, useEffect } from "react";
import en from "./translations/en";
import hi from "./translations/hi";
import ta from "./translations/ta";
import ar from "./translations/ar";
import fr from "./translations/fr";
import { APP_CONFIG } from "../config/constants";

const translations = { en, hi, ta, ar, fr };

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" }
];

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE) || "en";
  });

  const changeLanguage = (code) => {
    setLang(code);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE, code);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key) => {
    const keys = key.split(".");
    let result = translations[lang] || translations.en;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) break;
    }
    if (result === undefined) {
      result = translations.en;
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) return key;
      }
    }
    return result || key;
  };

  return (
    <I18nContext.Provider value={{ lang, changeLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

export default I18nProvider;
