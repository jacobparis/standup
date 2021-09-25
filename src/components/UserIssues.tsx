import React from 'react'

import axios from 'axios'
import {useQuery} from 'react-query'

import {UserProvider} from '../hooks/useUser'
import Issue from './Issue'

export default function User({user, disabled, className = '', ...props}) {
  const {
    isLoading: isStatusesLoading,
    isError: isStatusesError,
    data: statuses,
  } = useQuery(
    ['statuses'],
    async () => {
      return axios.get(`api/statuses`).then((response) => response.data)
    },
    {staleTime: Infinity, enabled: !disabled},
  )

  const {isLoading: isIssuesLoading, isError: isIssuesError, data} = useQuery(
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
    {staleTime: Infinity, enabled: !disabled && !!user.accountId},
  )

  const isLoading = isStatusesLoading || isIssuesLoading
  const isError = isStatusesError || isIssuesError

  const avatar96px = user.avatarUrls['48x48'].replace('/48', '/96')
  return (
    <UserProvider user={user}>
      {disabled ? null : (
        <div
          {...props}
          role="group"
          tabIndex={0}
          style={{transform: 'translateY(0)'}}
          className={`bg-white text-gray-900 sm:rounded-lg shadow-sm px-6 opacity-95 py-4 ${className}`}
        >
          <header className="flex">
            <img className="w-12 rounded-full shadow" src={avatar96px} />
            <h2 className="mx-4 text-gray-500">{user.displayName}</h2>
          </header>

          {disabled ? null : (
            <section className="mt-4">
              {isLoading ? (
                <p> Loading issues... </p>
              ) : isError ? (
                <p> Error fetching issues... </p>
              ) : (
                <div>
                  <ColumnGroup
                    statuses={statuses.filter(
                      (status) => status.statusCategory.key === 'done',
                    )}
                    items={data}
                    hideWhenEmpty={() => true}
                    defaultClosed={true}
                  />

                  <ColumnGroup
                    statuses={statuses.filter(
                      (status) => status.statusCategory.key === 'indeterminate',
                    )}
                    items={data}
                    hideWhenEmpty={(status) => !status.name.match(/progress/i)}
                    defaultClosed={false}
                  />

                  <ColumnGroup
                    statuses={statuses.filter(
                      (status) => status.statusCategory.key === 'new',
                    )}
                    items={data}
                    hideWhenEmpty={() => true}
                    defaultClosed={true}
                  />
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </UserProvider>
  )
}

function ColumnGroup({statuses, items, hideWhenEmpty, defaultClosed}) {
  if (statuses.length === 0) {
    return null
  }

  return statuses.map((status) => (
    <Column
      items={items.filter((issue) => issue.fields.status.name === status.name)}
      label={status.name}
      key={status.name}
      hideWhenEmpty={hideWhenEmpty}
      defaultClosed={defaultClosed}
    />
  ))
}

function Column({items, hideWhenEmpty, label, defaultClosed = false}) {
  const [isOpen, setIsOpen] = React.useState(() => !defaultClosed)

  if (items.length === 0) {
    return hideWhenEmpty ? null : (
      <div>
        <h3 className="mt-2 text-sm font-semibold text-gray-500">
          No tickets {label}
        </h3>
      </div>
    )
  }

  return (
    <details open={isOpen}>
      <summary
        className="block -ml-4"
        onClick={(e) => (e.preventDefault(), setIsOpen((isOpen) => !isOpen))}
      >
        <svg
          className={`inline w-4 h-4 -ml-1 opacity-60 transition-transform transform ${
            isOpen ? 'rotate-0' : '-rotate-90'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <h3 className="inline mt-2 ml-1 text-sm font-semibold text-gray-500 cursor-pointer hover:underline">
          {label}
        </h3>
      </summary>
      <ul>
        {items.map((issue) => (
          <li key={issue.id} className="mb-2 -mx-4">
            <Issue issue={issue} skip={!isOpen} />
          </li>
        ))}
      </ul>
    </details>
  )
}
