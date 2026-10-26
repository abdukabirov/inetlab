<h1 align="center">InetLab</h1>

<p align="center">
  An interactive, multilingual guide to how the Internet works — from a home network to global routing and submarine cables.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=111827" />
  <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <a href="https://inetlab.vercel.app/#/ru">Live demo</a>
</p>

## What it does

- Explains the Internet through an interactive map with four levels: big picture, home network, Internet architecture, and global infrastructure.
- Simulates an HTTPS request step by step, including DNS, TCP, TLS, routing, and encapsulation.
- Provides a nine-level learning path with 25 concepts, simple and technical explanations, and progress tracking.
- Includes a searchable glossary and quizzes with explanations for every answer.
- Supports English, Russian, and Uzbek, plus dark and light themes and reduced-motion preferences.

## Getting started

You need [Node.js](https://nodejs.org/) 20 or newer.

1. Install the dependencies:

   ```bash
   git clone https://github.com/abdukabirov/inetlab.git
   cd inetlab
   npm ci
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL shown by Vite in your browser.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local Vite development server |
| `npm run build` | Creates an optimized production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npx vitest run` | Runs the unit test suite |

## Tests

The test suite covers the networking models and curriculum integrity:

```bash
npx vitest run
```

## Project structure

```
src/
├── app/          App state, routing, theme, language, and progress
├── components/   Layout, map, UI, and visualization components
├── content/      Curriculum, packet journey, and network topology data
├── i18n/         English, Russian, and Uzbek translations
├── lib/           Networking simulations and unit tests
├── pages/         Home, map, learning, glossary, quiz, and settings pages
├── types/         Shared TypeScript types
├── App.tsx        Route selection and app shell
└── main.tsx       React entry point
```

## Built with

[React](https://react.dev) · [TypeScript](https://www.typescriptlang.org) · [Vite](https://vite.dev) · [Tailwind CSS](https://tailwindcss.com) · [Vitest](https://vitest.dev) · [Lucide](https://lucide.dev)

## Notes

The visualizations are teaching models, not live network telemetry. They intentionally simplify real routing, DNS resolution, congestion control, and infrastructure details to make each concept easier to understand.
