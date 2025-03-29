interface ImportMetaEnv {
  /**
   * 本番URL
   */
  readonly SITE_URL: string;

  // Vercel のシステム環境変数
  // ref. https://vercel.com/docs/environment-variables/system-environment-variables
  readonly VERCEL_URL: string;
  readonly VERCEL_ENV: "production" | "preview" | "development";
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
