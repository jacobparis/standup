// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios, {AxiosError} from 'axios'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function IssuesAssigned(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.query.accountId) {
    res.statusCode = 400
    res.json({error: 'Missing account ID in request'})

    return
  }

  try {
    const response = await axios.get(
      `${req.cookies.jiraHostUrl}/rest/api/3/search`,
      {
        headers: {
          Authorization: `Basic ${req.cookies.credentials}`,
        },
        params: {
          jql: `project in (OSC) AND assignee in (${req.query.accountId}) AND status != Done AND fixVersion = EMPTY ORDER BY updated DESC`,
          fields: 'attachment, description, issuetype, status, summary',
        },
      },
    )

    if (response.status === 200) {
      res.statusCode = 200
      res.json(response.data.issues)

      return
    }

    console.error('Unsupported response', {response})

    throw new Error('Unsupported response')
  } catch (err) {
    const error = err as AxiosError

    if (error.response) {
      if (error.response.status === 401) {
        res.statusCode = error.response.status
        res.json({error: 'Invalid credentials'})

        return
      }
    }

    console.error('Unsupported error', {error})

    res.statusCode = 500
    res.json({error: 'Internal server error'})
  }
}
