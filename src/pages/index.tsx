import React from 'react'

import axios from 'axios'
import Cookies from 'js-cookie'
import Head from 'next/head'
import {useUID} from 'react-uid'

export default function Home() {
  const [showTheme, setShowTheme] = React.useState(false)
  const jiraId = useUID()
  const emailId = useUID()
  const passwordId = useUID()

  const [loggingIn, setLoggingIn] = React.useState(false)

  const [message, setMessage] = React.useState('')

  // on submit, store their email and password in a samesite cookie
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loggingIn) return

    setLoggingIn(true)
    const form = new FormData(event.target)
    const jiraHostUrl = form.get('jiraHostUrl')
    const email = form.get('email')
    const password = form.get('password')

    if (!jiraHostUrl || !email || !password) {
      throw new Error('Missing required fields')
    }

    Cookies.set('jiraHostUrl', jiraHostUrl, {
      domain: 'localhost',
      secure: false,
      path: '/',
      sameSite: 'strict',
    })

    Cookies.set('credentials', window.btoa(`${email}:${password}`), {
      domain: 'localhost',
      secure: false,
      path: '/',
      sameSite: 'strict',
    })

    await axios
      .get(`api/user`)
      .then(
        (response) => {
          if (response.status === 200) {
            window.location.replace('/standup')
          }
        },
        (error) => {
          if (error.response.status === 401) {
            setMessage('Your email or API key was incorrect')

            Cookies.remove('credentials', {
              domain: 'localhost',
              secure: false,
              path: '/',
              sameSite: 'strict',
            })
          }
        },
      )
      .then(() => {
        setLoggingIn(false)
      })
  }

  return (
    <div className="flex flex-col min-vh-100">
      <Head>
        <title>Log in | Standup Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* hero section with login form */}
      <section className="px-4 py-8 mx-auto max-w-7xl px-42 sm:px-6">
        <div className="mt-10 mb-4">
          <h1 className="leading-11 text-64 font-700">Standup Dashboard</h1>
        </div>
        <p className="max-w-3xl mb-6 leading-snug tracking-tight text-28 font-300">
          Automated itineraries for scrum standups based on JIRA
        </p>
      </section>
      <main className="flex-grow">
        <div className="max-w-sm mx-auto shadow-sm rounded-lg bg-white px-4 sm:px-6 py-3 sm:py-4">
          <p className="font-semibold text-center mb-4">
            Log in to your JIRA account
          </p>

          {message.length > 0 ? (
            <p className="text-red-600 text-center mb-4">{message}</p>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor={jiraId} className="leading-12 font-300">
                JIRA URL
              </label>

              <TextInput
                name="jiraHostUrl"
                id={jiraId}
                type="text"
                autoComplete="url"
                required
                autoFocus
              />

              <label htmlFor={emailId} className="leading-12 font-300">
                JIRA Login
              </label>

              <TextInput
                name="email"
                id={emailId}
                type="email"
                required
                autoComplete="email"
              />
              <label htmlFor={passwordId} className="leading-12 font-300">
                API Key
              </label>

              <TextInput
                name="password"
                id={passwordId}
                required
                autoComplete="current-password"
                type="password"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 w-full rounded-md bg-blue-600 border-blue-950 text-gray-50 hover:bg-blue-500 focus:border-indigo-500 focus:ring-indigo-400"
            >
              Log in
            </button>
          </form>
        </div>
      </main>
      <footer className="pt-48 pb-8 text-center bg-blue-950">
        <small className="text-white"> Made with ❤️ by Jacob Paris </small>
      </footer>
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

export async function getStaticProps() {
  return {
    props: {},
  }
}
