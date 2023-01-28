import request from '@/utils/mockrequest'

export function getUserInfo() {
  return request({
    url: 'ISLG01/getUserInfo',
    method: 'post',
    data: {},
  })
}

export function authLogin(code) {
  return request({
    url: 'ISLG01/authLogin',
    method: 'post',
    data: {
      code,
    },
  })
}

export function refreshLogin(params) {
  return request({
    url: 'ISLG01/refreshToken',
    method: 'post',
    data: {
      params,
    },
  })
}

export function authLogout(token) {
  return request({
    url: 'ISLG01/authLogout',
    method: 'post',
    data: {
      token,
    },
  })
}

export function mobileLoginApi(mobile, smsCode) {
  return request({
    url: '/ISLG01/mobileLogin',
    method: 'post',
    data: {
      mobile,
      smsCode,
    },
  })
}

export function pwdLoginApi(username, p_username, p_password) {
  return request({
    url: '/ISLG01/pwdLogin',
    method: 'post',
    data: {
      username,
      p_username,
      p_password,
    },
  })
}

export function smsCodeApi(mobile) {
  return request({
    url: '/ISLG01/getSmsCode',
    method: 'post',
    data: { mobile },
  })
}

export function rsaKeyApi() {
  return request({
    url: '/ISLG01/getRsaKey',
    method: 'post',
    data: {},
  })
}

export function login(data) {
  return request({
    url: '/paas/user/login',
    method: 'post',
    data,
  })
}

export function getInfo(token) {
  return request({
    url: '/paas/user/info',
    method: 'get',
    params: { token },
  })
}

export function logout() {
  return request({
    url: '/paas/user/logout',
    method: 'post',
  })
}
