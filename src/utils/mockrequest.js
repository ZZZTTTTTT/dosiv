import axios from 'axios'
import { getToken, getRefreshToken } from '@/utils/auth'

const service = axios.create({
  // baseURL: 'http://10.26.10.229:8090/iehmdm/service/',
  // baseURL: 'http://10.23.243.1:9031/iehmdos/service/',
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 3600000, // request timeout
})

service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token !== null && token !== undefined && token !== '') {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    let msg = ''
    try {
      msg = response.data.__sys__.msg
    } catch (e) {
      msg = ''
    }
    // console.log('msg', msg)
    // 处理票据过去，需要重新登录
    if (msg.indexOf('票据过期') != -1) {
      // console.log('票据过期，请重新登录')
      const refreshToken = getRefreshToken()
      const params = {
        refreshToken,
      }
      const refreshLoginUrl = process.env.VUE_APP_BASE_API + 'ISLG01/refreshToken'
      axios.post(refreshLoginUrl, params).then((res) => {
        if (res.status !== 200 || res.data.code !== 200) {
          // console.log('刷新令牌失败')
          return
        }
        const { result } = res.data
        const newToken = result.access_token
        const newRefreshToken = result.refresh_token
        const newUserId = result.userName
        const newUsername = result.userName
        if (newToken == null || newToken == undefined || newToken == '') {
          // pass
        } else {
          setToken(newToken)
        }
        if (newRefreshToken == null || newRefreshToken == undefined || newRefreshToken == '') {
          // pass
        } else {
          setRefreshToken(newRefreshToken)
        }
        if (newUserId == null || newUserId == undefined || newUserId == '') {
          // pass
        } else {
          setUserId(newUserId)
        }
        if (newUsername == null || newUsername == undefined || newUsername == '') {
          // pass
        } else {
          setUsername(newUsername)
        }
      })
    } else {
      return response
    }
  },
  (error) => {
    // console.log(error)
    // console.log()
  }
)

export default service
