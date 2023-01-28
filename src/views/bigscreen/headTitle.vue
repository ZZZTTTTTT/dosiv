<template>
  <div id="head-title" style="height: 50px; padding: 6px 0 0">
    <div class="company-icon"></div>
    <div class="title-bg">
      <span class="title">远程智能运维平台</span>
    </div>

    <!--<el-button class="d-flex ai-center logout" type="primary" @click="logout()">退出</el-button> -->
    <div class="right-menu d-flex ai-center h-100 userName">
      <!-- <ThemeSwitch @change="themeChange"></ThemeSwitch> -->
      <!-- <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">{{ username }}</div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <span style="display: block" @click="authLogoutApi">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import { getToken, removeToken, removeUserId, removeRoles, getUsername, removeUsername, getCurrentEnv } from '@/utils/auth'
import { getUserInfo } from '@/api/user'

export default {
  data() {
    return {
      username: '',
    }
  },
  mounted() {
    this.username = getUsername()
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
    //console.log('this.username', this.username)
  },
  methods: {
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
  },
}
</script>

<style lang="scss" scoped>
#head-title {
  position: relative;
  //flex
  .d-flex {
    display: flex;
  }
  .userName {
    position: absolute;
    right: 2rem;
    top: -1rem;
    color: white;
  }
  .logout {
    width: 50px;
    height: 25px;
    color: #fff;
    text-align: center;
    padding: 2px;
    margin: 0;
    background: #409eff;
    border: 1px solid #409eff;
    font-size: 12px;
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .company-icon {
    height: 60px;
    width: 213px;
    position: absolute;
    top: 6px;
    left: 12px;
    background: url('./images/logo.png');
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .title-bg {
    height: 100%;
    background: url('./images/img_head.png');
    background-position: bottom center;
    background-size: contain;
    background-repeat: no-repeat;
    text-align: center;
  }
  .title {
    color: #4fdeff;
    font-weight: 500;
    font-size: 24px;
    letter-spacing: 4px;
    line-height: 28px;
    display: inline-block;
    padding-top: 6px;
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

.el-dropdown-menu {
  top: 35px !important;
}
</style>
