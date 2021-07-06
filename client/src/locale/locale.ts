import { createIntl, createIntlCache } from "react-intl";

import english from "./en.json";
import indonesian from "./id.json";
import korean from "./ko.json";

import brandedEnglish from "@branding/locale/en.json";
import brandedIndonesian from "@branding/locale/id.json";
import brandedKorean from "@branding/locale/ko.json";

Object.assign(english, brandedEnglish);
Object.assign(indonesian, brandedIndonesian);
Object.assign(korean, brandedKorean);

export const localeCodes = ["en", "ko", "id"];
const intlCache = createIntlCache();
export const fallbackLocale = createIntl(
  { locale: "en", messages: english },
  intlCache
);
export function getIntl(locale: string) {
  switch (locale) {
    case "id":
      return createIntl(
        { locale: "id", messages: indonesian, onError: () => { } },
        intlCache
      );
    case "ko":
      return createIntl({ locale: "ko", messages: korean }, intlCache);
    case "en":
      return createIntl({ locale: "en", messages: english }, intlCache);
  }
}
