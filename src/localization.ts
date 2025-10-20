export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh", name: "Chinese (Mandarin)", nativeName: "中文" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "he", name: "Hebrew", nativeName: "עברית" },
];

export interface LocalizedStrings {
  previousButton: string;
  nextButton: string;
  dismissTodayButton: string;
  dismissForeverButton: string;
  languageButton: string;
  tipOfTheDayTitle: string;
  contributedBy: string;
  suggestTipText: string;
  suggestTipLink: string;
}

export const UI_STRINGS: Record<string, LocalizedStrings> = {
  en: {
    previousButton: "Previous",
    nextButton: "Next",
    dismissTodayButton: "Dismiss Today",
    dismissForeverButton: "Dismiss Forever",
    languageButton: "Language",
    tipOfTheDayTitle: "💡 Tip Of The Day 💡",
    contributedBy: "Contributed by",
    suggestTipText: "Have a tip to share?",
    suggestTipLink: "Suggest your own tip!",
  },
  zh: {
    previousButton: "上一个",
    nextButton: "下一个",
    dismissTodayButton: "今日关闭",
    dismissForeverButton: "永久关闭",
    languageButton: "语言",
    tipOfTheDayTitle: "💡 每日提示 💡",
    contributedBy: "贡献者",
    suggestTipText: "有技巧要分享吗？",
    suggestTipLink: "建议您自己的技巧！",
  },
  hi: {
    previousButton: "पिछला",
    nextButton: "अगला",
    dismissTodayButton: "आज के लिए बंद करें",
    dismissForeverButton: "हमेशा के लिए बंद करें",
    languageButton: "भाषा",
    tipOfTheDayTitle: "💡 आज की युक्ति 💡",
    contributedBy: "योगदानकर्ता",
    suggestTipText: "साझा करने के लिए कोई युक्ति है?",
    suggestTipLink: "अपनी युक्ति सुझाएं!",
  },
  es: {
    previousButton: "Anterior",
    nextButton: "Siguiente",
    dismissTodayButton: "Descartar Hoy",
    dismissForeverButton: "Descartar Para Siempre",
    languageButton: "Idioma",
    tipOfTheDayTitle: "💡 Consejo Del Día 💡",
    contributedBy: "Contribuido por",
    suggestTipText: "¿Tienes un consejo para compartir?",
    suggestTipLink: "¡Sugiere tu propio consejo!",
  },
  fr: {
    previousButton: "Précédent",
    nextButton: "Suivant",
    dismissTodayButton: "Ignorer Aujourd'hui",
    dismissForeverButton: "Ignorer Pour Toujours",
    languageButton: "Langue",
    tipOfTheDayTitle: "💡 Astuce Du Jour 💡",
    contributedBy: "Contribué par",
    suggestTipText: "Vous avez une astuce à partager?",
    suggestTipLink: "Suggérez votre propre astuce!",
  },
  ar: {
    previousButton: "السابق",
    nextButton: "التالي",
    dismissTodayButton: "إغلاق اليوم",
    dismissForeverButton: "إغلاق للأبد",
    languageButton: "اللغة",
    tipOfTheDayTitle: "💡 نصيحة اليوم 💡",
    contributedBy: "ساهم بها",
    suggestTipText: "هل لديك نصيحة لمشاركتها؟",
    suggestTipLink: "اقترح نصيحتك الخاصة!",
  },
  bn: {
    previousButton: "পূর্ববর্তী",
    nextButton: "পরবর্তী",
    dismissTodayButton: "আজকের জন্য বন্ধ",
    dismissForeverButton: "চিরকালের জন্য বন্ধ",
    languageButton: "ভাষা",
    tipOfTheDayTitle: "💡 আজকের টিপস 💡",
    contributedBy: "অবদানকারী",
    suggestTipText: "শেয়ার করার জন্য টিপ আছে?",
    suggestTipLink: "আপনার নিজের টিপ সুझান!",
  },
  pt: {
    previousButton: "Anterior",
    nextButton: "Próximo",
    dismissTodayButton: "Dispensar Hoje",
    dismissForeverButton: "Dispensar Para Sempre",
    languageButton: "Idioma",
    tipOfTheDayTitle: "💡 Dica Do Dia 💡",
    contributedBy: "Contribuído por",
    suggestTipText: "Tem uma dica para compartilhar?",
    suggestTipLink: "Sugira sua própria dica!",
  },
  ru: {
    previousButton: "Назад",
    nextButton: "Далее",
    dismissTodayButton: "Закрыть На Сегодня",
    dismissForeverButton: "Закрыть Навсегда",
    languageButton: "Язык",
    tipOfTheDayTitle: "💡 Совет Дня 💡",
    contributedBy: "Внесено",
    suggestTipText: "Есть совет, которым можно поделиться?",
    suggestTipLink: "Предложите свой совет!",
  },
  ja: {
    previousButton: "前へ",
    nextButton: "次へ",
    dismissTodayButton: "今日は閉じる",
    dismissForeverButton: "完全に閉じる",
    languageButton: "言語",
    tipOfTheDayTitle: "💡 今日のヒント 💡",
    contributedBy: "貢献者",
    suggestTipText: "共有するヒントがありますか？",
    suggestTipLink: "自分のヒントを提案してください！",
  },
  he: {
    previousButton: "הקודם",
    nextButton: "הבא",
    dismissTodayButton: "סגור להיום",
    dismissForeverButton: "סגור לתמיד",
    languageButton: "שפה",
    tipOfTheDayTitle: "💡 הטיפ היומי 💡",
    contributedBy: "נתרם על ידי",
    suggestTipText: "יש לך טיפ לשתף?",
    suggestTipLink: "הצע טיפ משלך!",
  },
};

export function getLocalizedStrings(languageCode: string): LocalizedStrings {
  return UI_STRINGS[languageCode] || UI_STRINGS.en;
}

export function getSupportedLanguage(code: string): SupportedLanguage | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}
