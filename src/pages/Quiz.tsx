import { useMemo, useState } from 'react';
import { ArrowRight, Check, GraduationCap, RotateCcw, X } from 'lucide-react';
import { useApp } from '../app/state';
import { CONCEPT_BY_ID, QUIZ_IDS, shuffle } from '../content/curriculum';
import type { ConceptId, QuizId } from '../i18n/content-en';
import { Badge, Button, Card, Progress, Select } from '../components/ui';
import { cn } from '../utils/cn';

type Phase = 'setup' | 'running' | 'done';

export function QuizPage() {
  const { t, c, nav, recordQuiz } = useApp();
  const [phase, setPhase] = useState<Phase>('setup');
  const [count, setCount] = useState<'5' | '10' | '16'>('10');
  const [seed, setSeed] = useState(1);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ id: QuizId; correct: boolean }[]>([]);

  const questions = useMemo(() => shuffle(QUIZ_IDS, seed).slice(0, parseInt(count)), [count, seed]);
  const current = questions[index];
  const q = current ? c.quiz[current] : undefined;
  const score = answers.filter((a) => a.correct).length;

  const start = () => {
    setSeed(Date.now());
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setPhase('running');
  };

  const choose = (i: number) => {
    if (picked !== null || !q || !current) return;
    setPicked(i);
    setAnswers((a) => [...a, { id: current, correct: i === q.correct }]);
  };

  const advance = () => {
    if (index + 1 >= questions.length) {
      const finalScore = answers.filter((a) => a.correct).length;
      recordQuiz(finalScore, questions.length);
      setPhase('done');
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  };

  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.quiz.title}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-muted">{t.quiz.lead}</p>
        </header>
        <Card className="space-y-5 p-6">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/12 text-brand-500">
            <GraduationCap size={21} />
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label={t.quiz.questionsCount}
              value={count}
              onChange={setCount}
              options={[
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '16', label: '16' },
              ]}
            />
            <Badge tone="neutral">{t.quiz.mixed}</Badge>
          </div>
          <Button size="lg" variant="primary" onClick={start} trailing={<ArrowRight size={16} />}>
            {t.quiz.startQuiz}
          </Button>
        </Card>
      </div>
    );
  }

  if (phase === 'done') {
    const pct = score / questions.length;
    const verdict = pct === 1 ? t.quiz.perfect : pct >= 0.6 ? t.quiz.good : t.quiz.keepGoing;
    const missed = answers.filter((a) => !a.correct);
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t.quiz.results}</h1>
        </header>
        <Card className="p-6 text-center">
          <div className="font-mono text-5xl font-bold text-brand-600 dark:text-brand-300">
            {score}<span className="text-2xl text-slate-400 dark:text-faint">/{questions.length}</span>
          </div>
          <Progress className="mx-auto mt-4 max-w-xs" value={pct} />
          <p className="mt-4 text-[15px]">{verdict}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="primary" onClick={start} leading={<RotateCcw size={15} />}>{t.quiz.retry}</Button>
            <Button onClick={() => nav('/learn')}>{t.learn.title}</Button>
          </div>
        </Card>

        {missed.length > 0 && (
          <Card className="p-5">
            <div className="eyebrow mb-3 text-slate-500 dark:text-faint">{t.quiz.reviewConcept}</div>
            <ul className="space-y-1.5">
              {missed.map((a) => {
                const cid = c.quiz[a.id].concept as ConceptId;
                const meta = CONCEPT_BY_ID.get(cid);
                if (!meta) return null;
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => nav(`/learn/${cid}`)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors hover:bg-slate-100 dark:hover:bg-raised"
                    >
                      <span className="min-w-0 truncate">{c.concepts[cid].title}</span>
                      <ArrowRight size={14} className="shrink-0 text-brand-500" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </div>
    );
  }

  if (!q || !current) return null;
  const conceptId = q.concept as ConceptId;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[12px] text-slate-500 dark:text-muted">
          {t.quiz.question} {index + 1} / {questions.length}
        </span>
        <span className="font-mono text-[12px] text-slate-500 dark:text-muted">
          {t.quiz.score}: {score}
        </span>
      </div>
      <Progress value={(index + (picked !== null ? 1 : 0)) / questions.length} />

      <Card className="p-6">
        <h2 className="text-[17px] font-semibold leading-snug">{q.q}</h2>

        <ul className="mt-5 space-y-2">
          {q.a.map((option, i) => {
            const isCorrect = i === q.correct;
            const isPicked = picked === i;
            const revealed = picked !== null;
            return (
              <li key={i}>
                <button
                  onClick={() => choose(i)}
                  disabled={revealed}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-[12px] border px-4 py-3 text-left text-[14px] transition-colors',
                    !revealed && 'hover:border-brand-400 hover:bg-brand-500/[0.04] dark:hover:border-brand-400',
                    revealed && isCorrect && 'border-teal-500 bg-teal-500/10',
                    revealed && isPicked && !isCorrect && 'border-rose-500 bg-rose-500/10',
                    !revealed || (!isCorrect && !isPicked) ? 'border-slate-200 dark:border-hairline' : '',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-mono',
                      revealed && isCorrect
                        ? 'border-teal-500 bg-teal-500 text-white'
                        : revealed && isPicked
                          ? 'border-rose-500 bg-rose-500 text-white'
                          : 'border-slate-300 text-slate-400 dark:border-edge dark:text-faint',
                    )}
                  >
                    {revealed && isCorrect ? <Check size={11} /> : revealed && isPicked ? <X size={11} /> : String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {picked !== null && (
          <div className="rise mt-5 space-y-4">
            <div className={cn('rounded-[12px] border border-l-[3px] px-4 py-3', picked === q.correct ? 'border-teal-500/50 bg-teal-500/[0.07]' : 'border-amber-500/50 bg-amber-500/[0.07]')}>
              <div className={cn('eyebrow mb-1.5', picked === q.correct ? 'text-teal-700 dark:text-teal-300' : 'text-amber-700 dark:text-amber-300')}>
                {picked === q.correct ? t.quiz.correct : t.quiz.incorrect} · {t.quiz.explanation}
              </div>
              <p className="text-[13.5px] leading-relaxed text-slate-700 dark:text-ink/85">{q.explain}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={advance} trailing={<ArrowRight size={15} />}>
                {index + 1 >= questions.length ? t.quiz.finish : t.quiz.nextQuestion}
              </Button>
              {CONCEPT_BY_ID.has(conceptId) && (
                <Button variant="ghost" onClick={() => nav(`/learn/${conceptId}`)}>
                  {t.quiz.reviewConcept}
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
