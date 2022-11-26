export type Movie = {
  pk?: number
  title: string
  rating: number
  posterUrl?: string
  backdropUrl?: string
  year: number
  genres: string[]
  seenByUser?: boolean
  savedByUser?: boolean
}
export type Friend = {
  pk?: number
  first: string
  last: string
}
