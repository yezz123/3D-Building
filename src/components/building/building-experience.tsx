import { lazy, Suspense, useMemo, useState, useTransition, type CSSProperties } from "react"
import { ArrowUpRightIcon, BedDoubleIcon, Building2Icon, CompassIcon, EyeIcon, Move3DIcon, RulerIcon } from "lucide-react"

import type { FacadeView } from "@/components/building/building-canvas"
import { FloorPlan } from "@/components/building/floor-plan"
import { BidTerminal } from "@/components/market/bid-terminal"
import { Badge } from "@/components/ui/badge"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { Button } from "@/components/ui/button"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { filterResidences, getResidence, type ResidenceStatus } from "@/data/residences"
import { getTower, towers } from "@/data/towers"
import { getCheckoutUrl, isSandboxCheckout } from "@/lib/checkout"

const BuildingCanvas = lazy(() => import("@/components/building/building-canvas"))

type BedsFilter = "all" | "1" | "2" | "3"

const statusCopy: Record<ResidenceStatus, string> = {
  available: "Available",
  preview: "Preview release",
  waitlist: "Waitlist",
}

const facadeKeys: FacadeView[] = ["front", "east", "west"]

function CanvasLoadingState() {
  return (
    <div className="canvas-loading" role="status">
      <div className="canvas-loading__tower" />
      <p>Loading the tower</p>
    </div>
  )
}

export default function BuildingExperience() {
  const [towerId, setTowerId] = useState(towers[0].id)
  const [selectedId, setSelectedId] = useState("4B")
  const [bedsFilter, setBedsFilter] = useState<BedsFilter>("all")
  const [facadeView, setFacadeView] = useState<FacadeView>("front")
  const [, startTransition] = useTransition()
  const tower = getTower(towerId)
  const selectedResidence = getResidence(selectedId, tower.residences)
  const visibleResidences = useMemo(
    () => filterResidences(bedsFilter, tower.residences),
    [bedsFilter, tower.residences],
  )
  const visibleIds = useMemo(() => new Set(visibleResidences.map((residence) => residence.id)), [visibleResidences])

  const chooseTower = (nextTowerId: string) => {
    const nextTower = getTower(nextTowerId)
    const preferredUnit = selectedResidence.unit
    const nextResidence = nextTower.residences.find((residence) => residence.unit === preferredUnit)
      ?? nextTower.residences[0]

    startTransition(() => {
      setTowerId(nextTower.id)
      setSelectedId(nextResidence.id)
      setFacadeView("front")
    })
  }

  const applyFilter = (value: string) => {
    if (!value) return
    const nextFilter = value as BedsFilter
    const nextResidences = filterResidences(nextFilter, tower.residences)
    startTransition(() => {
      setBedsFilter(nextFilter)
      if (!nextResidences.some((residence) => residence.id === selectedId)) {
        setSelectedId(nextResidences[0].id)
      }
    })
  }

  const selectUnit = (unit: string) => {
    const residence = tower.residences.find((candidate) => candidate.unit === unit)
    if (!residence) return
    setBedsFilter("all")
    setSelectedId(residence.id)
    document.querySelector("#explore")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <div className="tower-collection" aria-label="Choose a tower">
        {towers.map((candidate, index) => {
          const active = candidate.id === tower.id
          return (
            <BlurFade delay={index * 0.06} inView key={candidate.id}>
              <button
                aria-pressed={active}
                className="tower-choice"
                onClick={() => chooseTower(candidate.id)}
                style={{ "--tower-color": candidate.palette.accent } as CSSProperties}
                type="button"
              >
                <span className="tower-choice__index">{candidate.index} / {candidate.code}</span>
                <span className="tower-choice__name">{candidate.name}</span>
                <span className="tower-choice__place">{candidate.district}, {candidate.city}</span>
                <span className="tower-choice__meta">
                  <b>{candidate.priceLabel}</b>
                  <small>{candidate.floors} floors</small>
                </span>
                {active ? <BorderBeam borderWidth={2} colorFrom="#03aded" colorTo="#10223f" duration={7} size={120} /> : null}
              </button>
            </BlurFade>
          )
        })}
      </div>

      <div className="explorer" data-testid="residence-explorer">
        <div className="explorer__toolbar">
          <div>
            <p className="eyebrow">{tower.code} / {tower.designNote}</p>
            <h2>{tower.name}. Three sides to explore.</h2>
          </div>

          <ToggleGroup aria-label="Filter residences by bedroom count" onValueChange={applyFilter} spacing={0} type="single" value={bedsFilter} variant="outline">
            <ToggleGroupItem aria-label="Show all homes" value="all">All</ToggleGroupItem>
            <ToggleGroupItem aria-label="Show one-bedroom homes" value="1">1 bed</ToggleGroupItem>
            <ToggleGroupItem aria-label="Show two-bedroom homes" value="2">2 bed</ToggleGroupItem>
            <ToggleGroupItem aria-label="Show three-bedroom homes" value="3">3 bed</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="explorer__body">
          <div className="tower-stage">
            <div className="tower-stage__hud" aria-hidden="true">
              <span>DRAG TO ORBIT</span>
              <Move3DIcon />
              <span>SCROLL TO ZOOM</span>
            </div>

            <div className="facade-switcher" aria-label={`Choose a ${tower.name} facade`}>
              {facadeKeys.map((view, index) => (
                <button aria-pressed={facadeView === view} key={view} onClick={() => setFacadeView(view)} type="button">
                  <EyeIcon aria-hidden="true" />
                  {tower.faces[index]}
                </button>
              ))}
            </div>

            <div className="tower-stage__canvas">
              <Suspense fallback={<CanvasLoadingState />}>
                <BuildingCanvas tower={tower} facadeView={facadeView} selectedId={selectedId} visibleIds={visibleIds} onSelect={setSelectedId} />
              </Suspense>
            </div>

            <div className="tower-stage__identity" aria-live="polite">
              <Building2Icon aria-hidden="true" />
              <span>{tower.code}</span>
              <p>{tower.description}</p>
            </div>

            <div className="residence-rail" aria-label="Choose a residence">
              {tower.residences.map((residence) => {
                const isVisible = visibleIds.has(residence.id)
                return (
                  <button
                    aria-label={`Residence ${residence.unit}, ${residence.beds} bedroom, ${statusCopy[residence.status]}`}
                    aria-pressed={selectedId === residence.id}
                    className="residence-chip"
                    data-visible={isVisible}
                    disabled={!isVisible}
                    key={residence.id}
                    onClick={() => setSelectedId(residence.id)}
                    type="button"
                  >
                    <span>{residence.unit}</span>
                    <small>{residence.beds} BR</small>
                  </button>
                )
              })}
            </div>
          </div>

          <aside className="residence-detail" aria-live="polite">
            <div className="residence-detail__topline">
              <p>{tower.code} / Residence {selectedResidence.unit}</p>
              <Badge variant={selectedResidence.status === "waitlist" ? "outline" : "secondary"}>{statusCopy[selectedResidence.status]}</Badge>
            </div>

            <div className="residence-detail__heading">
              <div>
                <p className="residence-detail__plan">{selectedResidence.plan}</p>
                <h3 aria-label={selectedResidence.price}><NumberTicker aria-hidden="true" className="text-inherit tracking-normal" key={selectedResidence.id} value={selectedResidence.priceValue / 1_000_000} decimalPlaces={2} />M</h3>
                <small>MAD · illustrative</small>
              </div>
              <span>{tower.district}</span>
            </div>

            <p className="residence-detail__summary">{selectedResidence.summary}</p>

            <div className="residence-specs">
              <div><BedDoubleIcon aria-hidden="true" /><span>{selectedResidence.beds} bed · {selectedResidence.baths} bath</span></div>
              <div><RulerIcon aria-hidden="true" /><span>{selectedResidence.area} m² internal</span></div>
              <div><CompassIcon aria-hidden="true" /><span>{selectedResidence.exposure} · {selectedResidence.view}</span></div>
            </div>

            <Separator />
            <FloorPlan residence={selectedResidence} />
            <Separator />

            <div className="checkout-cta">
              <div><p>Digital buyer pack</p><span>Plans, finishes + project notes</span></div>
              <strong>$29</strong>
            </div>

            <Button asChild className="w-full" size="lg">
              <a href={getCheckoutUrl(selectedResidence.id)} rel="noreferrer" target="_blank">
                Get the buyer pack <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </Button>

            <p className="sandbox-note">
              {isSandboxCheckout
                ? "Polar Sandbox test checkout. No real payment or property reservation."
                : "Secure Polar checkout for a digital product. No real property is sold or reserved."}
            </p>
          </aside>
        </div>
      </div>

      <p className="illustrative-note">Tower, residence, price, availability, view, and bid data are illustrative product-demo content.</p>
      <BidTerminal tower={tower} onSelectUnit={selectUnit} />
    </>
  )
}
