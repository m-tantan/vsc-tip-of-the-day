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
  languageButton: string;
  tipOfTheDayTitle: string;
  contributedBy: string;
  suggestTipText: string;
  suggestTipLink: string;
  favoriteButton: string;
  unfavoriteButton: string;
  myFavoritesTitle: string;
  noFavoritesMessage: string;
  favoritesInstructions: string;
  shareButton: string;
  shareCopied: string;
}

export const UI_STRINGS: Record<string, LocalizedStrings> = {
  en: {
    previousButton: "Previous",
    nextButton: "Next",
    dismissTodayButton: "Dismiss Today",
    languageButton: "Language",
    tipOfTheDayTitle: "💡 Tip Of The Day 💡",
    contributedBy: "Contributed by",
    suggestTipText: "Have a tip to share?",
    suggestTipLink: "Suggest your own tip!",
    favoriteButton: "Add to Favorites",
    unfavoriteButton: "Remove from Favorites",
    myFavoritesTitle: "⭐ My Favorite Tips ⭐",
    noFavoritesMessage: "You haven't bookmarked any tips yet. Click the star icon on tips you find useful!",
    favoritesInstructions: "Access your favorites anytime with: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "Copy to clipboard",
    shareCopied: "Tip copied to clipboard!",
  },
  zh: {
    previousButton: "上一个",
    nextButton: "下一个",
    dismissTodayButton: "今日关闭",
    languageButton: "语言",
    tipOfTheDayTitle: "💡 每日提示 💡",
    contributedBy: "贡献者",
    suggestTipText: "有技巧要分享吗？",
    suggestTipLink: "建议您自己的技巧！",
    favoriteButton: "添加到收藏",
    unfavoriteButton: "从收藏中移除",
    myFavoritesTitle: "⭐ 我的收藏 ⭐",
    noFavoritesMessage: "您还没有收藏任何提示。点击您觉得有用的提示上的星标图标！",
    favoritesInstructions: "随时访问您的收藏：Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "复制到剪贴板",
    shareCopied: "提示已复制到剪贴板！",
  },
  hi: {
    previousButton: "पिछला",
    nextButton: "अगला",
    dismissTodayButton: "आज के लिए बंद करें",
    languageButton: "भाषा",
    tipOfTheDayTitle: "💡 आज की युक्ति 💡",
    contributedBy: "योगदानकर्ता",
    suggestTipText: "साझा करने के लिए कोई युक्ति है?",
    suggestTipLink: "अपनी युक्ति सुझाएं!",
    favoriteButton: "पसंदीदा में जोड़ें",
    unfavoriteButton: "पसंदीदा से हटाएं",
    myFavoritesTitle: "⭐ मेरी पसंदीदा युक्तियाँ ⭐",
    noFavoritesMessage: "आपने अभी तक कोई युक्ति बुकमार्क नहीं की है। उपयोगी युक्तियों पर स्टार आइकन पर क्लिक करें!",
    favoritesInstructions: "किसी भी समय अपने पसंदीदा तक पहुंचें: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "क्लिपबोर्ड पर कॉपी करें",
    shareCopied: "युक्ति क्लिपबोर्ड पर कॉपी की गई!",
  },
  es: {
    previousButton: "Anterior",
    nextButton: "Siguiente",
    dismissTodayButton: "Descartar Hoy",
    languageButton: "Idioma",
    tipOfTheDayTitle: "💡 Consejo Del Día 💡",
    contributedBy: "Contribuido por",
    suggestTipText: "¿Tienes un consejo para compartir?",
    suggestTipLink: "¡Sugiere tu propio consejo!",
    favoriteButton: "Agregar a Favoritos",
    unfavoriteButton: "Quitar de Favoritos",
    myFavoritesTitle: "⭐ Mis Consejos Favoritos ⭐",
    noFavoritesMessage: "Aún no has marcado ningún consejo. ¡Haz clic en el ícono de estrella en los consejos que encuentres útiles!",
    favoritesInstructions: "Accede a tus favoritos en cualquier momento con: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "Copiar al portapapeles",
    shareCopied: "¡Consejo copiado al portapapeles!",
  },
  fr: {
    previousButton: "Précédent",
    nextButton: "Suivant",
    dismissTodayButton: "Ignorer Aujourd'hui",
    languageButton: "Langue",
    tipOfTheDayTitle: "💡 Astuce Du Jour 💡",
    contributedBy: "Contribué par",
    suggestTipText: "Vous avez une astuce à partager?",
    suggestTipLink: "Suggérez votre propre astuce!",
    favoriteButton: "Ajouter aux Favoris",
    unfavoriteButton: "Retirer des Favoris",
    myFavoritesTitle: "⭐ Mes Astuces Favorites ⭐",
    noFavoritesMessage: "Vous n'avez pas encore marqué d'astuces. Cliquez sur l'icône étoile sur les astuces que vous trouvez utiles!",
    favoritesInstructions: "Accédez à vos favoris à tout moment avec: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "Copier dans le presse-papiers",
    shareCopied: "Astuce copiée dans le presse-papiers!",
  },
  ar: {
    previousButton: "السابق",
    nextButton: "التالي",
    dismissTodayButton: "إغلاق اليوم",
    languageButton: "اللغة",
    tipOfTheDayTitle: "💡 نصيحة اليوم 💡",
    contributedBy: "ساهم بها",
    suggestTipText: "هل لديك نصيحة لمشاركتها؟",
    suggestTipLink: "اقترح نصيحتك الخاصة!",
    favoriteButton: "إضافة إلى المفضلة",
    unfavoriteButton: "إزالة من المفضلة",
    myFavoritesTitle: "⭐ نصائحي المفضلة ⭐",
    noFavoritesMessage: "لم تقم بوضع إشارة مرجعية على أي نصائح بعد. انقر فوق رمز النجمة على النصائح التي تجدها مفيدة!",
    favoritesInstructions: "الوصول إلى المفضلة في أي وقت مع: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "نسخ إلى الحافظة",
    shareCopied: "تم نسخ النصيحة إلى الحافظة!",
  },
  bn: {
    previousButton: "পূর্ববর্তী",
    nextButton: "পরবর্তী",
    dismissTodayButton: "আজকের জন্য বন্ধ",
    languageButton: "ভাষা",
    tipOfTheDayTitle: "💡 আজকের টিপস 💡",
    contributedBy: "অবদানকারী",
    suggestTipText: "শেয়ার করার জন্য টিপ আছে?",
    suggestTipLink: "আপনার নিজের টিপ সুझান!",
    favoriteButton: "পছন্দের তালিকায় যুক্ত করুন",
    unfavoriteButton: "পছন্দের তালিকা থেকে সরান",
    myFavoritesTitle: "⭐ আমার পছন্দের টিপস ⭐",
    noFavoritesMessage: "আপনি এখনও কোনো টিপ বুকমার্ক করেননি। আপনার কাছে উপযোগী টিপগুলিতে তারকা আইকনে ক্লিক করুন!",
    favoritesInstructions: "যেকোনো সময় আপনার পছন্দের তালিকা অ্যাক্সেস করুন: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "ক্লিপবোর্ডে কপি করুন",
    shareCopied: "টিপ ক্লিপবোর্ডে কপি করা হয়েছে!",
  },
  pt: {
    previousButton: "Anterior",
    nextButton: "Próximo",
    dismissTodayButton: "Dispensar Hoje",
    languageButton: "Idioma",
    tipOfTheDayTitle: "💡 Dica Do Dia 💡",
    contributedBy: "Contribuído por",
    suggestTipText: "Tem uma dica para compartilhar?",
    suggestTipLink: "Sugira sua própria dica!",
    favoriteButton: "Adicionar aos Favoritos",
    unfavoriteButton: "Remover dos Favoritos",
    myFavoritesTitle: "⭐ Minhas Dicas Favoritas ⭐",
    noFavoritesMessage: "Você ainda não marcou nenhuma dica. Clique no ícone de estrela nas dicas que você achar úteis!",
    favoritesInstructions: "Acesse seus favoritos a qualquer momento com: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "Copiar para a área de transferência",
    shareCopied: "Dica copiada para a área de transferência!",
  },
  ru: {
    previousButton: "Назад",
    nextButton: "Далее",
    dismissTodayButton: "Закрыть На Сегодня",
    languageButton: "Язык",
    tipOfTheDayTitle: "💡 Совет Дня 💡",
    contributedBy: "Внесено",
    suggestTipText: "Есть совет, которым можно поделиться?",
    suggestTipLink: "Предложите свой совет!",
    favoriteButton: "Добавить в Избранное",
    unfavoriteButton: "Удалить из Избранного",
    myFavoritesTitle: "⭐ Мои Избранные Советы ⭐",
    noFavoritesMessage: "Вы еще не добавили советы в закладки. Нажмите на значок звезды на полезных советах!",
    favoritesInstructions: "Получите доступ к избранному в любое время: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "Скопировать в буфер обмена",
    shareCopied: "Совет скопирован в буфер обмена!",
  },
  ja: {
    previousButton: "前へ",
    nextButton: "次へ",
    dismissTodayButton: "今日は閉じる",
    languageButton: "言語",
    tipOfTheDayTitle: "💡 今日のヒント 💡",
    contributedBy: "貢献者",
    suggestTipText: "共有するヒントがありますか？",
    suggestTipLink: "自分のヒントを提案してください！",
    favoriteButton: "お気に入りに追加",
    unfavoriteButton: "お気に入りから削除",
    myFavoritesTitle: "⭐ お気に入りのヒント ⭐",
    noFavoritesMessage: "まだヒントをブックマークしていません。役立つヒントの星アイコンをクリックしてください！",
    favoritesInstructions: "いつでもお気に入りにアクセス: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "クリップボードにコピー",
    shareCopied: "ヒントがクリップボードにコピーされました！",
  },
  he: {
    previousButton: "הקודם",
    nextButton: "הבא",
    dismissTodayButton: "סגור להיום",
    languageButton: "שפה",
    tipOfTheDayTitle: "💡 הטיפ היומי 💡",
    contributedBy: "נתרם על ידי",
    suggestTipText: "יש לך טיפ לשתף?",
    suggestTipLink: "הצע טיפ משלך!",
    favoriteButton: "הוסף למועדפים",
    unfavoriteButton: "הסר ממועדפים",
    myFavoritesTitle: "⭐ הטיפים המועדפים שלי ⭐",
    noFavoritesMessage: "עדיין לא סימנת טיפים. לחץ על אייקון הכוכב בטיפים שאתה מוצא שימושיים!",
    favoritesInstructions: "גישה למועדפים שלך בכל עת עם: Ctrl+Shift+P > TOTD: View Favorites",
    shareButton: "העתק ללוח",
    shareCopied: "הטיפ הועתק ללוח!",
  },
};

export function getLocalizedStrings(languageCode: string): LocalizedStrings {
  return UI_STRINGS[languageCode] || UI_STRINGS.en;
}

export function getSupportedLanguage(code: string): SupportedLanguage | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}
