import {
  getDeviceTypeAmount, // 设备类型数量
  getLastMonthDeviceDiagnosesAmount, // 上月诊断次数
  //getDeviceInfoAmount,
  getAmount, //获取基地设备总数量  getAmount
  getRuleAmount, //启用规则设备数量  getRuleAmount
  getDataAmount, //配置的数据项数量 getDataAmount
  getOfflineDeviceAmount, //离线设备 getOfflineDeviceAmount
  getOfflineDataAmount, // 离线数据项 getOfflineDataAmount
  getDomainDeviceInfos, // 设备状况数据
  getLast7DaysAlert, // 过去7天报警
  getAlertDeviceAmount, // 告警设备(各告警级别分类)
  getAbnormalDeviceAmount, // 异常设备(各报警级别)
  getUnclosedAlertAmount, //未闭环报警
} from '@/api/base'
// import remRatio from '@/utils/rem'
import store from '@/store'
export const basemix = {
  computed: {
    remRatio() {
      // console.log(this.$store.state.app.remRatio)
      return this.$store.state.app.remRatio
    },
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  methods: {
    initData() {
      // getDeviceTypeAmount(this.domainId).then((res) => {
      //   const tmp = []
      //   res.data.result.forEach((item) => {
      //     tmp.push({ name: item.deviceType, value: item.amount })
      //   })

      //   this.deviceTypeConfig = {
      //     data: tmp,
      //     color: ['#6ECEB2', '#1E4643', '#2A7665'],
      //     lineWidth: 30,
      //     radius: 75 * this.remRatio + '%',
      //     digitalFlopStyle: {
      //       fontSize: 16 * this.remRatio + 'px' || '16px',
      //       fill: store.state.user.themeStyle ? '#fff' : '#000',
      //     },
      //     showOriginValue: true,
      //   }
      // })
      // getLastMonthDeviceDiagnosesAmount(this.domainId).then((res) => {
      //   let tmp = []
      //   //res.data.result = [{ amount: 0 }, { amount: 0 }, { amount: 0 }]
      //   if (res.data.result.every((item) => item.amount == 0)) {
      //     // console.log('数据不能全为0')
      //     tmp = []
      //   } else {
      //     res.data.result.forEach((item) => {
      //       tmp.push({ name: item.domainName, value: item.amount })
      //     })
      //   }
      //   //console.log('remRatio', remRatio)
      //   this.diagnoseNumConfig = {
      //     data: tmp,
      //     color: ['#6ECEB2', '#1E4643', '#2A7665'],
      //     lineWidth: 30,
      //     radius: 75 * this.remRatio + '%',
      //     activeRadius: 80 * this.remRatio + '%',
      //     digitalFlopStyle: {
      //       fontSize: 16 * this.remRatio + 'px' || '16px',
      //     },
      //     showOriginValue: true,
      //   }
      // })
      /*
      getDeviceInfoAmount(this.domainId).then((res) => {
        if (res.status != 200 || res.data.result.length == 0) {
          return this.$message.error('获取设备信息失败')
        }
        this.accessDevice = res.data.result.amount + ''
        this.enabledRulesNum = res.data.result.ruleAmount
        this.configurationDataItemNum = res.data.result.dataAmount
        this.offlineDeviceNum = res.data.result.offlineDeviceAmount
        this.offlineDataNum = res.data.result.offlineDataAmount
      })
*/
      getAmount(this.domainId).then((res) => {
        this.accessDevice = res.data.result.amount + ''
      })

      getOfflineDataAmount(this.domainId).then((res) => {
        this.offlineDataNum = res.data.result.offlineDataAmount
      })

      getOfflineDeviceAmount(this.domainId).then((res) => {
        this.offlineDeviceNum = res.data.result.offlineDeviceAmount
      })

      getDataAmount(this.domainId).then((res) => {
        this.configurationDataItemNum = res.data.result.dataAmount
      })

      getRuleAmount(this.domainId).then((res) => {
        this.enabledRulesNum = res.data.result.ruleAmount
      })

      getDomainDeviceInfos(this.domainId).then((res) => {
        const tmp = []
        res.data.result.forEach((item) => {
          tmp.push([item.domainName, item.accessDeviceAmount, item.alertDeviceAmount, item.abnormalDeviceAmount, item.unclosedDeviceAmount])
        })
        this.deviceListMessage = {
          header: ['', '接入设备', '告警设备', '异常设备', '未闭环报警'],
          data: tmp,
          align: ['center'],
          headerBGC: 'rgba(0,0,0,0)',
          oddRowBGC: store.state.user.themeStyle ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.1)',
          evenRowBGC: 'rgba(0,0,0,0)',
          rowNum: 7,
        }
      })

      getUnclosedAlertAmount(this.domainId).then((res) => {
        this.unclosedData = res.data.result
        //console.log('this.unclosedData', this.unclosedData)
      })
    },
    barEcharts() {
      var barChartDom = document.getElementById('alarmBarChart')
      this.alarmBarChart = this.$echarts.init(barChartDom)
      getLast7DaysAlert(this.domainId).then((res) => {
        const xAxis = []
        const dangerAmount = []
        const noticeAmount = []
        const warnAmount = []

        /*
        res.data.result.forEach((item) => {
          xAxis.push(item.date)
          dangerAmount.push(item.dangerAmount)
          noticeAmount.push(item.noticeAmount)
          warnAmount.push(item.warnAmount)
        })*/

        if (res.data.result.length == 0) {
          // console.log('柱状图暂无数据')
          barChartDom.innerHTML = '暂无数据'
          barChartDom.style.cssText = 'text-align:center; color: #fff; border: none;line-height: 300px'
          barChartDom.removeAttribute('_echarts_instance_')
        } else {
          res.data.result.forEach((item) => {
            xAxis.push(item.date)
            dangerAmount.push(item.dangerAmount)
            noticeAmount.push(item.noticeAmount)
            warnAmount.push(item.warnAmount)
          })
        }

        this.alarmBarChartoption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            icon: 'circle',
            itemWidth: 10,
            textStyle: {
              color: store.state.user.themeStyle ? '#fff' : '#000',
            },
          },
          color: ['#f9e80d', '#ff9f0c', '#ff6060'],
          grid: {
            left: '10%',
            right: '10%',
            bottom: '10%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: xAxis,
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '注意',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series',
              },
              data: noticeAmount,
            },
            {
              name: '警告',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series',
              },
              data: warnAmount,
            },
            {
              name: '危险',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series',
              },
              data: dangerAmount,
            },
          ],
        }
        this.alarmBarChart.clear()
        this.alarmBarChartoption && this.alarmBarChart.setOption(this.alarmBarChartoption, true)
      })

      window.addEventListener('resize', () => {
        this.alarmBarChart.resize()
      })
    },
    dvCharts() {
      this.alarmDeviceChart = this.$echarts.init(document.getElementById('alarmDeviceChart'))
      this.abnormalDeviceChart = this.$echarts.init(document.getElementById('abnormalDeviceChart'))

      getAlertDeviceAmount(this.domainId).then((res) => {
        const result = res.data.result
        this.AlertDevicetotalAmount = res.data.result.totalAmount
        this.alarmDeviceChartoption = {
          tooltip: {
            trigger: 'item',
          } /*
          legend: {
            icon: 'circle',
            itemWidth: 10,
            textStyle: {
              color: '#fff',
            },
            orient: 'vertical',
            x: 'right',
            y: 'center',
          },*/,
          color: ['#E8C82C', '#DA7F1C', '#DF1D1E'],
          series: [
            {
              type: 'pie',
              radius: '70%',
              data: [
                { value: result.noticeAmount, name: '注意' },

                { value: result.warnAmount, name: '警告' },
                { value: result.dangerAmount, name: '危险' },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
              label: {
                show: false,
              },
            },
          ],
        }

        this.alarmDeviceChartoption && this.alarmDeviceChart.setOption(this.alarmDeviceChartoption)
      })

      getAbnormalDeviceAmount(this.domainId).then((res) => {
        const result = res.data.result
        this.AbnormalDevicetotalAmount = res.data.result.totalAmount
        this.abnormalDeviceChartoption = {
          tooltip: {
            trigger: 'item',
          },
          /*
          legend: {
            icon: 'circle',
            itemWidth: 10,
            textStyle: {
              color: '#fff',
            },
            x: 'center',
            y: 'bottom',
          },*/
          color: ['#E8C82C', '#DA7F1C', '#DF1D1E'],
          series: [
            {
              type: 'pie',
              radius: '70%',
              data: [
                { value: result.noticeAmount, name: '注意' },
                { value: result.warnAmount, name: '警告' },
                { value: result.dangerAmount, name: '危险' },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
              label: {
                show: false,
              },
            },
          ],
        }

        this.abnormalDeviceChartoption && this.abnormalDeviceChart.setOption(this.abnormalDeviceChartoption)
      })

      window.addEventListener('resize', () => {
        this.alarmDeviceChart.resize()
        this.abnormalDeviceChart.resize()
      })
    },
    pieOutlineFunc() {
      window.addEventListener('resize', () => {
        //console.log('this', this)
        this.$nextTick(() => {
          this.key++
        })
      })
    },
    /*
    deviceEcharts() {
      var errorInProcessChart = this.$echarts.init(document.getElementById('errorInProcessChart'))
      this.errorInProcesstoption = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          show: false,
        },
        color: ['#3cd2a5', '#fff'],
        yAxis: {
          type: 'value',
          splitLine: false,
          show: false,
        },

        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
            symbol: 'none',
          },
        ],
      }
      this.errorInProcesstoption && errorInProcessChart.setOption(this.errorInProcesstoption)

      var alarmInProcessChart = this.$echarts.init(document.getElementById('alarmInProcessChart'))
      this.alarmInProcessChartoption = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          icon: 'circle',
          itemWidth: 10,
          textStyle: {
            color: '#fff',
          },
        },
        color: ['#3cd2a5', '#1ecc33', '#2d8e83'],
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1, name: 'warnAmount' },
              { value: 1, name: 'noticeAmount' },
              { value: 1, name: 'dangerAmount' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              show: false,
            },
          },
        ],
      }
      this.alarmInProcessChartoption && alarmInProcessChart.setOption(this.alarmInProcessChartoption)

      var pendingWarnChart = this.$echarts.init(document.getElementById('pendingWarnChart'))
      this.pendingWarnChartoption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          icon: 'circle',
          itemWidth: 10,
          textStyle: {
            color: '#fff',
          },
        },
        color: ['#3cd2a5', '#1ecc33', '#2d8e83'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            show: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
            show: false,
          },
        ],
        series: [
          {
            name: 'dangerAmount',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series',
            },
            data: [120, 200, 150, 80, 70, 110, 130],
          },
        ],
      }
      this.pendingWarnChartoption && pendingWarnChart.setOption(this.pendingWarnChartoption)
    },*/
  },
}
