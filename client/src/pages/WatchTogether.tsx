import React from 'react'
import FilterFormModal from '../components/filterFormModal'
import FriendsColumn from '../components/FriendsColumn'
import Layout from '../components/Layout'
import RecommendedMovieList, {
  Recommendation,
} from '../components/RecommendedMovieList'
import { Friend, Movie } from '../types'

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

const recommended: Recommendation[] = [
  {
    movie: {
      pk: 1,
      title: 'Top Gun',
      rating: 2,
      year: 2001,
      genres: ['Crime', 'Horror'],
      posterUrl:
        'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
      backdropUrl:
        'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
    },
    activeUsers: [
      {
        pk: 1,
        first: 'Evan',
        last: 'Hansen',
        hasSaved: false,
        hasWatched: false,
      },
      {
        pk: 2,
        first: 'Claire',
        last: 'Martin',
        hasSaved: true,
        hasWatched: false,
      },
      {
        pk: 3,
        first: 'Test',
        last: 'Test',
        hasSaved: false,
        hasWatched: true,
      },
    ],
  },
  {
    movie: {
      pk: 2,
      title: 'bruh',
      rating: 1,
      year: 1983,
      genres: ['Death', 'Comedy'],
      posterUrl:
        'https://www.themoviedb.org/t/p/original/sg7klpt1xwK1IJirBI9EHaqQwJ5.jpg',
      backdropUrl:
        'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
    },
    activeUsers: [
      {
        pk: 1,
        first: 'Evan',
        last: 'Hansen',
        hasSaved: false,
        hasWatched: false,
      },
      {
        pk: 2,
        first: 'Claire',
        last: 'Martin',
        hasSaved: true,
        hasWatched: false,
      },
      {
        pk: 3,
        first: 'Test',
        last: 'Test',
        hasSaved: false,
        hasWatched: true,
      },
    ],
  },
]

export default function WatchTogether() {
  return (
    <Layout>
      <div className='container-fluid d-flex flex-row justify-content-between'>
        {/**<!-- This is the Recommendation Column--> */}
        <div className='mt-2 col-sm-9 border-right border-2 border-dark d-flex flex-column me-2'>
          <div className='d-flex justify-content-center bg-dark rounded shadow-sm'>
            <div className='h-100 p-2'>
              <h5 className='mb-0 text-white lh-100'>
                Recommendations{' '}
                <a
                  href='#'
                  className='link-light'
                >
                  <i className='bi bi-gear'></i>
                </a>
                {/**% include 'movies/filter-form-modal.html'% */}
                <FilterFormModal />
              </h5>
            </div>
          </div>
          {/**% include 'movies/recommended-movie-list.html'% */}
          <RecommendedMovieList recommendations={recommended} />
        </div>

        <div className='mt-2 col-sm-3 border-left border-2 border-dark d-flex flex-column'>
          <FriendsColumn friends={friends} />
        </div>
      </div>
    </Layout>
  )
}
