import { useState } from 'react'
import { Movie } from '../types'
import MovieDetailModal from './MovieDetailModal'

export default function MoviePosterWithModal({ movie }: { movie: Movie }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className='position-relative'>
      <img
        className='w-100 rounded '
        src={movie.posterUrl}
        alt=''
        style={{ aspectRatio: 6 / 9 }}
      />

      <a
        onClick={() => setIsModalOpen(true)}
        href='#'
        data-url="{% url 'movies:detail' movie_id=movie.pk %}"
        className='stretched-link'
      ></a>
      <MovieDetailModal
        isShowing={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
