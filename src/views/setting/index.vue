<template>
  <div class="setting">
    <div class="top">
      <div class="secret">
        <span class="font14">保密</span>
        <div class="splitLine"></div>
        <span>隐藏我填报数据中的机构名称</span>
        <a-switch
          default-checked
          @change="secretChange"
          class="switch"
          v-model="isHideOrg"
        />
        <p class="tip">(选择后，其他人将无法看到，搜索你填写的报价，成交信息中的买/卖方机构名称)</p>
      </div>
      <div
        class="admin"
        v-if="isadmin"
      >
        <span class="font14">管理员</span>
        <div class="splitLine"></div>
        <ul class="adminer">
          <li
            v-for="item in system"
            :key="item.code"
          >
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>
    <div
      class="bottom"
      v-if="isadmin"
    >
      <span class="font14">权限管理&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <a-input
        placeholder="请输入姓名"
        allowClear
        v-model="filterName"
        style="width: 200px"
      />
      <div class="employtable">
        <vxe-grid
          ref="setting"
          v-bind="gridOptions"
          :columns="columns"
          :data="tableShowData"
          :highlightCurrentRow="false"
          :checkbox-config="{
            checkAll: true
          }"
        ></vxe-grid>
      </div>
    </div>
  </div>
</template>

<script>
import gridMixin from '@/mixins/grid'
import { getSetupPage, saveUserSetup, saveHideOrg } from '@/api/setting'
import { mapGetters, mapMutations } from 'vuex'
import { getGroupList } from '@/api/user'
import columns from './columns'
export default {
  mixins: [gridMixin],
  data() {
    return {
      columns,
      system: [],
      isHideOrg: false,
      tableData: [],
      isadmin: false,
      filterName: '',
    }
  },
  created() {
    this.getSetupPage()
    this.isadmin = this.userInfo.is_admin === '1'
    this.init()
    window.saveItem = this.saveItem
  },
  mounted() {
    this.$nextTick(() => {
      this.setTableHeight()
    })
  },
  computed: {
    ...mapGetters(['userInfo']),
    tableShowData() {
      return this.tableData.filter(
        (item) => item.name.indexOf(this.filterName) > -1
      )
    },
  },
  methods: {
    ...mapMutations('user', ['setGroups']),
    init() {
      getGroupList().then(({ data }) => {
        window.groups = []
        data.dataList.forEach((item) => {
          window.groups.push({
            label: item.group_name,
            value: item.id,
          })
        })
      })
    },
    saveItem(row) {
      const req = {
        id: row.id,
        is_gather: row.is_gather ? '1' : '0',
        group_ids: row.group_ids.join(','),
        is_view_tran: row.is_view_tran ? '1' : '0',
        qq: row.qq,
        qt_no: row.qt_no,
      }
      saveUserSetup(req).then(() => {
        this.$message.success('设置成功', 3)
        this.getSetupPage()
      })
    },
    getSetupPage() {
      getSetupPage({ user_id: this.userInfo.id }).then(({ data: res }) => {
        this.system = res.system
        this.tableData = res.dataList
        this.tableData.forEach((item) => {
          item.isEdit = true
        })
        this.tableData.forEach((item) => {
          item.is_gather = item.is_gather === '1'
          return item.is_gather
        })
        this.tableData.forEach((item) => {
          item.is_view_tran = item.is_view_tran === '1'
          return item.is_gather
        })
        this.tableData.forEach((item) => {
          if (!item.group_ids.trim()) {
            item.group_ids = []
          } else {
            item.group_ids = item.group_ids.split(',')
          }
          return item.group_ids
        })
        this.isHideOrg = res.is_hide_org === '1'
      })
    },
    secretChange(checked) {
      let isHideOrg = '0'
      if (checked) {
        isHideOrg = '1'
      }
      saveHideOrg({ id: this.userInfo.id, is_hide_org: isHideOrg }).then(() => {
        this.$message.success('设置成功', 3)
      })
    },
    setTableHeight() {
      setTimeout(() => {
        var documenH = document.querySelector('.bottom').clientHeight
        var tableDivHeight = documenH - 50
        document.querySelector(
          '.employtable'
        ).style.height = `${tableDivHeight}px`
      }, 20)
    },
  },
}
</script>

<style lang="less" scoped>
/deep/.ant-input-search-icon {
  color: @mainColor;
}
/deep/.ant-select-arrow {
  color: @mainColor;
}
/deep/.ant-input-clear-icon {
  color: @mainColor;
}
/deep/.edit {
  background: #136C5E;
  color:#f7e1af;
  height: 30px;
  line-height: 30px;
}
/deep/.unedit{
  background: gray;
  color:#f7e1af;
  height: 30px;
  line-height: 30px;
}
/deep/.unedit:hover{
  background: gray;
  color:#f7e1af;
}
.font14 {
  font-size: 14px;
}
.ant-switch {
  background-color: gray;
}
.ant-switch-checked {
  background-color: @blockBackground;
}
.setting {
  overflow-y: hidden;
  .ant-switch-loading-icon,
  .ant-switch::after {
    background-color: white;
  }
  .splitLine {
    width: 100%;
    opacity: 1;
    border: 1px solid #1b4b2a;
    margin: 10px 0;
  }
  display: flex;
  flex-direction: column;
  .top {
    height: 30%;
    display: flex;
    flex-direction: column;
    text-align: left;
    .secret {
      font-family: PingFangSC-Medium;
      flex: 1;
      font-size: 16px;
      .switch {
        margin-left: 10px;
      }
      .tip {
        opacity: 0.8;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.65);
        margin-top: 10px;
      }
    }
    .admin {
      flex: 1;
      list-style: none;
      .adminer {
        li {
          width: 95px;
          height: 32px;
          line-height: 32px;
          margin-right: 10px;
          text-align: center;
          float: left;
          opacity: 1;
          background: #213225;
          border-radius: 2px 2px 0px 0px;
        }
      }
    }
  }
  .bottom {
    padding: 10px;
    height: 70%;
    text-align: left;
    border: 1px solid rgba(19, 108, 94, 0.5);
    .employtable {
      margin-top: 10px;
    }
    /deep/.ant-switch {
      background-color: gray;
    }
    /deep/.ant-switch.ant-switch-checked {
      background-color: @blockBackground;
    }
    /deep/.ant-switch::after {
      background-color: @mainColor;
    }
    /deep/.ant-select-selection__choice {
      background-color: gray;
      border: none;
    }
  }
}
</style>
