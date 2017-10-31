import * as statuses from 'statuses'

export const StatusCodeError = class extends Error {
  code: string

  constructor (code: number, msg: string | null = null, ...rest: any[]) {
    super(msg === null ? statuses[code] : msg, ...rest)
    Object.defineProperty(this, 'name', { value: 'StatusCodeError' })
    const nameDescriptor = Object.getOwnPropertyDescriptor(this, 'name')
    Object.defineProperty(this, 'code', Object.assign(
      {},
      nameDescriptor,
      { value: statuses[code] }
    ))
  }
}

export const SummarizerNotFoundError = class extends Error {
  url: string

  constructor (url: string, message: string = 'there is no summarizer for given URL.', ...rest: any[]) {
    super(message, ...rest)
    Object.defineProperty(this, 'name', { value: 'SummarizerNotFoundError' })
    const nameDescriptor = Object.getOwnPropertyDescriptor(this, 'name')
    Object.defineProperty(this, 'url', Object.assign(
      {},
      nameDescriptor,
      { value: url }
    ))
  }
}
