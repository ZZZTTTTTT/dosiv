<template>
  <div class="main">
    <div class="label">{{ nodeLabel }}</div>
    <!-- <div class="desc">{{ nodeDesc }}</div> -->
  </div>
</template>

<script>
export default {
  name: 'NodeSummary',
  props: {
    nodeLabel: String,
    nodeDesc: String,
  },
}
</script>

<style scoped>
.main {
  /* height: 120px; */
  /* margin-top: 50px;
  margin-left: 20px; */
  padding-top: 20px;
  padding-left: 20px;
}
.label {
  font-size: 35px;
  font-weight: bolder;
  font-family: 'Microsoft Yahei';
}
.desc {
  margin-top: 20px;
}
</style>
