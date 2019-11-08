import { createIntl, createIntlCache, defineMessages } from "react-intl";
import english from "./en";
import indonesian from "./id";
import korean from "./ko";

type Locales = "en" | "ko" | "id";

export function getIntl(locale: Locales) {
    const cache = createIntlCache();
    switch (locale) {
        case "id":
            return createIntl({ locale: "id", messages: indonesian, onError: () => { } }, cache);
        case "ko":
            return createIntl({ locale: "ko", messages: korean, onError: () => { } }, cache);
        default:
        case "en":
            return createIntl({ locale: "en", messages: english }, cache);
    }
}
