import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common from './en/common.json';

export enum Language {
  En = 'en-US',
}

export const resources = {
  [Language.En]: {
    common
  },
} as const;

export const defaultNS = 'common';

const nameSpacing = Object.keys(resources[Language.En]);

i18n.use(initReactI18next).init({
  ns: nameSpacing,
  defaultNS,
  resources,
  lng: Language.En,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
