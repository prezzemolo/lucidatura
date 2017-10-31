import test from 'ava'

import generalProvider from '../src/summarizer/providers/general'
import summarizer, { selectProvider } from '../src/summarizer'
import { SummarizerNotFoundError } from '../src/errors'

test(`summarizer > select 'general' provider from URL 'http://example.com'`, t => {
  const provider = selectProvider('http://example.com')
  t.is(provider, generalProvider)
})

test(`summarizer > throw SummarizerNotFoundError with unsupported URL 'ftp://example.com'`, async t => {
  await t.throws(summarizer('ftp://example.com'), SummarizerNotFoundError)
})
