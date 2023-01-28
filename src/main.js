import Vue from 'vue'

// import Axios from 'axios'

import Cookies from 'js-cookie'

import './utils/rem.js'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import componentsList from '@/plugins/componentsRegister'
Vue.use(componentsList)

import Global from '@/views/bigscreen/common-echart/global.js'
Vue.use(Global)

import { DataZoomComponent } from 'echarts/components'
echarts.use([DataZoomComponent])

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon

// import './permission-auth' // permission control
import './permission'

import './utils/error-log' // error log

import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import { activeRingChart, borderBox7, scrollBoard, decoration10 } from '@jiaminghi/data-view'
Vue.use(activeRingChart)
Vue.use(borderBox7)
Vue.use(scrollBoard)
Vue.use(decoration10)

import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'

import { BarChart, PieChart, RadarChart, LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TitleComponent } from 'echarts/components'

import { LabelLayout } from 'echarts/features'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  TitleComponent,
  RadarChart,
  PieChart,
  LabelLayout,
  LineChart,
])

Vue.prototype.$echarts = echarts

import * as filters from './filters' // global filters

import { library } from '@fortawesome/fontawesome-svg-core'

/* import specific icons */
import {
  faDownload,
  faPencil,
  faTrash,
  faExpand,
  faCalendar,
  faAngleDown,
  faBarChart,
  faChartPie,
  faCogs,
  faAreaChart,
  faLineChart,
  faPieChart,
} from '@fortawesome/free-solid-svg-icons'
import { faChrome } from '@fortawesome/free-brands-svg-icons'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* add icons to the library */
library.add(
  faDownload,
  faChrome,
  faPencil,
  faLineChart,
  faPieChart,
  faTrash,
  faExpand,
  faCalendar,
  faAngleDown,
  faBarChart,
  faChartPie,
  faCogs,
  faAreaChart
)

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)

import BorderWrap from '@/components/BorderWrap'
Vue.component('BorderWrap', BorderWrap)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// console.log('当前是什么环境？', process.env.NODE_ENV)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  // locale: enLang, // 如果使用中文，无需设置，请删除
})
//全局自定义指令注册
Vue.directive('resize', {
  bind(el, binding) {
    let width = '',
      height = ''
    function isReize() {
      const style = document.defaultView.getComputedStyle(el)
      if (width !== style.width || height !== style.height) {
        binding.value()
      }
      width = style.width
      height = style.height
    }
    el.__vueSetInterval__ = setInterval(isReize, 300)
  },
  unbind(el) {
    clearInterval(el.__vueSetInterval__)
  },
})

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

import Device from '@/device-package'
Vue.use(Device)

export default new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
