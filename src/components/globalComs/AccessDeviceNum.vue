<template>
  <div>
    <div style="font-weight: bold">接入设备数量</div>
    <div class="access">
      <div v-for="(item, index) in accessDevice" :key="index" :class="accessDevice.length > '5' ? 'block-6' : 'block'">
        <span :class="accessDevice.length > '5' ? 'accessnum-6' : 'accessnum'">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['accessDevice'],
}
</script>

<style scoped></style>
