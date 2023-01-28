<template>
  <div class="app-header" style="height: 3.5rem; justify-content: space-between; display: flex">
    <div style="display: flex">
      <div style="text-align: center; margin-left: 1rem; margin-right: 0.5rem">
        <img src="@/assets/logo.png" style="width: auto; height: 80%" />
      </div>

      <div style="align-self: center; color: #fff; font-size: 1.5rem">设备远程运维平台</div>
    </div>

    <div style="align-items: center; margin-right: 1.5rem; display: flex; height: 3.5rem">
      <span style="font-size: 1.4rem; margin-right: 1.5rem"
        ><a href="javascript:void(0);" onclick="changeQR()" style="color: white"><font-awesome-icon icon="fa-solid fa-download" /></a
      ></span>
      <span style="font-size: 1.4rem"
        ><a href="" style="color: white"><font-awesome-icon icon="fa-brands fa-chrome" /></a
      ></span>
    </div>
    <div style="position: absolute; right: 0; top: 3.5rem; background-color: white; width: 8rem; height: 8rem; padding: 0.4rem; margin-right: 1.5rem">
      <img src="@/assets/二维码.png" style="height: 100%; width: 100%" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.app-header {
  height: 3.25rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1020;
  background: rgba(29, 40, 53, 0.95);
  display: flex;
  transition: all 0.15s ease-in-out;
}
</style>
