<template>
  <div class="h-100 w-100 d-flex jc-center ai-center">
    <Echart
      :key="$store.state.app.resizeFlagT"
      v-if="options && options.series"
      :options="options"
      :handleClick="handleClick"
      id="single-line"
      height="100%"
      width="100%"
    ></Echart>
    <div v-else class="no-data d-flex flex-column ai-center">
      <!-- <div class="no-data-img"></div> -->
      暂无数据
    </div>
  </div>
</template>

<script>
import Echart from './common-echart/common-echart.vue'
export default {
  data: function () {
    return {}
  },

  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    handleClick: {
      type: Function,
    },
  },

  components: {
    Echart,
  },
}
</script>

<style lang="scss">
.no-data {
  color: #999;
  letter-spacing: 2px;
  .no-data-img {
    width: 70px;
    height: 70px;
    background-image: url(./images/noData.png);
    position: absolute;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    position: relative;
    margin-bottom: 6px;
    opacity: 0.5;
  }
}
</style>
