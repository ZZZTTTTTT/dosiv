<template>
  <div id="title-content" class="d-flex">
    <div class="t1"></div>
    <div class="t2" :style="{ width: width }"><span class="point"></span>{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: '120px',
    },
  },
}
</script>

<style lang="scss" scoped>
#title-content {
  padding: 12px 0;
  .t1 {
    background-color: #1f4ca2;
    width: 5px;
  }
  .t2 {
    display: flex;
    align-items: center;
    margin-left: 3px;
    background-color: #1f4ca2;
    background: linear-gradient(to right, #1f4ca2, #1f4da200);
    font-size: 16px;
    line-height: 24px;
    padding: 2px 10px;
    white-space: nowrap;
  }
  .point {
    margin-right: 8px;
    display: inline-block;
    line-height: 5px;
    height: 5px;
    width: 5px;
    background-color: #fff;
    border-radius: 50%;
  }
}
</style>
