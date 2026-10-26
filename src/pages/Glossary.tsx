import { useMemo, useState } from 'react';
import { ArrowRight, BookMarked, Search } from 'lucide-react';
import { useApp } from '../app/state';
import { GLOSSARY_IDS, GLOSSARY_TO_CONCEPT, CONCEPT_BY_ID } from '../content/curriculum';
import type { GlossaryId } from '../i18n/content-en';
import { Badge, Button, Card, EmptyState, TextInput } from '../components/ui';
import { cn } from '../utils/cn';

export function GlossaryPage({ termId }: { termId?: string }) {
  const { t, c, nav } = useApp();
  const [q, setQ] = useState('');

  const terms = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GLOSSARY_IDS.filter((id) => {
      if (!needle) return true;
      const g = c.glossary[id];
      return g.term.toLowerCase().includes(needle) || g.short.toLowerCase().includes(needle) || g.full.toLowerCase().includes(needle);
    }).sort((a, b) => c.glossary[a].term.localeCompare(c.glossary[b].term));
  }, [q, c]);

  const active = termId && GLOSSARY_IDS.includes(termId as GlossaryId) ? (termId as GlossaryId) : undefined;
  const term = active ? c.glossary[active] : undefined;
  const linkedConcept = active ? GLOSSARY_TO_CONCEPT[active] : undefined;
  const related = active
    ? GLOSSARY_IDS.filter((g) => g !== active && GLOSSARY_TO_CONCEPT[g] === linkedConcept).slice(0, 4)
    : [];

  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="mb-6 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.glossary.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-muted">{t.glossary.lead}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-[5.5rem] lg:self-start">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <TextInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.glossary.searchPlaceholder}
              aria-label={t.glossary.searchPlaceholder}
              className="w-full pl-9 font-sans"
            />
          </div>
          <p className="mt-2 px-1 text-[11.5px] text-slate-400 dark:text-faint">
            {terms.length} {t.glossary.termsCount}
          </p>
          <ul className="mt-2 max-h-[55vh] space-y-0.5 overflow-y-auto pr-1 thin-scroll">
            {terms.map((id) => (
              <li key={id}>
                <button
                  onClick={() => nav(`/glossary/${id}`)}
                  aria-current={active === id ? 'page' : undefined}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition-colors',
                    active === id
                      ? 'bg-brand-500/12 font-semibold text-brand-700 dark:text-brand-200'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-muted dark:hover:bg-raised',
                  )}
                >
                  <span className="min-w-0 truncate">{c.glossary[id].term}</span>
                </button>
              </li>
            ))}
            {terms.length === 0 && <li className="px-2 py-3 text-[13px] text-slate-400 dark:text-faint">{t.common.noResults}</li>}
          </ul>
        </aside>

        <div>
          {term && active ? (
            <div className="rise space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{term.term}</h2>
                <Badge tone="brand" className="mt-2">{t.glossary.title}</Badge>
              </div>

              <Card className="p-5">
                <div className="eyebrow mb-2 text-slate-500 dark:text-faint">{t.glossary.short}</div>
                <p className="text-[15px] leading-relaxed">{term.short}</p>
              </Card>

              <Card className="p-5">
                <div className="eyebrow mb-2 text-slate-500 dark:text-faint">{t.glossary.full}</div>
                <p className="text-[14px] leading-relaxed text-slate-600 dark:text-ink/80">{term.full}</p>
              </Card>

              {related.length > 0 && (
                <div>
                  <div className="eyebrow mb-2 text-slate-500 dark:text-faint">{t.glossary.seeAlso}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {related.map((r) => (
                      <button
                        key={r}
                        onClick={() => nav(`/glossary/${r}`)}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[12.5px] transition-colors hover:bg-slate-200 dark:bg-raised dark:hover:bg-overlay"
                      >
                        {c.glossary[r].term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {linkedConcept && CONCEPT_BY_ID.has(linkedConcept) && (
                <Button variant="primary" onClick={() => nav(`/learn/${linkedConcept}`)} trailing={<ArrowRight size={15} />}>
                  {t.glossary.openConcept}: {c.concepts[linkedConcept].title}
                </Button>
              )}
            </div>
          ) : terms.length === 0 ? (
            <EmptyState icon={<BookMarked size={22} />} title={t.common.noResults} body={t.glossary.lead} />
          ) : (
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {terms.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => nav(`/glossary/${id}`)}
                    className="lift flex h-full w-full flex-col rounded-[14px] border border-slate-200 bg-white p-4 text-left hover:border-brand-400/60 dark:border-hairline dark:bg-surface"
                  >
                    <span className="text-[14.5px] font-semibold">{c.glossary[id].term}</span>
                    <span className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500 dark:text-muted">{c.glossary[id].short}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
