import DeviceSelectTree from '../device-tree/components/device-select-tree.vue'

DeviceSelectTree.install = function (Vue) {
  Vue.component(DeviceSelectTree.name, DeviceSelectTree)
}

export default DeviceSelectTree
