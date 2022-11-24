import React from 'react'
import FriendsColumn from '../components/FriendsColumn'
import MovieSliderRow from '../components/MovieSliderRow'
import RecentlySavedColumn from '../components/RecentlySavedColumn'
import RecentlyWatchedColumn from '../components/RecentlyWatchedColumn'
import { Friend, Movie } from '../types'
import Base from './Base'

const friends: Friend[] = [
  {
    first: 'Evan',
    last: 'Hansen',
  },
  {
    first: 'Claire',
    last: 'Martin',
  },
]

const saved_movies: Movie[] = [
  {
    title: 'Top Gun',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
  },
  {
    title: 'bruh',
    rating: 1,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/sg7klpt1xwK1IJirBI9EHaqQwJ5.jpg',
  },
]

const watched_movies: Movie[] = [
  {
    title: 'Top Gun',
    rating: 1,
  },
  {
    title: 'bruh',
    rating: 2,
  },
  {
    title: 'bruh',
    rating: 3,
  },
  {
    title: 'bruh',
    rating: 4,
  },
]

const popular_movies: Movie[] = [
  {
    title: 'Top Gun',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
  },
  {
    title: 'bruh',
    rating: 1,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/sg7klpt1xwK1IJirBI9EHaqQwJ5.jpg',
  },
]

const upcoming_movies: Movie[] = [
  {
    title: 'Top Gun',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
  },
  {
    title: 'bruh',
    rating: 1,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/sg7klpt1xwK1IJirBI9EHaqQwJ5.jpg',
  },
]

const now_playing_movies: Movie[] = [
  {
    title: 'Top Gun',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
  },
  {
    title: 'bruh',
    rating: 1,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/sg7klpt1xwK1IJirBI9EHaqQwJ5.jpg',
  },
]

export default function Dashboard() {
  return (
    <Base>
      <div
        id='main'
        className='container-fluid'
      >
        <div className='row'>
          <div className='col-2 pt-3 sticky-top'>
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
          <div className='col-10 pt-3 pe-3'>
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
    </Base>
  )
}
