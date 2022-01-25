import Axios, { AxiosInstance } from 'axios'
import { Context } from '@nuxt/types'
import { onFulfilled, onRejected } from './interceptors'
import { servicesApi } from '~~/config'

export class BasicService {
  id = 0
  jsonrpc = '2.0'
  axios: AxiosInstance

  constructor (context: Context) {
    this.axios = Axios.create({
      baseURL: servicesApi,
      withCredentials: true
    })
    this.axios.interceptors.response.use(onFulfilled(context), onRejected)
  }

  /**
   * rpc request method
   * @param method
   * @param params
   */
  rpc (method: string, params: any): Promise<any> {
    return this.axios.post(`/${method}`, {
      jsonrpc: this.jsonrpc,
      id: ++this.id,
      method,
      params: [params]
    })
  }
}
