import summarizer from './summarizer'

import { ISummarizedMetadata, TRiassumereOption } from './interfaces'

import * as errors from './errors'
export { errors }

export default (...opts: TRiassumereOption[]): Promise<ISummarizedMetadata | ISummarizedMetadata[]> => {
  const promises: Promise<ISummarizedMetadata>[] = opts.map(
    opt =>
      typeof opt === 'string'
        ? summarizer(opt)
        : summarizer(opt.url, opt.lang)
  )

  return promises.length === 1 ? promises[0] : Promise.all(promises)
}
