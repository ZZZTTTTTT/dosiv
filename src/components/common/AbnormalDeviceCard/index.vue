<template>
  <div class="four-angle-border"></div>
</template>

<script>
export default {}
</script>

<style>
.four-angle-border {
  width: 240px;
  height: 140px;
  background: linear-gradient(to top, #dbdde2, #dbdde2) left top no-repeat, /*上左*/ linear-gradient(to right, #dbdde2, #dbdde2) left top no-repeat,
    /*左上*/ linear-gradient(to left, #dbdde2, #dbdde2) right top no-repeat, /*上右*/ linear-gradient(to bottom, #dbdde2, #dbdde2) right top no-repeat,
    /*上右*/ linear-gradient(to left, #dbdde2, #dbdde2) left bottom no-repeat,
    /*下左*/ linear-gradient(to bottom, #dbdde2, #dbdde2) left bottom no-repeat,
    /*左下*/ linear-gradient(to top, #dbdde2, #dbdde2) right bottom no-repeat,
    /*下右*/ linear-gradient(to left, #dbdde2, #dbdde2) right bottom no-repeat; /*右下*/
  background-size: 2px 16px, 16px 2px, 2px 16px, 16px 2px;
  /* background-color: rgba(36, 56, 128, 0.21); */
}
</style>
