/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Cloudflare Web Analytics beacon token; unset in local/dev (see analytics.service.ts). */
  readonly VITE_CF_ANALYTICS_TOKEN?: string;
}

