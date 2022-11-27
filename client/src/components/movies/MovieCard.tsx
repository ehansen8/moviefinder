import { Movie } from '../../types'
import RatingDropdownMenu from './RatingDropdownMenu'
type MovieCardProps = {
  movie: Movie
  rank: number
}
export default function MovieCard({ movie, rank }: MovieCardProps) {
  return (
    <div className='card shadow'>
      <img
        className='card-img'
        src={movie.backdropUrl}
        alt='Card image'
      />
      <div className='card-img-overlay d-flex flex-column justify-content-end p-0'>
        <div className='flex-grow-1 position-relative'>
          {/**<!-- Movie Card Link to Movie detail modal--> */}
          <a
            href='#'
            className='stretched-link'
          ></a>
        </div>
        <div className='container movie-card-gradient pe-0'>
          <div className='d-flex flex-row'>
            <div className='flex-grow-1'>
              <small className='card-text text-white'>
                {movie.rating ?? 'NA'}
              </small>
              <h6 className='card-title text-white m-0 p-0'>
                {`${rank}. ${movie.title}`}
              </h6>
              <small className='card-text text-white'>
                {movie.genres?.join(', ')} &bull; {movie.year}
              </small>
            </div>
            <div className='btn-group h-50 align-self-end'>
              {/**<!-- Save Movie Button--> */}
              <button
                type='button'
                className={`btn btn-sm btn-outline-light save-movie ${
                  movie.savedByUser && 'active'
                }`}
              >
                <i className='bi bi-bookmark'> </i>
              </button>
              <div
                className='btn-group dropdown-center rate-movie'
                data-url="{% url 'movies:rate' %}"
                data-movie-id='{{movie.pk}}'
              >
                {/**<!-- Rate Movie Button--> */}
                <button
                  type='button'
                  className={`btn btn-sm btn-outline-light caret-off dropdown-toggle ${
                    movie.seenByUser && 'active'
                  }`}
                  data-bs-toggle='dropdown'
                  data-bs-offset='0,10'
                >
                  <i className='bi bi-check2'></i>
                </button>
                <RatingDropdownMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
