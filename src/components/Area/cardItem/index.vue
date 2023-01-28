<template>
  <BorderWrap class="deviceBorder">
    <div style="height: 100%; flex-direction: column; padding: 15px; margin-right: 20px" class="display">
      <div>
        <div style="font-weight: bold; font-size: 14px">{{ title }}</div>
      </div>
      <div class="display margin">
        <div>
          <div style="font-size: 24px; font-weight: bold" class="light-style">{{ Count }}</div>
        </div>
        <div>
          <div style="text-align: center; font-size: 30px" class="light-style">
            <slot name="chart"></slot>
          </div>
        </div>
      </div>
      <div class="margin">
        <div style="color: grey; font-size: 14px"><slot name="subtext"></slot> {{ num }}</div>
      </div>
    </div>
  </BorderWrap>
</template>

<script>
export default {
  props: ['title', 'Count', 'num'],
}
</script>

<style scoped>
.margin {
  margin-top: 10px;
}
</style>
