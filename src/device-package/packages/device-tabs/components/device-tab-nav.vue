<template>
  <div class="de-tab-nav de-default-color">
    <div
      v-for="(item, index) in panes"
      :key="index"
      class="de-tab-nav_label"
      :class="{ 'de-active': active == item.name }"
      @click="switchTab(item.name)"
    >
      {{ item.label }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    panes: {
      type: Array,
      default: () => [],
    },
    active: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  methods: {
    switchTab(name) {
      this.$parent.$emit('change', name)
    },
  },
}
</script>
