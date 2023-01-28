import DeviceTabPane from '../device-tabs/components/device-tab-pane.vue'

DeviceTabPane.install = function (Vue) {
  Vue.component(DeviceTabPane.name, DeviceTabPane)
}

export default DeviceTabPane
