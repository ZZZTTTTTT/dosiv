<template>
  <div style="display: flex; width: 100%">
    <dv-border-box-7>
      <div class="titledisplay">翘扣头</div>
      <div style="display: flex; justify-content: space-between; margin: 20px">
        <div>
          <div>道次号</div>
          <div class="numdisplay">{{ detailObj.channelNo }}</div>
        </div>
        <div>
          <div>翘扣量</div>
          <div class="numdisplay">{{ detailObj.amount }}</div>
        </div>
      </div>
      <div style="margin: 20px">
        <div>带钢号</div>
        <div class="numdisplay">{{ detailObj.steelNo }}</div>
      </div>
    </dv-border-box-7>
    <dv-border-box-7>
      <div class="titledisplay">加热炉温度</div>
      <div style="display: flex; justify-content: space-between; margin: 20px">
        <div v-for="(item, index) in detailObj.HeatingFurnace" :key="index">
          <div>{{ item.furnaceNo }}号温室</div>
          <div class="numdisplay">{{ item.temperature }}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 20px">
        <div>
          <div>3号温度</div>
          <div class="numdisplay">2000</div>
        </div>
        <div>
          <div>4号温度</div>
          <div class="numdisplay">2000</div>
        </div>
      </div>
    </dv-border-box-7>
    <dv-border-box-7>
      <div class="titledisplay">扭矩</div>
      <div style="display: flex; justify-content: space-between; margin: 20px">
        <div>
          <div>上电机负载扭矩</div>
          <div class="numdisplay">{{ detailObj.upTorque }}</div>
        </div>
        <div>
          <div>下电机负载扭矩</div>
          <div class="numdisplay">{{ detailObj.downTorque }}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 20px">
        <div>
          <div>轧制力</div>
          <div class="numdisplay">{{ detailObj.rollForce }}</div>
        </div>
        <div>
          <div>带钢速度</div>
          <div class="numdisplay">{{ detailObj.steelSpeed }}</div>
        </div>
      </div>
    </dv-border-box-7>
  </div>
</template>

<script>
export default {
  props: ['detailObj'],
}
</script>

<style></style>
