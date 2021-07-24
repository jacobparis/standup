import React from 'react'

import axios from 'axios'
import {useJira} from 'hooks/useJira'
import {useQuery} from 'react-query'

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  weekday: 'long',
  day: '2-digit',
})

export default function WelcomeBar() {
  const {hostUrl} = useJira()

  const {isLoading, data} = useQuery(
    ['user', 'loggedIn'],
    async () => {
      return axios.get(`api/user`).then((response) => response.data)
    },
    {staleTime: Infinity},
  )

  return (
    <p className="sm:text-sm">
      {isLoading ? null : <span>Good morning, {data.displayName}. </span>}
      <span>
        {' '}
        Today is <strong>{today}</strong>.{' '}
      </span>

      <span>
        <a
          href={`${hostUrl}/browse/OSC`}
          target="_blank"
          rel="noreferrer nofollow"
          className="text-blue-400 hover:underline"
        >
          View JIRA board
        </a>
      </span>
    </p>
  )
}
