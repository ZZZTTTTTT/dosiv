<template>
  <div id="msg-block">
    <div class="label">{{ info.label }}</div>
    <div class="d-flex jc-center" style="padding-top: 12px">
      <div class="value">{{ info.value || '--' }}</div>
      <div class="unit d-flex">{{ info.unit }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import './scss/style.scss';
#msg-block {
  .label,
  .unit {
    font-size: 14px;
    color: #4fdeffcc;
  }
  .value {
    margin-right: 10px;
    font-weight: 500;
    color: #4fdeff;
    font-size: 42px;
  }
  .value {
    align-items: flex-end;
    line-height: 1 !important;
  }
  .unit {
    align-items: flex-end;
    line-height: 1 !important;
    margin-bottom: 5px;
  }
}
</style>
