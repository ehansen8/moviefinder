import { Friend } from '../../types'
import Link from 'next/link'

type FriendsColumnProps = {
  friends: Friend[]
  handleClick?: (userId: number) => void
}

export default function FriendsColumn({
  friends,
  handleClick,
}: FriendsColumnProps) {
  return (
    <>
      <div className='d-flex align-items-center justify-content-center text-white-50 bg-dark rounded shadow-sm'>
        <div className='h-100 p-2'>
          <h6 className='mb-0 text-white lh-100'>Friends</h6>
        </div>
      </div>
      <div className='btn-group-vertical text-center'>
        {friends.map(({ pk, first, last }) => {
          return (
            <Link
              key={pk}
              onClick={() => handleClick && handleClick(pk)}
              href={`/user/${pk}`}
              className='btn btn-outline-dark'
            >
              {`${first} ${last}`}
            </Link>
          )
        })}
      </div>
    </>
  )
}
