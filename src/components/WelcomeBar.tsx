import React from 'react'

import axios from 'axios'
import {useQuery} from 'react-query'

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  weekday: 'long',
  day: '2-digit',
})

export default function WelcomeBar() {
  const {isLoading, data: user} = useQuery(
    ['user', 'loggedIn'],
    async () => {
      return axios.get(`api/user`).then((response) => response.data)
    },
    {staleTime: Infinity},
  )

  const avatar96px = isLoading
    ? null
    : user.avatarUrls['48x48'].replace('/48', '/96')

  return (
    <div className="flex items-center justify-between px-4 py-2 ">
      <p className="text-4xl text-white opacity-70">
        <a href="/">3Q</a>
      </p>

      {isLoading ? null : (
        <img
          className="w-12 rounded-full shadow"
          src={avatar96px}
          alt={user.displayName}
        />
      )}
    </div>
  )
}
