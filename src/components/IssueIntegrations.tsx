import React from 'react'

import axios from 'axios'
import {useQuery} from 'react-query'

export default function IssueIntegrations({id}) {
  const {isLoading, data: integrations} = useQuery(
    ['issue', id, 'developer-information'],
    () => {
      return axios
        .get(`api/developer-information`, {
          params: {
            issue: id,
          },
        })
        .then((response) => response.data)
    },
    {staleTime: 3000000},
  )

  if (isLoading) {
    return (
      <h4 className="px-4 pb-2 mb-4 text-sm font-semibold">
        Loading development information…
      </h4>
    )
  }

  if (integrations.length === 0) {
    return null
  }

  return integrations.map((integration) => (
    <div key={integration._instance.name} className="px-4 mb-2 opacity-9">
      {integration.pullRequests.length > 0 ? (
        <>
          <h4 className="mb-2 text-sm font-semibold">
            {integration._instance.name}
          </h4>

          <ul className="mb-2">
            {integration.pullRequests.map((pullRequest) => (
              <li
                key={pullRequest.id}
                className="flex items-center justify-between"
              >
                <a
                  href={pullRequest.url}
                  target="_blank"
                  rel="noreferrer nofollow"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {pullRequest.name}
                </a>

                <span className="text-xs font-semibold">
                  {' '}
                  {pullRequest.status}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <h4 className="text-sm font-semibold">No pull requests</h4>
      )}
    </div>
  ))
}
