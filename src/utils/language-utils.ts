/**
 * Obtiene el nombre de visualización del idioma
 * @param langCode Código de idioma (formato de archivo de configuración o formato de servicio de traducción)
 * @returns Nombre de visualización del idioma
 */
export function getLanguageDisplayName(langCode: string): string {
  const languageNames: Record<string, string> = {
    zh_CN: "简体中文",
    zh_TW: "繁體中文",
    en: "English",
    ja: "日本語",
    ko: "한국어",
    es: "Español",
    th: "ไทย",
    vi: "Tiếng Việt",
    tr: "Türkçe",
    id: "Bahasa Indonesia",
    fr: "Français",
    de: "Deutsch",
    ru: "Русский",
    ar: "العربية",
    // Formato de servicio de traducción
    chinese_simplified: "简体中文",
    chinese_traditional: "繁體中文",
    english: "English",
    japanese: "日本語",
    korean: "한국어",
    spanish: "Español",
    thai: "ไทย",
    vietnamese: "Tiếng Việt",
    turkish: "Türkçe",
    indonesian: "Bahasa Indonesia",
    french: "Français",
    german: "Deutsch",
    russian: "Русский",
    arabic: "العربية",
  };

  return languageNames[langCode] || langCode;
}
