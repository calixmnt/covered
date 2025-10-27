// src/analytics.ts
import { init, track } from '@plausible-analytics/tracker';

export function initAnalytics() {
  init({
    domain: 'covered.lavibeagency.com',   // adapte
    // endpoint: 'https://plausible.io/api/event', // proxy plus tard si besoin
    autoCapturePageviews: true,
    hashBasedRouting: false,              // true si HashRouter
    captureOnLocalhost: false,
    bindToWindow: true,                   // utile pour le test d’installation
    // customProperties: (eventName) => ({ app_ver: '1.0.0' }) // optionnel
  });
}

// helper pour tes events
export function trackEvent(
  name: 'search_performed' | 'result_click' | 'favorite_add' | 'album_of_day_view',
  props?: Record<string, string | number | boolean>
) {
  // Convert all props to strings for Plausible
  const stringProps = props 
    ? Object.fromEntries(
        Object.entries(props).map(([key, value]) => [key, String(value)])
      )
    : undefined;
  
  track(name, { props: stringProps });
}
