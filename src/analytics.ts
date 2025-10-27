// src/analytics.ts
import Plausible from 'plausible-tracker';

const DOMAIN = 'covered.lavibeagency.com'; // <-- adapte

// si tu veux un opt-out, on lit un flag localStorage
// const isDisabled = () => localStorage.getItem('covered_analytics_optout') === '1';

const plausible = Plausible({
  domain: DOMAIN,
  apiHost: 'https://plausible.io',   // ou ton instance self-hosted
  trackLocalhost: false,
  hashMode: false,
  // on n'utilise pas auto pageviews dans une SPA : on déclenchera à chaque navigation
//   enabled: !isDisabled(),
});

export function enableAnalytics(enable: boolean) {
  if (enable) localStorage.removeItem('covered_analytics_optout');
  else localStorage.setItem('covered_analytics_optout', '1');
  window.location.reload();
}

export function trackPageview(url?: string, referrer?: string) {
  plausible.trackPageview({ url, referrer });
}

export function track(
  name: 'search_performed' | 'result_click' | 'favorite_add' | 'album_of_day_view',
  props?: Record<string, any>
) {
  plausible.trackEvent(name, { props });
}
