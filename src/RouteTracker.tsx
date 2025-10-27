// src/RouteTracker.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from './analytics';

export default function RouteTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Pour une SPA, Plausible a besoin qu'on envoie l'URL à chaque changement
    const url = pathname + search;
    trackPageview(url, document.referrer || undefined);
  }, [pathname, search]);

  return null;
}