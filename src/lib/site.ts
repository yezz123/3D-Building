const withoutTrailingSlash = (value: string) => value.replace(/\/$/, "")

export const siteConfig = {
  name: "Syndiqo Tower",
  siteUrl: withoutTrailingSlash(import.meta.env.VITE_SITE_URL || "http://localhost:4173"),
  syndiqoUrl: withoutTrailingSlash(import.meta.env.VITE_SYNDIQO_URL || "https://syndiqo.ma"),
} as const
