<template>
  <div class="corner-border">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style>
.corner-border {
  height: 100%;
  width: 100%;
  background: linear-gradient(to left, #c8cccf, #c8cccf) left top no-repeat, linear-gradient(to bottom, #c8cccf, #c8cccf) left top no-repeat,
    linear-gradient(to left, #c8cccf, #c8cccf) right top no-repeat, linear-gradient(to bottom, #c8cccf, #c8cccf) right top no-repeat,
    linear-gradient(to left, #c8cccf, #c8cccf) left bottom no-repeat, linear-gradient(to bottom, #c8cccf, #c8cccf) left bottom no-repeat,
    linear-gradient(to left, #c8cccf, #c8cccf) right bottom no-repeat, linear-gradient(to left, #c8cccf, #c8cccf) right bottom no-repeat;
  background-size: 2px 13px, 13px 2px, 2px 13px, 13px 2px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
}
</style>
