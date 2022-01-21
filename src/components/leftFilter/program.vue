<template>
  <div
    class="program"
    ref="program"
  >
    <span class="program-title">方案</span>
    <div class="program-main">
      <template v-for="(item, index) in programs">
        <span
          v-if="!item.isEdit"
          :key="index"
          :class="[item.active ? 'selected': '']"
          @click="handleProgramClick(item)"
          @dblclick="handleProgramDblclick(item)"
          @contextmenu.prevent="handleProgramContextmenu($event,item)"
        >{{item.scheme_name}}</span>
        <a-input
          v-else
          :key="index"
          v-model="item.scheme_name"
          ref="programInput"
          @blur="handleProgramInputBlur(item)"
          @pressEnter="handleProgramInputBlur(item)"
        ></a-input>
      </template>
      <a-button
        type="primary"
        @click="handleProgramSave"
      >保存</a-button>
    </div>
    <!-- 方案右键菜单 -->
    <div
      v-show="programMenuVisible"
      class="program-menu"
      :style="programMenuPosition"
      ref="program-menu"
    >
      <a-popconfirm
        title="请确认是否删除该方案?"
        ok-text="确定"
        cancel-text="取消"
        :getPopupContainer="getPopupContainer"
        :overlayStyle="{width: '200px'}"
        @confirm="handleProgramDelete"
      >
        <span @click.stop="">删除方案</span>
      </a-popconfirm>
      <!-- <span @click="handleProgramDelete">删除方案</span> -->
      <span @click="handleProgramRename">重命名</span>
    </div>
  </div>
</template>

<script>
import { bottomCondition } from '@/utils/const'
import {
  addScheme,
  getSchemeList,
  deleteScheme,
  updateScheme,
} from '@/api/optimalBonds'
import { mapGetters } from 'vuex'

export default {
  props: {
    condition: {
      type: Object,
      default() {
        return {
          top: {},
          bottom: {},
        }
      },
    },
  },
  data() {
    return {
      programs: [], // 方案列表
      programMenuPosition: {
        top: 0,
        left: 0,
      }, // 方案右键菜单位置
      programMenuVisible: false, // 菜单显示
      programInMenu: null, // 当前菜单所操作的方案
      timer: null, // 解决单击和双击冲突
      tempProgram: null,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  mounted() {
    document.addEventListener('click', () => {
      this.programMenuVisible = false
    })
    getSchemeList({ user_id: this.userInfo.id }).then(({ data }) => {
      this.programs = data.dataList.map((item) => {
        const jsonStr = item.scheme_json
          .replace('&lt;', '<')
          .replace('&gt;', '>')
        return Object.assign(item, { condition: JSON.parse(jsonStr) })
      })
    })
  },
  methods: {
    // 方案保存
    handleProgramSave() {
      //   const name = `方案${this.programs.length + 1}`
      let i = 1
      let name = ''
      while (true) {
        name = `方案${i}`
        const index = this.programs.findIndex(
          (item) => item.scheme_name === name
        )
        if (index === -1) break
        i++
      }
      addScheme({
        user_id: this.userInfo.id,
        scheme_name: name,
        scheme_json: JSON.stringify(this.condition.bottom),
      }).then(({ data }) => {
        if (data) {
          this.programs.unshift({
            id: parseFloat(data.id),
            scheme_name: name,
            condition: JSON.parse(JSON.stringify(this.condition.bottom)),
          })
          this.$message.success('方案保存成功')
        }
      })
    },
    // 单击方案
    handleProgramClick(item) {
      console.log(item.condition)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (item.active) {
          item.active = false
          this.$emit('toggle', JSON.parse(JSON.stringify(bottomCondition)))
        } else {
          this.programs.forEach((i) => {
            this.$set(i, 'active', false)
          })
          this.$set(item, 'active', true)
          this.$emit('toggle', JSON.parse(JSON.stringify(item.condition)))
        }
      }, 300)
    },
    // 双击方案
    handleProgramDblclick(item) {
      clearTimeout(this.timer)
      this.tempProgram = { ...item }
      this.$set(item, 'isEdit', true)
      setTimeout(() => {
        this.$refs.programInput[0].focus()
      }, 0)
    },
    // 失去焦点
    handleProgramInputBlur(item) {
      const index = this.programs.findIndex(
        (i) => i.id !== item.id && i.scheme_name === item.scheme_name
      )
      if (index > -1) {
        this.$message.warning('已存在相同的方案名，请重新输入！')
        return
      }
      item.isEdit = false
      if (item.scheme_name === this.tempProgram.scheme_name) return
      updateScheme({
        id: item.id,
        user_id: item.user_id,
        scheme_name: item.scheme_name,
      }).then(() => {
        this.$message.success('方案名称修改成功！')
      })
    },
    // 右键菜单
    handleProgramContextmenu(event, item) {
      const { pageX, pageY } = event
      this.programMenuPosition = {
        top: pageY + 'px',
        left: pageX + 'px',
      }
      this.programMenuVisible = true
      this.programInMenu = item
    },
    // 右键删除
    handleProgramDelete() {
      deleteScheme({ id: this.programInMenu.id }).then(() => {
        const index = this.programs.findIndex(
          (item) => item.id === this.programInMenu.id
        )
        this.programs.splice(index, 1)
        this.$message.success('方案删除成功！')
      })
    },
    // 右键重命名
    handleProgramRename() {
      this.$set(this.programInMenu, 'isEdit', true)
      setTimeout(() => {
        this.$refs.programInput[0].focus()
      }, 0)
    },
    // 取消选中状态
    cancelActiveStatus() {
      this.programs.forEach((i) => {
        this.$set(i, 'active', false)
      })
    },
    getPopupContainer() {
      return this.$refs['program-menu']
    },
  },
}
</script>

<style lang="less" scoped>
.program {
  display: flex;
  margin-bottom: 6px;
  text-align: left;
  &-title {
    width: 65px;
    line-height: 28px;
    padding-right: 8px;
    text-align: right;
    font-size: @fontSize_14;
    color: rgba(255, 255, 255, 0.65);
  }
  &-main {
    flex: 1;
    > span {
      display: inline-block;
      margin-right: 4px;
      margin-bottom: 8px;
      //   width: 70px;
      min-width: 70px;
      height: 28px;
      padding: 0 4px;
      line-height: 28px;
      border-radius: 2px;
      background: #172422;
      text-align: center;
      font-size: @fontSize_14;
      &.selected {
        background: #bd7b22;
      }
    }
    /deep/ .ant-btn {
      width: 70px;
      height: 28px;
      margin: 0;
    }
    /deep/ .ant-input {
      margin-right: 4px;
      width: 70px;
      font-family: @fontFamily;
    }
  }
  .program-menu {
    position: fixed;
    top: 0;
    left: 0;
    background: #090f0e;
    > span {
      display: block;
      width: 100px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: #203e3e;
      color: #ece4af;
      font-size: @fontSize_14;
      &:first-child {
        margin-bottom: 2px;
      }
    }
  }
}
</style>
