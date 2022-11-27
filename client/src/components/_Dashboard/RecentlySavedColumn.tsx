type RecentlySavedColumnProps = {
  savedMovies: any
}

export default function RecentlySavedColumn({
  savedMovies,
}: RecentlySavedColumnProps) {
  return (
    <>
      <div className='d-flex align-items-center justify-content-center text-white-50 bg-dark rounded shadow-sm mt-3'>
        <div className='h-100 p-2'>
          <h6 className='mb-0 text-white lh-100'>Recently Saved</h6>
        </div>
      </div>

      <div className='list-group'>
        {savedMovies.map((movie: any) => {
          return (
            <a
              key={movie.pk}
              href='#'
              className='list-group-item list-group-item-action d-flex justify-content-between px-1'
              aria-current='true'
            >
              <span className='text-truncate'>{movie.title}</span>
              <span
                className='ms-2'
                style={{ color: '#07a607' }}
              >
                {movie.rating.toFixed(0) + '%'}
              </span>
            </a>
          )
        })}
      </div>
    </>
  )
}
