<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/"
      ><el-breadcrumb-item
        style="cursor: pointer"
        v-for="(item, index) in levelList"
        :key="item.id"
        @click.native="changePage(item, index == levelList.length - 1)"
      >
        <!-- <a @click.prevent="handleLink(item)">{{ item.name }}</a> -->
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" v-show="lastItem.deviceCode" @click="collectDevice(lastItem.deviceCode)" :loading="loading">{{
      collection ? '取消收藏' : '收藏'
    }}</el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import deviceApi from '@/api/devicetree'
export default {
  data() {
    return {
      loading: false,
      collection: false,
    }
  },
  computed: {
    ...mapState('app', ['currentLevel', 'levelList']),
    lastItem() {
      return this.levelList[this.levelList.length - 1]
    },
  },
  methods: {
    // ...mapMutations('app', { setLevel: 'SET_LEVEL' }),
    handleLink(item) {
      // console.log('breadcrumb clicked', item)
      // this.setLevel(item.level)
    },
    async collectDevice(deviceCode) {
      try {
        this.loading = true
        let params = { deviceCode }
        this.collection ? await deviceApi.device.deleteFavoriteDevice({ params }) : await deviceApi.device.addFavoriteDevice({ params })
        this.$message.success('操作成功！')
        this.collection = !this.collection
        this.$store.commit('devicetree/setRefreshFlag')
        this.loading = false
      } catch (error) {
        this.loading = false
        // console.log(error)
        this.$message.error(error)
      }
    },
    changePage(item, isLast) {
      // 需求待确认
      // if (isLast) return
      // this.$store.commit('app/SET_CONFIG_NODE_ID', item.deviceCode ? item.deviceCode : item.id)
      // this.$store.commit('app/SET_CONFIG_NODE_LEVEL', item.deviceCode ? 'device' : 'domain')
      // this.$store.commit('app/SET_LAST_CLICK_STAMP', Date.now())
    },
  },
  watch: {
    levelList: {
      deep: true,
      handler(newVal) {
        let collectDeviceCodes = this.$deviceStore.state.collectList.map((item) => item.deviceCode)
        if (collectDeviceCodes && collectDeviceCodes.length > 0) {
          this.collection = newVal.some((item) => collectDeviceCodes.includes(item.deviceCode))
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  ::v-deep .el-button {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>
