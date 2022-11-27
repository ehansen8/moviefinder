import { Movie } from '../../types'
import fetchMovieDetail, {
  MovieDetail,
  movieDetailData,
} from '../../services/fetchMovieDetail'
import { AxiosError } from 'axios'
import RatingDropdownMenu from './RatingDropdownMenu'

export default function MovieDetailBody({
  movie,
  handleClose,
}: {
  movie: Movie
  handleClose: () => void
}) {
  //   const { data, isLoading, isError, error } = useQuery<MovieDetail, AxiosError>(
  //     'movieDetail',
  //     fetchMovieDetail,
  //   )
  const isLoading = false
  const isError = false
  const data = movieDetailData
  const error = new AxiosError()

  if (isLoading || !data) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }
  const { plot, productionCompanies, director, actors, watchProviders } = {
    ...data,
  }

  return (
    <>
      <button
        onClick={handleClose}
        type='button'
        className='btn-close btn-close-white position-absolute top-0 end-0 m-4'
      ></button>
      <img
        className='card-img rounded'
        src={movie.backdropUrl}
        alt='Card image'
      />

      <h1 className='display-6 '>{movie.title}</h1>
      <small>
        {movie.genres?.join(', ')} &bull;
        {movie.year} &bull; {movie.runtime}{' '}
      </small>

      {/**<!-- Hide / Rate / Save Group--> */}
      <div className='d-flex justify-content-center m-3'>
        <div className='btn-group'>
          <button
            type='button'
            className='btn btn-outline-light px-3'
          >
            <i className='bi bi-hand-thumbs-down'></i> Hide
          </button>

          {/**<!-- Rate Movie Button w/ dropdown options--> */}
          <div
            className='btn-group dropdown-center rate-movie'
            data-url="{% url 'movies:rate' %}"
            data-movie-id='{{movie.pk}}'
            data-refresh-url="{% url 'movies:detail' movie_id=movie.pk %}"
          >
            <button
              type='button'
              className='btn px-3 btn-outline-light caret-off dropdown-toggle {% if has_watched %}active{% endif %}'
              data-bs-toggle='dropdown'
              data-bs-offset='0,10'
            >
              <i className='bi bi-check2'></i> Seen
            </button>
            <RatingDropdownMenu />
          </div>
          <button
            type='button'
            className='btn btn-outline-light px-3 save-movie {% if has_saved %}active{% endif %}'
            data-url="{% url 'movies:bookmark' %}"
            data-movie-id='{{movie.pk}}'
          >
            <i className='bi bi-bookmark'> </i> Save
          </button>
        </div>
      </div>

      {/**<!-- Rotten Tomatoes / IMDB / User Ratings--> */}
      <div className='d-flex flex-wrap justify-content-center'>
        <p className='col-sm-9 mb-3 text-start'>{plot}</p>
        <hr className='col-12' />
        <div className='container d-flex justify-content-center '>
          <div className='col-sm-3 col-lg-2 mx-1'>
            <a className='btn vstack text-reset'>
              <span>{movie.imdbRating}/10</span>
              <span>
                <u>IMDb</u>
              </span>
            </a>
          </div>
          <div className='vr'></div>
          <div className='col-auto mx-1'>
            <a className='btn col vstack text-reset'>
              <span>{movie.rtRating}%</span>
              <span>
                <u>Rotten Tomatoes</u>
              </span>
            </a>
          </div>
          <div className='vr'></div>
          <div className='col-sm-3 col-lg-2 mx-1'>
            <a className='btn col vstack text-reset'>
              <span>{movie.userRating}/4</span>
              <span className=''>User Rating</span>
            </a>
          </div>
        </div>
        <hr className='col-12' />

        {/**<!-- Production Companies --> */}
        <h6 className='col-sm-12 m-1'>Production Companies</h6>
        <div className='col-sm-12 justify-content-center'>
          {productionCompanies.join(', ')}
        </div>
        <hr className='col-12' />

        {/**<!-- Director / Actors--> */}
        <div className='swiper'>
          <div className='swiper-wrapper mb-3'>
            {/**<!-- Director Slide --> */}
            <div
              className='swiper-slide'
              style={{ maxWidth: '20%' }}
            >
              <div className='border-end px-2'>
                <small>Director</small>
                <img
                  className='w-100 rounded '
                  src={director.imageUrl}
                  alt='director photo'
                />

                <div>{director.name}</div>
              </div>
            </div>
            {/* <!-- Actor Slides--> */}
            {actors.map((actor, idx) => {
              return (
                <div
                  className='swiper-slide px-2'
                  style={{ maxWidth: '20%' }}
                >
                  <div className=''>
                    {idx === 0 ? <small>Cast</small> : <div>&nbsp</div>}
                    <img
                      className='w-100 rounded'
                      src={actor.imageUrl}
                      alt={`${actor.name} image`}
                    />
                    <div>{actor.name}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* <!-- If we need scrollbar --> */}
          <div
            className='swiper-scrollbar'
            style={{ height: '10px' }}
          ></div>
        </div>
        <hr className='col-12' />

        {/* <!-- Genres --> */}
        <h6 className='col-sm-12 m-0'>Genres</h6>
        <div className='col-sm-12'> {movie.genres?.join(', ')}</div>
        <hr className='col-12' />

        {/* <!-- Release Date --> */}
        <h6 className='col-sm-12 m-0'>Released</h6>
        <div className='col-sm-12'> {movie.releaseDate}</div>
        <hr className='col-12' />

        {/* <!-- Watch Providers / Streaming --> */}
        <h6 className='col-sm-12 m-1'>Available On</h6>
        <div className='col-sm-12 justify-content-center'>
          {watchProviders ? (
            watchProviders.map((p) => {
              return (
                <img
                  src={p.logoUrl}
                  alt={p.name}
                  className='rounded'
                  width='50px'
                />
              )
            })
          ) : (
            <div className='col-sm-12'>Not currently streaming</div>
          )}
        </div>
      </div>
    </>
  )
}
