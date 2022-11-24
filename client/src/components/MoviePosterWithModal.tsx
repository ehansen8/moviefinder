import React from 'react'
import { Movie } from '../types'

export default function MoviePosterWithModal({ movie }: { movie: Movie }) {
  return (
    <div className='position-relative'>
      <img
        className='w-100 rounded '
        src={movie.posterUrl}
        alt=''
        style={{ aspectRatio: 6 / 9 }}
      />
      {/** //TODO: fix url stuff */}
      <a
        href='#'
        data-bs-toggle='modal'
        data-bs-target='#movie-detail-modal'
        data-url="{% url 'movies:detail' movie_id=movie.pk %}"
        className='stretched-link'
      ></a>
    </div>
  )
}
