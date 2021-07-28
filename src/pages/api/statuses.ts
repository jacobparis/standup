// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios, {AxiosError} from 'axios'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function Statuses(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.cookies.projects) {
    res.statusCode = 400
    res.json({error: 'Missing projects list in cookies'})

    return
  }

  const projects = req.cookies.projects.split(',')

  try {
    const responses = await Promise.all(
      projects.map((project) =>
        axios.get(
          `${req.cookies.jiraHostUrl}/rest/api/3/project/${project}/statuses`,
          {
            headers: {
              Authorization: `Basic ${req.cookies.credentials}`,
            },
          },
        ),
      ),
    )

    if (responses.every((response) => response.status === 200)) {
      res.statusCode = 200
      const result = Object.values(
        Object.fromEntries(
          responses
            .map((response) => response.data)
            .flat()
            .map((data) => data.statuses)
            .map((status) => [status.name, status]),
        ),
      ).flat()

      res.json(result)

      return
    }

    console.error('Unsupported response', {responses})

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

    return
  }
}
