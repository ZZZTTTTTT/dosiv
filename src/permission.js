import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken,
  setToken,
  getRoles,
  setRoles,
  setUserId,
  setUsername,
  setRefreshToken,
  getRefreshToken,
  setLoginName,
  setUserInfo,
  getDdsUserInfo,
  // setOrigin,
  // setDiagnoseDeviceCode,
  setMenu,
  setCurrentNodeId,
  // getCurrentNodeId,
} from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import { authLogin, refreshLogin } from '@/api/user'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

function getUrlParam() {
  let url = location.search //获取url中"?"符后的字串
  let theRequest = {}
  if (url.indexOf('?') != -1) {
    let str = url.substring(1)
    let strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest
}

// console.log('window.location.href', window.location.href)

// const currentEnvList = ['local', 'eplattest', 'sso']
let currentEnv = ''
if (window.location.href.indexOf('eplattest') != -1) {
  currentEnv = 'eplattest'
} else if (window.location.href.indexOf('localhost') != -1) {
  currentEnv = 'local'
} else {
  currentEnv = 'sso'
}

// console.log('currentEnv', currentEnv)

if (currentEnv == 'local') {
  router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()

    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
      } else {
        // determine whether the user has obtained his permission roles through getInfo
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        if (hasRoles) {
          next()
        } else {
          try {
            // get user info
            // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
            // const { roles } = await store.dispatch('user/getInfo')
            const roles = getRoles()
            const roleArr = JSON.parse(roles)
            await store.dispatch('user/setRoles', roleArr)

            // generate accessible routes map based on roles
            const accessRoutes = await store.dispatch('permission/generateRoutes', roleArr)

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* has no token*/

      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })
} else if (currentEnv == 'sso') {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title)
    const hasRoles = store.getters.roles && store.getters.roles.length > 0
    if (hasRoles) {
      next()
    } else {
      if (to.path.indexOf('real/index') != -1) {
        try {
          const roleArr = ['diagnose']
          await store.dispatch('user/setRoles', roleArr)
          const accessRoutes = await store.dispatch('permission/generateRoutes', roleArr)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (e) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  })
} else if (currentEnv == 'eplattest') {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title)

    const { origin, deviceCode, menu } = getUrlParam()
    if (deviceCode) setCurrentNodeId(deviceCode)
    if (menu) setMenu(menu)

    let token = getToken()
    let roles = getRoles()
    if (!token || !roles) {
      if (origin == 'dds') {
        const ddsUserInfo = getDdsUserInfo()
        setToken(ddsUserInfo.token)
        setRefreshToken(ddsUserInfo.refreshToken)
        setUserId(ddsUserInfo.userId)
        setUsername(ddsUserInfo.userName)
        setLoginName(ddsUserInfo.loginName)
        setRoles(['diagnose'])
        setUserInfo(ddsUserInfo)
        // setOrigin(origin)
        // setDiagnoseDeviceCode(deviceCode)
        // let currentId = getCurrentNodeId()
        // if (!currentId) {
        //   setCurrentNodeId(deviceCode)
        // }
      }
    }

    token = getToken()
    roles = getRoles()
    if (token && roles) {
      const refreshToken = getRefreshToken()
      const params = {
        refreshToken,
      }
      refreshLogin(params).then((res) => {
        if (res.status !== 200 || res.data.code !== 200 || res.data.result.error_code == '-3') {
          // 未刷新成功，仍然使用原token
          const roleArr = JSON.parse(roles)
          let accessRoutes
          store.dispatch('permission/generateRoutes', roleArr).then((res) => {
            accessRoutes = res
            router.addRoutes(accessRoutes)
            next()
            NProgress.done()
          })
        } else {
          const { result } = res.data
          const newToken = result.token
          const newRefreshToken = result.refreshToken
          const newUserId = result.userId
          const newUsername = result.userName
          const newLoginName = result.loginName
          const newExpiresIn = result.expiresIn
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
          if (newLoginName == null || newLoginName == undefined || newLoginName == '') {
            // pass
          } else {
            setLoginName(newLoginName)
          }
          let userInfo = {
            token: newToken,
            refreshToken: newRefreshToken,
            loginName: newLoginName,
            userName: newUsername,
            userId: newUserId,
            expiresIn: newExpiresIn,
          }
          setUserInfo(userInfo)
          const roleArr = JSON.parse(roles)
          let accessRoutes
          store.dispatch('permission/generateRoutes', roleArr).then((res) => {
            accessRoutes = res
            router.addRoutes(accessRoutes)
            next()
            NProgress.done()
          })
          next()
          NProgress.done()
        }
      })
    } else {
      const search = window.location.search
      if (search.indexOf('?code=') !== 0 || to.fullPath === '/login') {
        // 未获取code，需要通过安全中心验证
        window.location.search = ''
        window.location.href = process.env.VUE_APP_AUTH_URL
      } else {
        const code = search.replace('?code=', '')
        authLogin(code).then((res) => {
          if (res.status !== 200 || res.data.result.code !== '1') {
            window.location.href = process.env.VUE_APP_AUTH_URL
          } else {
            const result = res.data.result
            setToken(result.data.token)
            setUserId(result.data.userId)
            setUsername(result.data.userName)
            setRoles(result.data.roles)
            setRefreshToken(result.data.refreshToken)
            setLoginName(result.data.loginName)
            let userInfo = {
              token: result.data.token,
              refreshToken: result.data.refreshToken,
              loginName: result.data.loginName,
              userName: result.data.userName,
              userId: result.data.userId,
              expiresIn: result.data.expiresIn,
            }
            setUserInfo(userInfo)
            // const accessRoutes = await store.dispatch('permission/generateRoutes', result.data.roles)
            let accessRoutes
            store.dispatch('permission/generateRoutes', result.data.roles).then((res) => {
              accessRoutes = res
              router.addRoutes(accessRoutes)
              next({ ...to, replace: true })
            })
          }
        })
      }
    }
  })
}

// if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
//   router.beforeEach(async (to, from, next) => {
//     NProgress.start()
//     document.title = getPageTitle(to.meta.title)

//     const { origin, deviceCode, menu } = getUrlParam()
//     if (deviceCode) setCurrentNodeId(deviceCode)
//     if (menu) setMenu(menu)

//     let token = getToken()
//     let roles = getRoles()
//     if (!token || !roles) {
//       if (origin == 'dds') {
//         const ddsUserInfo = getDdsUserInfo()
//         setToken(ddsUserInfo.token)
//         setRefreshToken(ddsUserInfo.refreshToken)
//         setUserId(ddsUserInfo.userId)
//         setUsername(ddsUserInfo.userName)
//         setLoginName(ddsUserInfo.loginName)
//         setRoles(['diagnose'])
//         setUserInfo(ddsUserInfo)
//         // setOrigin(origin)
//         // setDiagnoseDeviceCode(deviceCode)
//         // let currentId = getCurrentNodeId()
//         // if (!currentId) {
//         //   setCurrentNodeId(deviceCode)
//         // }
//       }
//     }

//     token = getToken()
//     roles = getRoles()
//     if (token && roles) {
//       const refreshToken = getRefreshToken()
//       const params = {
//         refreshToken,
//       }
//       refreshLogin(params).then((res) => {
//         if (res.status !== 200 || res.data.code !== 200 || res.data.result.error_code == '-3') {
//           // 未刷新成功，仍然使用原token
//           const roleArr = JSON.parse(roles)
//           let accessRoutes
//           store.dispatch('permission/generateRoutes', roleArr).then((res) => {
//             accessRoutes = res
//             router.addRoutes(accessRoutes)
//             next()
//             NProgress.done()
//           })
//         } else {
//           const { result } = res.data
//           const newToken = result.token
//           const newRefreshToken = result.refreshToken
//           const newUserId = result.userId
//           const newUsername = result.userName
//           const newLoginName = result.loginName
//           const newExpiresIn = result.expiresIn
//           if (newToken == null || newToken == undefined || newToken == '') {
//             // pass
//           } else {
//             setToken(newToken)
//           }
//           if (newRefreshToken == null || newRefreshToken == undefined || newRefreshToken == '') {
//             // pass
//           } else {
//             setRefreshToken(newRefreshToken)
//           }
//           if (newUserId == null || newUserId == undefined || newUserId == '') {
//             // pass
//           } else {
//             setUserId(newUserId)
//           }
//           if (newUsername == null || newUsername == undefined || newUsername == '') {
//             // pass
//           } else {
//             setUsername(newUsername)
//           }
//           if (newLoginName == null || newLoginName == undefined || newLoginName == '') {
//             // pass
//           } else {
//             setLoginName(newLoginName)
//           }
//           let userInfo = {
//             token: newToken,
//             refreshToken: newRefreshToken,
//             loginName: newLoginName,
//             userName: newUsername,
//             userId: newUserId,
//             expiresIn: newExpiresIn,
//           }
//           setUserInfo(userInfo)
//           // const roleArr = JSON.parse(roles)
//           // let accessRoutes
//           // store.dispatch('permission/generateRoutes', roleArr).then((res) => {
//           //   accessRoutes = res
//           //   router.addRoutes(accessRoutes)
//           //   next()
//           //   NProgress.done()
//           // })
//           next()
//           NProgress.done()
//         }
//       })
//     } else {
//       const search = window.location.search
//       if (search.indexOf('?code=') !== 0 || to.fullPath === '/login') {
//         // 未获取code，需要通过安全中心验证
//         window.location.search = ''
//         window.location.href = process.env.VUE_APP_AUTH_URL
//       } else {
//         const code = search.replace('?code=', '')
//         authLogin(code).then((res) => {
//           if (res.status !== 200 || res.data.result.code !== '1') {
//             window.location.href = process.env.VUE_APP_AUTH_URL
//           } else {
//             const result = res.data.result
//             setToken(result.data.token)
//             setUserId(result.data.userId)
//             setUsername(result.data.userName)
//             setRoles(result.data.roles)
//             setRefreshToken(result.data.refreshToken)
//             setLoginName(result.data.loginName)
//             let userInfo = {
//               token: result.data.token,
//               refreshToken: result.data.refreshToken,
//               loginName: result.data.loginName,
//               userName: result.data.userName,
//               userId: result.data.userId,
//               expiresIn: result.data.expiresIn,
//             }
//             setUserInfo(userInfo)
//             // const accessRoutes = await store.dispatch('permission/generateRoutes', result.data.roles)
//             let accessRoutes
//             store.dispatch('permission/generateRoutes', result.data.roles).then((res) => {
//               accessRoutes = res
//               router.addRoutes(accessRoutes)
//               next({ ...to, replace: true })
//             })
//           }
//         })
//       }
//     }
//   })
// } else {
//   router.beforeEach(async (to, from, next) => {
//     // start progress bar
//     NProgress.start()

//     // set page title
//     document.title = getPageTitle(to.meta.title)

//     // determine whether the user has logged in
//     const hasToken = getToken()

//     if (hasToken) {
//       if (to.path === '/login') {
//         // if is logged in, redirect to the home page
//         next({ path: '/' })
//         NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
//       } else {
//         // determine whether the user has obtained his permission roles through getInfo
//         const hasRoles = store.getters.roles && store.getters.roles.length > 0
//         if (hasRoles) {
//           next()
//         } else {
//           try {
//             // get user info
//             // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
//             // const { roles } = await store.dispatch('user/getInfo')
//             const roles = getRoles()
//             const roleArr = JSON.parse(roles)
//             await store.dispatch('user/setRoles', roleArr)

//             // generate accessible routes map based on roles
//             const accessRoutes = await store.dispatch('permission/generateRoutes', roleArr)

//             // dynamically add accessible routes
//             router.addRoutes(accessRoutes)

//             // hack method to ensure that addRoutes is complete
//             // set the replace: true, so the navigation will not leave a history record
//             next({ ...to, replace: true })
//           } catch (error) {
//             // remove token and go to login page to re-login
//             await store.dispatch('user/resetToken')
//             Message.error(error || 'Has Error')
//             next(`/login?redirect=${to.path}`)
//             NProgress.done()
//           }
//         }
//       }
//     } else {
//       /* has no token*/

//       if (whiteList.indexOf(to.path) !== -1) {
//         // in the free login whitelist, go directly
//         next()
//       } else {
//         // other pages that do not have permission to access are redirected to the login page.
//         next(`/login?redirect=${to.path}`)
//         NProgress.done()
//       }
//     }
//   })
// }

router.afterEach(() => {
  NProgress.done()
})
