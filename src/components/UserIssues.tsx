import React from 'react'

import axios from 'axios'
import {useQuery} from 'react-query'

import {UserProvider} from '../hooks/useUser'
import Issue from './Issue'

export default function User({user, className = '', ...props}) {
  const {isLoading, data} = useQuery(
    ['user', user.accountId, 'issues'],
    async () => {
      return axios
        .get(`api/issues-assigned`, {
          params: {
            accountId: user.accountId,
          },
        })
        .then((response) => response.data)
    },
    {staleTime: Infinity, enabled: !!user.accountId},
  )

  const issuesInReview = data
    ? data.filter((issue) => issue.fields.status.name === 'In Review')
    : []
  const issuesInProgress = data
    ? data.filter((issue) => issue.fields.status.name === 'In Progress')
    : []
  const issuesInTodo = data
    ? data.filter((issue) => issue.fields.status.name === 'To Do')
    : []

  return (
    <UserProvider user={user}>
      <div
        {...props}
        role="group"
        tabIndex={0}
        style={{transform: 'translateY(0)'}}
        className={`bg-white sm:rounded-lg shadow-sm px-4 sm:px-6 opacity-95 py-4 ${className}`}
      >
        <header className="flex mb-4">
          <img
            className="w-12 rounded-full shadow"
            src={user.avatarUrls['48x48']}
          />
          <h2 className="mx-4 text-gray-500">{user.displayName}</h2>
        </header>

        <section>
          {isLoading ? (
            <p> Loading issues... </p>
          ) : (
            <div>
              {issuesInReview.length > 0 ? (
                <div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-500">
                    In review
                  </h3>

                  <ul>
                    {issuesInReview.map((issue) => (
                      <li key={issue.id} className="mb-2 -mx-4">
                        <Issue issue={issue} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {issuesInProgress.length > 0 ? (
                <div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-500">
                    In progress
                  </h3>

                  <ul>
                    {issuesInProgress.map((issue) => (
                      <li key={issue.id} className="mb-2 -mx-4">
                        <Issue issue={issue} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {issuesInTodo.length > 0 ? (
                <div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-500">
                    To do
                  </h3>

                  <ul>
                    {issuesInTodo.map((issue) => (
                      <li key={issue.id} className="mb-2 -mx-4">
                        <Issue issue={issue} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {issuesInProgress.length === 0 ? (
                <div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-500">
                    No tickets in progress
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
