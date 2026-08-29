import { lazy, Suspense, useMemo, useState, useTransition } from "react"
import { ArrowUpRightIcon, BedDoubleIcon, CompassIcon, Move3DIcon, RulerIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { filterResidences, getResidence, residences, type ResidenceStatus } from "@/data/residences"
import { getCheckoutUrl, isSandboxCheckout } from "@/lib/checkout"
import { FloorPlan } from "@/components/building/floor-plan"

const BuildingCanvas = lazy(() => import("@/components/building/building-canvas"))

type BedsFilter = "all" | "1" | "2" | "3"

const statusCopy: Record<ResidenceStatus, string> = {
  available: "Available",
  preview: "Preview release",
  waitlist: "Waitlist",
}

function CanvasLoadingState() {
  return (
    <div className="canvas-loading" role="status">
      <div className="canvas-loading__tower" />
      <p>Loading the tower</p>
    </div>
  )
}

export default function BuildingExperience() {
  const [selectedId, setSelectedId] = useState("4B")
  const [bedsFilter, setBedsFilter] = useState<BedsFilter>("all")
  const [, startTransition] = useTransition()
  const selectedResidence = getResidence(selectedId)
  const visibleIds = useMemo(
    () => new Set(filterResidences(bedsFilter).map((residence) => residence.id)),
    [bedsFilter],
  )

  const applyFilter = (value: string) => {
    if (!value) return
    const nextFilter = value as BedsFilter
    const nextResidences = filterResidences(nextFilter)
    startTransition(() => {
      setBedsFilter(nextFilter)
      if (!nextResidences.some((residence) => residence.id === selectedId)) {
        setSelectedId(nextResidences[0].id)
      }
    })
  }

  return (
    <div className="explorer" data-testid="residence-explorer">
      <div className="explorer__toolbar">
        <div>
          <p className="eyebrow">Interactive release</p>
          <h2>Orbit the building. Tap a home.</h2>
        </div>

        <ToggleGroup
          aria-label="Filter residences by bedroom count"
          onValueChange={applyFilter}
          spacing={0}
          type="single"
          value={bedsFilter}
          variant="outline"
        >
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

          <div className="tower-stage__canvas">
            <Suspense fallback={<CanvasLoadingState />}>
              <BuildingCanvas
                selectedId={selectedId}
                visibleIds={visibleIds}
                onSelect={setSelectedId}
              />
            </Suspense>
          </div>

          <div className="residence-rail" aria-label="Choose a residence">
            {residences.map((residence) => {
              const isVisible = visibleIds.has(residence.id)
              return (
                <button
                  aria-label={`Residence ${residence.id}, ${residence.beds} bedroom, ${statusCopy[residence.status]}`}
                  aria-pressed={selectedId === residence.id}
                  className="residence-chip"
                  data-visible={isVisible}
                  disabled={!isVisible}
                  key={residence.id}
                  onClick={() => setSelectedId(residence.id)}
                  type="button"
                >
                  <span>{residence.id}</span>
                  <small>{residence.beds} BR</small>
                </button>
              )
            })}
          </div>
        </div>

        <aside className="residence-detail" aria-live="polite">
          <div className="residence-detail__topline">
            <p>Residence {selectedResidence.id}</p>
            <Badge variant={selectedResidence.status === "waitlist" ? "outline" : "secondary"}>
              {statusCopy[selectedResidence.status]}
            </Badge>
          </div>

          <div className="residence-detail__heading">
            <div>
              <p className="residence-detail__plan">{selectedResidence.plan}</p>
              <h3>{selectedResidence.price}</h3>
            </div>
            <span>Illustrative</span>
          </div>

          <p className="residence-detail__summary">{selectedResidence.summary}</p>

          <div className="residence-specs">
            <div>
              <BedDoubleIcon aria-hidden="true" />
              <span>{selectedResidence.beds} bed · {selectedResidence.baths} bath</span>
            </div>
            <div>
              <RulerIcon aria-hidden="true" />
              <span>{selectedResidence.area} m² internal</span>
            </div>
            <div>
              <CompassIcon aria-hidden="true" />
              <span>{selectedResidence.exposure} · {selectedResidence.view}</span>
            </div>
          </div>

          <Separator />
          <FloorPlan residence={selectedResidence} />
          <Separator />

          <div className="checkout-cta">
            <div>
              <p>Digital buyer pack</p>
              <span>Plans, finishes + project notes</span>
            </div>
            <strong>$29</strong>
          </div>

          <Button asChild className="w-full" size="lg">
            <a href={getCheckoutUrl(selectedResidence.id)} rel="noreferrer" target="_blank">
              Get the buyer pack
              <ArrowUpRightIcon data-icon="inline-end" />
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
  )
}
