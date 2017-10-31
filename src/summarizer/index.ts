import providers from './providers'

import { ISummarizedMetadata, TSummarizeProvider } from '../interfaces'
import { SummarizerNotFoundError } from '../errors'

export const detectProvider = (url: string): TSummarizeProvider | null => {
  for (const [matcher, provider] of providers) {
    if (matcher.test(url)) return provider
  }
  return null
}

export default (url: string, lang: string = 'en'): Promise<ISummarizedMetadata> => {
  const provider = detectProvider(url)

  return provider === null ? Promise.reject(new SummarizerNotFoundError(url)) : provider(url, lang)
}
