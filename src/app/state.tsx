import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type Dict } from '../i18n/en';
import { ru } from '../i18n/ru';
import { uz } from '../i18n/uz';
import { contentEn, type ContentDict, type ConceptId } from '../i18n/content-en';
import { contentRu } from '../i18n/content-ru';
import { contentUz } from '../i18n/content-uz';

// ── Locales ─────────────────────────────────────────────────

export const LOCALES = ['en', 'ru', 'uz'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const DICTS: Record<Locale, Dict> = { en, ru, uz };
const CONTENTS: Record<Locale, ContentDict> = { en: contentEn, ru: contentRu, uz: contentUz };

export const LOCALE_LABELS: Record<Locale, { native: string; short: string }> = {
  en: { native: 'English', short: 'EN' },
  ru: { native: 'Русский', short: 'RU' },
  uz: { native: "O'zbekcha", short: 'UZ' },
};

function isLocale(v: string | undefined): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

// ── Route parsing ───────────────────────────────────────────

export interface Route {
  locale: Locale;
  /** path segments after the locale, e.g. ['learn','dns'] */
  segments: string[];
  /** full hash path, e.g. /en/learn/dns */
  path: string;
}

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, '');
  const parts = raw.split('/').filter(Boolean);
  if (isLocale(parts[0])) {
    return { locale: parts[0], segments: parts.slice(1), path: '/' + parts.join('/') };
  }
  const stored = safeGet('iv.locale');
  const locale = isLocale(stored ?? undefined) ? (stored as Locale) : detectLocale();
  return { locale, segments: parts, path: '/' + [locale, ...parts].join('/') };
}

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  for (const lang of navigator.languages ?? [navigator.language]) {
    const base = (lang ?? '').slice(0, 2).toLowerCase();
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

function safeGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function safeSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* storage unavailable */
  }
}

/** Navigate to a locale-relative path such as `/learn/dns`. */
export function go(locale: Locale, path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  window.location.hash = `/${locale}${clean === '/' ? '' : clean}`;
}

// ── Preferences & progress ──────────────────────────────────

export type Theme = 'dark' | 'light';
export type Detail = 'simple' | 'technical';

interface Progress {
  done: string[];
  quiz: { at: number; score: number; total: number }[];
  last: string | null;
}

const emptyProgress: Progress = { done: [], quiz: [], last: null };

function loadProgress(): Progress {
  try {
    const raw = safeGet('iv.progress');
    return raw ? { ...emptyProgress, ...(JSON.parse(raw) as Partial<Progress>) } : emptyProgress;
  } catch {
    return emptyProgress;
  }
}

interface AppCtx {
  locale: Locale;
  route: Route;
  t: Dict;
  c: ContentDict;
  setLocale: (l: Locale) => void;
  nav: (path: string) => void;
  href: (path: string) => string;
  theme: Theme;
  setTheme: (t: Theme) => void;
  detail: Detail;
  setDetail: (d: Detail) => void;
  motion: boolean;
  setMotion: (v: boolean) => void;
  /** true when animation should be suppressed (user pref or OS pref) */
  reduceMotion: boolean;
  progress: Progress;
  isDone: (id: string) => boolean;
  toggleDone: (id: string) => void;
  setLast: (id: string) => void;
  recordQuiz: (score: number, total: number) => void;
  resetProgress: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [theme, setThemeState] = useState<Theme>(() => (safeGet('iv.theme') === 'light' ? 'light' : 'dark'));
  const [detail, setDetailState] = useState<Detail>(() => (safeGet('iv.detail') === 'technical' ? 'technical' : 'simple'));
  const [motion, setMotionState] = useState<boolean>(() => safeGet('iv.motion') !== 'off');
  const [osReduce, setOsReduce] = useState(false);
  const [progress, setProgress] = useState<Progress>(loadProgress);

  // Ensure the URL always carries a locale so deep links and refresh work.
  useEffect(() => {
    const expected = `#/${route.locale}${route.segments.length ? '/' + route.segments.join('/') : ''}`;
    if (window.location.hash !== expected) window.location.replace(expected);
  }, [route]);

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setOsReduce(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.lang = route.locale;
  }, [theme, route.locale]);

  useEffect(() => safeSet('iv.progress', JSON.stringify(progress)), [progress]);

  const setLocale = useCallback(
    (l: Locale) => {
      safeSet('iv.locale', l);
      // Preserve the current page when switching language.
      window.location.hash = `/${l}${route.segments.length ? '/' + route.segments.join('/') : ''}`;
    },
    [route.segments],
  );

  const nav = useCallback((path: string) => go(route.locale, path), [route.locale]);
  const href = useCallback((path: string) => `#/${route.locale}${path === '/' ? '' : path}`, [route.locale]);

  const setTheme = useCallback((v: Theme) => {
    safeSet('iv.theme', v);
    setThemeState(v);
  }, []);
  const setDetail = useCallback((v: Detail) => {
    safeSet('iv.detail', v);
    setDetailState(v);
  }, []);
  const setMotion = useCallback((v: boolean) => {
    safeSet('iv.motion', v ? 'on' : 'off');
    setMotionState(v);
  }, []);

  const isDone = useCallback((id: string) => progress.done.includes(id), [progress.done]);
  const toggleDone = useCallback(
    (id: string) => setProgress((p) => ({ ...p, done: p.done.includes(id) ? p.done.filter((x) => x !== id) : [...p.done, id] })),
    [],
  );
  const setLast = useCallback((id: string) => setProgress((p) => (p.last === id ? p : { ...p, last: id })), []);
  const recordQuiz = useCallback(
    (score: number, total: number) => setProgress((p) => ({ ...p, quiz: [...p.quiz, { at: Date.now(), score, total }].slice(-30) })),
    [],
  );
  const resetProgress = useCallback(() => setProgress(emptyProgress), []);

  const value = useMemo<AppCtx>(
    () => ({
      locale: route.locale,
      route,
      t: DICTS[route.locale],
      c: CONTENTS[route.locale],
      setLocale,
      nav,
      href,
      theme,
      setTheme,
      detail,
      setDetail,
      motion,
      setMotion,
      reduceMotion: !motion || osReduce,
      progress,
      isDone,
      toggleDone,
      setLast,
      recordQuiz,
      resetProgress,
    }),
    [route, setLocale, nav, href, theme, setTheme, detail, setDetail, motion, setMotion, osReduce, progress, isDone, toggleDone, setLast, recordQuiz, resetProgress],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
}

/** Convenience: concept content for the active locale, with a safe fallback. */
export function useConcept(id: ConceptId) {
  const { c } = useApp();
  return c.concepts[id] ?? contentEn.concepts[id];
}
