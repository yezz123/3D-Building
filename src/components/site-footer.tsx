import { ArrowUpRightIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { BrandMark } from "@/components/brand/brand-mark"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/site"

const productLinks = [
  ["Calls for proposals", "/eng/tenders"],
  ["Pricing", "/eng/pricing"],
  ["Demo", "/eng/demo"],
  ["Residence CSV builder", "/eng/tools/csv-builder"],
  ["Blog", "/eng/blog"],
] as const

const companyLinks = [
  ["Contact", "/eng/contact"],
  ["HOET Technologies", "https://hoet.ma"],
] as const

const legalLinks = [
  ["Privacy", "/eng/privacy"],
  ["Terms", "/eng/terms"],
  ["Law 18-00", "/eng/loi-18-00"],
  ["Sitemap", "/sitemap.xml"],
] as const

const regions = [
  "Tanger-Tétouan-Al Hoceïma",
  "Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed Dahab",
]

const syndiqoLink = (path: string) => path.startsWith("http") ? path : `${siteConfig.syndiqoUrl}${path}`

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <div className="footer-links">
      <h3>{title}</h3>
      {links.map(([label, href]) => (
        <a href={syndiqoLink(href)} key={label} rel="noreferrer" target="_blank">
          {label} <ArrowUpRightIcon aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__statement">
          <p className="eyebrow">Built with Syndiqo</p>
          <h2>The residence becomes a collective.</h2>
          <Button asChild>
            <a href={siteConfig.syndiqoUrl} rel="noreferrer" target="_blank">
              Discover Syndiqo <ArrowUpRightIcon data-icon="inline-end" />
            </a>
          </Button>
        </div>

        <Separator />

        <div className="site-footer__directory">
          <div className="site-footer__about">
            <a aria-label="Syndiqo home" className="footer-brand" href={siteConfig.syndiqoUrl} rel="noreferrer" target="_blank">
              <BrandMark />
              <span>Syndiqo</span>
            </a>
            <p>The private platform that structures residences, collective decisions, and syndic mandates with a clear audit trail.</p>
          </div>
          <FooterLinks title="Product" links={productLinks} />
          <FooterLinks title="Company" links={companyLinks} />
          <FooterLinks title="Legal" links={legalLinks} />
          <div className="footer-links footer-contact">
            <h3>Contact</h3>
            <a href="mailto:contact@hoet.ma"><MailIcon aria-hidden="true" /> contact@hoet.ma</a>
            <a href="tel:+212611339986"><PhoneIcon aria-hidden="true" /> +212 611-339986</a>
            <span>ICE: 003928777000087</span>
          </div>
        </div>

        <div className="site-footer__regions">
          <div>
            <p className="eyebrow">Syndic pricing by region</p>
            <h3>Market references for Morocco's 12 regions.</h3>
          </div>
          <div className="region-links">
            {regions.map((region) => (
              <a href={syndiqoLink("/eng/pricing")} key={region} rel="noreferrer" target="_blank">{region}</a>
            ))}
          </div>
        </div>

        <div className="site-footer__office">
          <MapPinIcon aria-hidden="true" />
          <div>
            <p className="eyebrow">Our office</p>
            <h3>Visit us in Casablanca</h3>
          </div>
          <address>
            3 Eme Etage, Appt 11, Lusitania<br />
            Angle Rue D'alger Et 2, Rue Abou Bakr Al Baklani<br />
            Casablanca, Maroc
          </address>
          <a href="https://www.google.com/maps/search/?api=1&query=HOET+Technologies+Casablanca" rel="noreferrer" target="_blank">
            Open in Maps <ArrowUpRightIcon aria-hidden="true" />
          </a>
        </div>

        <Separator />

        <div className="site-footer__bottom">
          <span>© 2026 HOET Technologies SARL</span>
          <span>Vite · TanStack · shadcn/ui · Three.js · Polar</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>

      <div className="footer-wordmark" aria-hidden="true">
        <span>Syndiqo</span>
        <div className="footer-mini-tower">
          <i className="footer-mini-tower__plant" />
          <i /><i /><i /><i /><i /><i />
        </div>
      </div>
    </footer>
  )
}
