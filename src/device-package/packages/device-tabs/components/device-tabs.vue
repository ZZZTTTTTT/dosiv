<template>
   <div class="de-tabs" :class="{'device-theme-dark':theme=='dark','device-theme-light':!theme||theme=='light'}">
    <DeviceTabNav class="de-tab-nav" :panes="panes" :active="value"> </DeviceTabNav>
    <div class="de-tab-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import DeviceTabNav from './device-tab-nav.vue'
export default {
  name: 'DeviceTabs',
  components: { DeviceTabNav },
  provide() {
    return {
      activeTab: this,
    }
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    initDeviceCode:{
      type:String,
      default:'',
    },
    nodeType:{
      type:String,
      default:'device',
    },
    noCacheFlag: {
      type: Number,
      default: 0,
    },
    exportApi:{
      type:Object,
      default:() => ( {} ),
    },
    theme:{
      type:String,
      default:'light',
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  data() {
    return {
      panes: [],
    }
  },
  mounted() {
    this.calcPaneInstances()
  },
  methods: {
    calcPaneInstances() {
      if ( this.$slots.default ) {
        const panes = this.$slots.default.map( ( { componentInstance } ) => componentInstance )
        this.panes = panes
      }
    },
    getCheckedNode( checkedNode ) {
      this.$emit( 'getCheckedNode', checkedNode )
    },
    getBreadcrumb( breadcrumb ) {
      this.$emit( 'getBreadcrumb', breadcrumb )
    },
  },
}
</script>
