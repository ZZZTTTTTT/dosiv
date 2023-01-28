<template>
  <div class="card" style="position: relative">
    <div class="card-arrow" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0">
      <div class="card-arrow-top-left card-arrow-item"></div>
      <div class="card-arrow-top-right card-arrow-item"></div>
      <div class="card-arrow-bottom-left card-arrow-item"></div>
      <div class="card-arrow-bottom-right card-arrow-item"></div>
      <div style="position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; z-index: 10">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaoiemDdsBorderBox1',

  data() {
    return {}
  },

  mounted() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.card::before {
  content: '';
  position: absolute;
  left: 15px;
  right: 15px;
  top: 0;
  bottom: 0;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  opacity: 0.3;
}
.card:after {
  content: '';
  position: absolute;
  top: 15px;
  bottom: 15px;
  left: 0;
  right: 0;
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
  opacity: 0.3;
}

.card-arrow-item {
  width: 10px;
  height: 10px;
  position: absolute;
}
.card-arrow-top-left {
  left: 0;
  top: 0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
}
.card-arrow-top-right {
  right: 0;
  top: 0;
  border-right: 2px solid #fff;
  border-top: 2px solid #fff;
}
.card-arrow-bottom-left {
  left: 0;
  bottom: 0;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
}
.card-arrow-bottom-right {
  right: 0;
  bottom: 0;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}
</style>
