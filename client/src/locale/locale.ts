import { createIntl, createIntlCache, defineMessages } from "react-intl";
import english from "./en";
import korean from "./ko";

type Locales = "en" | "ko";

export function getIntl(locale: Locales) {
    const cache = createIntlCache();
    switch (locale) {
        case "ko":
            return createIntl({locale: "ko", messages: korean, onError: () => {}}, cache);
        default:
        case "en":
            return createIntl({locale: "en", messages: english}, cache);
    }
}
