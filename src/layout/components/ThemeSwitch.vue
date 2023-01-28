<template>
  <div class="theme-wrap">
    <input id="switch" v-model="themeStyle" type="checkbox" />
    <label class="cs-switch" for="switch" />
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      themeStyle: true,
    }
  },
  watch: {
    themeStyle(val) {
      this.$emit('change', val)
    },
  },
  created() {
    this.themeStyle = this.value
  },
}
</script>
<style lang="scss" scoped>
$height: 30px;
$width: 60px;
.theme-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
[type='checkbox'] {
  width: $width;
  height: $height;
  position: absolute;
  opacity: 0;
}
/* 开关样式 */
.cs-switch {
  display: inline-block;
  width: $width;
  height: $height;
  border: 2px solid #ccc;
  border-radius: $height;
  background-color: currentColor;
  box-sizing: border-box;
  color: white;
  transition: all 0.2s;
  cursor: pointer;
}
.cs-switch::before {
  content: '';
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #ccc;
  transition: margin-left 0.2s;
  background: no-repeat center/80% url('~@/assets/day.png') #fff;
}
:checked + .cs-switch {
  color: #283745;
}
:checked + .cs-switch::before {
  margin-left: $height;
  background: no-repeat center/80% url('~@/assets/night.png') #fff;
}
</style>
