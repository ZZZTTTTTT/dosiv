<template>
  <div>
    <button class="accordion-button" style="justify-content: space-between" @click="toggleDetail">
      <div class="d-flex" style="justify-content: space-between; cursor: pointer">
        <p :class="{ textclass: detailShow }">{{ detailData.pointName }}</p>
        <div class="d-flex" style="transform: translateY(25%)">
          <font-awesome-icon icon="fa-solid fa-angle-down" style="font-size: 16px" :class="{ iconclass: detailShow }" />
        </div>
      </div>
      <div class="button-background">
        <ul class="d-flex" style="margin-right: 15px; flex-wrap: wrap; justify-content: space-between">
          <li class="d-flex">
            <span class="text-theme">数据项 </span><span class="num-theme">{{ detailData.kpiNum }}</span>
          </li>
          <!--<li class="d-flex">
            <span class="text-theme">超阈值 </span><span class="num-theme">{{ detailData.exceedThresholdKpiCodeNum }}</span>
          </li>-->
          <li class="d-flex">
            <span class="text-theme">断更 </span><span class="num-theme">{{ detailData.inactiveKpiCodeNum }}</span>
          </li>
          <li class="d-flex">
            <span class="text-theme">从未上报 </span><span class="num-theme">{{ detailData.neverReportKpiCodeNum }}</span>
          </li>
        </ul>
      </div>
    </button>
    <transition>
      <div v-if="detailShow">
        <el-table :data="pointDetail" style="width: 100%" :show-header="false">
          <el-table-column prop="kpiDisplayName"></el-table-column>
          <el-table-column prop="value"></el-table-column>
          <el-table-column prop="unit"></el-table-column>
          <el-table-column prop="DTime"></el-table-column>
        </el-table>
      </div>
    </transition>
  </div>
</template>

<script>
import { getKpiValueListByCondition } from '@/api/area'

export default {
  props: ['detailData', 'deviceCode'],
  computed: {
    dataItemDetail() {
      let arr = []
      for (let kpi of this.detailData.deviceKpi) {
        let obj = {}
        obj.kpiDisplayName = kpi.kpiDisplayName
        obj.unit = kpi.unit
        obj.collectKpiId = kpi.collectKpiId
        arr.push(obj)
      }
      return arr
    },
  },
  data() {
    return {
      detailShow: false,
      pointDetail: [],
    }
  },
  methods: {
    toggleDetail() {
      const that = this
      if (that.detailShow === false) {
        // 从关闭到打开状态，需要获取一次数据
        const params = {
          deviceCode: that.deviceCode,
          pointId: that.detailData.collectPointId,
          kpiId: [],
        }
        getKpiValueListByCondition(params).then((res) => {
          if (res.status !== 200 || res.data.code !== 200) {
            return that.$message.error('获取数据项实时数据失败')
          }
          for (let i = 0; i < that.dataItemDetail.length; i++) {
            for (let j = 0; j < res.data.result.length; j++) {
              if (that.dataItemDetail[i].collectKpiId == res.data.result[j].kpiId) {
                that.dataItemDetail[i].value = res.data.result[j].value
                // if (res.data.result[j].DTime) {
                //   let time = new Date(res.data.result[j].DTime)
                //   res.data.result[j].DTime = time.toLocaleString()
                // }
                that.dataItemDetail[i].DTime = res.data.result[j].dTimeStr
              }
            }
          }
          that.pointDetail = that.dataItemDetail
          that.detailShow = !that.detailShow
        })
      } else {
        that.detailShow = !that.detailShow
      }
    },
  },
}
</script>

<style scoped>
.button-background {
  padding: 1rem;
  margin-bottom: 1rem;
}

.num-theme {
  color: #3cd2a5;

  margin-right: 10px;
}
.text-theme {
  font-size: 12px;
}
</style>
