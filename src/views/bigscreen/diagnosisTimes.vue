<template>
  <div style="height: 100%">
    <d-echart :options="options"></d-echart>
  </div>
</template>

<script>
import dEchart from './echart'
import { formateX } from './utils/tool'
export default {
  props: {
    echartsData: {
      require: true,
    },
  },
  data: function () {
    return {}
  },

  components: {
    dEchart,
  },
  computed: {
    options() {
      if (!this.echartsData || !this.echartsData.x) return
      let ll = this.echartsData.x.length
      var options = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%']
          },
          formatter: function (data) {
            return data[0].name + '<br />' + data[0].value + ' 次<br />'
          },
          textStyle: {
            color: this.$axisLabelColor,
            fontSize: 12,
          },
          backgroundColor: '#434343B3',
          extraCssText: 'border:none;box-shadow: 0 0 11px #027BF7;',
          axisPointer: {
            lineStyle: {
              color: '#027BF7',
            },
          },
          padding: [3, 15, 3, 15],
        },
        grid: {
          containLabel: true,
          left: 40,
          top: 10,
          right: 30,
          bottom: 15,
          tooltip: {
            trigger: 'axis',
          },
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: true,
            length: 5,
            lineStyle: {
              color: this.$axisLabelColor,
            },
          },
          axisLabel: {
            interval: 0,
            formatter:
              (this.echartsData.x || []).length > 3
                ? function (val) {
                    return formateX(val)
                  }
                : null,
            lineHeight: 14,
            margin: 10,
            color: this.$axisLabelColor,
          },
          type: 'category',
          boundaryGap: false,
          data: this.echartsData.x || [],
        },
        yAxis: [
          {
            offset: 20,
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
            max: this.echartsData.yMax || 1,
            minInterval: 1,
            posiiton: 'left',
            type: 'value',
            boundaryGap: [0, '100%'],
          },
        ],
        series: [
          {
            barWidth: 15,
            type: 'bar',
            yAxisIndex: 0,
            symbol: 'none',
            animation: true,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#027BF7',
                },
                {
                  offset: 1,
                  color: '#027BF7',
                },
              ]),
            },
            data: this.echartsData.y1 || [],
          },
        ],
      }
      if (ll > 10) {
        options.dataZoom = [
          {
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'empty',
            minSpan: Math.min(parseInt((10 * 100) / ll), 100),
            maxSpan: Math.min(parseInt((10 * 100) / ll), 100),
            zoomLock: true,
          },
          {
            type: 'slider',
            height: 0,
            top: '90%',
            left: 40,
            right: 30,
            showDetail: false,
            handleSize: '30%',
            moveHandleSize: 6,
            moveHandleStyle: {
              opacity: 0.5,
              color: '#027BF780',
            },
          },
        ]
      }
      return options
    },
  },

  mounted() {},
}
</script>

<style lang="scss"></style>
