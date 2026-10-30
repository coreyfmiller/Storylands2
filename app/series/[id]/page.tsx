import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { series, seriesById, storiesInSeries } from "@/lib/catalog"
import { SeriesView } from "@/components/series-view"

// The page a series card opens.
//
// Before this route existed, `SeriesRow` rendered cards that looked exactly like
// the clickable book cards beside them and did nothing when pressed — no href,
// no handler, nowhere to go. A series was a label on the shelf rather than
// something a child could follow, which is most of why the library had no series
// worth the name.

export function generateStaticParams() {
  // Only series that exist, which `series` already limits to those with two or
  // more READABLE books. A one-book series is not a series.
  return series.map((s) => ({ id: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const found = seriesById(id)
  if (!found) return { title: "Series not found" }
  return {
    title: found.name,
    description: found.tagline,
    openGraph: {
      title: found.name,
      description: found.tagline,
      images: [found.image],
    },
  }
}

export default async function SeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const found = seriesById(id)
  if (!found) notFound()

  return <SeriesView series={found} books={storiesInSeries(id)} />
}
