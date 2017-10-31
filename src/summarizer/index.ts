import providers from './providers'

import { ISummary, TSummarizeProvider } from '../interfaces'
import { SummarizerNotFoundError } from '../errors'

export const selectProvider = (url: string): TSummarizeProvider | null => {
  for (const [matcher, provider] of providers) {
    if (matcher.test(url)) return provider
  }
  return null
}

export default (url: string, lang: string = 'en'): Promise<ISummary> => {
  const provider = selectProvider(url)

  return provider === null ? Promise.reject(new SummarizerNotFoundError(url)) : provider(url, lang)
}
