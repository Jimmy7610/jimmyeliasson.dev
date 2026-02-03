import svTranslations from './sv.json';
import enTranslations from './en.json';

export type Lang = 'sv' | 'en';

const translations = {
    sv: svTranslations,
    en: enTranslations,
} as const;

/**
 * Get initial language from browser
 * Priority: localStorage > browser language detection
 */
export function getInitialLang(): Lang {
    if (typeof window === 'undefined') return 'en';

    const stored = localStorage.getItem('lang');
    if (stored === 'sv' || stored === 'en') return stored;

    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('sv') ? 'sv' : 'en';
}

/**
 * Get current language
 * Falls back to browser detection if not in localStorage
 */
export function getLang(): Lang {
    if (typeof window === 'undefined') return 'en';

    const stored = localStorage.getItem('lang');
    if (stored === 'sv' || stored === 'en') return stored;

    return getInitialLang();
}

/**
 * Set language and persist to localStorage
 * Dispatches 'langchange' event for islands to listen to
 */
export function setLang(lang: Lang): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    // Dispatch custom event for React islands
    window.dispatchEvent(
        new CustomEvent('langchange', { detail: { lang } })
    );
}

/**
 * Get translation by key
 * Supports nested keys with dot notation (e.g., 'nav.home')
 */
export function t(key: string, lang?: Lang): string {
    const currentLang = lang || getLang();
    const keys = key.split('.');

    let value: any = translations[currentLang];

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            // Fallback to English if key not found
            value = translations.en;
            for (const fallbackKey of keys) {
                if (value && typeof value === 'object' && fallbackKey in value) {
                    value = value[fallbackKey];
                } else {
                    return key; // Return key if not found anywhere
                }
            }
            break;
        }
    }

    return typeof value === 'string' ? value : key;
}

/**
 * React hook for translations in islands
 */
export function useTranslation() {
    if (typeof window === 'undefined') {
        return { lang: 'en' as Lang, t: (key: string) => key };
    }

    const [lang, setLangState] = (window as any).React?.useState?.(getLang()) || [getLang(), () => { }];

    (window as any).React?.useEffect?.(() => {
        const handleLangChange = (e: CustomEvent<{ lang: Lang }>) => {
            setLangState(e.detail.lang);
        };

        window.addEventListener('langchange', handleLangChange as EventListener);
        return () => window.removeEventListener('langchange', handleLangChange as EventListener);
    }, []);

    return {
        lang,
        t: (key: string) => t(key, lang),
    };
}
