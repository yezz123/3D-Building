import { lazy, Suspense } from "react"
import { ArrowDownIcon, ArrowUpRightIcon, BoxIcon, Layers3Icon, SunMediumIcon } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { usePageMetadata } from "@/hooks/use-page-metadata"
import { siteConfig } from "@/lib/site"

const BuildingExperience = lazy(() => import("@/components/building/building-experience"))

const processSteps = [
  {
    number: "01",
    title: "Turn the tower",
    copy: "Drag the model to read orientation, height, terraces, and outlook as one connected decision.",
  },
  {
    number: "02",
    title: "Compare the homes",
    copy: "Filter by bedroom count, then tap any lit residence for its plan, area, exposure, and release status.",
  },
  {
    number: "03",
    title: "Take the plans away",
    copy: "Use secure Polar checkout to purchase the $29 digital buyer pack without selling or reserving real property.",
  },
]

export function HomePage() {
  usePageMetadata({
    title: "Syndiqo Tower | Interactive 3D Apartment Explorer",
    description:
      "Explore Syndiqo Tower in interactive 3D. Compare 12 apartment floor plans by level, bedrooms, orientation, area, skyline view and availability.",
  })

  return (
    <div id="top">
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__status">
            <span className="pulse-dot" />
            <span>Phase 01 · interactive residence release</span>
            <span className="hero__status-rule" />
            <span>12 homes modeled</span>
          </div>

          <h1 id="hero-title">
            Explore every apartment
            <br />
            <em>inside a 3D tower.</em>
          </h1>
          <p className="hero__lede">
            Orbit Syndiqo Tower in real time. Compare every released apartment by height,
            orientation, floor plan, and light—without flattening the building into a list.
          </p>

          <div className="hero__actions">
            <Button asChild size="lg">
              <a href="#explore">
                Explore the tower
                <ArrowDownIcon data-icon="inline-end" />
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#architecture">
                Read the brief
                <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={siteConfig.syndiqoUrl} rel="noreferrer" target="_blank">
                Visit Syndiqo.ma
                <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </Button>
          </div>

          <div className="hero__index" aria-label="Project highlights">
            <div>
              <span>01</span>
              <p>Six residential levels</p>
            </div>
            <div>
              <span>02</span>
              <p>Three plan families</p>
            </div>
            <div>
              <span>03</span>
              <p>One full 3D decision</p>
            </div>
          </div>
        </section>

        <section className="explore-section" id="explore" aria-labelledby="residences">
          <div className="section-kicker" id="residences">
            <p>Residences / 02–07</p>
            <Badge variant="outline">WebGL · live model</Badge>
          </div>
          <Suspense fallback={<div className="experience-loading">Preparing the residence model…</div>}>
            <BuildingExperience />
          </Suspense>
          <p className="illustrative-note">
            Residence specifications, availability, views, and pricing are illustrative product-demo data.
          </p>
        </section>

        <section className="architecture-section" id="architecture" aria-labelledby="architecture-title">
          <div className="architecture-section__intro">
            <p className="eyebrow">Architecture / read the volume</p>
            <h2 id="architecture-title">A quieter tower with more sky in it.</h2>
            <p>
              Syndiqo Tower is imagined as a six-level residential stack: deep terraces temper the sun,
              two homes share each floor, and every corner earns a second direction of light.
            </p>
          </div>

          <div className="architecture-grid">
            <article>
              <SunMediumIcon aria-hidden="true" />
              <span>01</span>
              <h3>Light, mapped</h3>
              <p>Orientation lives beside every plan, so “bright” becomes a direction and a time of day.</p>
            </article>
            <article>
              <Layers3Icon aria-hidden="true" />
              <span>02</span>
              <h3>Two per floor</h3>
              <p>A simple A/B stack keeps the building legible while allowing each home a full facade bay.</p>
            </article>
            <article>
              <BoxIcon aria-hidden="true" />
              <span>03</span>
              <h3>Plans in context</h3>
              <p>Area, plan, balcony, and skyline are read together instead of across disconnected PDFs.</p>
            </article>
          </div>
        </section>

        <section className="process-section" id="process" aria-labelledby="process-title">
          <div className="process-section__heading">
            <p className="eyebrow">How it works</p>
            <h2 id="process-title">From facade to floor plan in three moves.</h2>
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
            <h2 id="buyer-pack-title">Take the decision offline.</h2>
          </div>
          <div>
            <p>
              The digital buyer pack turns the selected-home experience into a portable decision:
              illustrative floor plans, finish notes, and project information in one secure checkout.
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
              <AccordionTrigger>Is Syndiqo Tower a real property launch?</AccordionTrigger>
              <AccordionContent>
                No. Syndiqo Tower, its residences, availability, and pricing are illustrative demo content
                created to show a complete 3D real-estate commerce experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="three">
              <AccordionTrigger>How does the 3D apartment explorer work?</AccordionTrigger>
              <AccordionContent>
                The building is procedural geometry rendered in real time with Three.js and React Three
                Fiber. Orbit the tower, filter by bedroom count, and inspect each apartment floor plan.
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

      <footer className="site-footer">
        <div className="site-footer__brand">
          <p>Syndiqo Tower</p>
          <h2>See the whole decision.</h2>
        </div>
        <Separator />
        <div className="site-footer__bottom">
          <a href={siteConfig.syndiqoUrl} rel="noreferrer" target="_blank">A Syndiqo experience ↗</a>
          <span>Vite · TanStack · shadcn/ui · Three.js · Polar</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  )
}
