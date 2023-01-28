<template>
  <div id="kpi-content" class="d-flex flex-column ai-center jc-center">
    <div class="kpi-bg"></div>
    <div class="d-flex flex-column ai-center jc-center">
      <div class="kpi-value smaller" v-if="data && (data + '').length > 5">
        {{ data }}
      </div>
      <div class="kpi-value" v-else>{{ data || '--' }}</div>
      <div class="label">总数量</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: [Number, String],
      default: '',
    },
  },
  data: function () {
    return {}
  },

  components: {},

  mounted() {},
}
</script>

<style lang="scss" scoped>
#kpi-content {
  margin-top: -5%;
  height: calc(100% - 38px);
  position: relative;
  font-weight: 500;
  .kpi-bg {
    position: absolute;
    top: 5px;
    width: 100%;
    height: 100%;
    background-image: url(./images/img_kpi.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  .kpi-value {
    margin-top: 60%;
    font-size: 25px;
    line-height: 50px;
  }
  .kpi-value.smaller {
    font-size: 18px;
  }
  .label {
    margin-top: 0px;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 2px;
  }
}
</style>
