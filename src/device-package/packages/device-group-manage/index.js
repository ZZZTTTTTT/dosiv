import DeviceGroupManage from '../device-group/components/device-group-manage.vue'

DeviceGroupManage.install = function ( Vue ) {
  Vue.component( DeviceGroupManage.name, DeviceGroupManage )
}
export default DeviceGroupManage
