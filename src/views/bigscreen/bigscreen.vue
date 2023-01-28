<template>
  <div id="index" class="h-100">
    <div class="bg" :key="$route.params.id">
      <head-title></head-title>
      <breadcrumb></breadcrumb>
      <div class="content">
        <left-content style="width: 27%" />
        <center-content mode="base" style="width: 46%" />
        <right-content style="width: 27%" />
      </div>
    </div>
  </div>
</template>

<script>
import headTitle from './headTitle.vue'
import leftContent from './leftContent.vue'
import centerContent from './centerContent.vue'
import rightContent from './rightContent.vue'
import { findRootDomain } from '@/api/device'
import breadcrumb from './breadcrumb.vue'

export default {
  data: function () {
    return {
      // hackReset: true,
      // timer: null,
      // nodeId: 0,
    }
  },
  beforeMount() {
    // console.log('bigscreen.vue beforeMount')
  },
  watch: {
    $route() {
      // console.log('watch, bigscreen, this.$route.params.nodeId change', this.$route.params.nodeId)
      if (this.$route.params.nodeId == ':nodeId') {
        findRootDomain().then((res) => {
          let rootDomainId = 0
          try {
            rootDomainId = res.data.result.id
          } catch (e) {
            rootDomainId = 0
          }
          this.$router.push('/bigscreen/' + rootDomainId)
        })
      }
    },
  },
  mounted() {
    // console.log('bigscreen.vue mounted')
    // console.log(this.$route.params.nodeId);
    let nodeId = this.$route.params.nodeId
    if (!nodeId || nodeId == ':nodeId') {
      findRootDomain().then((res) => {
        console.log("findRootDomain",res);
        let rootDomainId = 0
        try {
          rootDomainId = res.data.result.id
        } catch (e) {
          rootDomainId = 0
        }
        this.$router.push('/bigscreen/' + rootDomainId)
      })
    } else {
      this.$router.push('/bigscreen/' + nodeId)
    }
  },
  methods: {
    // setRefresh: function () {
    //   this.timer = setInterval(() => {
    //     this.init()
    //     this.hackReset = false
    //     this.$nextTick(() => {
    //       this.hackReset = !this.hackReset
    //     })
    //   }, this.$interval)
    // },
    // init: function () {
    //   if (!this.$store.state.currentDomainId) {
    //     this.$store.commit('setCurrentDomain', this.$route.params.id)
    //   }
    // },
  },
  components: {
    headTitle,
    leftContent,
    centerContent,
    rightContent,
    breadcrumb
  },
}
</script>
<style lang="scss" scoped>
@import './scss/index.scss';
#index {
  position: absolute;
  height: 100%;
  .bg {
    height: 100%;
    overflow: hidden;
    position: relative;
    background-image: url('./images/pageBg.png');
    .content {
      height: calc(100% - 95px);
      display: flex;
      align-items: stretch;
      padding: 0 12px 16px;
    }
  }
}
</style>
