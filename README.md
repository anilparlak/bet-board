# Bet Board

A small React app that shows a betting bulletin as a scrollable table and lets you build a coupon from the odds you click.

Live: https://anilparlak.github.io/bet-board/

## Overview

The app fetches a list of betting events from api on load and renders them in a virtualized table. Clicking an odd adds it to the coupon panel on the right (a collapsible bottom sheet on mobile). Clicking the same odd again removes it. Only one selection per event is kept.

The coupon is stored in Redux and persisted to `localStorage`, so selections survive a page reload.

## Features

- Feature-based folder structure (`bulletin`, `coupon`)
- Bulletin table with 15 odd columns per event
- Coupon selection with total odd calculation, single item removal and clear-all
- Redux Toolkit for state, Redux Persist for keeping the store between reloads
- Virtualized rows with React Window
- Lazy-loaded feature components (code splitting)
- Loading, empty and error states with a retry button
- Responsive layout with a horizontally scrollable table on mobile
- Unit tests with Jest and React Testing Library
- Web Vitals logging
- Bundle analysis via Webpack Bundle Analyzer

## Tech Stack

React 19, TypeScript, Redux Toolkit, React Redux, Redux Persist, React Window, Webpack 5, Babel, CSS Modules, PostCSS + Autoprefixer, Jest + React Testing Library, web-vitals, gh-pages.

## Project Structure

```
src/
├── app/                 # store setup, typed hooks, App
├── features/
│   ├── bulletin/
│   │   ├── api/bets/    # fetchBets()
│   │   ├── components/  # BulletinContainer, BulletinRow, tests
│   │   ├── store/       # bulletinSlice
│   │   └── types/       # API types, column config, row constants
│   └── coupon/
│       ├── components/  # CouponContainer
│       ├── store/       # couponSlice
│       └── types/
├── pages/               # Home (layout + data fetch trigger + lazy imports)
├── shared/components/   # Spinner, ErrorState
├── styles/              # global.css, _variable.css (CSS variables)
├── test/                # jest setup, CSS module mock
├── index.tsx            # entry: Provider + PersistGate + web vitals
└── reportWebVitals.ts
```

Each feature owns its own API calls, components, slice and types. Anything used by more than one feature lives in `shared/` or `app/`.

## State Management

Two slices:

- `bulletin` — the fetched event list plus `status` (`idle | loading | ready | failed`) and `error`. Data is loaded by a `createAsyncThunk` (`fetchBulletin`) which skips the call if one is already in flight.
- `coupon` — selected outcomes keyed by event id, so picking a second odd on the same event replaces the first one.

Redux Persist wraps the root reducer and writes to `localStorage`. `PersistGate` shows the spinner while the stored state is being rehydrated. This is what keeps the coupon (and the last loaded bulletin) after a refresh.

## Table Performance

The bulletin can contain a lot of events, and each row renders 15 odd cells. Rendering all of them at once creates thousands of DOM nodes.

`BulletinContainer` uses `List` from `react-window`, so only the rows inside the visible area are mounted, plus a small overscan buffer. Row height is fixed at 64px and overscan is 4 rows (`BullentinRowTypes` in `features/bulletin/types/bulletin.types.ts`). Rows are keyed by event `NID`.

Because jsdom has no layout engine, `src/test/jest.setup.ts` stubs `ResizeObserver` so the list still renders rows in tests.

## API Cold Start

The API is hosted on Render's free tier and goes to sleep, so the first request after idle is slow. Measured locally:

- cold start: ~52.56 s
- warm request: ~480 ms

To start the request earlier, `public/index.html` preloads it:

```html
<link
  rel="preload"
  href="https://nesine-case-study.onrender.com/bets"
  as="fetch"
  crossorigin="anonymous"
/>
```

This starts the request while the JS bundle is loading. It does not remove the cold start — the backend still needs to wake up — but it can reduce the time the user waits for the data after the app starts.

## Browser Compatibility

CSS goes through `postcss-loader` with Autoprefixer (`postcss.config.js`). The `browserslist` field in `package.json` targets `Android >= 6` and `iOS >= 12` among others, so prefixes are added for older mobile browsers.

## Testing

Jest with jsdom and React Testing Library. `src/features/bulletin/components/BulletinContainer.test.tsx` renders the bulletin and coupon together and checks that a row is rendered, that clicking an odd adds it to the coupon, and that clicking it again removes it.

```bash
npm test            # run once
npm run test:watch  # watch mode
npm run test:coverage
```

## Performance Measurement

`src/reportWebVitals.ts` subscribes to CLS, INP, LCP, FCP and TTFB from the `web-vitals` package and logs each one to the console with its rating. Open the browser console to see them.

Lighthouse run on the deployed build:

| Metric | Value |
| --- | --- |
| First Contentful Paint | 0.2 s |
| Largest Contentful Paint | 0.4 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 0.5 s |

Category scores were 100 / 100 / 100 / 90.

## Bundle Analysis

```bash
npm run analyze
```

This runs a production build with `ANALYZE=true` and opens Webpack Bundle Analyzer at `http://127.0.0.1:8888`.

Before code splitting the initial `main` entrypoint was 254 KiB, slightly above Webpack's recommended 244 KiB limit. The bulletin and coupon features are now lazy-loaded with `React.lazy` and dynamic imports in `src/pages/Home.tsx`, which brings the initial entrypoint down to 239 KiB — below the recommended limit. The feature code is not gone, it just moved into async chunks that load after the first render.

Latest measurement:

- Initial entrypoint: 239 KiB
- Vendor chunk: 229 KiB
- Main JS: 7.42 KiB
- Async feature chunks: 11.4 KiB and 1.61 KiB

Vendor code is separated into its own chunk via `splitChunks: { chunks: "all" }` in `webpack.config.js`.

## Getting Started

```bash
git clone https://github.com/anilparlak/bet-board.git
cd bet-board
npm install
npm run dev
```

The dev server runs at `http://localhost:3000` with hot reload.

No environment variables are needed. The API base URL is hardcoded in `src/features/bulletin/api/bets/betsApi.ts`.

Other scripts:

```bash
npm run type-check   # tsc --noEmit
```

## Build

```bash
npm run build
```

Production build into `dist/`: content-hashed filenames, CSS extracted to a separate file with `mini-css-extract-plugin`, short hashed CSS module class names, no source maps.

## Deployment

Deployed to GitHub Pages from the `gh-pages` branch:

```bash
npm run deploy
```

This runs `npm run build` and then publishes `dist/` to the `gh-pages` branch with the `gh-pages` package. There is no CI workflow — deployment is run manually from a local machine.

One config detail matters here: `output.publicPath` is `""` in `webpack.config.js`, so assets are referenced with relative paths. Without it the app would look for assets at the domain root instead of `/bet-board/` and fail to load on GitHub Pages.

## Performance Notes Summary

- React Window virtualization for the bulletin table
- Code splitting: bulletin and coupon features loaded as async chunks
- `<link rel="preload">` on the `/bets` request to reduce the cold start impact
- `preconnect` for Google Fonts
- Webpack Bundle Analyzer for inspecting the production bundle
- Web Vitals logging for runtime metrics
- Autoprefixer with an explicit browserslist for older mobile browsers
