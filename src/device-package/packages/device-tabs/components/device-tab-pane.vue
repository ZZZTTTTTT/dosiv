<template>
  <div class="de-tab-pane" v-show="activeTab.value === name">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'DeviceTabPane',
  inject: ['activeTab'],
  props: {
    label: {
      type: String,
      reuqire: true,
    },
    name: {
      type: String,
      require: true,
    },
  },
  methods: {
    switchTab() {
      this.$parent.$emit('change', this.name)
    },
  },
}
</script>
<style lang="scss" scoped>
.tabitem {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  // text-align: center;
  // padding: 10px;
  border-radius: 5px 5px 0 0;
  background: transparent;
  color: #869098;
  cursor: pointer;
}

.tab-label {
  white-space: nowrap;
  font-size: 14px;
}
</style>
