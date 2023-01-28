import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken, getRoles, setRoles, setUserId, setUsername } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { authLogin } from '@/api/user'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)
  const token = getToken()
  const roles = getRoles()
  if (token && roles) {
    const roleArr = JSON.parse(roles)
    let accessRoutes
    store.dispatch('permission/generateRoutes', roleArr).then((res) => {
      accessRoutes = res
      router.addRoutes(accessRoutes)
      next()
      NProgress.done()
    })
  } else {
    const search = window.location.search
    if (search.indexOf('?code=') !== 0) {
      // 未获取code，需要通过安全中心验证
      window.location.href = process.env.VUE_APP_AUTH_URL
    } else {
      const code = search.replace('?code=', '')
      authLogin(code).then((res) => {
        if (res.status !== 200) {
          window.location.href = process.env.VUE_APP_AUTH_URL
        } else {
          const result = res.data.result
          setToken(result.data.token)
          setUserId(result.data.userId)
          setUsername(result.data.userName)
          setRoles(result.data.roles)
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

router.afterEach(() => {
  NProgress.done()
})
