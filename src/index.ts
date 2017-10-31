import summarizer from './summarizer'

import * as interfaces from './interfaces'
import * as errors from './errors'
export { errors, interfaces }

export default (...opts: interfaces.TRiassumereOption[]): Promise<interfaces.ISummary | interfaces.ISummary[]> => {
  const promises: Promise<interfaces.ISummary>[] = opts.map(
    opt =>
      typeof opt === 'string'
        ? summarizer(opt)
        : summarizer(opt.url, opt.lang)
  )

  return promises.length === 1 ? promises[0] : Promise.all(promises)
}
