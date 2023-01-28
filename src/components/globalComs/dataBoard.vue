<template>
  <div class="pane-content">
    <el-row>
      <el-radio-group v-model="pointRadio">
        <el-radio
          v-for="point in pointAggr"
          :key="point.collectPointId"
          :value="point.collectPointId"
          :label="point.collectPointId"
          @change="pointChange(point)"
          >{{ point.pointName }}
        </el-radio>
      </el-radio-group>
    </el-row>
    <hr />
    <el-row v-for="point in pointAggrFilter" :key="point.collectPointId">
      <device-point-collapse
        :device-code="innerDeviceCode"
        :point="point"
        v-show="pointRadio === 'all' || point.collectPointId === pointRadio"
      ></device-point-collapse>
    </el-row>
  </div>
</template>

<script>
import DevicePointCollapse from '@/components/device/DevicePointCollapse'
import { statisticsKpiIndicatorAggrByPoint, getKpiValueListByCondition } from '@/api/device'

export default {
  components: {
    DevicePointCollapse,
  },
  props: ['deviceCode'],
  computed: {
    innerDeviceCode() {
      return this.deviceCode
    },
    pointAggrFilter() {
      return this.pointAggr.filter((point) => {
        return point.collectPointId !== 'all'
      })
    },
  },
  watch: {
    innerDeviceCode(newVal, oldVal) {
      // do something
      this.init()
    },
  },
  methods: {
    pointChange(point) {
      // console.log('point change, point: ', point)
    },
    init() {
      const params = {
        deviceCode: this.innerDeviceCode,
      }
      statisticsKpiIndicatorAggrByPoint(params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('获取设备聚合信息失败')
        }
        if (res.data.code !== 200) {
          return this.$message.error('获取设备聚合信息失败')
        }
        this.pointAggr = res.data.result
        if (process.env.NODE_ENV == 'development') {
          // 开发环境使用模拟数据
          this.pointAggr = this.mockPointAggr
        }
        // 初始化默认的实时状态值和时间
        // this.pointAggr.forEach((item) => {
        //   item.deviceKpi.forEach((kpi) => {
        //     kpi.value = null
        //     kpi.DTime = null
        //   })
        // })
        // 添加全部测点
        if (this.pointAggr.length > 0) {
          let all = {
            collectPointId: 'all',
            pointName: '全部测点',
          }
          this.pointAggr.unshift(all)
        }
        // console.log('this.pointAttr', this.pointAggr)
      })
    },
  },
  data() {
    return {
      pointAggr: [],
      pointRadio: 'all',
      mockPointAggr: [
        {
          collectPointId: '00',
          deviceKpi: [
            {
              collectKpiId: 'G湿度',
              kpiDisplayName: 'G湿度',
              kpiId: 451757401,
              specialty: '设备诊断/振动诊断（振动）/工艺参数',
              unit: '%',
            },
            {
              collectKpiId: 'G开关',
              kpiDisplayName: 'G开关',
              kpiId: 887352877,
              specialty: '设备诊断/振动诊断（振动）/工艺参数',
              unit: '%',
            },
            {
              collectKpiId: 'G温度',
              kpiDisplayName: 'G温度',
              kpiId: 899739474,
              specialty: '设备诊断/振动诊断（振动）/工艺参数',
              unit: '℃',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 3,
          neverReportKpiCodeNum: 0,
          pointName: '整体',
          pointNo: '00',
        },
        {
          collectPointId: '01',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点01',
          pointNo: '01',
        },
        {
          collectPointId: '02',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '02',
        },
        {
          collectPointId: '03',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '03',
        },
        {
          collectPointId: '04',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '04',
        },
        {
          collectPointId: '05',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '05',
        },
        {
          collectPointId: '06',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '06',
        },
        {
          collectPointId: '07',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '07',
        },
        {
          collectPointId: '08',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '08',
        },
        {
          collectPointId: '09',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '09',
        },
        {
          collectPointId: '10',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '10',
        },
        {
          collectPointId: '11',
          deviceKpi: [
            {
              collectKpiId: 'Z高频冲击能量比',
              kpiDisplayName: 'Z高频冲击能量比',
              kpiId: 186613656,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z冲击峰值',
              kpiDisplayName: 'Z冲击峰值',
              kpiId: 290723532,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'G',
            },
            {
              collectKpiId: 'Z冲击',
              kpiDisplayName: 'Z冲击',
              kpiId: 310188985,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
            {
              collectKpiId: 'Z低频冲击能量比',
              kpiDisplayName: 'Z低频冲击能量比',
              kpiId: 397965177,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度峰值',
              kpiDisplayName: 'Z速度峰值',
              kpiId: 523112817,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z冲击有效值',
              kpiDisplayName: 'Z冲击有效值',
              kpiId: 912752809,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'm/s2',
            },
            {
              collectKpiId: 'Z速度有效值',
              kpiDisplayName: 'Z速度有效值',
              kpiId: 960591795,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'mm/s',
            },
            {
              collectKpiId: 'Z速度',
              kpiDisplayName: 'Z速度',
              kpiId: 994927377,
              specialty: '设备诊断/振动诊断（振动）/振动',
              unit: 'wave',
            },
          ],
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 0,
          kpiCount: 0,
          kpiNum: 8,
          neverReportKpiCodeNum: 0,
          pointName: '振动测点02',
          pointNo: '11',
        },
      ],
    }
  },
}
</script>

<style>
.transition-enter-active,
.transition-leave-active {
  transition: all 0.15s ease;
}
.transition-enter,
.transition-leave-to {
  height: 0;
}

ul,
li {
  list-style: none;
}
.pane-content {
  height: calc(100vh - 25rem);
}
.accordion-button {
  width: 100%;
  text-align: left;
  
  color: #fff;
  border: none;
}

p {
  font-size: 14px;
}

.num-theme {
  color: #3cd2a5;
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
  min-width: 4ch;
  display: inline-block;
}

.text-theme {
  font-size: 14px;
  margin-right: 10px;
}

.iconclass {
  transform: rotate(-180deg);
  color: #3cd2a5;
}

.textclass {
  color: #3cd2a5;
}
</style>
