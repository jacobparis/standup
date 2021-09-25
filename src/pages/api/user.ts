// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios, {AxiosError} from 'axios'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function UserIssues(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.cookies.jiraHostUrl) {
    res.statusCode = 401
    res.json({error: 'Not logged in'})

    return
  }

  try {
    const response = await axios.get(
      `${req.cookies.jiraHostUrl}/rest/api/3/myself`,
      {
        headers: {
          Authorization: `Basic ${req.cookies.credentials}`,
        },
      },
    )

    if (response.status === 200) {
      res.statusCode = 200
      res.json(response.data)

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
