import DeviceTree from './components/device-tree.vue'
import DeviceSelectTree from './components/device-select-tree.vue'

DeviceTree.install = function (Vue) {
  Vue.component(DeviceTree.name, DeviceTree)
  Vue.component(DeviceSelectTree.name, DeviceSelectTree)
}
export default DeviceTree
