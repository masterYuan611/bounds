<template>
  <div class="bonds-left-filter">
    <div
      class="main"
      v-show="!fold"
    >
      <!-- 分割线上方条件 -->
      <Top
        v-bind="$attrs"
        v-on="$listeners"
        :condition="condition"
        @top-change="handleTopChange"
      />
      <Divider class="divider">
        <span class="divider-dot"></span>
        <span class="divider-text">按住ctrl点击可多选</span>
      </Divider>
      <!-- 方案选择、保存 -->
      <Program
        ref="program"
        :condition="condition"
        @toggle="handleProgram"
      />
      <!-- 分割线下方条件 -->
      <Bottom
        :condition="condition"
        @bottom-change="handleBottomChange"
        @handle-product="handleProduct"
      />
    </div>
    <img
      class="fold"
      :style="{left: foldLeft}"
      src="../../assets/images/fold.png"
      @click="handleFoldToggle"
    />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Divider from '../divider'
import Top from './top.vue'
import Program from './program.vue'
import Bottom from './bottom.vue'

import { topCondition, bottomCondition } from '@/utils/const'

export default {
  components: {
    Divider,
    Top,
    Program,
    Bottom,
  },
  data() {
    return {
      fold: false,
      dynamicWidth: null,
      foldLeft: null,
      condition: {
        top: JSON.parse(JSON.stringify(topCondition)),
        bottom: JSON.parse(JSON.stringify(bottomCondition)),
      },
    }
  },
  props: {
    path: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters(['isCtrl']),
  },
  created() {
    this.$emit('change', 'all', this.condition)
  },
  methods: {
    // 筛选框上面部分变化
    handleTopChange(type) {
      // 债券代码变化
      if (type === 'code') {
        this.$emit('change', 'all', this.condition)
        return
      }
      // 重置
      if (type === 'reset') {
        this.handleReset()
        return
      }
      this.$emit('change', 'hangqing', this.condition)
    },
    handleBottomChange() {
      this.$emit('change', 'all', this.condition)
      this.handleCtrlSelectChange()
    },
    // 重置
    handleReset() {
      this.condition = {
        top: JSON.parse(JSON.stringify(topCondition)),
        bottom: JSON.parse(JSON.stringify(bottomCondition)),
      }
      this.$emit('change', 'reset', this.condition)
      this.handleCtrlSelectChange()
    },
    // 方案相关
    handleProgram(bottomCondition) {
      this.$set(this.condition, 'bottom', bottomCondition)
      this.$emit('change', 'all', this.condition)
    },
    // 产品R或C操作
    handleProduct(products) {
      this.condition.bottom.typ_codei = products
      this.$emit('change', 'all', this.condition)
      this.handleCtrlSelectChange()
    },
    // 筛选框折叠展开
    handleFoldToggle() {
      this.foldLeft = this.fold ? null : '0'
      this.fold = !this.fold
    },
    // 重新选择条件时取消方案高亮状态
    handleCtrlSelectChange() {
      this.$refs.program.cancelActiveStatus()
    },
  },
  //   watch: {
  //     isCtrl: {
  //       handler(val) {
  //         if (!val) {
  //           // 只影响当前页面（keep-alive影响）
  //           if (this.$route.path.indexOf(this.path) > -1) {
  //             this.$emit('change', 'all', this.condition)
  //           }
  //         }
  //       },
  //     },
  //   },
}
</script>

<style lang="less" scoped>
/deep/ .ant-checkbox-checked .ant-checkbox-inner::after {
  border-color: @mainColor;
}
/deep/ .ant-radio-group {
  display: flex;
}
/deep/ .ant-radio-wrapper {
  display: flex;
  align-items: center;
  margin-right: 32px;
}
/deep/ .ant-btn {
  margin-left: 4px;
  width: 60px;
  padding: 0;
  text-align: center;
  font-size: @fontSize_14;
}
.bonds-left-filter {
  height: 100%;
  cursor: pointer;
  .fold {
    position: absolute;
    left: 492px;
    // left: 506px;
    top: calc(50% - 80px);
    width: 14px;
    cursor: pointer;
  }
  .main {
    width: 476px;
    // width: 490px;
    height: 100%;
    overflow: auto;
    // padding: 12px 0 0 12px;
    border: 1px solid rgba(19, 108, 94, 0.5);
    border-radius: 2px;
    &::-webkit-scrollbar {
      width: 6px;
      background-color: rgba(255, 255, 255, 0.08);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: @blockBackground;
    }
    .divider {
      padding-right: 34px;
      padding-left: 12px;
    }
    .divider-dot {
      display: inline-block;
      width: 13px;
      height: 13px;
      margin-right: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
    }
    .divider-text {
      font-size: @fontSize_14;
      color: rgba(255, 255, 255, 0.25);
    }
  }
}
</style>
