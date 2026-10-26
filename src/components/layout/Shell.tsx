import { useEffect, useState, type ReactNode } from 'react';
import { BookMarked, BookOpen, Check, GraduationCap, Home, Languages, Map as MapIcon, Menu, Moon, Route, Search, Settings as SettingsIcon, Sun, X } from 'lucide-react';
import { LOCALES, LOCALE_LABELS, useApp, type Locale } from '../../app/state';
import { CONCEPTS } from '../../content/curriculum';
import { Button, IconButton, Progress } from '../ui';
import { SearchDialog } from './SearchDialog';
import { cn } from '../../utils/cn';

interface NavEntry {
  to: string;
  label: string;
  icon: ReactNode;
  group: 'discover' | 'study' | 'more';
}

export function Shell({ children }: { children: ReactNode }) {
  const { t, theme, setTheme, route, nav, href, progress } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const path = '/' + route.segments.join('/');
  useEffect(() => setMenuOpen(false), [route.path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest('input,textarea,select');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const entries: NavEntry[] = [
    { to: '/', label: t.nav.home, icon: <Home size={16} />, group: 'discover' },
    { to: '/map', label: t.nav.explore, icon: <MapIcon size={16} />, group: 'discover' },
    { to: '/journey', label: t.nav.journey, icon: <Route size={16} />, group: 'discover' },
    { to: '/learn', label: t.nav.learn, icon: <BookOpen size={16} />, group: 'study' },
    { to: '/quiz', label: t.nav.quiz, icon: <GraduationCap size={16} />, group: 'study' },
    { to: '/glossary', label: t.nav.glossary, icon: <BookMarked size={16} />, group: 'study' },
    { to: '/settings', label: t.nav.settings, icon: <SettingsIcon size={16} />, group: 'more' },
  ];

  const isActive = (to: string) => (to === '/' ? path === '/' : path === to || path.startsWith(to + '/'));
  const pct = progress.done.length / CONCEPTS.length;

  const groups: { id: NavEntry['group']; label: string }[] = [
    { id: 'discover', label: t.nav.sections.discover },
    { id: 'study', label: t.nav.sections.study },
    { id: 'more', label: t.nav.sections.more },
  ];

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {t.nav.skip}
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-hairline dark:bg-canvas/85">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
          <button className="-ml-1 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-raised lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label={t.nav.menu} aria-expanded={menuOpen}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <a href={href('/')} className="flex items-center gap-2.5" onClick={(e) => { e.preventDefault(); nav('/'); }}>
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-brand-500 to-teal-400 text-[11px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(43,116,245,0.9)]">
              IV
            </span>
            <span className="hidden text-[15px] font-semibold tracking-tight sm:block">{t.meta.title}</span>
          </a>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-[10px] border border-slate-300 px-2.5 text-[13px] text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-800 dark:border-edge dark:text-muted dark:hover:border-slate-500 dark:hover:text-ink"
              aria-label={t.search.open}
            >
              <Search size={15} />
              <span className="hidden md:inline">{t.nav.search}</span>
              <kbd className="hidden rounded border border-slate-300 px-1 font-mono text-[9px] dark:border-edge lg:inline">⌘K</kbd>
            </button>

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                aria-label={t.a11y.languageSwitcher}
                aria-expanded={langOpen}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border border-slate-300 px-2.5 text-[13px] font-medium transition-colors hover:border-slate-400 dark:border-edge dark:hover:border-slate-500"
              >
                <Languages size={15} />
                <span className="font-mono text-[11px]">{LOCALE_LABELS[route.locale].short}</span>
              </button>
              {langOpen && <LanguageMenu onClose={() => setLangOpen(false)} />}
            </div>

            <IconButton label={t.a11y.themeToggle} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </IconButton>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <nav
          aria-label={t.nav.menu}
          className={cn(
            'fixed inset-y-16 left-0 z-30 w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 transition-transform thin-scroll dark:border-hairline dark:bg-canvas lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
            menuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          )}
        >
          {groups.map((g) => (
            <div key={g.id} className="mb-4">
              <div className="eyebrow px-2 pb-1.5 text-slate-400 dark:text-faint">{g.label}</div>
              <ul className="space-y-0.5">
                {entries.filter((e) => e.group === g.id).map((e) => {
                  const active = isActive(e.to);
                  return (
                    <li key={e.to}>
                      <a
                        href={href(e.to)}
                        onClick={(ev) => { ev.preventDefault(); nav(e.to); }}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13.5px] transition-colors',
                          active
                            ? 'bg-brand-500/12 font-semibold text-brand-700 dark:text-brand-200'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-muted dark:hover:bg-raised dark:hover:text-ink',
                        )}
                      >
                        <span className={cn('shrink-0', active ? 'text-brand-500' : '')}>{e.icon}</span>
                        {e.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="mt-6 rounded-[14px] border border-slate-200 p-3.5 dark:border-hairline">
            <div className="eyebrow mb-2 text-slate-500 dark:text-faint">{t.learn.yourProgress}</div>
            <Progress value={pct} showValue label={t.a11y.progressBar} />
            <p className="mt-2 text-[11.5px] text-slate-500 dark:text-muted">
              {progress.done.length} / {CONCEPTS.length} {t.learn.conceptsDone}
            </p>
            {progress.done.length < CONCEPTS.length && (
              <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => nav(`/learn/${progress.last ?? CONCEPTS[0].id}`)}>
                {progress.done.length ? t.common.continue : t.common.startLearning}
              </Button>
            )}
          </div>
        </nav>

        {menuOpen && <div className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden />}

        <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
          <footer className="mt-16 border-t border-slate-200 pt-6 text-[11.5px] leading-relaxed text-slate-400 dark:border-hairline dark:text-faint">
            {t.meta.title} — {t.meta.tagline} · {t.common.simulatedHint}
          </footer>
        </main>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

function LanguageMenu({ onClose }: { onClose: () => void }) {
  const { locale, setLocale } = useApp();
  useEffect(() => {
    const onDoc = () => onClose();
    const id = window.setTimeout(() => document.addEventListener('click', onDoc, { once: true }), 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('click', onDoc);
    };
  }, [onClose]);
  return (
    <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[var(--shadow-lift)] dark:border-edge dark:bg-overlay">
      {LOCALES.map((l: Locale) => (
        <button
          key={l}
          onClick={() => { setLocale(l); onClose(); }}
          className={cn(
            'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13.5px] transition-colors hover:bg-slate-100 dark:hover:bg-raised',
            l === locale && 'font-semibold text-brand-600 dark:text-brand-300',
          )}
        >
          {LOCALE_LABELS[l].native}
          {l === locale && <Check size={14} />}
        </button>
      ))}
    </div>
  );
}
