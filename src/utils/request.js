import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // 将token写入请求头中，key可以根据后台自定义
      if (config.headers['Authorization2']) {
        config.headers['Authorization'] = config.headers['Authorization2']
      } else {
        config.headers['Authorization'] = 'Bearer ' + getToken()
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 只有200和字符串200的返回码是正确得，如果不是就会进入拦截方法，大坑
    if (res.code !== 200 && res.code !== '200') {
      const indexs = response.config.responseType
      if (indexs === 'arraybuffer') {
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(res)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }

      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // 在后置的拦截器中捕捉token失效的返回码，并且前提是cookie中已经存在token了，加上这个是因为这个框架一上来就会调用getUserInfo，此时token失效状态一定会进去，所以会报错
      if ((res.code === -2 || res.code === '-2') && getToken()) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      // 如果后端返回的错误编码是-1，则跳转到登录页面
      // if (res.code === -1 || res.code === '-1') {
      //   // 移除token
      //   removeToken()
      //   // 重定向
      //   router.push('/login')
      // }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
