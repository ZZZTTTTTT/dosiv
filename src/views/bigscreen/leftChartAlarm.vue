<template>
  <div id="left-chart-alarm-content" style="height: 46%">
    <dTitle :title="'每日告警数'" :width="'150px'" />
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
    alarmNumList: {
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
      if (!this.alarmNumList || !this.alarmNumList.length) return null
      let result = JSON.parse(JSON.stringify(this.alarmNumList))
      result.sort((pointA, pointB) => {
        return new Date(pointA['DATE']).getTime() - new Date(pointB['DATE']).getTime()
      })

      // let date = result.map((el) => el['DATE']) // 横轴
      // let data = result.map((el) => el['ALERT_QUANTITY'])
      let date = result.map((el) => el['date']) // 横轴
      let data = result.map((el) => el['count'])
      let max = Math.ceil(Math.max(...data) / 100) * 100 + 1
      let minInterval = Math.ceil(max / 5 / 100) * 100

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
          borderColor: 'red',
          backgroundColor: '#434343B3',
          extraCssText: 'border:none;box-shadow: 0 0 11px #1BCF9AFF;',
          axisPointer: {
            lineStyle: {
              color: '#7547FF55',
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
                    color: '#46E081',
                  },
                  {
                    offset: 1,
                    color: '#0DFFB7',
                  },
                ],
              },
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#47FF9069',
                },
                {
                  offset: 1,
                  color: '#74A8FF00',
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

<style lang="scss" scoped>
#left-chart-alarm-content {
}
</style>
