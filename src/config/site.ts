export const useConfig = () => {
  const env = import.meta.env;
  const vercelDeployUrl = env.VERCEL_ENV === "production" ? env.SITE_URL : env.VERCEL_URL;
  
  const isLocal = !vercelDeployUrl
  const title = "zaki-blog";
  const baseUrl = isLocal ? "http://localhost:3000" : vercelDeployUrl;
  return {
    title,
    baseUrl,
    isLocal
  };
};
