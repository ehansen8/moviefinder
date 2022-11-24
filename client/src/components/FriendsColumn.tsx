import React from 'react'
import { Friend } from '../types'
type FriendsColumnProps = {
  friends: any
}

export default function FriendsColumn({ friends }: FriendsColumnProps) {
  return (
    <>
      <div className='d-flex align-items-center justify-content-center text-white-50 bg-dark rounded shadow-sm'>
        <div className='h-100 p-2'>
          <h6 className='mb-0 text-white lh-100'>Friends</h6>
        </div>
      </div>
      <div className='btn-group-vertical text-center'>
        {friends.map(({ first, last }: Friend) => {
          return (
            <a
              href="{% url 'movies:user' user_id=friend.id  %}"
              className='btn btn-outline-dark'
            >
              {`${first} ${last}`}
            </a>
          )
        })}
      </div>
    </>
  )
}