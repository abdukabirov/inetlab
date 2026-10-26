import { useState } from 'react';
import { Check, Globe2, Languages, Moon, RotateCcw, Sun, Zap } from 'lucide-react';
import { LOCALES, LOCALE_LABELS, useApp, type Locale } from '../app/state';
import { CONCEPTS } from '../content/curriculum';
import { Badge, Button, Card, EmptyState, Progress, Switch, Tabs } from '../components/ui';
import { cn } from '../utils/cn';

function Row({ icon, title, hint, children }: { icon: React.ReactNode; title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-slate-100 px-5 py-4 last:border-0 dark:border-hairline/70">
      <div className="flex min-w-0 max-w-md items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-raised dark:text-muted">{icon}</span>
        <div className="min-w-0">
          <div className="text-[14px] font-medium">{title}</div>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500 dark:text-muted">{hint}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const { t, locale, setLocale, theme, setTheme, detail, setDetail, motion, setMotion, progress, resetProgress, nav } = useApp();
  const [confirm, setConfirm] = useState(false);
  const [flash, setFlash] = useState(false);
  const done = progress.done.length;
  const best = progress.quiz.length ? Math.max(...progress.quiz.map((q) => q.score / q.total)) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.settings.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-muted">{t.settings.lead}</p>
      </header>

      <Card className="overflow-hidden">
        <Row icon={<Languages size={16} />} title={t.settings.language} hint={t.settings.languageHint}>
          <div className="flex flex-wrap gap-1.5">
            {LOCALES.map((l: Locale) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                aria-pressed={locale === l}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] transition-colors',
                  locale === l
                    ? 'border-brand-500 bg-brand-500/12 font-medium text-brand-700 dark:text-brand-200'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-hairline dark:text-muted dark:hover:border-edge',
                )}
              >
                {LOCALE_LABELS[l].native}
                {locale === l && <Check size={13} />}
              </button>
            ))}
          </div>
        </Row>

        <Row icon={theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />} title={t.settings.theme} hint={t.settings.themeHint}>
          <Tabs
            size="sm"
            value={theme}
            onChange={setTheme}
            tabs={[
              { id: 'dark', label: t.settings.dark },
              { id: 'light', label: t.settings.light },
            ]}
          />
        </Row>

        <Row icon={<Globe2 size={16} />} title={t.settings.detail} hint={t.settings.detailHint}>
          <Tabs
            size="sm"
            value={detail}
            onChange={setDetail}
            tabs={[
              { id: 'simple', label: t.common.simple },
              { id: 'technical', label: t.common.technical },
            ]}
          />
        </Row>

        <Row icon={<Zap size={16} />} title={t.settings.motion} hint={t.settings.motionHint}>
          <span className="text-[12.5px] text-slate-500 dark:text-muted">{motion ? t.settings.motionOn : t.settings.motionOff}</span>
          <Switch checked={motion} onChange={setMotion} label={t.settings.motion} />
        </Row>
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold">{t.settings.progressTitle}</h2>
            <p className="mt-0.5 text-[12.5px] text-slate-500 dark:text-muted">{t.settings.progressHint}</p>
          </div>
          {best !== null && <Badge tone="teal">{Math.round(best * 100)}%</Badge>}
        </div>

        {done > 0 || progress.quiz.length > 0 ? (
          <>
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                <span>{t.learn.conceptsDone}</span>
                <span className="font-mono text-slate-500 dark:text-muted">{done} / {CONCEPTS.length}</span>
              </div>
              <Progress value={done / CONCEPTS.length} label={t.a11y.progressBar} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {confirm ? (
                <>
                  <span className="text-[13px]">{t.settings.resetConfirm}</span>
                  <Button size="sm" variant="danger" onClick={() => { resetProgress(); setConfirm(false); setFlash(true); window.setTimeout(() => setFlash(false), 2500); }}>
                    {t.settings.yes}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>{t.settings.cancel}</Button>
                </>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => setConfirm(true)} leading={<RotateCcw size={13} />}>
                  {t.settings.resetProgress}
                </Button>
              )}
              {flash && <span className="text-[13px] text-teal-600 dark:text-teal-300">{t.settings.resetDone}</span>}
            </div>
          </>
        ) : (
          <div className="mt-4">
            <EmptyState
              title={t.common.empty}
              body={t.learn.lead}
              action={<Button size="sm" variant="primary" onClick={() => nav('/learn')}>{t.common.startLearning}</Button>}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

export function NotFoundPage() {
  const { t, nav } = useApp();
  return (
    <div className="mx-auto max-w-lg py-16">
      <EmptyState
        title={t.notFound.title}
        body={t.notFound.body}
        action={
          <Button variant="primary" onClick={() => nav('/map')}>
            {t.notFound.cta}
          </Button>
        }
      />
    </div>
  );
}
