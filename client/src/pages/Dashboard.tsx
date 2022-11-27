import { useRef, useState, useLayoutEffect } from 'react'
import FriendsColumn from '../components/layout/FriendsColumn'
import MovieSliderRow from '../components/_Dashboard/MovieSliderRow'
import RecentlySavedColumn from '../components/_Dashboard/RecentlySavedColumn'
import RecentlyWatchedColumn from '../components/_Dashboard/RecentlyWatchedColumn'
import { Friend, Movie } from '../types'
import Layout from '../components/layout/Layout'
import { useRouter } from 'next/router'
import {
  friends,
  popular_movies,
  saved_movies,
  watched_movies,
} from '../MockData'

export const useBrowserLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : () => {}

export default function Dashboard() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | undefined>(0)

  useBrowserLayoutEffect(() => {
    function updateWidth() {
      setWidth(ref.current?.offsetWidth)
    }
    window.addEventListener('resize', updateWidth)
    updateWidth()
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const router = useRouter()
  return (
    <div
      id='main'
      className='container-fluid'
    >
      <div className='row'>
        <div
          ref={ref}
          id='sidebar'
          className='col-2 pt-3'
          style={{ position: 'fixed' }}
        >
          <div className='w-100 border-left border-2 border-dark d-flex flex-column'>
            {/* Link Friends to user detail page*/}
            <FriendsColumn
              friends={friends}
              handleClick={undefined}
            />
            {/**<!-- Recently Saved (saved_movies)--> */}
            <RecentlySavedColumn savedMovies={saved_movies} />
            {/**<!-- Recently Watched (watched_ratings)--> */}
            <RecentlyWatchedColumn watched={watched_movies} />
          </div>
        </div>
        {/**<!-- Movie Lists --> */}
        <div
          className='col-10 pt-3 pe-3'
          style={{ left: width, position: 'relative' }}
        >
          <MovieSliderRow
            title='Popular Movies This Week'
            movies={popular_movies}
          />
          <MovieSliderRow
            title='Upcoming'
            movies={popular_movies}
          />
          <MovieSliderRow
            title='Now Playing'
            movies={popular_movies}
          />
        </div>
      </div>
    </div>
  )
}
