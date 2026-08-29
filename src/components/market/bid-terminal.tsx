import { useMemo, useState } from "react"
import { ActivityIcon, ArrowUpRightIcon, CircleDotIcon, LockKeyholeIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Marquee } from "@/components/ui/marquee"
import { NumberTicker } from "@/components/ui/number-ticker"
import { createBids, getAllBids, type BidStatus } from "@/data/bids"
import { formatMad } from "@/data/residences"
import { towers, type Tower } from "@/data/towers"

type BidFilter = "all" | BidStatus

const statusLabels: Record<BidStatus, string> = {
  open: "Open",
  counter: "Counter",
  matched: "Matched",
}

export function BidTerminal({ tower, onSelectUnit }: { tower: Tower; onSelectUnit: (unit: string) => void }) {
  const [filter, setFilter] = useState<BidFilter>("all")
  const allTowerBids = useMemo(() => createBids(tower), [tower])
  const visibleBids = useMemo(
    () => filter === "all" ? allTowerBids : allTowerBids.filter((bid) => bid.status === filter),
    [allTowerBids, filter],
  )
  const tape = useMemo(() => getAllBids(towers).slice(0, 12), [])
  const referenceValue = Math.round(tower.startingPrice * 1.42)

  return (
    <section className="bid-terminal" id="bids" aria-labelledby="bid-terminal-title">
      <div className="bid-tape" aria-label="Illustrative market activity">
        <Marquee pauseOnHover repeat={2}>
          {tape.map((bid) => (
            <span className="bid-tape__item" key={bid.id}>
              <b>{bid.towerCode} {bid.residence}</b>
              <span>{bid.side}</span>
              <span>{formatMad(bid.amount)}</span>
              <span data-direction={bid.move >= 0 ? "up" : "down"}>{bid.move >= 0 ? "+" : ""}{bid.move.toFixed(1)}%</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="bid-terminal__header">
        <div>
          <p className="eyebrow">Tower market / read-only session</p>
          <h2 id="bid-terminal-title">Bid terminal</h2>
          <p>Compare indicative interest around {tower.name}, then jump straight back to a unit in 3D.</p>
        </div>
        <div className="terminal-session">
          <span><CircleDotIcon aria-hidden="true" /> Session active</span>
          <small><LockKeyholeIcon aria-hidden="true" /> Illustrative data</small>
        </div>
      </div>

      <div className="bid-terminal__metrics" aria-label={`${tower.name} market summary`}>
        <div>
          <span>Reference value</span>
          <strong aria-label={`${formatMad(referenceValue)} reference value`}><NumberTicker aria-hidden="true" className="text-inherit tracking-normal" key={`value-${tower.id}`} value={referenceValue / 1_000_000} decimalPlaces={2} />M</strong>
          <small>MAD</small>
        </div>
        <div>
          <span>Active bids</span>
          <strong aria-label={`${tower.activeBids} active bids`}><NumberTicker aria-hidden="true" className="text-inherit tracking-normal" key={`bids-${tower.id}`} value={tower.activeBids} /></strong>
          <small>signals</small>
        </div>
        <div>
          <span>Session move</span>
          <strong aria-label={`Plus ${tower.marketMove.toFixed(1)} percent session move`} className="metric-up">+<NumberTicker aria-hidden="true" className="text-inherit tracking-normal" key={`move-${tower.id}`} value={tower.marketMove} decimalPlaces={1} />%</strong>
          <small>demo index</small>
        </div>
        <div>
          <span>Selected tower</span>
          <strong className="metric-code">{tower.code}</strong>
          <small>{tower.district}</small>
        </div>
      </div>

      <div className="bid-terminal__panel">
        <div className="bid-terminal__toolbar">
          <div className="terminal-filters" aria-label="Filter bid activity">
            {(["all", "open", "counter", "matched"] as BidFilter[]).map((value) => (
              <button aria-pressed={filter === value} key={value} onClick={() => setFilter(value)} type="button">
                {value === "all" ? "All activity" : statusLabels[value]}
              </button>
            ))}
          </div>
          <Badge variant="outline"><ActivityIcon aria-hidden="true" /> {visibleBids.length} rows</Badge>
        </div>

        <div className="bid-table-wrap">
          <table className="bid-table">
            <caption className="sr-only">Illustrative bid and ask activity for {tower.name}</caption>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Unit</th>
                <th scope="col">Side</th>
                <th scope="col">Amount</th>
                <th scope="col">Move</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="sr-only">Open unit</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleBids.map((bid) => (
                <tr key={bid.id}>
                  <td>{bid.time}</td>
                  <td><b>{bid.towerCode}.{bid.residence}</b></td>
                  <td><span className="bid-side" data-side={bid.side.toLowerCase()}>{bid.side}</span></td>
                  <td>{formatMad(bid.amount)}</td>
                  <td className={bid.move >= 0 ? "metric-up" : "metric-down"}>{bid.move >= 0 ? "+" : ""}{bid.move.toFixed(1)}%</td>
                  <td><span className="bid-status" data-status={bid.status}>{statusLabels[bid.status]}</span></td>
                  <td>
                    <button className="bid-row-action" onClick={() => onSelectUnit(bid.residence)} type="button">
                      View <ArrowUpRightIcon aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bid-terminal__footer">
          <p>No order is submitted here. Values show product-demo activity only.</p>
          <Button asChild size="sm" variant="outline">
            <a href="#explore">Open {tower.code} in 3D <ArrowUpRightIcon data-icon="inline-end" /></a>
          </Button>
        </div>
      </div>
    </section>
  )
}
