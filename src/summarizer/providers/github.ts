/*
  GitHub Summarizer

  why?
      GitHub delivers 'robots.txt' that has the entry ban almost all,
    so avoidance it with GitHub REST API (v3).
 */
import axios from 'axios'
import * as URL from 'url-parse'
import * as pathToRegExp from 'path-to-regexp'

import { ISummary } from '../../interfaces'
import { SummarizerNotFoundError } from '../../errors'
import { commonAxiosErrorHandler as commonAxiosErrorHandlerGenerator } from './common'

import general from './general'

const githubAPIBase = 'https://api.github.com'
const commonAxiosErrorHandler = commonAxiosErrorHandlerGenerator(data => {
  if (typeof data !== 'object') return null
  return data.message
})

type TSubSummarizer = (...args: string[]) => Promise<ISummary>
type TSubSummarizers = Map<RegExp, TSubSummarizer>

const repository: TSubSummarizer = (user: string, repo: string): Promise<ISummary> =>
  axios.get(`${githubAPIBase}/repos/${user}/${repo}`)
    .then(response => {
      const {
        full_name: title,
        description,
        html_url: canonical,
        owner: { avatar_url: image }
      } = response.data
      return {
        title, canonical, image,
        description:
        description
          ? `${title} - ${description}`
          : `Contribute to ${title} development by creating an account on GitHub.`,
        type: 'object'
      }
    })
    .catch(commonAxiosErrorHandler)

const tag: TSubSummarizer = (user: string, repo: string, tag: string) =>
  Promise.all([
    repository(user, repo),
    // check existance of tag
    axios.head(`${githubAPIBase}/repos/${user}/${repo}/git/refs/tags/${tag}`)
  ])
    .then(([repo]) => {
      return Object.assign(repo, {
        canonical: `${repo.canonical}/releases/tag/${tag}`
      })
    })
    .catch(commonAxiosErrorHandler)

const commit: TSubSummarizer = (user: string, repo: string, sha: string): Promise<ISummary> =>
  Promise.all([
    axios.get(`${githubAPIBase}/repos/${user}/${repo}/commits/${sha}`),
    repository(user, repo)
  ])
    .then(([commit, repo]) => {
      const {
        author: { avatar_url: image },
        commit: { message },
        html_url: canonical
      } = commit.data
      const [title, ...desca] = message.split('\n\n', 2)
      const description = desca.join('\n\n') || repo.description
      return {
        title, description, canonical, image,
        type: 'object'
      }
    })
    .catch(commonAxiosErrorHandler)

const repositorySubcontents = [
  // top-level
  'pulls', 'issues', 'projects', 'wiki',
  // code
  'releases', 'tags', 'branches',
  // issues
  'milestones', 'labels',
  // insights
  'pulse', 'graphs/contributors', 'community', 'graphs/commit-activity', 'graphs/code-frequency', 'network/dependencies', 'network', 'members'
]
const repositorySubcontantsWrapper: TSubSummarizer = (...args: string[]): Promise<ISummary> => {
  const name = args[2]
  if (!repositorySubcontents.includes(name)) throw new SummarizerNotFoundError(`https://github.com/${args.join('/')}`)
  return repository(...args)
    .then((summary: ISummary) => Object.assign(summary, {
      title: !name.includes('/') ? `${name.substr(0, 1).toUpperCase() + name.substr(1)} \u00b7 ${summary.title}` : summary.title,
      canonical: `${summary.canonical}/${name}`
    }))
    .catch(commonAxiosErrorHandler)
}

// iap -> issue & pull request
const iap: TSubSummarizer = (user: string, repo: string, iapno: string): Promise<ISummary> => {
  return Promise.all([
    repository(user, repo),
    axios.get(`${githubAPIBase}/repos/${user}/${repo}/issues/${iapno}}`)
  ])
    .then(([repo, issue]) => {
      const {
        title,
        html_url: canonical,
        user: { avatar_url: image },
        body
      } = issue.data
      return {
        canonical, image,
        description: body ? body.trim() : repo.description,
        title: `${title} \u00b7 #${iapno} \u00b7 ${repo.title}`,
        type: 'object'
      }
    })
    .catch(commonAxiosErrorHandler)
}

const bt = (name: string): TSubSummarizer =>
  (user: string, repo: string, branch: string, path: string): Promise<ISummary> => {
    return Promise.all([
      repository(user, repo),
      axios.head(`${githubAPIBase}/repos/${user}/${repo}/contents/${path}`)
    ])
      .then(([repo]) => Object.assign(repo, {
        canonical: `${repo.canonical}/${name}/${branch}/${path}`
      }))
      .catch(commonAxiosErrorHandler)
  }

const user: TSubSummarizer = (user: string): Promise<ISummary> =>
  axios.get(`${githubAPIBase}/users/${user}`)
    .then(response => {
      const {
        login, name, public_repos,
        html_url: canonical,
        avatar_url: image
      } = response.data
      const description =
        public_repos > 0
          ? `${login} has ${public_repos} repositories available. Follow their code on GitHub.`
          : `Follow ${login} on GitHub and watch them build beautiful projects.`
      return {
        canonical, image, description,
        title: name ? `${login} (${name})` : login,
        type: 'profile'
      }
    })
    .catch(commonAxiosErrorHandler)

const summarizers: TSubSummarizers = new Map([
  [ pathToRegExp('/'), () => general('https://github.com/humans.txt', 'en') ],
  [ pathToRegExp('/:user'), user ],
  [ pathToRegExp('/:user/:repository'), repository ],
  [ pathToRegExp('/:user/:repository/releases/tag/:tag'), tag ],
  [ pathToRegExp('/:user/:repository/commit/:sha'), commit ],
  [ pathToRegExp('/:user/:repository/issues/:number'), iap ],
  [ pathToRegExp('/:user/:repository/pull/:number'), iap ],
  // dummy with repository
  [ pathToRegExp('/:user/:repository/blob/:branch/(.*)'), bt('blob') ],
  [ pathToRegExp('/:user/:repository/tree/:branch/(.*)'), bt('tree') ],
  // fallbacks
  [ pathToRegExp('/:user/:repository/(.*)'), repositorySubcontantsWrapper ]
])

export default (gURL: string): Promise<ISummary> => {
  const url = URL(gURL)
  const pathname = url.pathname || '/'
  for (const [matcher, summarizer] of summarizers) {
    if (matcher.test(pathname)) {
      const args = (
        (): string[] => {
          const r = matcher.exec(pathname)
          if (r === null) throw new Error('something happened...')
          r.shift()
          return r
        }
      )()
      return summarizer(...args).then(
        (summary: ISummary) => Object.assign(
          {
            lang: 'en',
            icon: 'https://assets-cdn.github.com/favicon.ico',
            site_name: 'GitHub'
          },
          summary
        )
      )
    }
  }
  return Promise.reject(new SummarizerNotFoundError(gURL))
}
