<template>
  <BorderWrap style="height: 100%; width: 100%; margin: 0">
    <el-row><div class="subtitledisplay">设备类型</div></el-row>
    <!--<el-row>
      <div style="margin-left: 10px; margin-top: 10px">
        <div class="legend-item-1">{{ deviceTypeConfig.data && deviceTypeConfig.data[0].name }}</div>
        <div class="legend-item-2">{{ deviceTypeConfig.data && deviceTypeConfig.data[1].name }}</div>
        <div class="legend-item-3">{{ deviceTypeConfig.data && deviceTypeConfig.data[2].name }}</div>
      </div>
    </el-row>-->
    <el-row>
      <div class="ringchart">
        <dv-active-ring-chart :config="deviceTypeConfig" style="width: 100%; height: 100%" :key="key" />
      </div>
    </el-row>
    <!-- <div class="subtitledisplay">设备类型</div> -->
    <!-- <div class="legend">
      <div class="legend-item-1">1#加热炉-2202</div>
      <div class="legend-item-2">层冷区-2209</div>
      <div class="legend-item-3">2#-层冷线-2202</div>
    </div> -->
    <!-- <div>
      <dv-active-ring-chart :config="deviceTypeConfig" style="width: 200px; height: 200px" />
    </div> -->
  </BorderWrap>
</template>

<script>
import { basemix } from '@/mixin/base'
export default {
  props: ['deviceTypeConfig'],
  mixins: [basemix],
  data() {
    return {
      key: 1,
    }
  },

  mounted() {
    this.pieOutlineFunc()
  },
  watch: {
    '$store.state.user.themeStyle'(newVal, oldVal) {
      this.$emit('updateConfig', 'deviceTypeConfig')
    },
  },
}
</script>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;
  margin-left: 20px;
}
.subtitledisplay {
  font-size: 20px;
}
</style>
