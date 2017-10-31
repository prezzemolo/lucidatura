import { StatusCodeError } from '../../errors'

export const commonAxiosErrorHandler = (messageGenerator?: (data: any) => string | null) => (reason: any) => {
  if (reason.response) {
    throw new StatusCodeError(reason.response.status, (
      (): string => {
        let message: string | null = null
        if (messageGenerator) message = messageGenerator(reason.response.data)
        if (!message && typeof reason.response.data === 'string') message = reason.response.data
        return message || 'unknown'
      }
    ))
  }

  throw reason
}
