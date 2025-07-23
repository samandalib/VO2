# Progressive Web App (PWA) Notes

## Overview
This document explains how the VO2Max Training App was upgraded to a Progressive Web App (PWA), what was implemented, and how to maintain or extend PWA features.

---

## What Was Done

### 1. Web App Manifest
- Added `public/manifest.json` with app metadata (name, icons, theme color, etc.)
- Ensures the app is installable and displays correctly on mobile devices

### 2. Service Worker
- Integrated [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) in `vite.config.ts`
- Enables offline support and asset caching
- Service worker is set to auto-update

### 3. Meta Tags
- Updated `index.html` to include:
  - `<link rel="manifest" href="/manifest.json" />`
  - `<meta name="theme-color" content="#23a04c" />`
  - `<link rel="apple-touch-icon" href="/icon-192.png" />`

### 4. Icons
- Manifest references `icon-192.png` and `icon-512.png` in `public/`
- Add more icon sizes for better device support if needed

### 5. Build & Test
- Run `npm run build` and `npm run preview` to test PWA features locally
- Use Chrome DevTools → Lighthouse to audit PWA compliance

### 6. Deployment
- Vercel supports PWAs out of the box
- No special configuration needed for deployment

---

## Why PWA?
- **Installable**: Users can add the app to their home screen
- **Offline Support**: App works with no/poor internet connection (static assets)
- **Native Feel**: Standalone display, splash screen, theming
- **Better Engagement**: Push notifications and background sync possible (future)

---

## Next Steps & Maintenance
- **Add more icons**: For iOS/Android splash screens and better device support
- **Custom splash screens**: Use [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- **Push notifications**: Can be enabled via service worker (advanced)
- **Background sync**: For offline data submission (advanced)
- **Update manifest**: If app name, theme, or icons change
- **Test regularly**: Use Lighthouse after major UI or build changes

---

## References
- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [Google Web Dev: PWA](https://web.dev/progressive-web-apps/)
- [MDN: Progressive web apps (PWAs)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

**Maintainer tip:**
If you change the manifest or service worker config, users may need to refresh or clear their cache to see updates. 