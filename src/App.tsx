import { useEffect } from 'react';
import { AppProvider, useApp } from './app/state';
import { Shell } from './components/layout/Shell';
import { HomePage } from './pages/Home';
import { MapExplorerPage } from './pages/MapExplorer';
import { JourneyPage } from './pages/Journey';
import { ConceptPage, LearnPage } from './pages/Learn';
import { GlossaryPage } from './pages/Glossary';
import { QuizPage } from './pages/Quiz';
import { NotFoundPage, SettingsPage } from './pages/Settings';
import { MAP_LEVELS, type MapLevel } from './content/topology';

function Routes() {
  const { route, t, reduceMotion } = useApp();
  const [first, second, third] = route.segments;

  // reflect motion preference on <html> and keep the document title in sync
  useEffect(() => {
    document.documentElement.classList.toggle('no-motion', reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    const section =
      first === 'map' ? t.nav.explore
      : first === 'journey' ? t.nav.journey
      : first === 'learn' ? t.nav.learn
      : first === 'glossary' ? t.nav.glossary
      : first === 'quiz' ? t.nav.quiz
      : first === 'settings' ? t.nav.settings
      : t.meta.tagline;
    document.title = `${t.meta.title} — ${section}`;
  }, [first, t]);

  switch (first) {
    case undefined:
    case '':
      return <HomePage />;
    case 'map': {
      const level = (MAP_LEVELS as string[]).includes(second ?? '') ? (second as MapLevel) : 'l1';
      return <MapExplorerPage key={level} level={level} nodeId={third} />;
    }
    case 'journey':
      return <JourneyPage />;
    case 'learn':
      return second ? <ConceptPage key={second} id={second} /> : <LearnPage />;
    case 'glossary':
      return <GlossaryPage key={second ?? 'all'} termId={second} />;
    case 'quiz':
      return <QuizPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <NotFoundPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Shell>
        <Routes />
      </Shell>
    </AppProvider>
  );
}
