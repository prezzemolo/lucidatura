import axios from 'axios'
import * as qs from 'query-string'

import { ISummary } from '../../interfaces'
import { commonAxiosErrorHandler } from './common'

export default (url: string, lang: string, ref: string = 'refs/tags/0.4.6'): Promise<ISummary> =>
  axios
    .get(`https://analizzatore.prezzemolo.ga/?${qs.stringify({ url, lang, ref })}`)
    .then(response => {
      return response.data as ISummary
    })
    .catch(commonAxiosErrorHandler(data => {
      if (typeof data !== 'object') return null
      return `${
        // cut a suffix '.'
        data.title.endsWith('.')
          ? data.title.slice(0, -1)
          : data.title
      }, ${data.detail.toLocaleLowerCase()}`
    }))
