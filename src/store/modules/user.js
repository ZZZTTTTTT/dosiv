import { logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  // themeStyle: 'theme-dark',
  themeStyle: '',
}

const userList = ['baowu_bj', 'baowu_robot', 'baowu_steel', 'baowu_admin']

const tokens = {
  baowu_bj: {
    token: 'baowu_bj-token',
  },
  baowu_robot: {
    token: 'baowu_robot-token',
  },
  baowu_admin: {
    token: 'baowu_admin-token',
  },
  baowu_steel: {
    token: 'baowu_steel-token',
  },
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_THEME: (state, themeStyle) => {
    state.themeStyle = themeStyle
  },
}

const actions = {
  // set user role
  setRoles({ commit }, roles) {
    return new Promise((resolve, reject) => {
      commit('SET_ROLES', roles)
      resolve()
    })
  },

  // user login
  login({ commit }, userInfo) {
    const { username } = userInfo
    return new Promise((resolve, reject) => {
      if (userList.indexOf(username) !== -1) {
        const token = tokens[username].token
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      } else {
        reject()
      }
    })
  },
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password })
  //       .then((response) => {
  //         const { data } = response
  //         commit('SET_TOKEN', data.token)
  //         setToken(data.token)
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const users = {
        'admin-token': {
          roles: ['admin'],
          introduction: 'I am a super administrator',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: 'Super Admin',
        },
        'editor-token': {
          roles: ['editor'],
          introduction: 'I am an editor',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: 'Normal Editor',
        },
        'baowu_bj-token': {
          roles: ['baowu_bj', 'bigscreen', 'diagnose'],
          introduction: '我是报警管理员',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: '报警管理员',
        },
        'baowu_robot-token': {
          roles: ['baowu_robot'],
          introduction: '我是多角色操作员',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: '多角色操作员',
        },
        'baowu_admin-token': {
          roles: ['baowu_admin'],
          introduction: '我是管理员',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: '管理员',
        },
        'baowu_steel-token': {
          roles: ['baowu_steel'],
          introduction: '我是后台管理员',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: '后台管理员',
        },
      }
      const data = users[state.token]
      const { roles, name, avatar, introduction, themeStyle } = data
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }
      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      commit('SET_THEME', themeStyle || state.themeStyle)
      resolve(data)
    })
  },
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token)
  //       .then((response) => {
  //         const { data } = response

  //         if (!data) {
  //           reject('Verification failed, please Login again.')
  //         }

  //         const { roles, name, avatar, introduction, themeStyle } = data

  //         // roles must be a non-empty array
  //         if (!roles || roles.length <= 0) {
  //           reject('getInfo: roles must be a non-null array!')
  //         }

  //         commit('SET_ROLES', roles)
  //         commit('SET_NAME', name)
  //         commit('SET_AVATAR', avatar)
  //         commit('SET_INTRODUCTION', introduction)
  //         commit('SET_THEME', themeStyle || state.themeStyle)
  //         resolve(data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  changeTheme({ commit }, val) {
    commit('SET_THEME', val)
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
