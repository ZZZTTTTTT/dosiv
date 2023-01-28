<template>
  <BorderWrap style="height: 100%; margin: 0px">
    <div style="display: flex; align-items: center; box-sizing: border-box">
      <div class="subtitledisplay">告警设备</div>
    </div>
    <div style="display: flex">
      <div id="alarmDeviceChart" />
      <div style="margin-right: 0.7rem">
        <div class="num-display">{{ AlertDevicetotalAmount }}</div>
        <div class="legend">
          <div class="legend-item-1">注意</div>
          <div class="legend-item-2" style="margin-top: 10px">警告</div>
          <div class="legend-item-3" style="margin-top: 10px">危险</div>
        </div>
      </div>
    </div>
  </BorderWrap>
</template>

<script>
export default {
  props: ['AlertDevicetotalAmount'],
}
</script>

<style scoped>
#alarmDeviceChart {
  width: 80%;
  height: 150px;
}
.legend {
  white-space: nowrap;
}
</style>
