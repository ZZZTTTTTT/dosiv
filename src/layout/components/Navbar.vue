<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="fullscreen-container">
      <!-- <i style="font-size: 35px" class="el-icon-full-screen" /> -->
      <!-- <span class="fullscreen-name">E3</span> -->
      <span style="font-size: 15px; font-weight: bold">设备远程运维平台</span>
    </div>
    <div class="right-menu">
      <ThemeSwitch @change="themeChange"></ThemeSwitch>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">{{ username }}</div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <span style="display: block" @click="authLogoutApi">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'

import ThemeSwitch from './ThemeSwitch.vue'

import { getToken, removeToken, removeUserId, removeRoles, getUsername, removeUsername, getCurrentEnv } from '@/utils/auth'
// import { authLogout } from '@/api/user'
import { getUserInfo } from '@/api/user'

export default {
  data() {
    return {
      username: '',
    }
  },

  components: {
    // Breadcrumb,
    Hamburger,
    ThemeSwitch,
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar']),
    // ...mapState('app', ['username']),
    themeStyle: {
      get() {
        return this.$store.state.user.themeStyle === 'theme-dark'
      },
      set(val) {
        this.$store.dispatch('user/changeTheme', val ? 'theme-dark' : 'theme-light')
      },
    },
  },
  methods: {
    themeChange(val) {
      this.$store.commit('user/SET_THEME', val)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // TODO
    authLogoutApi() {
      let currentEnv = getCurrentEnv()
      if (currentEnv == 'eplattest') {
        // eplattest
        const token = getToken()
        removeUserId()
        removeToken()
        removeRoles()
        removeUsername()
        let url = process.env.VUE_APP_AUTH_LOGOUT + token
        window.location.href = url
      } else if (currentEnv == 'local') {
        // local
        this.$router.push('/login')
      } else {
        // sso
        let uri = process.env.VUE_APP_LOGOUT_URL
        let baseUri = uri.substring(0, uri.lastIndexOf('/'))
        location.href = [baseUri, '/', 'login.jsp'].join('')
      }
    },
    // logout() {
    //   removeUserId()
    //   removeToken()
    //   removeRoles()
    //   removeUsername()
    //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    // },
  },
  mounted() {
    this.username = getUsername()
    // console.log(this.username)
    if (!this.username) {
      getUserInfo().then(({ data }) => {
        //console.log('headTitle getUserInfo, res', res)
        const { code, result } = data
        // console.log('headTitle getUserInfo, res', code, result)
        if (code == 200) {
          this.username = result.userName
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    padding: 10px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .fullscreen-container {
    margin-left: 40px;
    height: 100%;
    position: relative;
    display: inline-flex;
    align-items: center;
    .fullscreen-name {
      position: absolute;
      left: 7px;
      color: #3ac99f !important;
      font-weight: 700;
      cursor: pointer;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .theme-wrap {
      float: left;
      margin-top: 10px;
      margin-right: 10px;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      // color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      float: right;
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
