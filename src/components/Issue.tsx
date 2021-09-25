import React from 'react'

import {useJira} from '../hooks/useJira'
import IssueDescriptionContent from './IssueDescriptionContent'
import IssueIntegrations from './IssueIntegrations'
import IssueTransitions from './IssueTransitions'

export default function Issue({issue, skip = false, dark = false}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const {hostUrl} = useJira()

  let isFlagged = false
  if (issue.fields['customfield_10021']) {
    isFlagged = Boolean(
      issue.fields['customfield_10021'].some(
        (field) => field.value === 'Impediment',
      ),
    )
  }

  return (
    <details
      onToggle={() => setIsOpen((isOpen) => !isOpen)}
      open={isOpen}
      className={`${
        isFlagged
          ? isOpen
            ? 'bg-yellow-100 sm:rounded-md pb-2'
            : 'bg-yellow-100 sm:rounded-md'
          : isOpen
          ? 'bg-gray-50 sm:rounded-md pb-2'
          : ''
      }`}
    >
      <summary
        className={`block px-4 py-2 sm:rounded-md cursor-pointer  ${
          isOpen || isFlagged ? '' : 'hover:bg-gray-50'
        } ${dark ? 'hover:bg-opacity-10' : ''}`}
      >
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
                <img src={attachment.thumbnail} className="border rounded" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <IssueIntegrations id={issue.id} skip={skip} />
      <IssueTransitions
        id={issue.id}
        skip={skip}
        status={issue.fields.status.name}
      />
    </details>
  )
}
