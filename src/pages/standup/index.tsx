import React from 'react'

import axios, {AxiosError} from 'axios'
import UnassignedIssues from 'components/UnassignedIssues'
import UserIssues from 'components/UserIssues'
import {JiraProvider} from 'hooks/useJira'
import cookies from 'next-cookies'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

const queryClient = new QueryClient()

export default function HelloWorld({users, jiraHostUrl}) {
  return (
    <div>
      <JiraProvider hostUrl={jiraHostUrl}>
        <QueryClientProvider client={queryClient}>
          <header className=" bg-blue-950 text-gray-50">
            <div className="max-w-3xl px-4 py-8 mx-auto">
              <h1 className="py-2 text-6xl font-extrabold">
                Standup Dashboard
              </h1>

              <nav className="mb-8">
                <ul>
                  <li>
                    <a
                      href={`${jiraHostUrl}/browse/OSC`}
                      target="_blank"
                      rel="noreferrer nofollow"
                      className="text-blue-400 sm:text-sm hover:underline"
                    >
                      JIRA Board
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <svg
            preserveAspectRatio="xMidYMax meet"
            style={{marginTop: '-1px'}}
            className="sm:-mb-48 max-w-none"
            viewBox="0 0 1600 200"
            data-height="200"
          >
            <polygon
              className=""
              style={{opacity: '0.7', fill: 'rgb(42, 44, 66)'}}
              points="-4,0 800,198 1604,0 1604,11.833 800,198 -4,12 "
            />
            <polygon
              className=""
              style={{opacity: '1', fill: 'rgb(36, 44, 66)'}}
              points="-4,0 800,198 1604,0"
            />
            <polygon
              className=""
              style={{opacity: '0.3', fill: 'rgb(63, 44, 66)'}}
              points="-4,12 -4,24 800,198 1604,24 1604,11.833 800,198 "
            />
          </svg>

          <section className="max-w-2xl mx-auto">
            <ul>
              {users.map((user) => (
                <li key={user.accountId} className="my-4 sm:my-12">
                  <UserIssues user={user} />
                </li>
              ))}
            </ul>
          </section>

          <svg
            preserveAspectRatio="xMidYMax meet"
            style={{marginBottom: '-1px'}}
            className="sm:-mt-48 max-w-none"
            viewBox="0 0 1600 200"
            data-height="200"
          >
            <polygon
              className=""
              style={{opacity: '0.3', fill: 'rgb(42, 44, 66)'}}
              points="-4,0 800,198 1604,0 1604,11.833 800,198 -4,12 "
            />
            <polygon
              className=""
              style={{opacity: '1', fill: 'rgb(36, 44, 66)'}}
              points="-4,24 800,198 1604,24 1604,204 -4,204"
            />
            <polygon
              className=""
              style={{opacity: '0.7', fill: 'rgb(63, 44, 66)'}}
              points="-4,12 -4,24 800,198 1604,24 1604,11.833 800,198 "
            />
          </svg>

          <section className="py-12 bg-blue-950 text-gray-50">
            <div className="max-w-2xl mx-auto">
              <UnassignedIssues />
            </div>
          </section>
        </QueryClientProvider>
      </JiraProvider>
    </div>
  )
}

export async function getServerSideProps(context) {
  const serverSideCookies = cookies(context)
  if (!serverSideCookies.jiraHostUrl) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  try {
    const response = await axios.get(
      `${serverSideCookies.jiraHostUrl}/rest/api/3/users/search`,
      {
        headers: {
          Authorization: `Basic ${serverSideCookies.credentials}`,
        },
      },
    )

    if (response.status === 200) {
      const users = response.data
        .filter((user) => user.active)
        .filter((user) => user.accountType === 'atlassian')

      const dayOfMonth = new Date().getDate()

      return {
        props: {
          // Rotate users each day so it's always someone new starting
          users: users
            ? [
                ...users.slice(dayOfMonth % users.length),
                ...users.slice(0, dayOfMonth % users.length),
              ]
            : [],
          jiraHostUrl: serverSideCookies.jiraHostUrl,
        },
      }
    }

    throw new Error('Unsupported response')
  } catch (err) {
    const error = err as AxiosError

    if (error.response) {
      if (error.response.status === 401) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    }
  }
}
