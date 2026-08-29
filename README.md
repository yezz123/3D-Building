# Syndiqo Tower

An editorial, interactive 3D apartment explorer published for Syndiqo. Select a floor and plan directly on the tower, compare illustrative availability, and purchase a digital buyer pack through Polar.

Live site: [tower.syndiqo.ma](https://tower.syndiqo.ma/)

## Stack

- Vite, React 19, and TypeScript
- TanStack Router and Query
- React Three Fiber, Drei, and Three.js
- Tailwind CSS and shadcn/ui
- Polar hosted checkout
- Vercel Web Analytics and Speed Insights
- Technical SEO, JSON-LD, sitemap, robots, Open Graph, and AI-crawler context

## Local development

```bash
bun install
bun run dev
```

Quality checks:

```bash
bun run typecheck
bun run test
bun run build
```

Copy `.env.example` to `.env.local` and set the environment-specific public checkout URL. The browser receives only a hosted Polar checkout link—never an API access token. If the production URL is absent, local development deliberately falls back to Polar Sandbox.

Residence specifications, property pricing, and availability are illustrative. The separately purchased buyer pack is a digital product and does not sell or reserve real property.
