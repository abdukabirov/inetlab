import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

// ── Button ──────────────────────────────────────────────────

type Variant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  leading,
  trailing,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; leading?: ReactNode; trailing?: ReactNode }) {
  const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
    md: 'h-10 px-4 text-sm gap-2 rounded-[10px]',
    lg: 'h-12 px-6 text-[15px] gap-2 rounded-xl',
  };
  const variants: Record<Variant, string> = {
    primary:
      'bg-brand-500 text-white hover:bg-brand-400 shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-10px_rgba(43,116,245,0.9)]',
    secondary:
      'border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:border-edge dark:bg-raised dark:text-ink dark:hover:border-slate-500 dark:hover:bg-overlay',
    subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-raised dark:text-ink dark:hover:bg-overlay',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-muted dark:hover:bg-raised dark:hover:text-ink',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
  };
  return (
    <button
      className={cn(
        'inline-flex select-none items-center justify-center font-medium transition-colors disabled:pointer-events-none disabled:opacity-45',
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}

export function IconButton({ label, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-slate-300 bg-white text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-edge dark:bg-raised dark:text-muted dark:hover:border-slate-500 dark:hover:text-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

// ── Card / Panel / Section ──────────────────────────────────

export function Card({
  children,
  className,
  interactive,
  as: As = 'div',
  ...rest
}: { children: ReactNode; className?: string; interactive?: boolean; as?: 'div' | 'article' | 'section' } & React.HTMLAttributes<HTMLElement>) {
  return (
    <As
      className={cn(
        'rounded-[14px] border border-slate-200 bg-white dark:border-hairline dark:bg-surface',
        interactive && 'lift cursor-pointer hover:border-slate-300 hover:shadow-[var(--shadow-soft)] dark:hover:border-edge',
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

export function Panel({ title, subtitle, actions, children, className, bodyClass }: { title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={cn('overflow-hidden rounded-[14px] border border-slate-200 bg-white dark:border-hairline dark:bg-surface', className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-slate-100 px-4 py-3 dark:border-hairline/80">
          <div className="min-w-0">
            {title && <h3 className="truncate text-[13.5px] font-semibold tracking-tight text-slate-900 dark:text-ink">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-muted">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn('p-4', bodyClass)}>{children}</div>
    </section>
  );
}

export function Section({ id, eyebrow, title, lead, actions, children, className }: { id?: string; eyebrow?: string; title?: ReactNode; lead?: ReactNode; actions?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      {(eyebrow || title || lead || actions) && (
        <header className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="max-w-2xl">
            {eyebrow && <div className="eyebrow mb-2 text-brand-500 dark:text-brand-300">{eyebrow}</div>}
            {title && <h2 className="balance text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>}
            {lead && <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-muted">{lead}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

// ── Badge / Chip ────────────────────────────────────────────

type Tone = 'neutral' | 'brand' | 'teal' | 'violet' | 'amber' | 'rose' | 'lime' | 'outline';
const TONES: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-600 dark:bg-raised dark:text-muted',
  brand: 'bg-brand-500/12 text-brand-600 dark:text-brand-300',
  teal: 'bg-teal-500/12 text-teal-600 dark:text-teal-300',
  violet: 'bg-violet-500/12 text-violet-600 dark:text-violet-300',
  amber: 'bg-amber-500/14 text-amber-700 dark:text-amber-300',
  rose: 'bg-rose-500/12 text-rose-600 dark:text-rose-300',
  lime: 'bg-lime-500/14 text-lime-700 dark:text-lime-300',
  outline: 'border border-slate-300 text-slate-600 dark:border-edge dark:text-muted',
};

export function Badge({ children, tone = 'neutral', className, mono = true }: { children: ReactNode; tone?: Tone; className?: string; mono?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]', mono && 'font-mono', TONES[tone], className)}>
      {children}
    </span>
  );
}

export function Pill({ children, active, onClick, className }: { children: ReactNode; active?: boolean; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors',
        active
          ? 'border-brand-500 bg-brand-500/12 text-brand-600 dark:text-brand-200'
          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-hairline dark:text-muted dark:hover:border-edge dark:hover:text-ink',
        className,
      )}
    >
      {children}
    </button>
  );
}

// ── Tabs ────────────────────────────────────────────────────

export function Tabs<T extends string>({ tabs, value, onChange, className, size = 'md' }: { tabs: { id: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; className?: string; size?: 'sm' | 'md' }) {
  return (
    <div role="tablist" className={cn('inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-raised', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-lg font-medium transition-colors',
            size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-[13px]',
            value === tab.id
              ? 'bg-white text-slate-900 shadow-sm dark:bg-overlay dark:text-ink'
              : 'text-slate-500 hover:text-slate-900 dark:text-muted dark:hover:text-ink',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Progress ────────────────────────────────────────────────

export function Progress({ value, className, label, showValue }: { value: number; className?: string; label?: string; showValue?: boolean }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-raised"
      >
        <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-teal-400 transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      {showValue && <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-muted">{pct}%</span>}
    </div>
  );
}

// ── Note / Callout ──────────────────────────────────────────

export function Note({ tone = 'brand', title, children, className }: { tone?: 'brand' | 'amber' | 'teal' | 'violet'; title?: string; children: ReactNode; className?: string }) {
  const map = {
    brand: 'border-brand-500/45 bg-brand-500/[0.07]',
    amber: 'border-amber-500/45 bg-amber-500/[0.07]',
    teal: 'border-teal-500/45 bg-teal-500/[0.07]',
    violet: 'border-violet-500/45 bg-violet-500/[0.07]',
  }[tone];
  const titleColor = {
    brand: 'text-brand-600 dark:text-brand-300',
    amber: 'text-amber-700 dark:text-amber-300',
    teal: 'text-teal-700 dark:text-teal-300',
    violet: 'text-violet-700 dark:text-violet-300',
  }[tone];
  return (
    <div className={cn('rounded-xl border border-l-[3px] px-4 py-3', map, className)}>
      {title && <div className={cn('eyebrow mb-1.5', titleColor)}>{title}</div>}
      <div className="text-[14px] leading-relaxed text-slate-700 dark:text-ink/85">{children}</div>
    </div>
  );
}

// ── Inputs ──────────────────────────────────────────────────

export function TextInput({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 rounded-[10px] border border-slate-300 bg-white px-3 font-mono text-sm text-slate-900 outline-none transition-colors placeholder:font-sans placeholder:text-slate-400 focus:border-brand-400 dark:border-edge dark:bg-raised dark:text-ink dark:placeholder:text-faint',
        className,
      )}
      {...rest}
    />
  );
}

export function Select<T extends string>({ value, onChange, options, label, className, id }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label?: string; className?: string; id?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {label && (
        <label htmlFor={id} className="text-xs text-slate-500 dark:text-muted">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 rounded-[10px] border border-slate-300 bg-white px-2.5 text-[13px] text-slate-900 outline-none focus:border-brand-400 dark:border-edge dark:bg-raised dark:text-ink"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </span>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-brand-500' : 'bg-slate-300 dark:bg-edge')}
    >
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left]', checked ? 'left-[22px]' : 'left-0.5')} />
    </button>
  );
}

// ── Data display ────────────────────────────────────────────

export function KeyValue({ rows, className, mono = true }: { rows: { k: ReactNode; v: ReactNode; note?: string }[]; className?: string; mono?: boolean }) {
  return (
    <dl className={cn('grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-[13px]', className)}>
      {rows.map((r, i) => (
        <div key={i} className="contents">
          <dt className="text-slate-500 dark:text-muted">{r.k}</dt>
          <dd className={cn('min-w-0 break-words text-slate-900 dark:text-ink', mono && 'font-mono text-[12.5px]')}>
            {r.v}
            {r.note && <span className="ml-1.5 font-sans text-[11px] text-slate-400 dark:text-faint">{r.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Stat({ value, label, hint, tone = 'brand' }: { value: ReactNode; label: string; hint?: string; tone?: Tone }) {
  return (
    <div className="rounded-[14px] border border-slate-200 bg-white px-4 py-3.5 dark:border-hairline dark:bg-surface">
      <div className={cn('font-mono text-2xl font-bold tabular-nums', tone === 'brand' ? 'text-brand-600 dark:text-brand-300' : 'text-slate-900 dark:text-ink')}>{value}</div>
      <div className="mt-1 text-[13px] font-medium text-slate-700 dark:text-ink/80">{label}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-500 dark:text-muted">{hint}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-slate-300 px-6 py-12 text-center dark:border-edge">
      {icon && <div className="mb-3 text-slate-400 dark:text-faint">{icon}</div>}
      <p className="text-sm font-medium text-slate-700 dark:text-ink">{title}</p>
      {body && <p className="mt-1 max-w-sm text-[13px] text-slate-500 dark:text-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}


