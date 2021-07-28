/** ts-ignore-file **/
import React from 'react'

export default function IssueDescriptionContent({
  type,
  attrs = {},
  text = '',
  content,
  ...props
}: any) {
  if (type === 'inlineCard') return null
  if (type === 'hardBreak') return null
  if (type === 'mediaGroup') return null
  if (type === 'mediaSingle') return null
  if (type === 'media') return null

  if (type === 'paragraph') {
    return (
      <p className="mb-4 text-sm">
        {content[0] ? (
          Array.from(content).map((c, i) => (
            <IssueDescriptionContent key={i} {...c} />
          ))
        ) : (
          <IssueDescriptionContent {...content} />
        )}
      </p>
    )
  }

  if (type === 'codeBlock') {
    return (
      <pre className="mb-4 text-sm">
        {content[0] ? (
          Array.from(content).map((c, i) => (
            <IssueDescriptionContent key={i} {...c} />
          ))
        ) : (
          <IssueDescriptionContent {...content} />
        )}
      </pre>
    )
  }

  if (type === 'orderedList') {
    return (
      <ol className="mb-4">
        {content[0] ? (
          Array.from(content).map((c, i) => (
            <IssueDescriptionContent key={i} {...c} />
          ))
        ) : (
          <IssueDescriptionContent {...content} />
        )}
      </ol>
    )
  }

  if (type === 'bulletList') {
    return (
      <ul className="mb-4">
        {content[0] ? (
          Array.from(content).map((c, i) => (
            <IssueDescriptionContent key={i} {...c} />
          ))
        ) : (
          <IssueDescriptionContent {...content} />
        )}
      </ul>
    )
  }

  if (type === 'listItem') {
    return (
      <li>
        {content[0] ? (
          Array.from(content).map((c, i) => (
            <IssueDescriptionContent key={i} {...c} />
          ))
        ) : (
          <IssueDescriptionContent {...content} />
        )}
      </li>
    )
  }

  if (type === 'text') {
    return <span> {text}</span>
  }

  if (type) {
    console.error('Unsupported content type', {type, text, content, ...props})
    return null
  }

  return null
}
