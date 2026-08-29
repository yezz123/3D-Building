import { useQuery } from "@tanstack/react-query"

import { mergeOwnerships, type ApartmentOwnership } from "@/data/ownership"

type OwnershipResponse = {
  ownerships: ApartmentOwnership[]
}

async function getOwnerships() {
  const response = await fetch("/api/ownership", { headers: { Accept: "application/json" } })
  if (!response.ok) throw new Error("Ownership directory is temporarily unavailable")
  const payload = (await response.json()) as OwnershipResponse
  return mergeOwnerships(payload.ownerships)
}

export function useOwnerships() {
  return useQuery({
    queryKey: ["apartment-ownerships"],
    queryFn: getOwnerships,
    initialData: mergeOwnerships([]),
    retry: 1,
    staleTime: 30_000,
  })
}
