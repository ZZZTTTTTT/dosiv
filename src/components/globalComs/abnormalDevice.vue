<template>
  <!--
  <corner-border>
    <div style="display: flex; align-items: center; flex-direction: column">
      <span style="width: 100%; font-size: 17px; margin: 10px; margin-left: 20px">异常设备</span>

      <div class="total">
        {{ AbnormalDevicetotalAmount }}
      </div>
      <div id="abnormalDeviceChart" style="width: 100%; height: 200px" />
    </div>
  </corner-border>-->
  <BorderWrap style="height: 100%; margin: 0px">
    <div style="display: flex; align-items: center; box-sizing: border-box">
      <div class="subtitledisplay">异常设备</div>
    </div>
    <div style="display: flex">
      <div id="abnormalDeviceChart" />
      <div style="margin-right: 0.7rem">
        <div class="num-display">{{ AbnormalDevicetotalAmount }}</div>
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
  props: ['AbnormalDevicetotalAmount'],
}
</script>

<style scoped>
/*.total {
  font-weight: bold;
  color: #eb810f;
  width: 100%;
  font-size: 35px;

  line-height: 1.2;
  margin-left: 20px;
}*/

#abnormalDeviceChart {
  width: 80%;
  height: 150px;
}
.legend {
  white-space: nowrap;
}
</style>
