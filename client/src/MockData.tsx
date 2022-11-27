import { Recommendation } from './components/_WatchTogether/RecommendedMovieList'
import { Friend, Movie } from './types'

export { saved_movies, friends, watched_movies, popular_movies, recommended }

const saved_movies: Movie[] = [
  {
    pk: 1,
    title: 'Top Gun',
    rating: 1,
    year: 1000,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
  },
  {
    pk: 2,
    title: 'bruh',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
  },
  {
    pk: 3,
    title: 'bruh',
    rating: 3,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
  },
  {
    pk: 4,
    title: 'bruh',
    rating: 4,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
  },
]

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

const watched_movies: Movie[] = [
  {
    pk: 1,
    title: 'Top Gun',
    rating: 1,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
  },
  {
    pk: 2,
    title: 'bruh',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
  },
  {
    pk: 3,
    title: 'bruh',
    rating: 3,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
  },
  {
    pk: 4,
    title: 'bruh',
    rating: 4,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
  },
]

const popular_movies: Movie[] = [
  {
    pk: 1,
    title: 'Top Gun',
    rating: 2,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
    genres: ['horror, comedy'],
    runtime: 45,
  },
  {
    pk: 2,
    title: 'bruh',
    rating: 1,
    posterUrl:
      'https://www.themoviedb.org/t/p/original/sg7klpt1xwK1IJirBI9EHaqQwJ5.jpg',
    backdropUrl:
      'https://www.themoviedb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg',
    genres: ['horror, comedy'],
    runtime: 45,
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
