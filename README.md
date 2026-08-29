# Syndiqo Tower

An editorial, interactive 3D apartment explorer published for Syndiqo. Walk through colorful planted grounds, select a floor and plan directly on one of four towers, compare illustrative bid activity, and purchase a digital buyer pack plus one branded-residence claim through Polar.

Live site: [tower.syndiqo.ma](https://tower.syndiqo.ma/)

## Stack

- Vite, React 19, and TypeScript
- TanStack Router and Query
- React Three Fiber, Drei, and Three.js
- Tailwind CSS and shadcn/ui
- Polar hosted checkout
- Server-side Polar payment verification for production and sandbox previews
- Private Cloudflare R2 logo storage with proxied public delivery
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

Copy `.env.example` to `.env.local` and set the environment-specific public checkout URL. The browser receives only a hosted Polar checkout link—never an API or storage token. The claim endpoints require restricted Polar checkout-read credentials and a private R2 bucket on the server. Sandbox claims are disabled unless `ALLOW_POLAR_SANDBOX_CLAIMS=true`, which should be limited to local or preview testing.

Two showcase homes are permanently reserved in the interface: Syndiqo at Atlas Court 4B and HOET Technologies at Marina Fold 5A. Customer claims cannot replace them.

Residence specifications, property pricing, and availability are illustrative. The separately purchased buyer pack is a digital product and does not sell or reserve real property.
