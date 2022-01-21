<template>
  <div class="grouping">
    <span
      v-for="(item, index) in groups"
      :key="index"
      class="grouping-item"
      :class="[item.id === active ? 'active': '']"
      @click="handleItemClick(item)"
    >
      {{item.group_name}}
    </span>
  </div>
</template>

<script>
/**
 * 监听组件变化两种方式
 * 1.watch active对应的父组件数据
 * 2.绑定change自定义事件
 */
import { mapGetters } from 'vuex'

export default {
  props: {
    active: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters(['groups']),
  },
  methods: {
    handleItemClick(item) {
      this.$emit('update:active', item.id)
      this.$emit('change', item.id)
    },
  },
}
</script>

<style lang="less" scoped>
.grouping {
  display: flex;
  font-size: @fontSize_14;
  &-item {
    width: 95px;
    height: 32px;
    line-height: 32px;
    margin-right: 4px;
    background: #213225;
    border-radius: 2px 2px 0px 0px;
    cursor: pointer;
    &.active {
      background: @blockBackground;
    }
  }
}
</style>
