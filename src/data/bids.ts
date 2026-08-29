import type { Tower } from "@/data/towers"

export type BidStatus = "open" | "counter" | "matched"

export type Bid = {
  id: string
  towerId: string
  towerCode: string
  residence: string
  side: "BID" | "ASK"
  amount: number
  move: number
  status: BidStatus
  time: string
}

const bidBlueprints = [
  { unit: "4B", side: "BID", factor: 1.36, move: 1.8, status: "open", time: "18:42:09" },
  { unit: "7A", side: "ASK", factor: 2.12, move: -0.6, status: "counter", time: "18:39:51" },
  { unit: "3A", side: "BID", factor: 1.25, move: 0.9, status: "matched", time: "18:35:14" },
  { unit: "5B", side: "BID", factor: 1.16, move: 2.1, status: "open", time: "18:31:22" },
  { unit: "6A", side: "ASK", factor: 1.9, move: -1.2, status: "counter", time: "18:28:47" },
] as const

export function createBids(tower: Tower): Bid[] {
  return bidBlueprints.map((bid, index) => ({
    id: `${tower.code}-${bid.unit}-${index}`,
    towerId: tower.id,
    towerCode: tower.code,
    residence: bid.unit,
    side: bid.side,
    amount: Math.round((tower.startingPrice * bid.factor) / 10_000) * 10_000,
    move: bid.move + tower.marketMove / 10,
    status: bid.status,
    time: bid.time,
  }))
}

export function getAllBids(towers: Tower[]) {
  return towers.flatMap(createBids)
}
