import { Context } from '@nuxt/types'
import { AxiosError, AxiosResponse } from 'axios'
import errno from '~/constant/errno'

export function onFulfilled (context: Context) {
  return (res: AxiosResponse) => {
    if (res.data) {
      if (res.data.err_no === errno.success) {
        return res.data.data
      }
      else {
        if (res.data.err_no === errno.rpcApiErrSystemUpgrade) {
          context.app.$alert({
            title: context.app.$tt('Tips'),
            message: context.app.$tt('The service is under maintenance, please try again later.')
          })
        }
        else {
          const serverError: any = new Error(res.data.err_msg)
          serverError.code = res.data.err_no
          throw serverError
        }
      }
    }
    else {
      const serverError: any = new Error(res.data.err_msg)
      serverError.code = res.data.err_no
      throw serverError
    }
  }
}

export function onRejected (err: AxiosError) {
  err.code = String(errno.networkError)
  throw err
}
