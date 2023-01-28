<template>
  <div class="wrap-container">
    <el-row class="wrap-top">
      <device-bread-crum></device-bread-crum>
    </el-row>
    <div
      class="wrap-inner"
      v-if="
        this.currentLevel == 'company' ||
        this.currentLevel == '公司' ||
        this.currentLevel == 'base' ||
        this.currentLevel == '基地' ||
        this.currentLevel == 'factory' ||
        this.currentLevel == '厂部' ||
        this.currentLevel == 'productLine' ||
        this.currentLevel == '产线'
      "
    >
      <base-view></base-view>
    </div>
    <!--
    <div v-else-if="this.currentLevel == '厂部'">
      <factory-view></factory-view>
    </div>
    <div v-else-if="this.currentLevel == '产线'">
      <product-line-view></product-line-view>
    </div>-->
    <div v-if="this.currentLevel == 'area' || this.currentLevel == '区域'">
      <area-view></area-view>
    </div>
    <div v-else-if="this.currentLevel == 'device' || this.currentLevel == '设备'">
      <device-view></device-view>
    </div>
    <div v-else>
      <!-- <default-view></default-view> -->
    </div>
  </div>
</template>

<script>
import BaseView from '@/views/base'
import FactoryView from '@/views/factory'
import ProductLineView from '@/views/productline'
import AreaView from '@/views/area'
import DeviceView from '@/views/device'
import DeviceBreadCrum from '@/components/Breadcrumb'
import DefaultView from '@/views/default'
import { getCurrentNodeLevel } from '@/utils/auth'

import { mapState } from 'vuex'

export default {
  // data() {
  //   return {
  //     currentLevel: '',
  //   }
  // },
  watch: {
    currentLevel: {
      handler(newVal, oldVal) {
        // console.log(`currentLevel changed, oldVal: ${oldVal}, newVal: ${newVal}`)
      },
    },
  },
  components: {
    BaseView,
    FactoryView,
    ProductLineView,
    AreaView,
    DeviceView,
    DeviceBreadCrum,
    DefaultView,
  },
  // methods: {
  //   ...mapMutations('app', {
  //     setConfigNodeId: 'SET_CONFIG_NODE_ID',
  //     setConfigNodeLevel: 'SET_CONFIG_NODE_LEVEL',
  //     setLastClickStamp: 'SET_LAST_CLICK_STAMP',
  //     setActiveTab: 'SET_ACTIVE_TAB',
  //   }),
  // },
  computed: {
    ...mapState('app', ['currentLevel']),
  },
  // mounted() {
  //   const origin = getOrigin()
  //   if (origin == 'dds') {
  //     console.log('real发现从dds跳转过来')
  //     const diagnoseDeviceCode = getDiagnoseDeviceCode()
  //     const menu = getMenu()
  //     this.setConfigNodeId(diagnoseDeviceCode)
  //     this.setConfigNodeLevel('设备')
  //     this.setActiveTab(menu)
  //     removeOrigin()
  //     removeDiagnoseDeviceCode()
  //     removeMenu()
  //     this.setLastClickStamp(Date.now())
  //   }
  // },
  // mounted() {
  //   this.currentLevel = getCurrentNodeLevel()
  //   console.log('real index mounted, currentLevel', this.currentLevel)
  // },
}
</script>

<style scoped>
.wrap-container {
  height: 100%;
  padding: 0 10px;
}
.wrap-top {
  height: 2%;
}

.wrap-inner {
  height: 98%;
}
</style>
