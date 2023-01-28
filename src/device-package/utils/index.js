import DeviceTabs from '../packages/device-tabs'
import DeviceTabPane from '../packages/device-tab-pane'
import DeviceTree from '../packages/device-tree'
import DeviceSelectTree from '../packages/device-select-tree'
import DeviceCollect from '../packages/device-collect'
import DeviceGroup from '../packages/device-group'
import DeviceFocus from '../packages/device-focus'
import DeviceBacktop from '../packages/device-backtop'
import DeviceGroupManage from '../packages/device-group-manage'

import '../style/common.scss'

import { store } from './store'

const components = [ DeviceTabs, DeviceTabPane, DeviceTree, DeviceSelectTree, DeviceCollect, DeviceGroup, DeviceFocus, DeviceBacktop, DeviceGroupManage ]

const install = function ( Vue, opts = {} ) {
  Vue.prototype.$deviceStore = store( Vue, opts )
  components.forEach( ( component ) => {
    Vue.component( component.name, component )
  } )
}
export default {
  install,
  DeviceTabs,
  DeviceTabPane,
  DeviceTree,
  DeviceSelectTree,
  DeviceCollect,
  DeviceGroup,
  DeviceFocus,
  DeviceBacktop,
  DeviceGroupManage,
}
