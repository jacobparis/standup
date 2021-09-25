import React from 'react'

import axios from 'axios'
import {useJira} from 'hooks/useJira'
import Cookies from 'js-cookie'
import {useQuery} from 'react-query'

export default function ProjectSelector({selectedProjects}) {
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
                  className={`inline font-semibold  hover:underline text-blue-100 hover:text-white`}
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
            <label key={project.key} className="flex items-center mb-2 ">
              <input
                name="project"
                defaultChecked={selectedProjects.includes(project.key)}
                value={project.key}
                type="checkbox"
                className="mr-2 text-blue-900 border-gray-300 rounded shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {project.name}
            </label>
          ))}
          <div>
            <button
              type="submit"
              className="px-2 py-1 mx-1 text-xs text-blue-100 bg-blue-900 rounded shadow-sm hover:text-white focus:border-indigo-500 focus:ring-indigo-400 hover:opacity-90 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-opacity-50"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </DetailsComponent>
  )
}
