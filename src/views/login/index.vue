<template>
  <div class="login-container">
    <header-bar />
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      <div style="display: flex; color: #eee; justify-content: space-around; margin: 20px">
        <div :class="{ active: show == 0 }" style="cursor: pointer" @click="show = 0">密码登录</div>
        <div :class="{ active: show == 1 }" style="cursor: pointer" @click="show = 1">短信登录</div>
      </div>
      <div v-show="show == 0">
        <div class="loginbody">宝武通行证/手机号：</div>

        <el-form-item prop="username">
          <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>

        <div class="loginbody">密码：</div>
        <div class="reset-input">
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
            />
          </el-form-item>
        </div>
      </div>

      <div v-show="show == 1">
        <div class="loginbody">手机号：</div>
        <el-form-item prop="mobile">
          <el-input ref="mobile" v-model="loginForm.mobile" placeholder="手机号码" name="mobile" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <div class="loginbody">验证码：</div>
        <div style="display: flex; width: 100%">
          <el-form-item prop="smsCode" style="flex: auto; margin-right: 1px">
            <el-input
              :key="passwordType"
              ref="verification"
              v-model="loginForm.smsCode"
              placeholder="手机验证码"
              name="smsCode"
              tabindex="2"
              auto-complete="on"
            />
          </el-form-item>
          <el-button class="verification" style="cursor: pointer" @click.native.prevent="getSmsCode">获取验证码</el-button>
        </div>
      </div>
      <!-- <el-button
        :loading="loading"
        style="width: 100%; margin-bottom: 30px; border: 1px solid rgb(42, 168, 118); background: rgba(0, 0, 0, 0.1); color: rgb(42, 168, 118)"
        @click.native.prevent="handleLogin"
        >登录</el-button
      > -->
      <el-button
        :loading="loading"
        style="width: 100%; margin-bottom: 30px; border: 1px solid rgb(42, 168, 118); background: rgba(0, 0, 0, 0.1); color: rgb(42, 168, 118)"
        @click.native.prevent="mockLogin"
        >登录</el-button
      >

      <div class="tips">
        <div style="display: flex">
          <input id="inputId" type="checkbox" /><label for="inputId" /><span style="margin-left: 5px"
            >同意<span class="tip" style="cursor: pointer" @click="showPolicy">宝武智维隐私政策</span></span
          >
        </div>
        <div style="display: none">
          <span class="tip" style="margin-right: 5px">忘记密码</span>|<span class="tip" style="margin-left: 5px">快速注册</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { mapMutations } from 'vuex'
import headerBar from '@/components/globalComs/headerBar.vue'

import JSEncrypt from 'jsencrypt'
import { setToken, setUserId, setRoles } from '@/utils/auth'
import { smsCodeApi, mobileLoginApi, pwdLoginApi, rsaKeyApi } from '@/api/user'

export default {
  name: 'Login',
  components: { headerBar },
  data() {
    /*
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }*/
    return {
      loginForm: {
        // username: '',
        // password: '',
        mobile: '',
        smsCode: '',
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      show: 0,
      rsaKey: '',
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  mounted() {
    this.getRsaKey()
  },
  methods: {
    ...mapMutations('app', { setUsername: 'SET_USERNAME' }),
    setUserData(userId, token, roles) {
      setUserId(userId)
      setToken(token)
      setRoles(roles)
    },
    getSmsCode() {
      const mobile = this.loginForm.mobile.trim()
      // let url = 'http://localhost:8080/service/ISLG01/getSmsCode'
      // let params = {
      //   mobile,
      // }
      smsCodeApi(mobile).then((res) => {
        // axios.post(url, params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('获取验证码失败，请重试')
        }
        const { data } = res
        const { result } = data
        if (result.code !== '1') {
          return this.$message.error('获取验证码失败，请重试')
        }
        this.$message.success('验证码已发送至手机，请输入验证码登录')
      })
    },
    mockLogin() {
      const userId = this.loginForm.username.trim()
      const token = 'mock-token'
      const roles = ['diagnose']
      this.$message.success('登录成功')
      this.setUserData(userId, token, roles)
      this.setUsername(userId)
      this.$router.push({ path: this.redirect || '/' })
      this.loading = false
    },
    mobileLogin() {
      const mobile = this.loginForm.mobile.trim()
      const smsCode = this.loginForm.smsCode.trim()
      // let params = {
      //   mobile,
      //   smsCode,
      // }
      // let url = 'http://localhost:8080/service/ISLG01/mobileLogin/'
      mobileLoginApi(mobile, smsCode).then((res) => {
        // axios.post(url, params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('登录失败，请重试')
        }
        const { data } = res
        const { result } = data
        if (result.code !== 1) {
          return this.$message.error('登录失败，请重试')
        }
        const { userId, token, roles } = result.data
        this.$message.success('登录成功')
        this.setUserData(userId, token, roles)
        this.setUsername(userId)
        this.$router.push({ path: this.redirect || '/' })
        this.loading = false
      })
    },
    pwdLogin() {
      const username = this.loginForm.username
      const password = this.loginForm.password
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.rsaKey)
      const p_username = encrypt.encrypt(username)
      const p_password = encrypt.encrypt(password)
      // let params = {
      //   username,
      //   p_username,
      //   p_password,
      // }
      // let url = 'http://localhost:8080/service/ISLG01/pwdLogin'
      pwdLoginApi(username, p_username, p_password).then((res) => {
        // axios.post(url, params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('登录失败，请重试')
        }
        const { data } = res
        const { result } = data
        if (result.code !== 1) {
          return this.$message.error('登录失败，请重试')
        }
        const { userId, token, roles } = result.data
        this.$message.success('登录成功')
        this.setUserData(userId, token, roles)
        this.setUsername(userId)
        this.$router.push({ path: this.redirect || '/' })
        this.loading = false
      })
    },
    getRsaKey() {
      // let rsaUrl = 'http://localhost:8080/service/ISLG01/getRsaKey'
      rsaKeyApi().then((res) => {
        // axios.post(rsaUrl, {}).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('获取RsaKey失败')
        }
        const { data } = res
        if (data.result.code !== 1) {
          return this.$message.error('获取RsaKey失败')
        }
        this.rsaKey = data.result.data.rsaKey
        // console.log('this.rsaKey:', this.rsaKey)
      })
    },
    showPolicy() {
      window.open('https://eplat.baoiem.com/eplat/privacy.html', '_blank')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if (this.show === 0) {
        // 密码登录
        this.pwdLogin()
      } else if (this.show === 1) {
        this.mobileLogin()
      }
      // let mobile = this.loginForm.username.trim()
      // let smsCode = this.loginForm.password.trim()

      // let url = 'http://localhost:8080/mobile/login/' + mobile + '/' + smsCode
      // axios.get(url).then((res) => {
      //   console.log(res)
      // })
    },
    // handleLogin() {
    //   this.$refs.loginForm.validate((valid) => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store
    //         .dispatch('user/login', this.loginForm)
    //         .then(() => {
    //           this.setUsername(this.loginForm.username)
    //           this.$router.push({ path: this.redirect || '/' })
    //           this.loading = false
    //         })
    //         .catch(() => {
    //           this.loading = false
    //         })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
  },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */

.login-container {
  background: linear-gradient(180deg, rgba(50, 70, 80, 0.8) 0, #0d101b 100%), url('~@/assets/night_bg.png') no-repeat;
  background-size: cover;

  .verification {
    width: 100px;
    height: 47px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #fff;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    transform: translate(0, 30%) scale(1.5);
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    input {
      display: none;
    }
    label {
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      cursor: pointer;
    }
    label::before {
      display: inline-block;
      content: '\2713';
      width: 12px;
      height: 4px;
      top: 0px;
      left: 2px;
      position: absolute;
      opacity: 0;
    }

    input:checked + label::before {
      opacity: 0.5;
      transform: all 0.5s;
    }

    .tip {
      color: aquamarine;
    }
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .active {
    border-bottom: 3px solid rgb(42, 168, 118);
    color: #fff;
  }

  .loginbody {
    color: #fff;
    margin-bottom: 10px;
  }

  .el-button:hover {
    background-color: rgb(42, 168, 118) !important;
    color: #fff !important;
    transition: 0.7s;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
