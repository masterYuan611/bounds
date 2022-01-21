<template>
  <div class="ctrl-select">
    <span class="title">{{title}}</span>
    <div class="main">
      <div class="top">
        <span
          :class="[selectedArr.length === 0 ? 'selected': '']"
          @click="handleAll(false)"
        >全部</span>
        <slot name="extra"></slot>
        <span
          v-for="(item, index) in options"
          :key="index"
          :class="[
            item.value === '--' ? 'hidden' : '',
            selectedArr.includes(item.value) ? 'selected': '',
            item.width === 'auto'? 'width-auto': '',
          ]"
          @click="handleClick(item)"
        >{{item.label}}</span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * 监听组件变化两种方式
 * 1.watch selectedArr对应的父组件数据
 * 2.绑定change自定义事件
 */
import { mapGetters } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: String,
      default: '',
    },
    hasChange: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['isCtrl']),
    selectedArr() {
      return this.selected.split(',').filter((item) => item)
    },
  },
  methods: {
    handleClick(item) {
      if (this.isCtrl) {
        this.$emit('update:hasChange', true)
      }
      if (this.isCtrl && this.options.length > 2) {
        this.handleMultipleChoice(item)
      } else {
        this.handleSingleChoice(item)
      }
    },
    // 单选（立即执行）
    handleSingleChoice(item) {
      //   const index = this.selectedArr.findIndex((i) => i === item.value)
      //   const clone = JSON.parse(JSON.stringify(this.selectedArr))
      //   if (index > -1) {
      //     clone.splice(index, 1)
      //     this.$emit('update:selected', clone.join(','))
      //     if (this.isCtrl) return
      //     this.$emit('change', clone.join(','))
      //   } else {
      //     this.$emit('update:selected', item.value)
      //     if (this.isCtrl) return
      //     this.$emit('change', item.value)
      //   }
      this.$emit('update:selected', item.value)
      if (this.isCtrl) return
      this.$emit('change', item.value)
    },
    // 多选（释放ctrl后执行）
    handleMultipleChoice(item) {
      const index = this.selectedArr.findIndex((i) => i === item.value)
      const clone = JSON.parse(JSON.stringify(this.selectedArr))
      if (index > -1) {
        clone.splice(index, 1)
        this.$emit('update:selected', clone.join(','))
      } else {
        clone.push(item.value)
        this.$emit('update:selected', clone.join(','))
      }

      //   this.$emit('change', clone.join(','))
    },
    // isBlock用于是否阻断拦截事件,防止同时发起多个请求，例如：历史报价中的重置按钮
    handleAll(isBlock) {
      this.$emit('update:selected', '')
      console.log(isBlock)
      if (!isBlock) {
        this.$emit('change', '')
      }
    },
    choseIndx(val, isBlock) {
      this.$emit('update:selected', val)
      if (!isBlock) {
        this.$emit('change', val)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.ctrl-select {
  display: flex;
  margin-bottom: 6px;
  .title {
    width: 65px;
    line-height: 28px;
    padding-right: 8px;
    text-align: right;
    font-size: @fontSize_14;
    color: rgba(255, 255, 255, 0.65);
  }
  .main {
    flex: 1;
    text-align: left;
    cursor: pointer;
    .top {
      > span {
        display: inline-block;
        margin-right: 4px;
        margin-bottom: 8px;
        width: 70px;
        height: 28px;
        line-height: 28px;
        border-radius: 2px;
        background: #172422;
        text-align: center;
        font-size: @fontSize_14;
        &.selected {
          background: #bd7b22;
        }
        &.hidden {
          visibility: hidden;
        }
        &:nth-child(5n) {
          margin-right: 0;
        }
        &.width-auto {
          width: auto;
          padding: 0 4px;
        }
      }
    }
  }
}
</style>
