<template>
  <div id="left-chart-device-content" style="height: 46%">
    <dTitle :title="'设备总接入数(月)'" :width="'200px'" />
    <div style="height: calc(100% - 40px)">
      <d-echart :options="options"></d-echart>
    </div>
  </div>
</template>

<script>
import dEchart from './echart'
import dTitle from './title'
export default {
  props: {
    deviceNumList: {
      type: Array,
      default: () => [],
    },
  },
  data: function () {
    return {}
  },

  components: {
    dEchart,
    dTitle,
  },

  computed: {
    options() {
      if (!this.deviceNumList || !this.deviceNumList.length) return null
      let result = JSON.parse(JSON.stringify(this.deviceNumList))
      result.sort((pointA, pointB) => {
        return new Date(pointA['DATE']).getTime() - new Date(pointB['DATE']).getTime()
      })
      let date = result.map((el) => el['month']) // 横轴
      let data = result.map((el) => el['deviceCount'])
      // let data = result.map((el) => el['DEVICE_QUANTITY'])
      let max = Math.ceil(Math.max(...data) / 100) * 100 + 1
      let minInterval = 1
      /**
       * 百万设备目标
       */
      if (max > 5000000) {
        minInterval = Math.ceil(max / 5 / 1000000) * 1000000
      } else if (max >= 500000 && max < 5000000) {
        minInterval = Math.ceil(max / 5 / 100000) * 1000000
      } else if (max >= 50000 && max < 500000) {
        minInterval = Math.ceil(max / 5 / 10000) * 10000
      } else if (max >= 5000 && max < 50000) {
        minInterval = Math.ceil(max / 5 / 1000) * 1000
      } else if (max >= 500 && max < 5000) {
        minInterval = Math.ceil(max / 5 / 100) * 100
      } else if (max >= 50 && max < 500) {
        minInterval = Math.ceil(max / 5 / 10) * 10
      }

      let defaultOptions = {
        grid: {
          containLabel: true,
          left: 15,
          top: 10,
          right: 35,
          bottom: 0,
          tooltip: {
            trigger: 'axis',
          },
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (data) {
            return data[0].name + '<br />' + Math.round(data[0].value)
          },
          textStyle: {
            color: this.$axisLabelColor,
            fontSize: 12,
          },
          backgroundColor: '#434343B3',
          extraCssText: 'border:none;box-shadow: 0 0 11px #6096FFB3;',
          axisPointer: {
            lineStyle: {
              color: '#1968FF55',
            },
          },
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: true,
            length: 5,
            lineStyle: {
              color: this.$axisLabelColor,
            },
          },
          axisLabel: {
            margin: 10,
            color: this.$axisLabelColor,
          },
          data: date,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisLabel: {
            align: 'right',
            color: this.$axisLabelColor,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: this.$axisSplitLineColor,
            },
          },
          minInterval: minInterval,
          type: 'value',
          splitNumber: 5,
          maxInterval: max,
        },
        series: [
          {
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbolSize: 3,
            sampling: 'average',
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#3DE6FF',
                  },
                  {
                    offset: 1,
                    color: '#1968FF',
                  },
                ],
              },
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#36A1FF99',
                },
                {
                  offset: 1,
                  color: '#1968FF00',
                },
              ]),
            },
            data: data,
          },
        ],
      }
      return defaultOptions
    },
  },
}
</script>

<style lang="scss" scoped></style>
