import React from 'react'
import { Friend, Movie } from '../types'
import MovieCard from './MovieCard'
import { Recommendation } from './RecommendedMovieList'
type RecommendedMovieProps = {
  recommendation: Recommendation
  rank: number
}

interface activeUser extends Friend {
  hasSaved: boolean
  hasWatched: boolean
}

export default function RecommendedMovie({
  recommendation: { movie, activeUsers },
  rank,
}: RecommendedMovieProps) {
  return (
    <div className='col-sm-6 my-1'>
      <MovieCard
        movie={movie}
        rank={rank}
      />
      <div className='list-group list-group-horizontal text-center'>
        {activeUsers.map((user) => {
          let status = ''
          if (user.hasSaved) status = 'list-group-item-success'
          else if (user.hasWatched) status = 'list-group-item-danger'

          return (
            <div
              key={user.pk}
              className={`flex-fill list-group-item ${status}`}
            >
              {user.first}
            </div>
          )
        })}
      </div>
    </div>
  )
}
