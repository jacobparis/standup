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

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-blue-950">
      <p className="text-4xl text-white opacity-70">Standup </p>

      {isLoading ? null : (
        <img
          className="w-12 rounded-full shadow"
          src={user.avatarUrls['48x48']}
          alt={user.displayName}
        />
      )}
    </div>
  )
}
