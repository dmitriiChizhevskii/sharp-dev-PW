import { resources, Language } from './i18n';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: typeof resources[Language.En];
  }
}