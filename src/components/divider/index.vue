<template>
  <div class="divider">
    <span class="line"></span>
    <div class="content">
      <slot></slot>
    </div>
    <span class="line"></span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.divider {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 0;
  .line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.12);
  }
  .content {
    padding: 0 16px;
  }
}
</style>
