<template>
  <BorderWrap class="borderwrap">
    <el-row><div class="subtitledisplay">上月诊断次数</div></el-row>
    <!--<el-row>
      <div class="legend" style="margin-left: 20px">
        <div class="legend-item-1">{{ diagnoseNumConfig.data && diagnoseNumConfig.data[0].name }}</div>
        <div class="legend-item-2">{{ diagnoseNumConfig.data && diagnoseNumConfig.data[1].name }}</div>
        <div class="legend-item-3">{{ diagnoseNumConfig.data && diagnoseNumConfig.data[2].name }}</div>
      </div>
    </el-row>-->
    <el-row>
      <div class="ringchart">
        <dv-active-ring-chart :config="diagnoseNumConfig" style="width: 100%; height: 100%" :key="key" />
      </div>
    </el-row>
    <!-- <div class="subtitledisplay" style="font-size: 20px">上月诊断次数</div> -->
    <!-- <div class="legend" style="display: flex; flex-wrap: wrap; margin-top: 20px">
      <div class="legend-item-1">1#加热炉-2202</div>
      <div class="legend-item-2">层冷区-2209</div>
      <div class="legend-item-3">2#-层冷线-2202</div>
    </div> -->
    <!-- <div>
      <dv-active-ring-chart :config="diagnoseNumConfig" style="width: 100%; height: 300px" />
    </div> -->
  </BorderWrap>
</template>

<script>
import { basemix } from '@/mixin/base'
export default {
  props: ['diagnoseNumConfig'],
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
      this.$emit('updateConfig', 'diagnoseNumConfig')
    },
  },
}
</script>

<style scoped>
.borderwrap {
  height: 100%;
  width: 100%;
  margin: 0 !important;
}
.subtitledisplay {
  font-size: 20px;
}
</style>
