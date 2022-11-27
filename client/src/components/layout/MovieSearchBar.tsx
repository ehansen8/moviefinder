type SearchBarProps = {
  onSubmit: (event: React.FormEvent) => void
}

export function MovieSearchBar({ onSubmit }: SearchBarProps) {
  return (
    <form
      id='movie-search-form'
      method='POST'
      onSubmit={(e: React.FormEvent) => onSubmit(e)} //data-action={% url 'movies:search' %}
      className='d-flex w-100'
      style={{ height: '40px' }}
    >
      {
        //% csrf_token %}
      }
      <div
        id='search-btn-group'
        className='dropdown btn-group w-100'
      >
        <input
          id='search-input'
          className='form-control bg-light text-dark'
          type='text'
          name='search'
          color='dark'
          placeholder='Search for a movie'
          aria-label='Search'
          style={{ height: '40px' }}
          data-bs-toggle='dropdown'
          data-bs-auto-close='outside'
        />

        <button
          id='search-button'
          className='btn rounded btn-outline-light'
          type='submit'
          value='Post'
          aria-label='submit search'
        >
          <i className='bi bi-search mx-2'></i>
        </button>
        {/* Search Dropdown w/ limited display*/}
        <div className='dropdown-menu w-100 border border-2 border-dark px-4 py-3'>
          <div className='d-flex justify-content-center w-100'>
            <div
              id='search-result-spinner'
              className='spinner-border visually-hidden'
              role='status'
            >
              <span
                className='
                     visually-hidden'
              >
                Loading...
              </span>
            </div>
          </div>
          <div id='search-results'></div>
        </div>
      </div>
    </form>
  )
}
