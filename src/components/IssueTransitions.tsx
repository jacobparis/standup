import React from 'react'

import axios from 'axios'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

import {useUser} from '../hooks/useUser'

export default function IssueTransitions({id, dark, status}) {
  const queryClient = useQueryClient()
  const user = useUser()

  if (!user) {
    throw new Error('IssueTransitions must be within a User component')
  }

  // Transitions are the same for all statuses, and don't change
  const {isLoading, data: transitions} = useQuery(
    ['transitions', status],
    () => {
      return axios
        .get(`api/transitions`, {
          params: {
            issue: id,
          },
        })
        .then((response) => response.data)
    },
    {staleTime: Infinity},
  )

  const doTransition = (transition) => axios.post('api/transitions', transition)
  const mutation = useMutation(doTransition, {
    async onMutate(transition) {
      await queryClient.cancelQueries(['user', user.accountId, 'issues'])

      const previousIssues = queryClient.getQueryData([
        'user',
        user.accountId,
        'issues',
      ]) as any[]

      if (previousIssues) {
        queryClient.setQueryData(
          ['user', user.accountId, 'issues'],
          previousIssues.map((issue) => {
            if (issue.id !== transition.issue) return issue

            return {
              ...issue,
              fields: {
                ...issue.fields,
                status: transition.to,
              },
            }
          }),
        )
      }

      return {previousIssues}
    },
    onSettled() {
      queryClient.invalidateQueries(['user', user.accountId, 'issues'])
    },
    onError(error, transition, context: any) {
      if (context && context.previousIssues) {
        queryClient.setQueryData(
          ['user', user.accountId, 'issues'],
          context.previousIssues,
        )
      }
    },
  })

  if (isLoading) {
    return (
      <h4 className="px-4 pb-2 mb-4 text-sm font-semibold">
        Loading transitions…
      </h4>
    )
  }

  if (transitions.length === 0) {
    return null
  }

  return (
    <footer className="px-2">
      {transitions.map((transition) => (
        <button
          aria-disabled={mutation.isLoading}
          key={transition.id}
          className={`px-2 py-1 mx-1 text-xs ${
            dark
              ? 'bg-blue-950 border-blue-950 text-gray-400 hover:text-white focus:border-indigo-500 focus:ring-indigo-400'
              : 'bg-white hover:text-gray-500 focus:border-indigo-300 focus:ring-indigo-200 disabled:text-gray-400 disabled:bg-gray-50'
          } border rounded shadow-sm hover:opacity-90 focus:outline-none  focus:ring focus:ring-offset-0  focus:ring-opacity-50`}
          onClick={() => {
            mutation.mutate({
              transition: transition.id,
              to: transition.to,
              issue: id,
            })
          }}
        >
          {transition.name}
          {mutation.isLoading &&
          mutation.variables?.transition === transition.id
            ? '…'
            : ''}
        </button>
      ))}
    </footer>
  )
}
