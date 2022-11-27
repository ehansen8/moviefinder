import { useRouter } from 'next/router'
import MoviePosterWithModal from '../../components/movies/MoviePosterWithModal'
import { saved_movies, watched_movies } from '../../MockData'
import { getRatingColor } from '../../utils/getRatingColor'

export default function UserPage() {
  const router = useRouter()
  const { id } = router.query
  return (
    <div className='container-fluid'>
      <ul className='nav nav-tabs m-2'>
        <li className='nav-item'>
          <a
            className='nav-link active'
            aria-current='page'
            href='#'
            data-bs-toggle='tab'
            data-bs-target='#saved-tab-content'
          >
            Saved
          </a>
        </li>
        <li className='nav-item'>
          <a
            className='nav-link'
            href='#'
            data-bs-toggle='tab'
            data-bs-target='#watched-tab-content'
          >
            Watched
          </a>
        </li>
        <li className='nav-item'>
          <a
            className='nav-link'
            href='#'
            data-bs-toggle='tab'
            data-bs-target='#following-tab-content'
          >
            Following
          </a>
        </li>
      </ul>
      <div className='tab-content'>
        <div
          id='saved-tab-content'
          className='tab-pane fade show active'
          role='tabpanel'
          aria-labelledby='home-tab'
        >
          <div className='d-flex justify-content-start flex-wrap'>
            {saved_movies.map((movie) => {
              return (
                <div
                  key={movie.pk}
                  className='col-lg-2 col-3 p-1'
                >
                  <MoviePosterWithModal movie={movie} />
                  <div className='d-flex justify-content-between h6'>
                    <span className='text-truncate'>{movie.title}</span>
                    <span
                      className='ms-2'
                      style={{ color: '#07a607' }}
                    >
                      {movie.rating}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div
          id='watched-tab-content'
          className='tab-pane fade'
          role='tabpanel'
          aria-labelledby='profile-tab'
        >
          <div className='d-flex justify-content-start flex-wrap'>
            {watched_movies.map((movie) => {
              const color = getRatingColor(movie.rating)
              return (
                <div
                  key={movie.pk}
                  className='col-lg-2 col-3 px-1 mb-1'
                >
                  <MoviePosterWithModal movie={movie} />
                  <div className='d-flex flex-column h6'>
                    <div className='text-truncate'>{movie.title}</div>
                    <div className={`text-${color}`}>{movie.rating}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div
          id='following-tab-content'
          className='tab-pane fade'
          role='tabpanel'
          aria-labelledby='contact-tab'
        >
          ...
        </div>
      </div>
    </div>
  )
}
