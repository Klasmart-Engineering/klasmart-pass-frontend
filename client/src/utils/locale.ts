import { fallbackLocale, getIntl, localeCodes } from "../locale/locale";

const localeCache = new Map<string, ReturnType<typeof getIntl>>();

export function getDefaultLanguageCode() {
    for (const language of navigator.languages) {
        if (localeCodes.indexOf(language) !== -1) {
            return language;
        }
    }
    return "en";
}

export function getLanguage(languageCode: string) {
    let language = localeCache.get(languageCode);
    if (language !== undefined) { return language; }
    language = getIntl(languageCode);
    localeCache.set(languageCode, language);
    if (language !== undefined) { return language; }
    return fallbackLocale;
}
