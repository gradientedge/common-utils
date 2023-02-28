import nock from 'nock'
import { getAxiosClient } from '../index'

describe('getAxiosClient', function () {
  it('should add an X-Retry-Count header for retried requests', async () => {
    const url = 'http://localhost'
    const resource = '/test'
    const request1 = nock(url).get(resource).reply(501, '')
    const request2 = nock(url).matchHeader('X-Retry-Count', '1').get(resource).reply(502, '')
    const request3 = nock(url).matchHeader('X-Retry-Count', '2').get(resource).reply(200, 'Content')

    const client = getAxiosClient()

    await client.get(`${url}${resource}`)

    request1.isDone()
    request2.isDone()
    request3.isDone()
  })
})
