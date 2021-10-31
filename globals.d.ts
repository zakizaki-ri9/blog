declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_ANALYTICS_ID: string

    // see. https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
    VERCEL_URL: string | undefined

    // see. nuxt.config.ts
    baseUrl: string
  }
}
