<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" @mouseout="out" />
</template>

<script>
import tdTheme from './theme.json' // 引入默认主题
import echartMixins from '../utils/resizeMixins'

export default {
  name: 'echart',
  mixins: [echartMixins],
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    id: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '2.5rem',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    handleClick: Function,
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    options: {
      handler(options) {
        // 设置true清空echart缓存
        this.chart.setOption(options, true)
      },
      deep: true,
    },
  },
  mounted() {
    this.$echarts.registerTheme('tdTheme', tdTheme) // 覆盖默认主题
    this.initChart()
    // console.log('22', this.options)
  },
  methods: {
    initChart() {
      // 初始化echart
      this.chart = this.$echarts.init(this.$el, 'tdTheme')
      this.chart.setOption(this.options, true)

      this.chart.on('click', (params) => {
        if (this.handleClick) {
          this.handleClick(params)
        }
      })
    },

    out() {
      this.chart &&
        this.chart.dispatchAction({
          type: 'hideTip',
        })
    },
  },
}
</script>

<style></style>
