import summarizer from './summarizer'

import { ISummarizedMetadata, TRiassumereOption } from './interfaces'

import * as errors from './errors'
export { errors }

export default (...opts: TRiassumereOption[]): Promise<ISummarizedMetadata | ISummarizedMetadata[]> => {
  const promises: Promise<ISummarizedMetadata>[] = opts.map(
    opt =>
      typeof opt == 'string'
        ? summarizer(opt)
        : summarizer(opt.url, opt.lang)
  )

  if (promises.length === 1)
    return promises[0]

  return Promise.all(promises)
}
