import React from 'react'

import axios, {AxiosError} from 'axios'
import UnassignedIssues from 'components/UnassignedIssues'
import UserIssues from 'components/UserIssues'
import WelcomeBar from 'components/WelcomeBar'
import {
  JiraProvider,
  useJira,
} from 'hooks/useJira'
import Cookies from 'js-cookie'
import cookies from 'next-cookies'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query'

const queryClient = new QueryClient()

function ProjectSelector({selectedProjects}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const {hostUrl} = useJira()

  const {isLoading, isError, data} = useQuery(
    ['projects'],
    async () => {
      const response = await axios.get(`api/projects`)

      return response.data
    },
    {staleTime: Infinity},
  )

  function handleSubmit(event) {
    const form = new FormData(event.target)

    const selectedProjects = Array.from(form.getAll('project')).join(',')

    Cookies.set('projects', selectedProjects, {
      domain: window.location.hostname,
      secure: window.location.hostname !== 'localhost',
      path: '/',
      sameSite: 'strict',
    })
  }

  if (isLoading) return <p> Is loading…</p>

  if (isError) return <p>Is error </p>

  const selectedProjectData = data.values.filter((project) =>
    selectedProjects.includes(project.key),
  )

  const shouldBeOpen = isOpen || selectedProjectData.length === 0

  console.log(data)
  const DetailsComponent = selectedProjectData.length === 0 ? 'div' : 'details'
  const SummaryComponent = selectedProjectData.length === 0 ? 'div' : 'summary'

  return (
    <DetailsComponent
      onToggle={() => setIsOpen((isOpen) => !isOpen)}
      open={shouldBeOpen}
      className={`${
        shouldBeOpen ? 'bg-gray-50 sm:rounded-md pb-2' : ''
      } bg-opacity-10 -mx-4 `}
    >
      <SummaryComponent
        className={`block px-4 py-2 sm:rounded-md cursor-pointer  ${
          shouldBeOpen ? '' : 'hover:bg-gray-50'
        } hover:bg-opacity-10`}
      >
        {selectedProjectData.length === 0 ? (
          'Choose projects to display'
        ) : (
          <>
            Showing tickets for{' '}
            {selectedProjectData.map((project, i) => (
              <>
                {i !== 0 ? ' and ' : null}
                <a
                  href={`${hostUrl}/browse/${project.key}`}
                  key={project.key}
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={`inline font-semibold  hover:underline text-blue-400 hover:text-blue-300`}
                >
                  {project.name}
                </a>
              </>
            ))}
            .
          </>
        )}
      </SummaryComponent>

      <div className="px-4">
        <form onSubmit={handleSubmit}>
          {data.values.map((project) => (
            <label key={project.key} className="block mb-2">
              <input
                name="project"
                defaultChecked={selectedProjects.includes(project.key)}
                value={project.key}
                type="checkbox"
                className="mr-2 text-indigo-600 align-text-top border-gray-300 rounded shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {project.name}
            </label>
          ))}
          <div>
            <button
              type="submit"
              className="px-2 py-1 mx-1 text-xs text-gray-400 border rounded shadow-sm bg-blue-950 border-blue-950 hover:text-white focus:border-indigo-500 focus:ring-indigo-400 hover:opacity-90 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-opacity-50"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </DetailsComponent>
  )
}

const today = new Date().toLocaleDateString('en-US', {
  month: 'long',
  weekday: 'long',
  day: '2-digit',
})

export default function Standup({users, jiraHostUrl, selectedProjects}) {
  return (
    <div>
      <JiraProvider hostUrl={jiraHostUrl}>
        <QueryClientProvider client={queryClient}>
          <WelcomeBar />
          <header className=" bg-blue-950 text-gray-50">
            <div className="max-w-3xl px-4 py-8 mx-auto">
              <h1 className="py-2 text-6xl font-extrabold">{today}</h1>

              <ProjectSelector selectedProjects={selectedProjects} />
            </div>
          </header>

          <svg
            preserveAspectRatio="xMidYMax meet"
            style={{marginTop: '-1px'}}
            className="sm:-mb-36 max-w-none"
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
                  <UserIssues
                    user={user}
                    disabled={selectedProjects.length === 0}
                  />
                </li>
              ))}
            </ul>
          </section>

          <svg
            preserveAspectRatio="xMidYMax meet"
            style={{marginBottom: '-1px'}}
            className="sm:-mt-36 max-w-none"
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
              {selectedProjects.length === 0 ? null : <UnassignedIssues />}
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
