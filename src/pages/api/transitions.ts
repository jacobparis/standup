// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios, {AxiosError} from 'axios'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function Transitions(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    if (!req.query.issue) {
      res.statusCode = 400
      res.json({error: 'Missing issue ID in request'})

      return
    }

    try {
      const response = await axios.get(
        `${req.cookies.jiraHostUrl}/rest/api/3/issue/${req.query.issue}/transitions`,
        {
          headers: {
            Authorization: `Basic ${req.cookies.credentials}`,
          },
        },
      )

      if (response.status === 200) {
        res.statusCode = 200
        res.json(response.data.transitions.reverse())

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

      return
    }
  }

  if (req.method === 'POST') {
    if (!req.body.issue) {
      res.statusCode = 400
      res.json({error: 'Missing issue ID in request'})

      return
    }

    if (!req.body.transition) {
      res.statusCode = 400
      res.json({error: 'Missing transition ID in request'})

      return
    }

    try {
      const response = await axios.post(
        `${req.cookies.jiraHostUrl}/rest/api/3/issue/${req.body.issue}/transitions`,
        {
          transition: {
            id: req.body.transition,
          },
        },
        {
          headers: {
            Authorization: `Basic ${req.cookies.credentials}`,
          },
        },
      )

      if (response.status === 200 || response.status === 204) {
        res.statusCode = 200
        res.json({success: true})

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

      return
    }
  }

  // method not supported
  res.status(405).json({error: 'Method not supported'})
}
