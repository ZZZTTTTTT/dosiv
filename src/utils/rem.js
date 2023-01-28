// rem等比适配配置文件
// 基准大小
const baseSize = 14
//var remRatio = 1
import store from '@/store'
// 设置 rem 函数
export function setRem() {
  // 当前页面屏幕分辨率相对于 1920宽的缩放比例，可根据自己需要修改
  const scale = document.documentElement.clientWidth / 1920
  store.commit('app/SET_REMRATIO', scale)
  // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
  //console.log('reset', baseSize * Math.min(scale, 2) + 'px')
  //console.log('remRatio', remRatio)
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
// window.onresize = function () {
//   setRem()
//   console.log('111')
// }
