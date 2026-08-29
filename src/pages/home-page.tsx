import { lazy, Suspense } from "react"
import { ArrowDownIcon, ArrowUpRightIcon, Layers3Icon, RadioTowerIcon, SunMediumIcon } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePageMetadata } from "@/hooks/use-page-metadata"

const BuildingExperience = lazy(() => import("@/components/building/building-experience"))

const processSteps = [
  {
    number: "01",
    title: "Choose a tower",
    copy: "Compare four price bands, districts, and architectural ideas before entering the building.",
  },
  {
    number: "02",
    title: "Read all three sides",
    copy: "Jump between each named façade, orbit the model, then inspect any lit apartment in context.",
  },
  {
    number: "03",
    title: "Watch the market",
    copy: "Review illustrative bid activity, return to a unit in 3D, and take the plans away in the buyer pack.",
  },
]

export function HomePage() {
  usePageMetadata({
    title: "Syndiqo Towers | Interactive 3D Apartment Marketplace",
    description:
      "Explore four Syndiqo towers in interactive 3D. Compare apartment prices, three designed façades, floor plans, views, and illustrative bid activity.",
  })

  return (
    <div id="top">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__status">
            <span className="pulse-dot" />
            <span>Four towers · one interactive market</span>
            <span className="hero__status-rule" />
            <span>48 apartments modeled</span>
          </div>

          <h1 id="hero-title">
            <span>Compare four towers</span>
            <em>from every angle.</em>
          </h1>
          <p className="hero__lede">
            Compare architecture, residences, prices, and illustrative bid activity in one real-time 3D decision space.
          </p>

          <div className="hero__actions">
            <Button asChild size="lg">
              <a href="#explore">
                Enter the tower market
                <ArrowDownIcon data-icon="inline-end" />
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#bids">
                View the bid terminal
                <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </Button>
          </div>

          <div className="hero__index" aria-label="Project highlights">
            <div>
              <span>01</span>
              <p>Four distinct tower designs</p>
            </div>
            <div>
              <span>02</span>
              <p>Three named façades each</p>
            </div>
            <div>
              <span>03</span>
              <p>Price and bid context in MAD</p>
            </div>
          </div>
        </section>

        <section className="explore-section" id="explore" aria-labelledby="towers-title">
          <div className="section-kicker" id="towers-title">
            <p>Towers / Casablanca + Rabat</p>
            <Badge variant="outline">WebGL · four live models</Badge>
          </div>
          <Suspense fallback={<div className="experience-loading">Preparing the residence model…</div>}>
            <BuildingExperience />
          </Suspense>
        </section>

        <section className="architecture-section" id="architecture" aria-labelledby="architecture-title">
          <div className="architecture-section__intro">
            <p className="eyebrow">Architecture / four points of view</p>
            <h2 id="architecture-title">Four silhouettes. Twelve designed faces.</h2>
            <p>
              Each tower answers a different setting with its own massing, material palette, price band,
              and three legible façades. The demo keeps every decision connected to the apartment plan.
            </p>
          </div>

          <div className="architecture-grid">
            <article>
              <SunMediumIcon aria-hidden="true" />
              <span>01</span>
              <h3>Three real sides</h3>
              <p>Front, east, and west views are named for each tower and available as direct camera presets.</p>
            </article>
            <article>
              <Layers3Icon aria-hidden="true" />
              <span>02</span>
              <h3>Four price bands</h3>
              <p>Starting prices and apartment values move with the selected tower, shown in Moroccan dirhams.</p>
            </article>
            <article>
              <RadioTowerIcon aria-hidden="true" />
              <span>03</span>
              <h3>Market context</h3>
              <p>Illustrative bids connect back to apartments without pretending to submit a real property order.</p>
            </article>
          </div>
        </section>

        <section className="process-section" id="process" aria-labelledby="process-title">
          <div className="process-section__heading">
            <p className="eyebrow">How it works</p>
            <h2 id="process-title">From skyline to unit in three moves.</h2>
          </div>
          <div className="process-list">
            {processSteps.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="buyer-pack-section" aria-labelledby="buyer-pack-title">
          <div>
            <p className="eyebrow">Digital buyer pack / $29 once</p>
            <h2 id="buyer-pack-title">Keep the comparison with you.</h2>
          </div>
          <div>
            <p>
              The digital buyer pack turns the selected-apartment experience into a portable comparison:
              illustrative floor plans, finish notes, and tower information in one secure checkout.
            </p>
            <a href="#explore">Choose a residence first <ArrowUpRightIcon aria-hidden="true" /></a>
          </div>
        </section>

        <section className="faq-section" id="faq" aria-labelledby="faq-title">
          <div>
            <p className="eyebrow">Questions / answers</p>
            <h2 id="faq-title">Before you tap “buy”.</h2>
          </div>
          <Accordion collapsible type="single">
            <AccordionItem value="demo">
              <AccordionTrigger>Are these real property launches?</AccordionTrigger>
              <AccordionContent>
                No. The towers, residences, availability, property pricing, and bid activity are illustrative
                demo content created to show a complete 3D real-estate discovery experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="three">
              <AccordionTrigger>How does the 3D apartment explorer work?</AccordionTrigger>
              <AccordionContent>
                Each building is procedural geometry rendered in real time with Three.js and React Three
                Fiber. Choose a tower, open any of its three façades, orbit it, and inspect apartment plans.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="bids">
              <AccordionTrigger>Does the bid terminal place a real bid?</AccordionTrigger>
              <AccordionContent>
                No. The terminal is a read-only product demonstration. Every amount, status, session move,
                and market signal is illustrative, and no property order is submitted.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pack">
              <AccordionTrigger>What is included in the digital buyer pack?</AccordionTrigger>
              <AccordionContent>
                The one-time digital buyer pack includes illustrative apartment floor plans, finish notes,
                and project information. Buying the pack does not sell or reserve real property.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="polar">
              <AccordionTrigger>How is checkout handled?</AccordionTrigger>
              <AccordionContent>
                Polar securely hosts checkout for the $29 digital product. The checkout does not sell or
                reserve an apartment, and test environments are clearly identified as sandbox mode.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
