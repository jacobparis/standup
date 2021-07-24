// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios, {AxiosError} from 'axios'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function IssuesUnassigned(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const response = await axios.get(
      `${req.cookies.jiraHostUrl}/rest/api/3/search`,
      {
        headers: {
          Authorization: `Basic ${req.cookies.credentials}`,
        },
        params: {
          jql: `project in (OSC) AND assignee in (EMPTY) AND status != Done AND status != "Needs Estimate" AND fixVersion = EMPTY ORDER BY updated DESC`,
          fields: 'attachment, description, issuetype, status, summary',
        },
      },
    )
    if (response.status === 401) {
      res.statusCode = response.status
      res.json({error: 'Invalid credentials'})
    }

    if (response.status === 200) {
      res.statusCode = 200
      res.json(response.data.issues)
    }
  } catch (err) {
    const error = err as AxiosError

    if (error.response) {
      if (error.response.status === 401) {
        res.statusCode = error.response.status
        res.json({error: 'Invalid credentials'})
      }
    }

    res.statusCode = 500
    res.json({error: 'Internal server error'})
  }
}
