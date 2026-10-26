import { useEffect, useMemo, useRef, useState } from 'react';
import { BookMarked, BookOpen, Layers, Search, X } from 'lucide-react';
import { useApp } from '../../app/state';
import { CONCEPTS, GLOSSARY_IDS, LEVELS } from '../../content/curriculum';
import { cn } from '../../utils/cn';

interface Hit {
  id: string;
  group: 'concepts' | 'glossary' | 'levels' | 'pages';
  title: string;
  detail: string;
  to: string;
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, c, nav } = useApp();
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo<Hit[]>(() => {
    const out: Hit[] = [];
    for (const meta of CONCEPTS) {
      const cc = c.concepts[meta.id];
      out.push({
        id: `c-${meta.id}`,
        group: 'concepts',
        title: cc.title,
        detail: `${cc.tagline} ${cc.takeaway} ${cc.terms.map((x) => x.t).join(' ')}`,
        to: `/learn/${meta.id}`,
      });
    }
    for (const gid of GLOSSARY_IDS) {
      const g = c.glossary[gid];
      out.push({ id: `g-${gid}`, group: 'glossary', title: g.term, detail: `${g.short} ${g.full}`, to: `/glossary/${gid}` });
    }
    for (const lv of LEVELS) {
      const l = t.levels[lv];
      out.push({ id: `l-${lv}`, group: 'levels', title: l.title, detail: l.desc, to: `/learn#${lv}` });
    }
    out.push(
      { id: 'p-map', group: 'pages', title: t.nav.explore, detail: t.map.lead, to: '/map' },
      { id: 'p-journey', group: 'pages', title: t.nav.journey, detail: t.journey.lead, to: '/journey' },
      { id: 'p-quiz', group: 'pages', title: t.nav.quiz, detail: t.quiz.lead, to: '/quiz' },
      { id: 'p-glossary', group: 'pages', title: t.nav.glossary, detail: t.glossary.lead, to: '/glossary' },
      { id: 'p-settings', group: 'pages', title: t.nav.settings, detail: t.settings.lead, to: '/settings' },
    );
    return out;
  }, [c, t]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    const scored = index
      .map((h) => {
        const title = h.title.toLowerCase();
        if (title.startsWith(needle)) return { h, s: 0 };
        if (title.includes(needle)) return { h, s: 1 };
        if (h.detail.toLowerCase().includes(needle)) return { h, s: 2 };
        return null;
      })
      .filter(Boolean) as { h: Hit; s: number }[];
    return scored.sort((a, b) => a.s - b.s).slice(0, 12).map((x) => x.h);
  }, [q, index]);

  useEffect(() => {
    if (open) {
      setQ('');
      setCursor(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => setCursor(0), [q]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const openHit = (h: Hit) => {
    onClose();
    nav(h.to);
  };

  const groupLabels = t.search.groups;
  const order: Hit['group'][] = ['concepts', 'glossary', 'levels', 'pages'];
  const icons = {
    concepts: <BookOpen size={14} />,
    glossary: <BookMarked size={14} />,
    levels: <Layers size={14} />,
    pages: <Search size={14} />,
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t.search.title}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[3px] dark:bg-black/70" onClick={onClose} aria-hidden />
      <div className="rise absolute inset-x-3 top-[8vh] mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-lift)] dark:border-edge dark:bg-surface sm:inset-x-0">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 dark:border-hairline">
          <Search size={16} className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search.placeholder}
            aria-label={t.search.title}
            className="h-12 flex-1 bg-transparent text-[14px] outline-none placeholder:text-slate-400 dark:text-ink dark:placeholder:text-faint"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setCursor((v) => Math.min(results.length - 1, v + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setCursor((v) => Math.max(0, v - 1));
              } else if (e.key === 'Enter' && results[cursor]) {
                openHit(results[cursor]);
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
          />
          <button onClick={onClose} aria-label={t.nav.close} className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-ink">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto thin-scroll">
          {!q.trim() ? (
            <p className="px-4 py-8 text-center text-[13px] text-slate-500 dark:text-muted">{t.search.hint}</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-slate-500 dark:text-muted">{t.common.noResults}</p>
          ) : (
            order.map((g) => {
              const items = results.filter((r) => r.group === g);
              if (!items.length) return null;
              return (
                <div key={g}>
                  <div className="eyebrow px-4 pb-1 pt-3 text-slate-400 dark:text-faint">{groupLabels[g]}</div>
                  <ul>
                    {items.map((h) => {
                      const i = results.indexOf(h);
                      return (
                        <li key={h.id}>
                          <button
                            onClick={() => openHit(h)}
                            onMouseEnter={() => setCursor(i)}
                            className={cn(
                              'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                              i === cursor ? 'bg-brand-500/10' : 'hover:bg-slate-50 dark:hover:bg-raised',
                            )}
                          >
                            <span className="shrink-0 text-slate-400 dark:text-faint">{icons[g]}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13.5px] font-medium">{h.title}</span>
                              <span className="block truncate text-[11.5px] text-slate-500 dark:text-muted">{h.detail}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-slate-100 px-4 py-2 font-mono text-[10px] text-slate-400 dark:border-hairline dark:text-faint">
          <span>↑↓ {t.search.navigate}</span>
          <span>↵ {t.search.select}</span>
          <span>esc {t.search.dismiss}</span>
        </div>
      </div>
    </div>
  );
}
