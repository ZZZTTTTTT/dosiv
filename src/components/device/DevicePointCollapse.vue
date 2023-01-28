<template>
  <div>
    <button class="accordion-button d-flex" style="justify-content: space-between; padding: 20px" @click="titleClick()">
      <div style="font-size: 14px; font-weight: bold">{{ pointData.pointName }}</div>
      <div class="d-flex">
        <ul class="d-flex" style="margin-right: 15px">
          <li>
            <strong class="text-theme">数据项 </strong>
            <div class="num-theme">{{ pointData.kpiNum }}</div>
          </li>
          <!--
          <li>
            <strong class="text-theme">超阈值数据项 </strong><div class="num-theme">{{ pointData.exceedThresholdKpiCodeNum }}</div>
          </li>
          -->
          <li>
            <strong class="text-theme">断更 </strong>
            <div class="num-theme">{{ pointData.inactiveKpiCodeNum }}</div>
          </li>
          <li>
            <strong class="text-theme">从未上报 </strong>
            <div class="num-theme">{{ pointData.neverReportKpiCodeNum }}</div>
          </li>
        </ul>
        <div class="d-flex" style="transform: translateY(10%)">
          <font-awesome-icon icon="fa-solid fa-angle-down" style="font-size: 16px" :class="{ iconclass: detailShow }" />
        </div>
      </div>
    </button>

    <transition>
      <div v-if="detailShow" style="margin-left: 10px; margin-right: 10px">
        <el-table :data="kpiValueList" style="width: 100%" :show-header="true" v-loading="detailLoading">
          <el-table-column label="数据项名称" prop="kpiDisplayName"></el-table-column>
          <el-table-column label="实时值" prop="value"></el-table-column>
          <el-table-column label="单位" prop="unit"></el-table-column>
          <el-table-column label="时间" prop="DTime"></el-table-column>
        </el-table>
      </div>
    </transition>
  </div>
</template>

<script>
import { getKpiValueListByCondition } from '@/api/device'
export default {
  props: ['point', 'deviceCode'],
  // watch: {
  //   pointData: {
  //     handler(newVal, oldVal) {
  //       console.log('this.pointData变化了', newVal)
  //       this.kpiValueList = newVal.deviceKpi
  //     },
  //     deep: true,
  //   },
  // },
  computed: {
    pointData() {
      return this.point
    },
  },
  data() {
    return {
      detailShow: false,
      detailLoading: true,
      kpiValueList: [],
      // pointData: {},
      mockKpiValueList: [
        {
          DTime: 1650582857000000000, //纳秒，目前没转换，后端也可以转
          kpiId: '345129846',
          value: 76,
        },
        {
          DTime: 1650582857000000000,
          kpiId: '458234448',
          value: 23,
        },
      ],
    }
  },
  methods: {
    titleClick() {
      const that = this
      // console.log('this.pointData', this.pointData)
      that.pointData.deviceKpi.forEach((item) => {
        item.value = null
        item.DTime = null
      })
      // if (!this.detailShow) {
      //   this.detailShow = !this.detailShow
      //   return
      // }
      const params = {
        deviceCode: this.deviceCode,
        pointId: this.pointData.collectPointId,
        kpiId: [],
      }
      // console.log('params', params)
      that.detailShow = !that.detailShow
      getKpiValueListByCondition(params).then((res) => {
        //setTimeout(() => {
          // console.log('res', res)

          if (res.status !== 200) {
            return this.$message.error('获取测点下数据项信息失败')
          }
          if (res.data.code !== 200) {
            return this.$message.error('获取测点下数据项信息失败')
          }
          // 测试环境使用模拟数据
          if (process.env.NODE_ENV === 'development') {
            // console.log('测试环境，使用mock数据')
            if (res.data.result.length < 1) {
              res.data.result = that.mockKpiValueList
            }
          }
          // console.log('res', res)
          that.pointData.deviceKpi.forEach((item) => {
            res.data.result.forEach((ret) => {
              if (item.collectKpiId == ret.kpiId) {
                item.value = ret.value
                item.DTime = ret.dTimeStr
              }
            })
          })
          // console.log('处理完毕后的this.pointData', this.pointData)
          that.kpiValueList = new Array()
          for (let item of this.pointData.deviceKpi) {
            // if (item.DTime) {
            //   let time = new Date(item.DTime)
            //   item.DTime = time.toLocaleString()
            // }
            that.kpiValueList.push(item)
          }
          //console.log('that.kpiValueList', that.kpiValueList)
          
          this.detailLoading = false

          // this.$forceUpdate()
        //}, 3000)
      })
    },
  },
}
</script>

<style scoped>
.text-theme {
  font-size: 14px;
  margin-right: 10px;
}
</style>
