<template>
  <div @click="toggleClick">
    <i
      :style="{ 'font-size': '30px' }"
      :class="[$store.state.user.themeStyle === 'theme-dark' ? 'hamburger-icon-dark' : 'hamburger-icon-light']"
      class="el-icon-s-operation"
    />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    },
  },
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
.hamburger-icon-dark:hover {
  color: #fff;
}
.hamburger-icon-light:hover {
  color: #000;
}
</style>
