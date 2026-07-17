import { AnalyticsService, injectAnalyticsBeacon } from './analytics.service';

describe('injectAnalyticsBeacon', () => {
  afterEach(() => {
    document
      .querySelectorAll('script[data-cf-beacon]')
      .forEach((el) => el.remove());
  });

  it('injects the Cloudflare beacon script for the given token', () => {
    injectAnalyticsBeacon('test-token');

    const script = document.querySelector('script[data-cf-beacon]');
    expect(script).toBeTruthy();
    expect(script?.getAttribute('src')).toBe(
      'https://static.cloudflareinsights.com/beacon.min.js'
    );
    expect(script?.getAttribute('data-cf-beacon')).toContain('test-token');
  });

  it('does not inject the script twice', () => {
    injectAnalyticsBeacon('test-token');
    injectAnalyticsBeacon('test-token');

    expect(document.querySelectorAll('script[data-cf-beacon]').length).toBe(1);
  });
});

describe('AnalyticsService', () => {
  afterEach(() => {
    document
      .querySelectorAll('script[data-cf-beacon]')
      .forEach((el) => el.remove());
  });

  it('makes no network requests when no token is configured', () => {
    new AnalyticsService();

    expect(document.querySelector('script[data-cf-beacon]')).toBeNull();
  });
});
