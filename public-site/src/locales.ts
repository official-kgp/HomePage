import ja from './locales/ja.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import ptBR from './locales/pt-BR.json';

export const languages = [
  { id: 'ja', flag: '🇯🇵', label: '日本語' },
  { id: 'en', flag: '🇺🇸', label: 'English' },
  { id: 'zh', flag: '🇨🇳', label: '简体中文' },
  { id: 'ko', flag: '🇰🇷', label: '한국어' },
  { id: 'pt-BR', flag: '🇧🇷', label: 'Português (Brasil)' },
] as const;

export type Language = (typeof languages)[number]['id'];
export type Copy = typeof ja;

export const dictionaries: Record<Language, Copy> = {
  ja,
  en,
  zh,
  ko,
  'pt-BR': ptBR,
};

export function preferredLanguage(): Language {
  const saved = localStorage.getItem('kgp-language');
  if (saved && languages.some((language) => language.id === saved)) {
    return saved as Language;
  }

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('pt')) return 'pt-BR';
  if (browserLanguage.startsWith('zh')) return 'zh';
  if (browserLanguage.startsWith('ko')) return 'ko';
  if (browserLanguage.startsWith('en')) return 'en';
  return 'ja';
}