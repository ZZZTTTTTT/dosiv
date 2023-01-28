<template>
  <div>
    <h1>工作台首页</h1>
    <div id="message"></div>
  </div>
</template>

<script>
export default {
  methods: {
    receiveMessage(event) {
      // console.log('子页面接收到消息', event.data)
      if (!event.data.type) {
        document.getElementById('message').innerHTML = '收到' + event.origin + '消息：' + event.data
      }
    },
  },
  mounted() {
    window.onmessage = this.receiveMessage
    parent.postMessage({ retcode: 200 }, '*')
  },
}
</script>

<style></style>
