import React from 'react'

import axios from 'axios'
import {useQuery} from 'react-query'

import {UserProvider} from '../hooks/useUser'
import Issue from './Issue'

export default function UnassignedIssues({className = '', ...props}) {
  const {isLoading, isError, data: unassignedIssues} = useQuery(
    ['user', 'unassigned', 'issues'],
    () => {
      return axios
        .get(`api/issues-unassigned`)
        .then((response) => response.data)
    },
    {staleTime: 3000000},
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
        <header className="flex mb-4">
          <h2 className="mx-4 text-gray-900">Unassigned tickets</h2>
        </header>

        <section>
          {isLoading ? (
            <p> Loading unassigned tickets... </p>
          ) : isError ? (
            <p> Error fetching tickets... </p>
          ) : (
            <div>
              {unassignedIssues.length > 0 ? (
                <div>
                  <ul>
                    {unassignedIssues.map((issue) => (
                      <li key={issue.id} className="mb-2 -mx-4">
                        <Issue issue={issue} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {unassignedIssues.length === 0 ? (
                <div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    There are no unassigned tickets on the board
                  </h3>
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </UserProvider>
  )
}
