<template>
  <div style="height: 100%">
    <d-echart :options="options"></d-echart>
  </div>
</template>

<script>
import dEchart from './echart'

export default {
  props: {
    echartsData: {
      require: true,
    },
  },
  data: function () {
    return {}
  },
  computed: {
    remRatio() {
      //console.log(this.$store.state.app.remRatio)
      return this.$store.state.app.remRatio
    },
    options() {
      if (!this.echartsData || !this.echartsData.length) return
      let legendData = this.echartsData.map((el) => el.name)
      var options = {
        legend: {
          orient: 'vertical',
          type: 'scroll',
          top: 40,
          right: -10,
          bottom: 20,
          itemWidth: 8,
          itemHeight: 8,
          data: legendData,
          textStyle: {
            color: this.$axisLabelColor,
            fontSize: 16 * this.remRatio + 'px',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          textStyle: {
            color: this.$axisLabelColor,
            fontSize: 12,
          },
          backgroundColor: '#434343B3',
          extraCssText: 'border:none;box-shadow: 0 0 11px #434343B3;',
        },
        series: [
          {
            name: '分类数量',
            type: 'pie',
            avoidLabelOverlap: false,
            hoverAnimation: false,
            startAngle: 80,
            left: 10,
            right: 80,
            top: 50,
            bottom: 20,
            radius: ['60%', '90%'],

            label: {
              position: 'outside',
              align: 'center',
              verticalAlign: 'middle',
              formatter: '{d} %',
              color: this.$axisLabelColor,
              fontSize: 16 * this.remRatio + 'px',
            },
            labelLine: {
              length: 5,
              length2: 4,
              lineStyle: {
                width: 1,
                color: '#fff',
              },
            },
            color: [
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#002AFF',
                },
                {
                  offset: 1,
                  color: '#8062E8',
                },
              ]),
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#29CBFF',
                },
                {
                  offset: 1,
                  color: '#129BFF',
                },
              ]),
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#EAFF8F',
                },
                {
                  offset: 1,
                  color: '#EAFF8F',
                },
              ]),
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#FFC9AC',
                },
                {
                  offset: 1,
                  color: '#FF9874',
                },
              ]),
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0DFFB7',
                },
                {
                  offset: 1,
                  color: '#46E081',
                },
              ]),
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#FF6992',
                },
                {
                  offset: 1,
                  color: '#FF3859',
                },
              ]),
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0E96FF',
                },
                {
                  offset: 1,
                  color: '#065DFF',
                },
              ]),
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#EAFF8F',
                },
                {
                  offset: 1,
                  color: '#EAFF8F',
                },
              ]),
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#FFC9AC',
                },
                {
                  offset: 1,
                  color: '#FF9874',
                },
              ]),
              new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0DFFB7',
                },
                {
                  offset: 1,
                  color: '#46E081',
                },
              ]),
            ],
            data: this.echartsData,
          },
        ],
      }
      //console.log('33', options)
      return options
    },
  },

  components: {
    dEchart,
  },

  mounted() {},
}
</script>

<style lang="scss" scoped></style>
