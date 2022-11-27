import { Movie } from '../../types'
import MoviePosterWithModal from '../movies/MoviePosterWithModal'

type MovieSliderRowProps = {
  title: string
  movies: Movie[]
}

export default function MovieSliderRow({ title, movies }: MovieSliderRowProps) {
  return (
    <div className='swiper mb-5'>
      <div
        className='d-flex
         align-items-center
         justify-content-center
         text-white-50
         bg-dark
         rounded shadow-sm
         mb-2'
      >
        <div className='h-100 p-2 '>
          <h5 className='mb-0 text-white lh-100'>{title}</h5>
        </div>
      </div>
      <div className='swiper-wrapper mb-2'>
        {movies.map((movie) => {
          return (
            <div
              key={movie.pk}
              className='swiper-slide pe-2 col-lg-2 col-3'
            >
              {/*% include 'movies/movie-poster-with-modal.html' % */}
              <MoviePosterWithModal movie={movie} />
              <div className='d-flex justify-content-between h6'>
                <span className='text-truncate'>{movie.title}</span>
                <span
                  className='ms-2'
                  style={{ color: '#07a607' }}
                >
                  {movie.rating.toFixed(0)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div
        className='swiper-scrollbar'
        style={{ height: '10px' }}
      ></div>
    </div>
  )
}
