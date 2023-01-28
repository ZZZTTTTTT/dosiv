import DeviceGroup from './components/device-group.vue'

DeviceGroup.install = function ( Vue ) {
  Vue.component( DeviceGroup.name, DeviceGroup )
}
export default DeviceGroup
