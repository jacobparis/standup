import React from 'react'

import axios, {AxiosError} from 'axios'
import DecorativeFooter from 'components/DecorativeFooter'
import DecorativeHeader from 'components/DecorativeHeader'
import Cookies from 'js-cookie'
import cookies from 'next-cookies'
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
      domain: window.location.hostname,
      secure: window.location.hostname !== 'localhost',
      path: '/',
      sameSite: 'strict',
    })

    Cookies.set('credentials', window.btoa(`${email}:${password}`), {
      domain: window.location.hostname,
      secure: window.location.hostname !== 'localhost',
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
              domain: window.location.hostname,
              secure: window.location.hostname !== 'localhost',
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
        <title>Log in | 3Q</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex items-center justify-between px-4 py-2 bg-blue-400">
        <div>
          <a
            className="font-bold text-gray-800 text-28 hover:text-gray-600"
            href="/"
          >
            3Q <span className="text-xl font-normal"> (three questions) </span>
          </a>
        </div>

        <div className="flex items-center">
          <a
            className="px-4 py-2 text-xl text-gray-800 hover:text-gray-600"
            href="#free"
          >
            Pricing
          </a>
          <a
            className="px-4 py-2 text-xl text-gray-800 hover:text-gray-600"
            href="#faq"
          >
            FAQ
          </a>
          <a
            className="px-4 py-2 text-xl font-normal text-gray-200 bg-black rounded-lg hover:text-white hover:bg-gray-800"
            href="#login"
          >
            Log in
          </a>
        </div>
      </header>

      <DecorativeHeader>
        <div className="mt-10 mb-4">
          <h1 className="inline text-7xl font-700">Better standup meetings</h1>
        </div>
        <p className="max-w-3xl mb-6 leading-snug tracking-tight text-28 font-300">
          See your team and everything they're working on in one place, so
          everyone knows what to discuss and nothing is overlooked.
        </p>
        <a
          className="px-4 py-2 text-xl font-normal text-gray-200 bg-black rounded-lg hover:text-white hover:bg-gray-800"
          href="#login"
        >
          Start now
        </a>
      </DecorativeHeader>

      <div className="bg-gray-100">
        <section className="max-w-4xl py-8 mx-auto ">
          <div className="px-4 mb-4">
            <h2 className="inline text-28 font-700">
              Choose your JIRA projects
            </h2>
          </div>

          <div className="flex">
            <div className="flex-1 px-4 sm:px-6">
              <p className="max-w-3xl mb-6">
                Include the projects that are relevant to the meeting at hand
                and ignore the rest
              </p>
            </div>

            <div className="flex-1 mx-4 overflow-hidden rounded">
              <img src="./project-selector-01.png" />
            </div>
          </div>
        </section>

        <section className="max-w-4xl py-8 mx-auto ">
          <div className="px-4 mb-4">
            <h2 className="inline text-28 font-700">
              See epic progress at a glance
            </h2>
          </div>

          <div className="flex">
            <div className="flex-1 px-4 sm:px-6">
              <p className="max-w-3xl mb-6">
                Begin each meeting with a summary of progress in each active
                epic
              </p>
            </div>

            <div className="flex-1 mx-4 overflow-hidden rounded">
              <img src="./epic-progress-01.png" />
            </div>
          </div>
        </section>

        <section className="max-w-4xl px-4 py-8 mx-auto px-42 sm:px-6">
          <div className="mb-4">
            <h2 className="inline text-28 font-700">Top to bottom reporting</h2>
          </div>
          <p className="max-w-3xl mb-6">
            Someone new starts the meeting every day, and no one gets left out.
            When one person finishes their report, the next person on the list
            gets to start.
          </p>
        </section>
        <section className="flex max-w-4xl mx-auto">
          <div className="flex-1 px-4 sm:px-6">
            <h2 className="inline text-base font-700">
              What are you doing today to help the team complete the sprint?
            </h2>

            <p className="max-w-3xl mb-4">
              Active tickets are pre-opened and placed in the center of the
              screen, with full descriptions, images, and development status
              available at the click of a button.
            </p>

            <h2 className="inline text-base font-700">
              What did you do yesterday to help the team complete the sprint?
            </h2>

            <p className="max-w-3xl mb-4">
              Let's face it – it's hard to remember everything that happened
              yesterday. 3Q shows both completed work and work yet to do so
              you're ready to discuss anything that needs to be brought up.
            </p>

            <h2 className="inline text-base font-700">
              Is anything getting in the way of the team completing the sprint?
            </h2>

            <p className="max-w-3xl mb-4">
              Flagged tickets are highlighted for discussion so issues can be
              resolved immediately
            </p>
          </div>

          <div className="flex-1 max-w-4xl mx-auto overflow-hidden rounded-lg ">
            <img src="./user-issues-01.png" />
          </div>
        </section>
        <section className="max-w-4xl py-8 mx-auto ">
          <div className="px-4 mb-4">
            <h2 className="inline text-28 font-700">One click transitions</h2>
          </div>

          <div className="flex">
            <div className="flex-1 px-4 sm:px-6">
              <p className="max-w-3xl mb-6">
                Instantly move reviewed tickets to the Done pile or TODO tickets
                into progress. Integrations with code repositories like GitLab
                or GitHub are shown inline, so you can see at a glance if a
                linked ticket is still open or has been merged.
              </p>
            </div>

            <div className="flex-1 mx-4 overflow-hidden rounded">
              <img src="./issue-integrations-01.png" />
            </div>
          </div>
        </section>

        <section className="max-w-4xl px-4 py-8 mx-auto px-42 sm:px-6">
          <div className="mt-10 mb-4">
            <h2 className="inline text-28 font-700">Use your existing data</h2>
          </div>
          <p className="max-w-3xl mb-6">
            Treat 3Q like a smarter dashboard for your existing JIRA data. To
            get started,{' '}
            <a
              href="https://id.atlassian.com/manage-profile/security/api-tokens"
              target="_blank"
              rel="noreferrer nofollow"
              className="text-blue-600 hover:underline"
            >
              create a token in your Atlassian profile
            </a>
            , choose the projects you want to display, and you're ready for
            focused and efficient meetings.
          </p>
        </section>
      </div>

      <DecorativeFooter>
        <main className="flex-grow py-8 text-gray-900">
          <h2 className="w-full max-w-full mb-4 text-center text-28 font-700">
            Get started
          </h2>
          <div className="max-w-sm px-4 py-3 mx-auto mb-4 bg-white rounded-lg shadow sm:px-6 sm:py-4">
            <p id="login" className="mb-4 text-base font-semibold text-center">
              Log in to your JIRA account
            </p>

            {message.length > 0 ? (
              <p className="mb-4 text-center text-red-600">{message}</p>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label htmlFor={emailId} className="leading-12 font-300">
                  JIRA Email
                </label>
                <TextInput
                  name="email"
                  id={emailId}
                  type="email"
                  required
                  autoFocus
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
                <p className="mb-4 -mt-4 text-xs leading-4 text-gray-700">
                  You can{' '}
                  <a
                    href="https://id.atlassian.com/manage-profile/security/api-tokens"
                    target="_blank"
                    rel="noreferrer nofollow"
                    className="text-blue-600 hover:underline"
                  >
                    create a token in your Atlassian profile
                  </a>
                </p>

                <label htmlFor={jiraId} className="leading-12 font-300">
                  JIRA URL
                </label>
                <TextInput
                  name="jiraHostUrl"
                  id={jiraId}
                  type="text"
                  autoComplete="url"
                  required
                  placeholder="https://example.atlassian.net"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 rounded-md border-blue-950 text-gray-50 hover:bg-blue-500 focus:border-indigo-500 focus:ring-indigo-400"
              >
                Log in
              </button>
            </form>
          </div>
        </main>

        <section className="max-w-4xl px-4 py-8 mx-auto px-42 sm:px-6">
          <div className="mt-10 mb-4">
            <h2 id="faq" className="inline text-28 font-700">
              Frequently Asked Questions
            </h2>
          </div>

          <h3 className="mb-4 text-lg font-bold" id="free">
            How much does 3Q cost?
          </h3>

          <p className="max-w-3xl mb-6">
            3Q is completely free. This was a pet project born out of
            frustration at too many long unfocused meetings. There is no
            tracking, no analytics, no account, and no cost.
          </p>

          <h3 className="mb-4 text-lg font-bold"> What does 3Q stand for? </h3>

          <p className="max-w-3xl mb-6">
            The name is a reference to the{' '}
            <a
              href="https://en.wikipedia.org/wiki/Stand-up_meeting#Three_Questions"
              target="_blank"
              rel="noreferrer nofollow"
              className="text-blue-600 hover:underline"
            >
              Three Questions
            </a>{' '}
            suggested as a framework to encourage daily reports to focus on
            eliminating impediments and granting visibility into the progress of
            the team.
          </p>
        </section>
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
    return {props: {}}
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
        redirect: {
          destination: '/logged-in',
          permanent: false,
        },
      }
    }

    throw new Error('Unsupported response')
  } catch (err) {
    const error = err as AxiosError

    if (error.response) {
      if (error.response.status === 401) {
        return {}
      }
    }

    console.error(err)

    throw new Error('Unsupported error')
  }
}
