import providers from './providers'

import { ISummarizedMetadata } from '../interfaces'
import { SummarizerNotFoundError } from '../errors'

export default (url: string, lang: string = 'en'): Promise<ISummarizedMetadata> => {
  for (const [matcher, provider] of providers) {
    if (matcher.test(url))
      return provider(url, lang)
  }

  return Promise.reject(new SummarizerNotFoundError(url))
}
