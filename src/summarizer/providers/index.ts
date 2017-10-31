import { TSummarizeProviders } from '../../interfaces'

import general from './general'
import github from './github'

const providers: TSummarizeProviders = new Map([
  [ new RegExp('^https?://github\.com(?:/.*)?$'), github ],
  [ new RegExp('^https?://.*$'), general ]
])

export default providers
