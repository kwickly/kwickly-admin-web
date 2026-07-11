# Kwickly PWA Architecture

This document explains the Progressive Web App (PWA) architecture implemented in the `kwickly-admin-web` application. Our goal is to provide a seamless, native-like experience on mobile and desktop, including offline support and seamless background updates.

## Core Technologies

- **Vite PWA Plugin (`vite-plugin-pwa`)**: Handles the automatic generation of the Web Manifest and the Workbox Service Worker during the build process.
- **Workbox**: Google's library for adding offline support to web apps. It handles our caching strategies.
- **Assets Generator (`@vite-pwa/assets-generator`)**: Automatically generates all necessary splash screens and responsive icons from a single base SVG.

## 1. Web Manifest & Assets

The Web Manifest (`manifest.webmanifest`) is automatically injected into the build output by `vite-plugin-pwa`. It provides the browser with metadata about the app:
- **Display Mode:** Set to `standalone` to hide browser UI components (like the URL bar) and look like a native app.
- **Theme Colors:** Matches our Tailwind dark theme (`#0f172a`), ensuring the device status bar blends seamlessly with the app header.
- **Icons:** We use `manifest-icon-192.maskable.png` and `manifest-icon-512.maskable.png` to ensure Android and iOS can apply their own border-radius masks without cutting off the logo.

## 2. Service Worker & Caching Strategy

We use the `GenerateSW` strategy provided by Workbox. When `bun run vite build` is executed, Workbox analyzes the `dist/` folder and generates a Service Worker (`sw.js`) that precaches all static assets.

### Pre-caching
- All generated JavaScript, CSS, HTML, and local images are precached. 
- When a user loads the app, the Service Worker immediately stores these assets in the browser's Cache Storage. Subsequent loads are near-instantaneous and don't require a network request for the UI shell.

### Runtime Caching
External assets that cannot be precached during the build are cached at runtime:
- **Google Fonts:** Requests to `fonts.googleapis.com` and `fonts.gstatic.com` use a `CacheFirst` strategy. The fonts are cached for up to 1 year, drastically improving load times and typography consistency when offline.

### API Exclusions
We explicitly tell Workbox **not** to cache `/api/*` routes using `navigateFallbackDenylist: [/^\/api/]`. Data fetched from the server should always be fresh, relying on React Query's internal caching rather than the Service Worker.

## 3. Update Mechanism & UX

A common issue with SPAs is that users keep a tab open for days, running stale JavaScript while the server has been updated.

To solve this, we implemented the `PWABadge` component using `virtual:pwa-register/react`.
1. **Polling/Detection:** The Service Worker checks for byte-differences in `sw.js` on navigation or interval.
2. **Notification:** If a new version is detected, the `needRefresh` state is triggered.
3. **UX Prompt:** The `PWABadge` component renders a toast notification in the bottom right corner: *"New content available, click on reload button to update."*
4. **Activation:** When the user clicks "Reload", the new Service Worker takes over, and the page hard-refreshes to load the new assets.

## 4. Development Workflow

- **Testing Locally:** Standard `bun dev` does not run the service worker (to prevent caching issues during active development).
- **Testing PWA:** Run `bun run build && bun run preview`. This creates a production build and serves it locally, allowing you to test offline mode via Chrome DevTools (Network -> Offline) and verify the manifest in the Application tab.
