/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APP_URL?: string;
  readonly PUBLIC_MEDIA_BASE_URL?: string;
  readonly PUBLIC_AGENT_DEMO_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
