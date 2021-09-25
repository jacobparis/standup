import React from 'react'

import axios, {AxiosError} from 'axios'
import DecorativeFooter from 'components/DecorativeFooter'
import DecorativeHeader from 'components/DecorativeHeader'
import EpicSummary from 'components/EpicSummary'
import ProjectSelector from 'components/ProjectSelector'
import UnassignedIssues from 'components/UnassignedIssues'
import UserIssues from 'components/UserIssues'
import WelcomeBar from 'components/WelcomeBar'
import {JiraProvider} from 'hooks/useJira'
import cookies from 'next-cookies'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

const queryClient = new QueryClient()

const today = new Date().toLocaleDateString('en-US', {
  month: 'long',
  weekday: 'long',
  day: '2-digit',
})

export default function Standup({users, jiraHostUrl, selectedProjects}) {
  return (
    <div className="bg-gradient-to-tr from-blue-600 to-blue-500 text-gray-50">
      <JiraProvider hostUrl={jiraHostUrl}>
        <QueryClientProvider client={queryClient}>
          <WelcomeBar />

          <DecorativeHeader>
            <h1 className="py-2 text-6xl font-extrabold">{today}</h1>

            <ProjectSelector selectedProjects={selectedProjects} />

            <div className="max-w-2xl mx-auto">
              <EpicSummary />
            </div>
          </DecorativeHeader>

          <div className="bg-gray-100 sm:py-12">
            <section className="max-w-2xl mx-auto">
              <ul>
                {users.map((user) => (
                  <li key={user.accountId} className="mt-0 sm:mb-12">
                    <UserIssues
                      user={user}
                      disabled={selectedProjects.length === 0}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <DecorativeFooter>
            {selectedProjects.length === 0 ? null : <UnassignedIssues />}
          </DecorativeFooter>
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
          selectedProjects: serverSideCookies.projects
            ? serverSideCookies.projects.split(',')
            : [],
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

    console.log(error.response)

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
