import axios from 'axios'
import * as qs from 'query-string'

import { ISummary } from '../../interfaces'
import { StatusCodeError } from '../../errors'

export default (url: string, lang: string, ref: string = 'refs/tags/0.4.5'): Promise<ISummary> =>
  axios
    .get(`https://analizzatore.prezzemolo.ga/?${qs.stringify({ url, lang, ref })}`)
    .then(response => {
      return response.data as ISummary
    })
    .catch(reason => {
      if (reason.response) {
        if (typeof reason.response.data === 'string') {
          throw new StatusCodeError(reason.response.status, reason.response.data)
        }

        throw new StatusCodeError(reason.response.status, `${
          // cut a suffix '.'
          reason.response.data.title.endsWith('.')
            ? reason.response.data.title.slice(0, -1)
            : reason.response.data.title
        }, ${reason.response.data.detail.toLocaleLowerCase()}`)
      }

      throw reason
    })
