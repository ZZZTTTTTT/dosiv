// const tokens = {
//   admin: {
//     token: 'admin-token'
//   },
//   editor: {
//     token: 'editor-token'
//   }
// }

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
    roles: ['baowu_bj', 'workbench', 'diagnose'],
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

module.exports = [
  // user login
  {
    url: '/paas/user/login',
    type: 'post',
    response: (config) => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.',
        }
      }

      return {
        code: 20000,
        data: token,
      }
    },
  },

  // get user info
  {
    url: '/paas/user/info.*',
    type: 'get',
    response: (config) => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.',
        }
      }

      return {
        code: 20000,
        data: info,
      }
    },
  },

  // user logout
  {
    url: '/paas/user/logout',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success',
      }
    },
  },
]
