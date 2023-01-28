<template>
  <BorderWrap style="height: 100%; width: 100%; margin: 0">
    <el-row
      ><div class="subtitledisplay"><slot></slot></div
    ></el-row>
    <el-row>
      <div class="ringchart">
        <!-- <div class="echarts" ref="topPie" style="margin: 0 auto"></div> -->
        <Echart :options="optionPie" @getInstance="setInstance" @updateConfig="changeTheme" @fontResize="fontResize"></Echart>
      </div>
    </el-row>
  </BorderWrap>
</template>

<script>
import Echart from './echart.vue'
import store from '@/store'
export default {
  data() {
    return {
      echartsPie: '',
      optionPie: null,
    }
  },
  components: { Echart },
  computed: {
    remRatio() {
      return this.$store.state.app.remRatio
    },
  },
  watch: {
    dvechartData(newVal, oldVal) {
      if (!newVal || newVal.length == 0) return {}
      this.optionPie = {
        legend: {
          show: false,
        },
        color: ['#6ECEB2', '#1E4643', '#2A7665'],
        series: [
          {
            type: 'pie',
            radius: ['70%', '85%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            // 标签
            label: {
              normal: {
                show: false,
                position: 'center',
              },
              emphasis: {
                show: true,
                // 自定义标签
                formatter: ['{num|{d}' + '%}', '{bt|{b}}'].join('\n'),
                rich: {
                  num: {
                    fontSize: 20,
                    lineHeight: 40,
                  },
                  bt: {
                    fontSize: 20,
                  },
                },
              },
            },
            // 视觉引导线隐藏
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: newVal,
          },
        ],
      }
      this.bindEvents()
    },
  },
  props: ['dvechartData'],
  mounted() {},
  methods: {
    // 饼状图实现循环高亮
    pieActive() {
      let index = -1 //高亮所在下标

      let dataLength = this.optionPie.series[0].data.length // 当前饼图有多少个扇形
      if (this.mTime) {
        clearInterval(this.mTime)
      }
      // 用定时器控制饼图高亮
      this.mTime = setInterval(() => {
        // 清除之前的高亮
        this.echartsPie.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: index,
        })
        index = (index + 1) % dataLength
        // 当前下标高亮
        this.echartsPie.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: index,
        })
        if (index > dataLength) {
          index = 0
        }
      }, 2000)
      // 鼠标划入
      this.echartsPie.on('mouseover', () => {
        // 停止定时器，清除之前的高亮
        clearInterval(this.mTime)
        this.echartsPie.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: index,
        })
      })
    },
    bindEvents() {
      this.pieActive()
      // 鼠标划出
      this.echartsPie.on('mouseout', () => {
        this.pieActive()
      })
    },
    setInstance(d) {
      this.echartsPie = d
    },
    fontResize() {
      if (!this.optionPie) return

      this.optionPie.series[0].label.emphasis.rich = {
        num: {
          fontSize: 20 * this.remRatio || 20,
          lineHeight: 40 * this.remRatio || 40,
        },
        bt: {
          fontSize: 20 * this.remRatio || 20,
        },
      }
      this.optionPie = { ...this.optionPie }
    },
    changeTheme() {
      this.optionPie.series[0].label.emphasis.color = store.state.user.themeStyle ? '#fff' : '#000'
      this.optionPie = { ...this.optionPie }
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
