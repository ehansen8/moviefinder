export default function RatingDropdownMenu() {
  return (
    <div className='dropdown-menu p-0'>
      <div className='btn-group'>
        <a
          className='btn btn-outline-danger dropdown-item'
          href='#'
          data-rating='1'
        >
          Awful
        </a>
        <a
          className='btn btn-outline-warning dropdown-item'
          href='#'
          data-rating='2'
        >
          Meh
        </a>
        <a
          className='btn btn-outline-success dropdown-item'
          href='#'
          data-rating='3'
        >
          Good
        </a>
        <a
          className='btn btn-outline-primary dropdown-item'
          href='#'
          data-rating='4'
        >
          Amazing
        </a>
      </div>
    </div>
  )
}
