import nock from 'nock'
import { getAxiosClient } from '../index'
import { DEFAULT_RETRY_DELAY_MS, DEFAULT_RETRY_MAX_RETRIES } from '../constants'

describe('retryOn429', () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  it('Should make three requests and receive 200 response eventually after two 429 responses', async () => {
    const url = 'http://localhost'
    const resource = '/test'
    const request1 = nock(url).get(resource).reply(429, '')
    const request2 = nock(url).get(resource).reply(429, '')
    const request3 = nock(url).get(resource).reply(200, 'Content')
    const client = getAxiosClient({
      retry: {
        delayMs: DEFAULT_RETRY_DELAY_MS,
        maxRetries: DEFAULT_RETRY_MAX_RETRIES,
        retryStatusCodes: [429],
      },
    })

    await client.get(`${url}${resource}`)

    request1.isDone()
    request2.isDone()
    request3.isDone()
  })
})
