import FilterFormModal from '../components/modals/FilterFormModal'
import FriendsColumn from '../components/layout/FriendsColumn'
import RecommendedMovieList, {
  Recommendation,
} from '../components/_WatchTogether/RecommendedMovieList'
import { friends, recommended } from '../MockData'

export default function WatchTogether() {
  return (
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
        <FriendsColumn
          friends={friends}
          handleClick={() => {}}
        />
      </div>
    </div>
  )
}
