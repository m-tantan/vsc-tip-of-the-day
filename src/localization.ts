export interface SupportedLanguage {
    code: string;
    name: string;
    nativeName: string;
}

// Top 10 most spoken languages + Hebrew as requested
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' }
];

export interface LocalizedStrings {
    previousButton: string;
    nextButton: string;
    dismissTodayButton: string;
    dismissForeverButton: string;
    languageButton: string;
    tipOfTheDayTitle: string;
}

export const UI_STRINGS: Record<string, LocalizedStrings> = {
    en: {
        previousButton: 'Previous',
        nextButton: 'Next',
        dismissTodayButton: 'Dismiss Today',
        dismissForeverButton: 'Dismiss Forever',
        languageButton: 'Language',
        tipOfTheDayTitle: '💡 Tip Of The Day 💡'
    },
    zh: {
        previousButton: '上一个',
        nextButton: '下一个',
        dismissTodayButton: '今日关闭',
        dismissForeverButton: '永久关闭',
        languageButton: '语言',
        tipOfTheDayTitle: '💡 每日提示 💡'
    },
    hi: {
        previousButton: 'पिछला',
        nextButton: 'अगला',
        dismissTodayButton: 'आज के लिए बंद करें',
        dismissForeverButton: 'हमेशा के लिए बंद करें',
        languageButton: 'भाषा',
        tipOfTheDayTitle: '💡 आज की युक्ति 💡'
    },
    es: {
        previousButton: 'Anterior',
        nextButton: 'Siguiente',
        dismissTodayButton: 'Descartar Hoy',
        dismissForeverButton: 'Descartar Para Siempre',
        languageButton: 'Idioma',
        tipOfTheDayTitle: '💡 Consejo Del Día 💡'
    },
    fr: {
        previousButton: 'Précédent',
        nextButton: 'Suivant',
        dismissTodayButton: 'Ignorer Aujourd\'hui',
        dismissForeverButton: 'Ignorer Pour Toujours',
        languageButton: 'Langue',
        tipOfTheDayTitle: '💡 Astuce Du Jour 💡'
    },
    ar: {
        previousButton: 'السابق',
        nextButton: 'التالي',
        dismissTodayButton: 'إغلاق اليوم',
        dismissForeverButton: 'إغلاق للأبد',
        languageButton: 'اللغة',
        tipOfTheDayTitle: '💡 نصيحة اليوم 💡'
    },
    bn: {
        previousButton: 'পূর্ববর্তী',
        nextButton: 'পরবর্তী',
        dismissTodayButton: 'আজকের জন্য বন্ধ',
        dismissForeverButton: 'চিরকালের জন্য বন্ধ',
        languageButton: 'ভাষা',
        tipOfTheDayTitle: '💡 আজকের টিপস 💡'
    },
    pt: {
        previousButton: 'Anterior',
        nextButton: 'Próximo',
        dismissTodayButton: 'Dispensar Hoje',
        dismissForeverButton: 'Dispensar Para Sempre',
        languageButton: 'Idioma',
        tipOfTheDayTitle: '💡 Dica Do Dia 💡'
    },
    ru: {
        previousButton: 'Назад',
        nextButton: 'Далее',
        dismissTodayButton: 'Закрыть На Сегодня',
        dismissForeverButton: 'Закрыть Навсегда',
        languageButton: 'Язык',
        tipOfTheDayTitle: '💡 Совет Дня 💡'
    },
    ja: {
        previousButton: '前へ',
        nextButton: '次へ',
        dismissTodayButton: '今日は閉じる',
        dismissForeverButton: '完全に閉じる',
        languageButton: '言語',
        tipOfTheDayTitle: '💡 今日のヒント 💡'
    },
    he: {
        previousButton: 'הקודם',
        nextButton: 'הבא',
        dismissTodayButton: 'סגור להיום',
        dismissForeverButton: 'סגור לתמיד',
        languageButton: 'שפה',
        tipOfTheDayTitle: '💡 טיפ של היום 💡'
    }
};

export function getLocalizedStrings(languageCode: string): LocalizedStrings {
    return UI_STRINGS[languageCode] || UI_STRINGS.en;
}

export function getSupportedLanguage(code: string): SupportedLanguage | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}