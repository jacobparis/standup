import React from 'react'

import axios from 'axios'
import {useQuery} from 'react-query'

import {useJira} from '../hooks/useJira'
import IssueDescriptionContent from './IssueDescriptionContent'
import IssueTransitions from './IssueTransitions'

export default function Epic({issue, dark = false}) {
  const {hostUrl} = useJira()

  const {isLoading, isError, data: issues} = useQuery(
    ['issues', issue.key],
    () => {
      return axios
        .get(`api/issues-epic`, {
          params: {
            epicId: issue.key,
          },
        })
        .then((response) => response.data)
    },
    {staleTime: Infinity},
  )

  const totalIssues = issues && issues.length
  const completeIssues =
    issues &&
    issues.filter((issue) => issue.fields.status.name === 'Done').length

  const [isOpen, setIsOpen] = React.useState(false)
  return isLoading ? null : (
    <details
      onToggle={() => setIsOpen((isOpen) => !isOpen)}
      open={isOpen}
      className={`text-gray-900 rounded-md pb-2 ${
        isOpen ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <summary
        className={`block px-4 py-2 sm:rounded-md cursor-pointer  text-gray-900 ${
          isOpen ? '' : 'hover:bg-gray-50'
        }`}
      >
        <div
          className="h-2 mb-2 overflow-hidden bg-gray-200 rounded-sm"
          aria-label="32%"
          title={`Completed ${completeIssues} out of ${totalIssues} (${
            (completeIssues / totalIssues) * 100
          }%)`}
        >
          <div
            className="h-2 bg-green-500"
            style={{width: `${(completeIssues / totalIssues) * 100}%`}}
          />
        </div>

        <a
          href={`${hostUrl}/browse/${issue.key}`}
          className={`inline font-semibold  hover:underline ${
            dark
              ? 'text-blue-400 hover:text-blue-300'
              : 'text-blue-600 hover:text-blue-500'
          }`}
          target="_blank"
          rel="noreferrer nofollow"
        >
          <img
            src={issue.fields.issuetype.iconUrl}
            title={issue.fields.issuetype.name}
            className="inline mr-2"
          />
          {issue.key}
        </a>

        <h3 className="inline mx-2 font-semibold">{issue.fields.summary}</h3>
      </summary>

      {isOpen ? (
        <>
          {issue.fields.description ? (
            <section className="px-4 mb-4">
              {issue.fields.description.content.map((content, i) => (
                <IssueDescriptionContent key={i} {...content} />
              ))}
            </section>
          ) : null}

          {issue.fields.attachment ? (
            <ul className="flex mb-4">
              {issue.fields.attachment.map((attachment, i) => (
                <li key={attachment.id} className="px-4 py-2">
                  <a
                    href={attachment.content}
                    target="_blank"
                    rel="noreferrer nofollow"
                  >
                    <img
                      src={attachment.thumbnail}
                      className="border rounded"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          <IssueTransitions id={issue.id} status={issue.fields.status.name} />
        </>
      ) : null}
    </details>
  )
}
