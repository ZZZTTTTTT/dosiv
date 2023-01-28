import axios from 'axios'
import EiInfo from './EiInfo'
const instance = axios.create({
  baseUrl: '',
  timeout: 120000,
  headers: {},
})
const oppdcInstance = axios.create({
  baseUrl: '',
  timeout: 120000,
  headers: {},
})

var agreement = location.protocol // 判断当前是http还是https

if (process.env.NODE_ENV == 'production') {
  instance.defaults.baseURL = agreement + '//eplat.baoiem.com'
  oppdcInstance.defaults.baseURL = agreement + '//eplat.baoiem.com' // 设置oppdc线上地址
} else if (process.env.NODE_ENV == 'test' && window.location.href.includes('baoiem.com')) {
  instance.defaults.baseURL = agreement + '//eplattest.baoiem.com'
  oppdcInstance.defaults.baseURL = agreement + '//eplattest.baoiem.com' // 设置oppdc线上地址
}
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let respInterceptors = [
  function (response) {
    let eiInfo = new EiInfo(response.data)
    if (eiInfo.getStatus() == eiInfo['RESP_STATE']) {
      if (Object.keys(eiInfo.getBlocks()).length == 0) {
        return response.data.result ? response.data.result : []
      } else {
        return eiInfo.getBlocks()
      }
    } else {
      return Promise.reject({
        msg: eiInfo.getMsg(),
        result: response.data.result ? response.data.result : [],
      })
    }
  },
  function (error) {
    return Promise.reject(error)
  },
]

// 响应拦截
instance.interceptors.response.use(...respInterceptors)
const fetch = {}
fetch.get = function (url, params = {}, config = {}) {
  config.params = params
  return instance.get(url, config)
}
fetch.post = function (url, data = {}, config = {}) {
  return instance.post(url, data, config)
}
export default fetch

oppdcInstance.interceptors.response.use(...respInterceptors)
export const http2 = {
  get: function (url, params = {}, config = {}) {
    config.params = params
    return oppdcInstance.get(url, config)
  },
  post: function (url, data = {}, config = {}) {
    return oppdcInstance.post(url, data, config)
  },
}
