<template>
  <div>
    <div class="subtitledisplay">告警设备</div>
    <div style="display: flex; align-items: center">
      <div style="font-weight: bold; color: #3cd2a5; width: 100%; font-size: 6rem; text-align: center; line-height: 1.2">
        {{ AlertDevicetotalAmount }}
      </div>
      <dv-active-ring-chart :config="ProductlineAlarmConfig" style="width: 80%; height: 300px" :key="key" />
    </div>
    <!--<div class="legend" style="display: flex; flex-direction: column">
      <div class="legend-item-1">{{ ProductlineAlarmConfig.data && ProductlineAlarmConfig.data[0].name }}</div>
      <div class="legend-item-2">{{ ProductlineAlarmConfig.data && ProductlineAlarmConfig.data[1].name }}</div>
      <div class="legend-item-3">{{ ProductlineAlarmConfig.data && ProductlineAlarmConfig.data[2].name }}</div>
    </div>-->
  </div>
</template>

<script>
import { basemix } from '@/mixin/base'
export default {
  props: ['ProductlineAlarmConfig', 'AlertDevicetotalAmount'],
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

<style scoped></style>
