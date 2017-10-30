import { TSummarizeProviders } from '../../interfaces'

import general from './general'

const providers: TSummarizeProviders = new Map([
  [ new RegExp('^https?://.*$'), general ]
])

export default providers
