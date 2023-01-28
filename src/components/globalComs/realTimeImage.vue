<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex">
        <span style="margin-right: 10px">更新时间:</span>
        <real-time />
      </div>
      <div>
        <a href="#"><font-awesome-icon icon="fa-solid fa-expand" /></a>
      </div>
    </div>
    <div style="display: flex; justify-content: center">
      <img src="@/assets/实时图.png" alt="">
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
img {
  object-fit: cover;

  height: 500px;
}
</style>
