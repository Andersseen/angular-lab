import { Injectable } from '@angular/core';

const BEACON_SELECTOR = 'script[data-cf-beacon]';

/**
 * Injects the Cloudflare Web Analytics beacon script for the given token, if
 * it is not already present. Exported separately from the token lookup so it
 * can be tested without stubbing `import.meta.env`.
 */
export function injectAnalyticsBeacon(token: string): void {
  if (typeof document === 'undefined' || document.querySelector(BEACON_SELECTOR)) {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.defer = true;
  script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(script);
}

/**
 * Privacy-friendly analytics seam (Cloudflare Web Analytics: no cookies, no
 * cross-site tracking). Injects the beacon script only when a token is
 * configured via VITE_CF_ANALYTICS_TOKEN; with no token (the default for
 * local/dev), this makes no network requests at all.
 */
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor() {
    const token = import.meta.env.VITE_CF_ANALYTICS_TOKEN;
    if (token) {
      injectAnalyticsBeacon(token);
    }
  }
}
