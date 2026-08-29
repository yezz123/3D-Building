import { ArrowDownRightIcon } from "lucide-react"

import { BrandMark } from "@/components/brand/brand-mark"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="site-header">
      <a aria-label="Syndiqo Tower home" className="brand" href="#top">
        <BrandMark />
        <span>
          Syndiqo <b>Tower</b>
        </span>
      </a>

      <nav aria-label="Main navigation">
        <a href="#residences">Residences</a>
        <a href="#architecture">Architecture</a>
        <a href="#process">How it works</a>
        <a href="#faq">FAQ</a>
      </nav>

      <Button asChild size="sm">
        <a href="#explore">
          Choose a home
          <ArrowDownRightIcon data-icon="inline-end" />
        </a>
      </Button>
    </header>
  )
}
