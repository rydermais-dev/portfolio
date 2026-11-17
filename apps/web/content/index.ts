import ptBR from './pt-BR.json';
import ptPT from './pt.json';
import en from './en.json';
import es from './es.json';
import de from './de.json';
import fr from './fr.json';
import ja from './ja-JP.json';
import ko from './ko.json';
import ru from './ru.json';

export const dictionaries = { 'pt-BR': ptBR, 'pt-PT': ptPT, en, es, de, fr, 'ja-JP': ja, ko, ru };
export type Locale = keyof typeof dictionaries;
export const locales = Object.keys(dictionaries) as Locale[];
export const languages = {
  'pt-BR': ['Português (Brasil)', 'Brazil'], 'pt-PT': ['Português (Portugal)', 'Portugal'],
  en: ['English', 'USA'], es: ['Español', 'Spain'], de: ['Deutsch', 'Germany'],
  fr: ['Français', 'France'], 'ja-JP': ['日本語', 'Japan'], ko: ['한국어', 'SouthKorea'],
  ru: ['Русский', 'Russia'],
} satisfies Record<Locale, [string, string]>;

export function isLocale(value: string): value is Locale {
  return Object.hasOwn(dictionaries, value);
}

export function translate(locale: Locale, key: string): string {
  function find(source: unknown) {
    return key.split('.').reduce<unknown>((value, part) => value && typeof value === 'object'
      ? (value as Record<string, unknown>)[part] : undefined, source);
  }
  const value = find(dictionaries[locale]);
  const fallback = find(ptBR);
  return typeof value === 'string' && value ? value : typeof fallback === 'string' ? fallback : '';
}

export function https(value?: string | null) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined;
  } catch {
    return undefined;
  }
}
