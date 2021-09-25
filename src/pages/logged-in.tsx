import React from 'react'

import axios, {AxiosError} from 'axios'
import DecorativeFooter from 'components/DecorativeFooter'
import DecorativeHeader from 'components/DecorativeHeader'
import Cookies from 'js-cookie'
import cookies from 'next-cookies'
import Head from 'next/head'
import Link from 'next/link'
import {useUID} from 'react-uid'

export default function LoggedIn({user}) {
  const [showTheme, setShowTheme] = React.useState(false)
  const jiraId = useUID()
  const emailId = useUID()
  const passwordId = useUID()
  const [loggingIn, setLoggingIn] = React.useState(false)

  const [message, setMessage] = React.useState('')

  // on submit, store their email and password in a samesite cookie
  const handleSubmit = async (event) => {
    Cookies.remove('credentials', {
      domain: window.location.hostname,
      secure: window.location.hostname !== 'localhost',
      path: '/',
      sameSite: 'strict',
    })

    Cookies.remove('jiraHostUrl', {
      domain: window.location.hostname,
      secure: window.location.hostname !== 'localhost',
      path: '/',
      sameSite: 'strict',
    })
  }

  return (
    <div className="flex flex-col min-vh-100">
      <Head>
        <title>Log in | Standup Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DecorativeHeader />
      <main className="grid content-center justify-center flex-grow bg-gray-100">
        <div className="max-w-sm px-4 py-3 mx-auto mb-4 bg-white rounded-lg shadow sm:px-6 sm:py-4">
          <h1 className="py-4 mb-4 text-6xl text-center font-700">
            3Q Dashboard
          </h1>
          <p className="mb-4 font-semibold text-center">Welcome back!</p>

          {message.length > 0 ? (
            <p className="mb-4 text-center text-red-600">{message}</p>
          ) : null}

          <div className="my-4 text-center">
            <Link href="standup">
              <a className="inline-block w-full px-4 py-2 bg-blue-600 rounded-md border-blue-950 focus:text-white text-gray-50 hover:text-white hover:bg-blue-500 focus:border-indigo-500 focus:ring-indigo-400">
                Continue as {user.displayName}
              </a>
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="w-full px-4 py-2 border border-gray-200 rounded-md hover:opacity-70 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-400"
            >
              Not you? <span className="underline"> Switch accounts </span>
            </button>
          </form>
        </div>
      </main>
      <DecorativeFooter>
        <div className="py-4 text-center">
          <small className="mb-4 text-gray-700">
            Made with ❤️ by{' '}
            <a href="https://twitter.com/jacobmparis" target="_blank">
              Jacob Paris
            </a>
          </small>
        </div>
      </DecorativeFooter>
    </div>
  )
}

function TextInput({className = '', disabled = false, ...props}) {
  return (
    <div
      className={`relative flex border rounded-md shadow-sm mb-5 focus-within:outline-none focus-within:border-indigo-300 focus-within:ring focus-within:ring-indigo-200 focus-within:ring-opacity-50 ${
        disabled
          ? 'bg-gray-200 border-gray-200 text-gray-500'
          : 'border-gray-300 '
      }`}
    >
      <input
        className={`w-full min-w-0 px-4 py-2 bg-transparent rounded-md border-none outline-none  ${className}`}
        type="text"
        disabled={disabled}
        {...props}
      />
    </div>
  )
}

export async function getServerSideProps(context) {
  const serverSideCookies = cookies(context)

  if (!serverSideCookies.jiraHostUrl) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
    const response = await axios.get(
      `${serverSideCookies.jiraHostUrl}/rest/api/3/myself`,
      {
        headers: {
          Authorization: `Basic ${serverSideCookies.credentials}`,
        },
      },
    )

    if (response.status === 200) {
      return {
        props: {
          user: response.data,
        },
      }
    }

    throw new Error('Unsupported response')
  } catch (err) {
    const error = err as AxiosError

    if (error.response) {
      if (error.response.status === 401) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    }
    console.error(err)
    throw new Error('Unsupported error')
  }
}
