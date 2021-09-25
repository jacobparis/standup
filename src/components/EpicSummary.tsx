import React from 'react'

import axios from 'axios'
import {useQuery} from 'react-query'

import {UserProvider} from '../hooks/useUser'
import Epic from './Epic'

export default function EpicSummary({className = '', ...props}) {
  const {isLoading, isError, data: epics} = useQuery(
    ['epics'],
    () => {
      return axios
        .get(`api/epics-in-progress`)
        .then((response) => response.data)
    },
    {staleTime: Infinity},
  )

  return (
    <UserProvider user={{accountId: 'unassigned'}}>
      <div
        {...props}
        role="group"
        tabIndex={0}
        style={{transform: 'translateY(0)'}}
        className={`sm:rounded-lg px-4 sm:px-6 opacity-95 py-4 ${className}`}
      >
        {isLoading ? (
          <p> Loading epics... </p>
        ) : isError ? (
          <p> Error fetching epics... </p>
        ) : (
          <div>
            {epics.length > 0 ? (
              <div>
                <ul className="mx-0">
                  {epics.map((issue) => (
                    <li key={issue.id} className="mb-2">
                      <Epic issue={issue} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {epics.length === 0 ? (
              <div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  There are no epics in progress
                </h3>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </UserProvider>
  )
}
