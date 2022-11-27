import axios from "axios";
    
export type MovieDetail = {
    productionCompanies: string[]
    watchProviders?: WatchProvider[]
    plot: string
    director: Cast
    actors: Cast[]
}

type WatchProvider = {
    name: string
    logoUrl: string
}

type Cast = {
    name: string
    imageUrl? : string
}

export const movieDetailData: MovieDetail = {
    productionCompanies: ['A24'],
    watchProviders: [{
        name: 'Netflix',
        logoUrl: 'https://www.themoviedb.org/t/p/original/jPXksae158ukMLFhhlNvzsvaEyt.jpg'
    }],
    plot: 'crazy stuff happens to good people',
    director: {
        name: 'Gretta',
        imageUrl: 'https://www.themoviedb.org/t/p/original/3H0xzU12GTNJyQTpGysEuI9KyiQ.jpg'
    } ,
    actors: [{
        name: 'Gretta',
        imageUrl: 'https://www.themoviedb.org/t/p/original/3H0xzU12GTNJyQTpGysEuI9KyiQ.jpg'
    },
    {
        name: 'Timothee',
        imageUrl: 'https://www.themoviedb.org/t/p/original/giE73ickrnQ61qK8iRdOSv9Oj2Z.jpg'
    },
    ],
    
}

export default async function fetchMovieDetail()  {
    const { data } = await axios.get<MovieDetail>('https://jsonplaceholder.typicode.com/users')
    return new Promise<MovieDetail>(() => movieDetailData)
}