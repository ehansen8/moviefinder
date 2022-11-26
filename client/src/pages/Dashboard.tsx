import { useRef, useState, useLayoutEffect } from 'react'
import BasePage from '../components/Layout'
import FriendsColumn from '../components/FriendsColumn'
import MovieSliderRow from '../components/MovieSliderRow'
import { NavigationBar } from '../components/NavigationBar'
import RecentlySavedColumn from '../components/RecentlySavedColumn'
import RecentlyWatchedColumn from '../components/RecentlyWatchedColumn'
import { Friend, Movie } from '../types'
import Layout from '../components/Layout'

const friends: Friend[] = [
  {
    pk: 1,
    first: 'Evan',
    last: 'Hansen',
  },
  {
    pk: 2,
    first: 'Claire',
    last: 'Martin',
  },
]

const saved_movies: Movie[] = [
  {
    pk: 1,
    title: 'Top Gun',
    rating: 1,
  },
  {
    pk: 2,
    title: 'bruh',
    rating: 2,
  },
  {
    pk: 3,
    title: 'bruh',
    rating: 3,
  },
  {
    pk: 4,
    title: 'bruh',
    rating: 4,
  },
]

const watched_movies: Movie[] = [
  {
    pk: 1,
    title: 'Top Gun',
    rating: 1,
  },
  {
    pk: 2,
    title: 'bruh',
    rating: 2,
  },
  {
    pk: 3,
    title: 'bruh',
    rating: 3,
  },
  {
    pk: 4,
    title: 'bruh',
    rating: 4,
  },
]

const popular_movies: Movie[] = [
  {
    pk: 1,
    title: 'Top Gun',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
  },
  {
    pk: 2,
    title: 'bruh',
    rating: 1,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/sg7klpt1xwK1IJirBI9EHaqQwJ5.jpg',
  },
]

const upcoming_movies: Movie[] = [
  {
    pk: 1,
    title: 'Top Gun',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
  },
  {
    pk: 2,
    title: 'bruh',
    rating: 1,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/sg7klpt1xwK1IJirBI9EHaqQwJ5.jpg',
  },
]

const now_playing_movies: Movie[] = [
  {
    pk: 1,
    title: 'Top Gun',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
  },
  {
    pk: 2,
    title: 'bruh',
    rating: 1,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/sg7klpt1xwK1IJirBI9EHaqQwJ5.jpg',
  },
]
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

  return (
    <Layout>
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
              {/**<!-- This is the Friends Column--> */}
              <FriendsColumn friends={friends} />
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
              movies={upcoming_movies}
            />
            <MovieSliderRow
              title='Now Playing'
              movies={now_playing_movies}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
