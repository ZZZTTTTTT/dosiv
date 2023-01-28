<template>
  <div class="center-content">
    <presentTime class="card1" />
    <div class="d-flex jc-around card2">
      <msgBlock :info="info" v-for="info in deviceInfo" :key="info.label"></msgBlock>
    </div>

    <main-map class="card3"></main-map>

    <div class="d-flex card4">
      <div class="" style="width: 44%; margin-right: 2%">
        <dv-border-box-7 :color="['#002e76', '#3DDDFF']">
          <div class="h-100 pie-classify border-content">
            <d-title :title="'数据项总数'" :width="'150px'" style="margin-top: 0" />
            <kpiIndicator :data="kpiValue" />
          </div>
        </dv-border-box-7>
      </div>
      <div class="" style="width: 54%">
        <dv-border-box-7 :color="['#002e76', '#3DDDFF']">
          <div class="h-100 border-content pie-classify">
            <d-title :title="'分类数量占比'" :width="'150px'" style="margin-top: 0; position: absolute" />
            <!-- <number-of-categories v-bind:echartsData="numberOfCategoriesData" /> -->
            <div class="echarts" ref="topPie"></div>
          </div>
        </dv-border-box-7>
      </div>
    </div>
  </div>
</template>

<script>
import presentTime from './presentTime'
import msgBlock from './msgBlock.vue'
import kpiIndicator from './kpiIndicator.vue'
import numberOfCategories from './numberOfCategories.vue'
import mainMap from './mainMap.vue'
import dTitle from './title'
import deviceInfoData from './json/deviceInfoData.json'
import numberOfCategoriesData from './json/numberOfCategoriesData'
import { getDeviceTypePercentage, getDataItemTotalCount, getDeviceTotalCount, getFaultDeviceCount, getProductLineCount } from '@/api/bigscreen'

export default {
  props: {
    mode: {
      type: String,
      default: 'home',
    },
  },
  data: function () {
    return {
      // nodeId: 0,
      routeName: this.$route.name,
      numberOfCategoriesData: [],
      kpiValue: '',
      prodLineQuantity: '',
      totalNumberOfFaults: '',

      totalAmount: null,
      faultEquipmentAmount: null,
      productlineAmount: null,
      domainId: this.$route.params.nodeId || '',
      echartsPie: '', // 扇形图实例
      // 扇形图配置
      optionPie: {
        // animation: false,   // 取消动画
        // 提示框组件
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{b} : {c} ({d}%)"
        // },
        //图例组件
        legend: {
          show: false,
        },
        color: ['#E35D68', '#08BA79', '#1D77D2'],
        //系列列表,每个系列通过 type 决定自己的图表类型
        series: [
          {
            type: 'pie',
            radius: ['70%', '85%'],
            center: ['40%', '50%'],
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
                    fontSize: '24',
                    lineHeight: '40',
                  },
                  bt: {
                    fontSize: '10',
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
            data: [],
          },
        ],
      },
    }
  },
  watch: {
    $route() {
      this.domainId = this.$route.params.nodeId
      // console.log('centerContent, this.nodeId', this.domainId)
      this.init()
    },
  },
  mounted() {
    this.init()
    // 初始化扇形图
    this.echartsPie = this.$echarts.init(this.$refs.topPie)
    this.search() // 这是获取接口数据给echarts赋值的方法

    //宽度自适应
    window.addEventListener('resize', () => {
      this.echartsPie.resize()
    })
  },

  computed: {
    mainMapName() {
      return this.mode == 'home' ? 'homeMainMap' : 'baseMainMap'
    },
    deviceInfo() {
      return [
        {
          label: ' ',
          value: this.totalAmount,
          unit: '设备总数量',
        },
        {
          label: '  ',
          value: this.faultEquipmentAmount,
          unit: '故障设备数量',
        },
        {
          label: '   ',
          value: this.productlineAmount,
          unit: '产线数量',
        },
      ]
    },
  },

  methods: {
    init() {
      this.getDeviceInfo()
      this.getKpiValue()
      this.getNumberOfCategoriesData()
      this.getDeviceInfo()
    },
    compareVal(property) {
      return function (a, b) {
        return b[property] - a[property]
      }
    },
    getDeviceInfo() {
      let params = {
        domainId: this.domainId,
      }
      getDeviceTotalCount(params).then((res) => {
        // this.totalAmount = 122096
        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.totalAmount = result[0].deviceCount
          }
        }
      })
      getFaultDeviceCount(params).then((res) => {
        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.faultEquipmentAmount = result.count
          }
        }
      })
      getProductLineCount(params).then((res) => {
        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.productlineAmount = result[0].prodLineCount
          }
        }
      })
    },
    getKpiValue() {
      let params = {
        domainId: this.domainId,
      }
      getDataItemTotalCount(params).then((res) => {
        // this.kpiValue = 765851
        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.kpiValue = result[0].deviceKpiCount
          }
        }
      })
    },
    getNumberOfCategoriesData() {
      let params = {
        domainId: this.domainId,
      }
      getDeviceTypePercentage(params).then((res) => {
        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            let numberOfCategoriesData = result.map((t) => {
              return { name: t.deviceTypeName, value: t.deviceCount }
            })
            let top5 = numberOfCategoriesData.sort(this.compareVal('value')).splice(0, 5)
            let othersCount = numberOfCategoriesData.reduce((total, current) => {
              return total + parseInt(current['value'])
            }, 0)
            top5.push({ name: '其他', value: othersCount })
            this.numberOfCategoriesData = top5
          }
        }
        // let top5 = numberOfCategoriesData.sort(this.compareVal('value')).splice(0, 5)
        // let othersCount = numberOfCategoriesData.reduce((total, current) => {
        //   return total + parseInt(current['value'])
        // }, 0)
        // top5.push({ name: '其他', value: othersCount })
        // this.numberOfCategoriesData = top5
        // console.log('this.numberOfCategoriesData', this.numberOfCategoriesData)
      })
    },
    // 饼状图实现循环高亮
    pieActive() {
      let index = -1 //高亮所在下标
      let dataLength = this.optionPie.series[0].data.length // 当前饼图有多少个扇形
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
    search() {
      this.optionPie.series[0].data = [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ]

      // 绘图
      this.echartsPie.setOption(this.optionPie)
      this.pieActive()
      // 鼠标划出
      this.echartsPie.on('mouseout', () => {
        this.pieActive()
      })
    },
  },

  components: {
    msgBlock,
    numberOfCategories,
    presentTime,
    kpiIndicator,
    dTitle,
    mainMap,
  },
}
</script>

<style lang="scss" scoped>
.center-content {
  .card1 {
    height: 4%;
  }
  .card2 {
    position: relative;
    z-index: 10;
    padding-top: 15px;
    height: 15%;
  }
  .card3 {
    height: 49%;
  }
  .card4 {
    height: 29%;
  }

  .pie-classify {
    position: relative;
  }
  .echarts {
    width: 300px;
    height: 220px;
  }
}
</style>
