import nock from 'nock'
import { getAxiosClient } from '../index'
import * as https from 'https'

describe('getAxiosClient', function () {
  beforeEach(() => {
    nock.cleanAll()
  })

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

  it('should pass the `elapsedTimeMs` property in the response object to log function', async () => {
    const url = 'https://localhost'
    const resource = '/test'
    const scope = nock(url).get(resource).delay(200).reply(200, 'Content')
    const logFn = jest.fn()
    const client = getAxiosClient({ logFn })

    await client.get(`${url}${resource}`)

    expect(scope.isDone()).toBeTrue()
    expect(logFn).toHaveBeenCalledTimes(1)
    expect(logFn).toHaveBeenCalledWith({
      request: {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-encoding': 'gzip, compress, deflate, br',
          'user-agent': 'axios/1.3.4',
        },
        method: 'get',
        url: 'https://localhost/test',
        params: undefined,
        data: undefined,
      },
      response: {
        data: 'Content',
        elapsedTimeMs: expect.any(Number),
        status: 200,
        headers: undefined,
      },
    })
    expect(logFn.mock.calls[0][0].response.elapsedTimeMs).toBeGreaterThanOrEqual(200)
  })

  it('should pass the `elapsedTimeMs` property in the response object when an error status is returned', async () => {
    const url = 'https://localhost'
    const resource = '/test'
    const scope = nock(url).get(resource).reply(401, 'Content')
    const logFn = jest.fn()
    const client = getAxiosClient({ logFn })

    await expect(client.get(`${url}${resource}`)).rejects.toThrow('Request failed with status code 401')

    expect(scope.isDone()).toBeTrue()
    expect(logFn).toHaveBeenCalledTimes(1)
    expect(logFn).toHaveBeenCalledWith({
      request: {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-encoding': 'gzip, compress, deflate, br',
          'user-agent': 'axios/1.3.4',
        },
        method: 'get',
        url: 'https://localhost/test',
        params: undefined,
        data: undefined,
      },
      response: {
        code: 'ERR_BAD_REQUEST',
        elapsedTimeMs: expect.any(Number),
        status: 401,
        data: 'Content',
      },
    })
  })

  it('should pass a value greater than the timeout to the `elapsedTimeMs` property in the response object to log function if we get a timeout', async () => {
    const url = 'https://localhost'
    const resource = '/test'
    const scope = nock(url).get(resource).delay(600).reply(200, 'Content')
    const logFn = jest.fn()
    const client = getAxiosClient({ logFn, retry: { maxRetries: 0 }, httpsAgent: new https.Agent({ timeout: 500 }) })

    await expect(client.get(`${url}${resource}`, { timeout: 500 })).rejects.toThrow('timeout of 500ms exceeded')

    expect(scope.isDone()).toBeTrue()
    expect(logFn).toHaveBeenCalledTimes(1)
    expect(logFn).toHaveBeenCalledWith({
      request: {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-encoding': 'gzip, compress, deflate, br',
          'user-agent': 'axios/1.3.4',
        },
        method: 'get',
        url: 'https://localhost/test',
      },
      response: {
        code: 'ETIMEDOUT',
        elapsedTimeMs: expect.any(Number),
        message: 'timeout of 500ms exceeded',
      },
    })
  })

  it('should retry a timed out request', async () => {
    const url = 'https://localhost'
    const resource = '/test'
    const scope1 = nock(url).get(resource).delay(600).reply(200, 'Content1')
    const scope2 = nock(url).get(resource).reply(200, 'Content2')
    const logFn = jest.fn()
    const client = getAxiosClient({ logFn })

    const result = await client.get(`${url}${resource}`, { timeout: 500 })

    expect(result.data).toBe('Content2')
    expect(scope1.isDone()).toBeTrue()
    expect(scope2.isDone()).toBeTrue()
    expect(logFn).toHaveBeenCalledTimes(2)
    expect(logFn).toHaveBeenNthCalledWith(1, {
      request: {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-encoding': 'gzip, compress, deflate, br',
          'user-agent': 'axios/1.3.4',
        },
        method: 'get',
        url: 'https://localhost/test',
        params: undefined,
        data: undefined,
      },
      response: {
        code: 'ETIMEDOUT',
        elapsedTimeMs: expect.any(Number),
        message: 'timeout of 500ms exceeded',
      },
    })
    expect(logFn).toHaveBeenNthCalledWith(2, {
      request: {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-encoding': 'gzip, compress, deflate, br',
          'user-agent': 'axios/1.3.4',
          'x-retry-count': '1',
        },
        method: 'get',
        url: 'https://localhost/test',
      },
      response: {
        data: 'Content2',
        status: 200,
        elapsedTimeMs: expect.any(Number),
      },
    })
  })
})
