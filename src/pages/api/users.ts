// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios, {AxiosError} from 'axios'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function Users(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(
      `${req.cookies.jiraHostUrl}/rest/api/3/users/search`,
      {
        headers: {
          Authorization: `Basic ${req.cookies.credentials}`,
        },
      },
    )

    if (response.status === 200) {
      res.statusCode = 200
      res.json(
        response.data
          .filter((user) => user.active)
          .filter((user) => user.accountType === 'atlassian'),
      )
    }

    throw new Error('Unsupported response')
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
