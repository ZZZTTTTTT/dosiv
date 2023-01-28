<template>
  <div>
    <div class="subtitledisplay">异常设备</div>
    <div style="display: flex">
      <div style="align-self: center; font-weight: bold; color: #3cd2a5; width: 100%; font-size: 6rem; text-align: center; line-height: 1.2">
        {{ AbnormalDevicetotalAmount }}
      </div>
      <dv-active-ring-chart :config="ProductlineAbnormalConfig" style="width: 100%; height: 300px" :key="key" />
    </div>
    <!--<div class="legend" style="display: flex; flex-direction: column">
      <div class="legend-item-1">{{ ProductlineAbnormalConfig.data && ProductlineAbnormalConfig.data[0].name }}</div>
      <div class="legend-item-2">{{ ProductlineAbnormalConfig.data && ProductlineAbnormalConfig.data[1].name }}</div>
      <div class="legend-item-3">{{ ProductlineAbnormalConfig.data && ProductlineAbnormalConfig.data[2].name }}</div>
    </div>-->
  </div>
</template>

<script>
import { basemix } from '@/mixin/base'
export default {
  props: ['ProductlineAbnormalConfig', 'AbnormalDevicetotalAmount'],
  data() {
    return {
      key: 1,
    }
  },
  mixins: [basemix],
  mounted() {
    this.pieOutlineFunc()
  },
}
</script>

<style></style>
