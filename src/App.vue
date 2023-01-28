<template>
  <div id="app" :class="{ 'theme-dark-app': themeStyle, 'theme-light-app': !themeStyle }">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { setRem } from '@/utils/rem'

export default {
  name: 'App',
  computed: {
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  methods: {
    respResize: debounce(function () {
      let _t = new Date().getTime()
      this.$store.commit('app/SET_RESIZE_FLAG_T', _t)
    }, 100),
  },

  created() {
    /** 绑定 resize 事件 */
    window.onresize = () => {
      this.respResize()
      setRem()
    }
  },
}
</script>
<style lang="scss">
#app {
  overflow: auto;
}
</style>
