export const axisLabelColor = '#ffffff99'
export const axisSplitLineColor = '#ffffff14'

const options = {
  grid: {
    containLabel: true,
    left: 30,
    top: 30,
    right: 30,
    bottom: 20,
    tooltip: {
      trigger: 'axis',
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
        color: axisLabelColor,
      },
    },
    axisLabel: {
      margin: 10,
      color: axisLabelColor,
    },
    data: '',
  },
  yAxis: {
    offset: 20,
    axisLine: {
      show: false,
    },
    axisLabel: {
      align: 'right',
      color: axisLabelColor,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: axisSplitLineColor,
      },
    },
    type: 'value',
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (data) {
      return data[0].name + '<br />' + Number(data[0].value)
    },
    textStyle: {
      color: axisLabelColor,
      fontSize: 12,
    },
    backgroundColor: '#434343B3',
    extraCssText: 'border:none;box-shadow: 0 0 11px #606060;',
    axisPointer: {
      lineStyle: {
        color: '#1968FF55',
      },
    },
  },
}

// 局部配置使用
// tooltip
// optObj.tooltip.extraCssText = 'border:none;box-shadow: 0 0 11px #606060;';
// optObj.tooltip.axisPointer.lineStyle.color = '#1968FF55'

export default options
