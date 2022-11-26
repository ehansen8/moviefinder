import React from 'react'
import { Movie } from '../types'

type RecentlyWatchedColumnProps = {
  watched: Movie[]
}

export default function RecentlyWatchedColumn({
  watched,
}: RecentlyWatchedColumnProps) {
  return (
    <>
      <div className='d-flex align-items-center justify-content-center text-white-50 bg-dark rounded shadow-sm mt-3'>
        <div className='h-100 p-2'>
          <h6 className='mb-0 text-white lh-100'>Recently Watched</h6>
        </div>
      </div>

      <div className='list-group'>
        {watched.map(({ pk, title, rating }: Movie) => {
          let color: string = ''
          switch (rating) {
            case 1:
              color = 'danger'
              break
            case 2:
              color = 'warning'
              break
            case 3:
              color = 'primary'
              break
            default:
              color = 'success'
              break
          }
          return (
            <a
              key={pk}
              href='#'
              className='list-group-item list-group-item-action d-flex justify-content-between px-1'
              aria-current='true'
            >
              <span className='text-truncate'>{title}</span>
              <span className={`ms-2 text-${color}`}>{rating}/4</span>
            </a>
          )
        })}
      </div>
    </>
  )
}
