import nock from 'nock'
import axios from 'axios'
import { transformAxiosResponseForLogger } from '../transform'

describe('transformAxiosResponseForLogger', () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  it('should transform a GET request to the correct object structure', async () => {
    nock('http://localhost').get('/test').reply(200, { name: 'Jimmy' })
    const response = await axios.get('http://localhost/test', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'mock-user-agent',
      },
    })

    const result = transformAxiosResponseForLogger(response)

    expect(result).toEqual({
      request: {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'mock-user-agent',
        },
        method: 'get',
        url: 'http://localhost/test',
      },
      response: {
        data: {
          name: 'Jimmy',
        },
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
      },
    })
  })

  it('should transform a POST request to the correct object structure', async () => {
    nock('http://localhost').post('/test', { item1: 'test' }).reply(200, { name: 'Jimmy' })
    const response = await axios.post(
      'http://localhost/test',
      { item1: 'test' },
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'mock-user-agent',
        },
      },
    )

    const result = transformAxiosResponseForLogger(response)

    expect(result).toEqual({
      request: {
        data: {
          item1: 'test',
        },
        headers: {
          Accept: 'application/json',
          'Content-Length': 16,
          'Content-Type': 'application/json',
          'User-Agent': 'mock-user-agent',
        },
        method: 'post',
        url: 'http://localhost/test',
      },
      response: {
        data: {
          name: 'Jimmy',
        },
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
      },
    })
  })
})
