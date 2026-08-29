import { useEffect } from "react"

type PageMetadata = {
  title: string
  description: string
  robots?: string
}

const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"

export function usePageMetadata({ title, description, robots = DEFAULT_ROBOTS }: PageMetadata) {
  useEffect(() => {
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]')

    document.title = title
    descriptionMeta?.setAttribute("content", description)
    robotsMeta?.setAttribute("content", robots)
  }, [description, robots, title])
}
