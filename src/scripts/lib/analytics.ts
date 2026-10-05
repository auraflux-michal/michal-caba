/**
 * Analytics events, provider-agnostic. No tracker is installed yet: every call is a safe no-op
 * until GA4 (gtag / dataLayer) or Meta Pixel (fbq) is added to the page. Remember: both need a
 * cookie-consent banner in the EU before they may load.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

type Params = Record<string, string | number | boolean>;

/** Meta standard events for the funnel steps that have one */
const META_STANDARD: Record<string, string> = { lustro_signup: 'Lead' };

export function track(event: string, params: Params = {}) {
  try {
    if (window.gtag) window.gtag('event', event, params);
    else window.dataLayer?.push({ event, ...params });

    if (window.fbq) {
      const standard = META_STANDARD[event];
      if (standard) window.fbq('track', standard, params);
      else window.fbq('trackCustom', event, params);
    }
  } catch {
    // Analytics must never break the page
  }
}
