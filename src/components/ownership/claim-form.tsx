import { useMemo, useState, type FormEvent } from "react"
import { CheckCircle2Icon, ImagePlusIcon, LoaderCircleIcon, LockKeyholeIcon } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ownershipId } from "@/data/ownership"
import { towers } from "@/data/towers"
import { useOwnerships } from "@/hooks/use-ownerships"

const MAX_LOGO_BYTES = 1_500_000
const ACCEPTED_LOGOS = ["image/png", "image/jpeg", "image/webp"]

type ClaimState = { type: "idle" | "submitting" | "success" | "error"; message?: string }

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("We could not read that logo file"))
    reader.readAsDataURL(file)
  })
}

export function ClaimForm({ checkoutId, environment }: { checkoutId: string; environment: "production" | "sandbox" }) {
  const queryClient = useQueryClient()
  const { data: ownerships } = useOwnerships()
  const [state, setState] = useState<ClaimState>({ type: "idle" })
  const claimedIds = useMemo(() => new Set(ownerships.map((owner) => owner.id)), [ownerships])
  const availableHomes = useMemo(
    () => towers.flatMap((tower) => tower.residences
      .filter((residence) => !claimedIds.has(ownershipId(tower.id, residence.unit)))
      .map((residence) => ({
        id: ownershipId(tower.id, residence.unit),
        towerId: tower.id,
        unit: residence.unit,
        label: `${tower.name} · Residence ${residence.unit} · ${residence.price}`,
      }))),
    [claimedIds],
  )

  const submitClaim = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState({ type: "submitting" })
    const form = new FormData(event.currentTarget)
    const file = form.get("logo")

    try {
      if (!(file instanceof File) || !file.size) throw new Error("Choose a PNG, JPG, or WebP logo")
      if (!ACCEPTED_LOGOS.includes(file.type)) throw new Error("Use a PNG, JPG, or WebP logo")
      if (file.size > MAX_LOGO_BYTES) throw new Error("Keep the logo under 1.5 MB")

      const residence = availableHomes.find((home) => home.id === form.get("residence"))
      if (!residence) throw new Error("Choose an available residence")

      const response = await fetch("/api/ownership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutId,
          environment,
          towerId: residence.towerId,
          unit: residence.unit,
          ownerName: String(form.get("ownerName") ?? ""),
          website: String(form.get("website") ?? ""),
          brandColor: String(form.get("brandColor") ?? "#03aded"),
          logo: await fileToDataUrl(file),
        }),
      })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(payload.error || "The apartment claim could not be completed")

      await queryClient.invalidateQueries({ queryKey: ["apartment-ownerships"] })
      setState({ type: "success", message: "Your logo is live. Return to the tower to see your branded apartment." })
      event.currentTarget.reset()
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "The apartment claim could not be completed" })
    }
  }

  return (
    <section className="claim-card" aria-labelledby="claim-title">
      <div className="claim-card__intro">
        <span><LockKeyholeIcon aria-hidden="true" /> Verified with Polar</span>
        <h2 id="claim-title">Put your name on the skyline.</h2>
        <p>One successful buyer-pack checkout unlocks one unclaimed demo apartment. Your logo is stored privately in Cloudflare R2.</p>
      </div>

      {state.type === "success" ? (
        <div className="claim-success" role="status">
          <CheckCircle2Icon aria-hidden="true" />
          <h3>Apartment claimed</h3>
          <p>{state.message}</p>
          <Button asChild><a href="/#explore">See the branded tower</a></Button>
        </div>
      ) : (
        <form className="claim-form" onSubmit={submitClaim}>
          <label>
            <span>Organization name</span>
            <Input autoComplete="organization" maxLength={60} name="ownerName" placeholder="Your brand or organization" required />
          </label>
          <label>
            <span>Website</span>
            <Input autoComplete="url" name="website" placeholder="https://example.com" required type="url" />
          </label>
          <label>
            <span>Apartment</span>
            <select defaultValue="" name="residence" required>
              <option disabled value="">Choose an unclaimed residence</option>
              {availableHomes.map((home) => <option key={home.id} value={home.id}>{home.label}</option>)}
            </select>
          </label>
          <label>
            <span>Brand color</span>
            <Input defaultValue="#03aded" name="brandColor" type="color" />
          </label>
          <label className="claim-form__upload">
            <ImagePlusIcon aria-hidden="true" />
            <span><b>Upload your logo</b><small>PNG, JPG, or WebP · maximum 1.5 MB</small></span>
            <Input accept={ACCEPTED_LOGOS.join(",")} name="logo" required type="file" />
          </label>
          {state.type === "error" ? <p className="claim-form__error" role="alert">{state.message}</p> : null}
          <Button disabled={state.type === "submitting" || availableHomes.length === 0} size="lg" type="submit">
            {state.type === "submitting" ? <><LoaderCircleIcon className="animate-spin" /> Verifying purchase…</> : "Claim and publish apartment"}
          </Button>
          <p className="claim-form__fineprint">The payment is verified server-side. Checkout IDs and storage credentials never enter the public page.</p>
        </form>
      )}
    </section>
  )
}
