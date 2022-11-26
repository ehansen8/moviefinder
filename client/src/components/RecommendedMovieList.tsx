import React from 'react'
import { Friend, Movie } from '../types'
import MovieCard from './MovieCard'
import Pagination from './Pagination'
import RecommendedMovie from './RecommendedMovie'

type RecommendedMovieListProps = {
  recommendations: Recommendation[]
}

export type Recommendation = {
  movie: Movie
  activeUsers: ActiveUser[]
}

interface ActiveUser extends Friend {
  hasSaved: boolean
  hasWatched: boolean
}

export default function RecommendedMovieList({
  recommendations,
}: RecommendedMovieListProps) {
  return (
    <div className='d-flex flex-row flex-wrap justify-content-start'>
      {recommendations.map((recommendation, idx) => {
        const rank = idx + 1
        return (
          <RecommendedMovie
            key={rank}
            recommendation={recommendation}
            rank={rank}
          />
        )
      })}

      <Pagination />
    </div>
  )
}
