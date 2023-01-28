<template>
  <li>
    <div>
      <div class="de-flex de-item">
        <i
          class="el-icon-s-opportunity"
          :style="{
            color: statusColor(model.status),
            'text-indent': 1.2 * model.level + 'em',
            'font-size': '14px',
          }"
        ></i>
        <span
          class="de-item_label"
          :class="{
            'de-active': isActive,
            'last-active': isLastActive,
          }"
          @click="changeCurrentNodeId"
        >
          {{ model.name }}
          {{ model.domainType && (model.deviceNum || model.deviceNum === 0) ? `( ${model.deviceNum} )` : '' }}
          {{ !model.domainType ? `( ${model.deviceCode} )` : '' }}
          <i class="el-icon-loading" v-if="loading"></i>
        </span>
        <div class="de-expand-icon-wrap" v-if="model.domainType" @click="toggle">
          <i class="de-expand-icon el-icon-caret-top" :class="{ 'de-rotate180': isOpen }"></i>
        </div>
      </div>
    </div>
    <ul class="de-animate-wrap" v-show="isOpen">
      <TreeItem v-for="(item, index) in childNode" :key="index" class="item" :model="item" />
    </ul>
  </li>
</template>
<script>
import mixin from '../../../utils/mixins'
export default {
  name: 'TreeItem',
  inject: ['outerData'],
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
      loading:false,
      childNode: [],
    }
  },
  created() {},
  computed: {
    currentNodeId() {
      const currentNode = this.$deviceStore.state.selectedNode
      return currentNode.id || currentNode.deviceId || ''
    },
    isLastActive() {
      return this.currentNodeId == this.model.id
    },
    isActive() {
      if ( this.isLastActive ) return false
      let breadcrumb = this.$deviceStore.state.breadcrumb
      let isGroup = breadcrumb.every( ( item ) => Array.isArray( item.name ) )
      if ( isGroup ) {
        return breadcrumb
          .map( ( b ) => b.pathIds )
          .flat()
          .includes( this.model.id )
      }
      return breadcrumb.map( ( item ) => item.id ).includes( this.model.id )

    },
  },
  methods: {
    async toggle() {
      try {
        this.isOpen = !this.isOpen
        if ( this.isOpen ) {
          this.loading = true
          this.childNode = await this.$deviceStore.commit( 'getNextLevelNodes', this.model.id, this.model.level )
          this.$deviceStore.commit( 'updateNodeStatus', this.childNode )
          this.loading = false
        }
      } catch ( error ) {
        this.loading = false
        this.$message.error( error.msg ? error.msg : error )
      }
    },
    statusColor( status ) {
      return this.$deviceStore.commit( 'statusColor', status )
    },
    changeCurrentNodeId() {
      if ( this.outerData.onlyDevice && this.model.domainType ) {
        this.toggle()
      } else {
        let category = this.model.domainType ? this.model.domainType : 'device'
        let selectedNode = { category, ...this.model }
        let tempNode = Object.assign( {}, selectedNode )
        tempNode.domainType = this.$deviceStore.commit( 'domainTypeMap', tempNode.domainType )
        this.$deviceStore.commit( 'setSelectedNode', tempNode )
        this.dispatch( 'DeviceTabs', 'getCheckedNode', tempNode )
        this.dispatch( 'DeviceTabs', 'getBreadcrumb', this.$deviceStore.state.breadcrumb )
      }
    },
  },
  watch: {},
}
</script>
