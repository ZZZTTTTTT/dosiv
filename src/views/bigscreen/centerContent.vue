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
            <number-of-categories v-bind:echartsData="numberOfCategoriesData" />
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
}
</style>
