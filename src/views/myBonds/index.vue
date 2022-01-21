<template>
  <div class="main myBondsPage">
    <div class="searchDiv">
      <div class="cxLeftDiv">
        <ul>
          <li>
            <span>债券搜索</span>
            <AutoComplete
              style="width: 100%;"
              v-model="searchData.searchInfo.key_word"
              @change="handleCodeChange"
            />
          </li>
          <li>
            <span>交易方向</span>
            <a-tree-select
              v-model="searchData.searchInfo.bo"
              style="width: 100%"
              class="selectBo"
              placeholder="请选择报价机构类型"
              allow-clear
              tree-default-expand-all
            >
              <a-tree-select-node
                value="b"
                title="Bid"
              />
              <a-tree-select-node
                value="o"
                title="Ofr"
              />
            </a-tree-select>
          </li>
          <li>
            <span>起始时间</span>
            <!-- <a-date-picker v-model="searchData.searchInfo.beg_d" show-time placeholder="请选择起始时间"/> -->
            <a-time-picker
              :disabledHours='disabledHours'
              :disabledMinutes='disabledMinutes'
              :disabledSeconds='disabledSeconds'
              hideDisabledOptions
              valueFormat='HH:mm:ss'
              placeholder="请选择起始时间"
              v-model="searchData.searchInfo.beg_d"
              :open.sync="open1"
              allow-clear
            >
              <a-button
                slot="addon"
                size="small"
                type="primary"
                @click="clickNow(1)"
              >
                此刻
              </a-button>
              <a-button
                slot="addon"
                size="small"
                type="primary"
                @click="open1=false"
              >
                确定
              </a-button>
            </a-time-picker>
          </li>
          <li>
            <span>结束时间</span>
            <!-- <a-date-picker v-model="searchData.searchInfo.end_d" show-time placeholder="请选择结束时间"/> -->
            <a-time-picker
              :disabledHours='disabledHours'
              :disabledMinutes='disabledMinutes'
              :disabledSeconds='disabledSeconds'
              hideDisabledOptions
              valueFormat='HH:mm:ss'
              placeholder="请选择结束时间"
              v-model="searchData.searchInfo.end_d"
              :open.sync="open2"
            >
              <a-button
                slot="addon"
                size="small"
                type="primary"
                @click="clickNow(2)"
              >
                此刻
              </a-button>
              <a-button
                slot="addon"
                size="small"
                type="primary"
                @click="open2=false"
              >
                确定
              </a-button>
            </a-time-picker>
          </li>
          <li>
            <span>对手机构</span>
            <a-input
              v-model="searchData.searchInfo.org_name"
              placeholder="请输入买方机构"
              allow-clear
            />
          </li>
          <li>
            <span>对手交易员</span>
            <a-input
              v-model="searchData.searchInfo.customer_name"
              placeholder="请输入买方机构"
              allow-clear
            />
          </li>
        </ul>
        <CtrlSelect
          v-show="zk"
          v-for="(item, index) in myOfferCtrSelects"
          :key="index"
          ref="ctrlSelect"
          :title="item.title"
          :options="$data[`${item.key1}`]"
          :selected.sync="condition[`${item.key2}`]"
          :hasChange.sync="hasChange"
          @change="handleCtrlSelectChange"
        />
        <div
          style="margin-bottom:10px;"
          class="mar20"
        >
          <a-button
            type="primary"
            @click="openXx"
            v-if="!zk"
          >
            更多筛选条件
            <a-icon type="caret-down" />
          </a-button>
          <div v-else>
            <p style="text-align:left;color:gray;padding-left:30%">
              <a-icon type="exclamation-circle" />按住ctrl点击可多选
            </p>
            <a-button
              type="primary"
              @click="openXx"
            >
              收起
              <a-icon type="caret-up" />
            </a-button>
          </div>
        </div>
      </div>
      <div class="cxBtnDiv">
        <a-button
          @click="search"
          type="primary"
        > 查询 </a-button>
        <a-button
          @click="reset"
          type="primary"
        > 重置 </a-button>
      </div>
    </div>
    <div class="tableDiv">
      <div class="tableTitle">
        <div>
          <a-button
            @click="copy"
            type="primary"
          >复制</a-button>
          <a-button
            @click="copyAdd"
            type="primary"
          >复制并新增</a-button>
          <a-button
            @click="batchEdit"
            type="primary"
          >批量修改</a-button>
          <a-button
            @click="revoke"
            class="red"
            type="primary"
          >撤销</a-button>
          <a-button
            @click="turnover"
            type="primary"
          >批量成交</a-button>
        </div>
        <img
          v-if="dcShow"
          @click="dc"
          src="../../assets/images/download.png"
        />
        <a-icon
          v-if="!dcShow"
          style="font-size: 16px"
          type="loading"
        />
      </div>
      <div class="gridDiv">
        <vxe-grid
          ref="hangqing"
          show-overflow
          v-bind="gridOptions"
          :loading="topLoading"
          :columns="columns"
          :edit-config="{trigger: 'dblclick', mode: 'cell', activeMethod: activeMethod}"
          :data="tableList"
          @cell-dblclick="handleCellDbclick"
          @scroll="handleScroll"
          @edit-actived="editActived"
          @sort-change='sortChange'
          @menu-click="(menu) => handleContextMenuClick(menu, 'hangqing')"
        ></vxe-grid>
      </div>
    </div>
    <div
      v-if="visible"
      class="popDiv"
    >
      <div
        class="moveDiv"
        v-drag
      >
        <p>批量修改
          <a-icon
            @click="popClose"
            type="close"
          />
        </p>
        <ul @mousedown.stop=''>
          <li>
            <span>价格</span>
            <a-input
              @input="inputNumber($event, popData.price, 'price')"
              v-model="popData.price"
              placeholder="请输入价格"
            />
          </li>
          <li>
            <span>对手机构</span>
            <a-input
              v-model="popData.org_name"
              placeholder="请输入对手机构"
            />
          </li>
          <li>
            <span>面额</span>
            <a-input
              @input="inputNumber($event, popData.vol, 'vol')"
              v-model="popData.vol"
              placeholder="请输入数量"
            />
          </li>
          <li>
            <span>对手交易员</span>
            <a-input
              v-model="popData.customer_name"
              placeholder="对手交易员"
            />
          </li>
        </ul>
        <div>
          <a-button
            @click="confirmEdit"
            size="large"
          >提交</a-button>
          <a-button
            size="large"
            type="primary"
            @click="popClose"
          >取消</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import columns from './columns'
import CtrlSelect from '../../components/ctrlSelect'
import gridMixin from './grid.js'
import { dealState, quotationSource, myOfferCtrSelects } from '@/utils/const'
import moment from 'moment'
import {
  getMyBondsList,
  quotePrice,
  revokePrice,
  exportBond,
} from '@/api/myBonds.js'
import XEClipboard from 'xe-clipboard'
import { mapMutations, mapGetters } from 'vuex'
export default {
  mixins: [gridMixin],
  components: {
    CtrlSelect,
  },
  data() {
    return {
      visible: false,
      zk: false,
      dcShow: true,
      popData: {
        is_hot: null,
        term: null,
        code: null,
        name: null,
        bo: null,
        price: null,
        xh: null,
        pri_eva: null,
        vol: null,
        volxh: null,
        org_name: null,
        customer_name: null,
        eva: null,
        level: null,
        operator_name: null,
      },
      moment,
      open1: false,
      open2: false,
      isNextPage: true,
      searchData: {
        currPage: 1,
        pageSize: 20,
        softType: 'desc',
        sortFields: 'price_dt',
        searchInfo: {
          key_word: '',
          user_id: '',
          beg_d: '',
          end_d: '',
          bo: null,
          org_name: '',
          customer_name: '',
          state: '',
          src: '',
        },
      },
      topLoading: false,
      columns,
      tableList: [],
      dealState,
      quotationSource,
      myOfferCtrSelects,
      condition: {
        dealState: [], // 成交状态
        quotationSource: [], // 报价来源
      },
      hasChange: false, // 按住ctrl后是否点选了多选区选项
    }
  },
  computed: {
    ...mapGetters(['isCtrl']),
  },
  watch: {
    isCtrl: {
      handler(val) {
        // 释放ctrl键
        if (!val && this.hasChange) {
          this.handleCtrlSelectChange()
        }
        if (val) {
          this.hasChange = false
        }
      },
    },
  },
  created() {
    this.getTableList()
  },
  mounted() {
    this.$nextTick(() => {
      this.setTableHeight()
    })
    window.editRow = this.editRow
    window.isHot = this.isHot
  },
  activated() {
    this.search()
  },
  methods: {
    ...mapMutations('app', ['setCachedPath']),
    editActived() {
      this.$nextTick(() => {
        document.querySelectorAll('.vxe-table--render-wrapper input')[0].focus()
      })
    },
    inputNumber($event, val, key) {
      this.popData[key] = $event.target.value.replace(/[^0-9.-]/g, '')
      console.log(this.popData[key])
    },
    numCl(val, key) {
      if (val !== '-' && val !== '--') {
        if (parseFloat(val)) {
          this.popData[key] = parseFloat(val)
        } else {
          if (parseFloat(val) === 0) {
            this.popData[key] = '0'
          } else {
            this.popData[key] = null
          }
        }
      }
    },
    // 判断只有未成交才能编辑表格内容
    activeMethod({ row }) {
      if (row.state !== '1') {
        return false
      } else {
        return true
      }
    },
    openXx() {
      this.zk = !this.zk
      this.setTableHeight()
    },
    // 修改表格中报价
    editRow(row) {
      quotePrice({
        dataList: [row],
        loginOperator: this.$store.getters.userInfo.code,
      })
        .then((res) => {
          this.$message.success('修改数据成功', 1)
          const $table = this.$refs.hangqing
          $table.clearActived()
        })
        .catch(() => {})
    },
    // 筛选
    handleCtrlSelectChange() {
      this.searchData.searchInfo.state = this.condition.state
      this.searchData.searchInfo.src = this.condition.src
      this.search()
    },
    // 导出
    dc() {
      var data = JSON.parse(JSON.stringify(this.searchData))
      if (!data.searchInfo.bo) {
        data.searchInfo.bo = ''
      }
      data.searchInfo.user_id = this.$store.getters.userInfo.id
      this.dcShow = false
      exportBond(data)
        .then((res) => {
          var blob = new Blob([res])
          const elink = document.createElement('a')
          elink.download = '我的报价.xls'
          elink.href = URL.createObjectURL(blob)
          elink.click()
          this.dcShow = true
        })
        .catch(() => {
          this.dcShow = true
          this.$message.error('导出失败', 1)
        })
    },
    // 批量成交
    turnover() {
      // 获取所有选中行
      const selectListData = this.$refs.hangqing.getCheckboxRecords()
      if (selectListData.length < 1) {
        this.$message.warning('请选择要批量成交的表格数据行', 1)
        return false
      }
      const cannotArr = []
      const goodArr = []
      selectListData.forEach((item) => {
        if (item.state === '4' || item.state === '3') {
          // 根据row获取索引（数组下标）
          var itemIndex = this.$refs.hangqing.getRowIndex(item)
          cannotArr.push(itemIndex + 1)
        } else {
          goodArr.push(item)
        }
      })
      if (cannotArr.length === selectListData.length) {
        this.$message.warning(`没有可以成交的数据`, 1)
        return false
      }
      this.$store.commit('transcation/setTranscationList', goodArr)
      this.setCachedPath({
        path: { title: '新增成交', path: '/layout/newTransaction' },
        flag: 'add',
      })
      this.$router.push({ name: 'newTransaction' })
    },
    // 撤销
    revoke() {
      // 获取所有选中行
      const selectListData = this.$refs.hangqing.getCheckboxRecords()
      if (selectListData.length < 1) {
        this.$message.warning('请选择要撤销的表格数据行', 1)
        return false
      }
      const wcj = []
      const cantcx = []
      const idsArr = []
      selectListData.forEach(item => {
        var itemIndex = this.$refs.hangqing.getRowIndex(item)
        if (item.state === '3' || item.state === '4') {
          cantcx.push(itemIndex + 1)
        } else {
          if (item.state === '1') {
            wcj.push(itemIndex + 1)
          }
          idsArr.push(item.id)
        }
      })
      if (idsArr.length < 1) {
        this.$message.warning('没有可撤销的报价！')
        return false
      }
      if (wcj.length > 0) {
        this.confirmRevoke('撤销后，已发布的未成交报价将不会显示在行情中，请问是否继续撤销？', idsArr, cantcx)
      } else {
        this.confirmRevoke('是否继续撤销？', idsArr, cantcx)
      }
    },
    // 撤销确认提示框
    confirmRevoke(wz, idsArr, cantcx) {
      // 获取所有选中行
      // const selectListData = this.$refs.hangqing.getCheckboxRecords()
      const me = this
      this.$confirm({
        title: '是否撤销?',
        content: wz,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          if (cantcx.length > 0) {
            me.$message.error(
              `序号${cantcx.join(
                ','
              )}不能被撤销！`,
              1
            )
          }
          revokePrice({
            id: idsArr.join(','),
            user_id: me.$store.getters.userInfo.id,
          })
            .then((res) => {
              // const tj = []
              // selectListData.forEach((item) => {
              //   // 根据row获取索引（数组下标）
              //   var itemIndex = me.$refs.hangqing.getRowIndex(item)
              //   switch (item.state) {
              //     case '1':
              //       me.$set(me.tableList[itemIndex], 'state', '4')
              //       tj.push(itemIndex + 1)
              //       break
              //     case '2':
              //       me.$set(me.tableList[itemIndex], 'state', '1')
              //       tj.push(itemIndex + 1)
              //       break
              //   }
              // })
              // if (tj.length > 0) {
              //   me.$message.success(`序号${tj.join(',')}撤销成功`, 1)
              // }
              me.search()
              me.$message.success(`撤销成功`, 1)
            })
            .catch(() => {})
        },
        onCancel() {},
      })
    },
    // 弹窗关闭
    popClose() {
      this.popData = {
        is_hot: null,
        term: null,
        code: null,
        name: null,
        bo: null,
        price: null,
        xh: null,
        pri_eva: null,
        vol: null,
        volxh: null,
        org_name: null,
        customer_name: null,
        eva: null,
        level: null,
        operator_name: null,
      }
      this.visible = false
    },
    // 批量修改
    batchEdit() {
      const selectListData = this.$refs.hangqing.getCheckboxRecords()
      if (selectListData.length < 1) {
        this.$message.warning('请选择需要批量修改的表格数据行', 1)
        return false
      }
      const errArr = []
      selectListData.forEach((item, index) => {
        var itemIndex = this.$refs.hangqing.getRowIndex(item)
        if (item.state !== '1') {
          errArr.push(itemIndex + 1)
        }
      })
      if (errArr.length > 0) {
        this.$message.warning(
          `序号${errArr.join(',')}的成交状态不是未成交，不能修改`,
          1
        )
        return false
      }
      this.visible = true
    },
    // 确认批量修改
    async confirmEdit() {
      const me = this
      if (
        !/^\d{1,8}$|^\d{1,8}[.]\d{1,4}$/.test(me.popData.vol) &&
        me.popData.vol &&
        me.popData.vol !== '-' &&
        me.popData.vol !== '--'
      ) {
        this.$message.warning('面额限制范围8位整数，4位小数', 1)
        return false
      }
      if (
        !/^\d{1,4}$|^\d{1,4}[.]\d{1,4}$/.test(me.popData.price) &&
        me.popData.price &&
        me.popData.price !== '-' &&
        me.popData.price !== '--'
      ) {
        this.$message.warning('价格限制范围4位整数，4位小数', 1)
        return false
      }
      // 获取所有选中行
      const selectListData = this.$refs.hangqing.getCheckboxRecords()
      const flPopData = JSON.parse(JSON.stringify(this.popData))
      selectListData.forEach((item) => {
        // 根据row获取索引（数组下标）
        var itemIndex = this.$refs.hangqing.getRowIndex(item)
        if (flPopData.vol > 0) {
          this.$set(this.tableList[itemIndex], 'vol', flPopData.vol)
        } else if (flPopData.vol === '-' || flPopData.vol === '--' || flPopData.vol === '0') {
          this.$set(this.tableList[itemIndex], 'vol', '--')
        }
        if (flPopData.price > 0) {
          this.$set(this.tableList[itemIndex], 'price', flPopData.price)
        } else if (flPopData.price === '-' || flPopData.price === '--' || flPopData.price === '0') {
          this.$set(this.tableList[itemIndex], 'price', '--')
        }
        if (flPopData.bo) {
          if (flPopData.bo === 'o') {
            flPopData.bo = 'Ofr'
          } else {
            flPopData.bo = 'Bid'
          }
          this.$set(this.tableList[itemIndex], 'bo', flPopData.bo)
        }
        if (flPopData.org_name) {
          this.$set(this.tableList[itemIndex], 'org_name', flPopData.org_name)
        }
        if (flPopData.customer_name) {
          this.$set(
            this.tableList[itemIndex],
            'customer_name',
            flPopData.customer_name
          )
        }
      })
      const ajaxData = JSON.parse(JSON.stringify(this.$refs.hangqing.getCheckboxRecords()))
      ajaxData.forEach(item => {
        if (item.bo === 'Ofr') {
          item.bo = 'o'
        } else {
          item.bo = 'b'
        }
      })
      quotePrice({
        dataList: ajaxData,
        loginOperator: this.$store.getters.userInfo.code,
      })
        .then((res) => {
          this.search()
          this.$message.success('批量修改数据成功', 1)
        })
        .catch(() => {})
      this.visible = false
      this.popData = {
        is_hot: null,
        term: null,
        code: null,
        name: null,
        bo: null,
        price: null,
        xh: null,
        pri_eva: null,
        vol: null,
        volxh: null,
        org_name: null,
        customer_name: null,
        eva: null,
        level: null,
        operator_name: null,
      }
    },
    // 复制并新增
    copyAdd() {
      const selectListData = this.$refs.hangqing.getCheckboxRecords()
      this.$store.commit('newBonds/setMyBondsList', selectListData)
      this.setCachedPath({
        path: { title: '新增报价', path: '/layout/newBonds' },
        flag: 'add',
      })
      this.$router.push('/layout/newBonds')
    },
    // 复制
    copy() {
      const selectListData = this.$refs.hangqing.getCheckboxRecords()
      if (selectListData.length < 1) {
        this.$message.warning('请选择要复制的行', 1)
        return false
      }
      let copyStr = ''
      selectListData.forEach((item) => {
        if (item.is_ask === '否') {
          item.is_ask = ''
        } else if (item.is_ask === '必须请示') {
          item.is_ask = '**'
        } else if (item.is_ask === '需请示') {
          item.is_ask = '*'
        }
        copyStr += `${item.term || '--'} ${item.code || '--'} ${
          item.name || '--'
        } ${
          item.bo === 'Bid'
            ? `${item.price > 0 ? item.price : 'Bid'}/--`
            : `--/${item.price > 0 ? item.price : 'Ofr'}`
        }${item.is_ask} ${
          item.bo === 'Bid'
            ? `${item.vol > 0 ? item.vol : '--'}/--`
            : `--/${item.vol > 0 ? item.vol : '--'}`
        } ${item.level || '--'} 中债 ${item.eva || '--'}\n`
      })
      if (XEClipboard.copy(copyStr)) {
        if (copyStr) {
          this.$message.success('报价信息已复制到剪贴板！', 1)
        } else {
          this.$message.warning('无债券信息可复制', 1)
        }
      }
    },
    // 查询
    search() {
      this.tableList = []
      this.searchData.currPage = 1
      this.getTableList()
    },
    // 排序
    sortChange(sortObj) {
      if (!sortObj.order || !sortObj.property) {
        this.searchData.softType = 'desc'
        this.searchData.sortFields = 'price_dt'
      } else {
        this.searchData.softType = sortObj.order
        this.searchData.sortFields = sortObj.property
      }
      this.tableList = []
      this.searchData.currPage = 1
      this.getTableList()
    },
    // 获取表格列表
    getTableList() {
      this.topLoading = true
      var data = JSON.parse(JSON.stringify(this.searchData))
      if (!data.searchInfo.bo) {
        data.searchInfo.bo = ''
      }
      data.searchInfo.user_id = this.$store.getters.userInfo.id
      getMyBondsList(data)
        .then((res) => {
          this.isNextPage = res.data.isNextPage
          if (
            !this.isNextPage &&
            res.data.dataList.length > 0 &&
            this.searchData.currPage > 1
          ) {
            this.$message.info({
              content: '已经是最后一页了',
              duration: 1,
              onClose: () => {},
            })
          }
          res.data.dataList.forEach((item) => {
            this.tableList.push(item)
          })
          this.topLoading = false
        })
        .catch(() => {
          this.topLoading = false
        })
    },
    // 表格高度计算
    setTableHeight() {
      setTimeout(() => {
        var documenH = document.querySelector('.main').clientHeight
        var countHeight = document.querySelector('.searchDiv').clientHeight
        var tableDivHeight = documenH - countHeight
        document.querySelector('.tableDiv').style.height = `${
          tableDivHeight - 10
        }px`
        document.querySelector('.gridDiv').style.height = `${
          document.querySelector('.tableDiv').clientHeight -
          document.querySelector('.tableTitle').clientHeight -
          20
        }px`
      }, 20)
    },
    handleScroll({ type, scrollTop, scrollLeft, isX, isY, $event }) {
      if (isY) {
        console.log(scrollTop)
        const scrollHeight = document.querySelector(
          '.vxe-table--body-wrapper'
        ).scrollHeight
        const clientHeight = document.querySelector(
          '.vxe-table--body-wrapper'
        ).clientHeight
        if (this.isNextPage) {
          if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            !this.topLoading
          ) {
            this.topLoading = true
            this.searchData.currPage++
            this.getTableList()
          }
        }
      }
    },
    // 重置
    reset() {
      this.searchData.searchInfo = {
        key_word: '',
        user_id: '',
        beg_d: '',
        end_d: '',
        bo: null,
        org_name: '',
        customer_name: '',
        state: '',
        src: '',
      }
      this.$refs.ctrlSelect[0].handleAll(true)
      this.$refs.ctrlSelect[1].handleAll(true)
      this.search()
    },
    handleCodeChange() {
      this.$emit('top-change', 'code')
    },
    disabledHours() {
      return [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23, 24]
    },
    disabledMinutes(selectedHour) {
      const allArr = []
      if (selectedHour === 18) {
        for (let i = 0; i < 60; i++) {
          allArr.push(i + 1)
        }
      }
      return allArr
    },
    disabledSeconds(selectedHour, selectedMinute) {
      const allArr = []
      if (selectedHour === 18) {
        for (let i = 0; i < 60; i++) {
          allArr.push(i + 1)
        }
      }
      return allArr
    },
    // 此刻
    clickNow(val) {
      if (val === 1) {
        this.searchData.searchInfo.beg_d = this.moment().format('HH:mm:ss')
        this.open1 = false
      } else if (val === 2) {
        this.searchData.searchInfo.end_d = this.moment().format('HH:mm:ss')
        this.open2 = false
      }
    },
    // 相同代码，设置其中一个热点其他跟着联动
    isHot(code, hot) {
      if (hot === '0') {
        hot = '1'
      } else {
        hot = '0'
      }
      this.tableList.forEach((item, index) => {
        if (item.code === code) {
          this.$set(this.tableList[index], 'is_hot', hot)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
@themeColor: rgba(19, 108, 94, 0.5);
// 表格枚举颜色
/deep/ .redState {
  color: #df6565;
}
/deep/ .blueState {
  color: #6d75db;
}
/deep/ .greenState {
  color: @themeColor;
}
/deep/ .row--current {
  background-color: #aa6e3f !important;
}
/deep/ thead {
  background-color: #090f0e;
}
/deep/ .vxe-body--row {
  background-color: #1c3323;
}
/deep/ .ctrl-select .main .top > span {
  width: 90px;
}
/deep/ .ant-input-clear-icon {
  color: @mainColor;
}
/deep/ .ant-time-picker-clear {
  z-index: 4;
  opacity: 1;
  color: @mainColor;
  /deep/ svg {
    opacity: 1 !important;
  }
}
/deep/ .ant-select-arrow-icon,
/deep/ .ant-time-picker-clock-icon {
  color: rgba(255, 255, 255, 0.2);
}
/deep/ .selectBo{
  .ant-select-selection__clear{
    display: inline-block !important;
    &:hover{
      display: inline-block !important;
    }
  }
}
.ctrl-select {
  /deep/ .title {
    width: 80px;
  }
}
.bonds-main {
  padding-bottom: 0px !important;
}
.main {
  .searchDiv {
    display: flex;
    .cxLeftDiv {
      width: 85%;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          display: flex;
          align-items: center;
          width: 25%;
          margin-bottom: 20px;
          padding-left: 0.8%;
          span {
            width: 22%;
            text-align: left;
            margin-right: 10px;
          }
          .ant-input,
          .ant-time-picker {
            width: 65%;
            margin-right: 0;
          }
          .ant-input-affix-wrapper {
            width: 65%;
            margin-right: 0;
            /deep/ .ant-input {
              text-align: left;
            }
          }
          /deep/.ant-select {
            width: 65% !important;
            margin-right: 0;
          }
        }
      }
    }
    .cxBtnDiv {
      width: 15%;
      display: flex;
      justify-content: space-around;
      padding: 0 30px;
      button {
        &:last-child {
          background: #3053eb;
          border-color: #3053eb;
        }
      }
    }
  }
  .tableDiv {
    border: 1px solid @themeColor;
    padding: 10px;
    overflow: hidden;
    box-sizing: border-box;
    .tableTitle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      > div {
        display: flex;
        button {
          display: flex;
          width: 100px;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
        }
        .red {
          background: #ec482e;
          border-color: #ec482e;
        }
      }
      img {
        width: 20px;
        cursor: pointer;
      }
    }
  }
}
.popDiv {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 5;
  > div {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    position: absolute;
    width: 800px;
    background: #203e3e;
    color: #c3cbcb;
    border-radius: 3px;
    > p {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 12px;
      font-size: @fontSize_18;
      i {
        cursor: pointer;
      }
    }
    > ul {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 10px 0 10px;
      border-top: 1px solid #2c4949;
      border-bottom: 1px solid #2c4949;
      li {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        span {
          margin-right: 10px;
        }
        &:nth-child(2n + 1) {
          width: 45%;
          justify-content: flex-start;
        }
        &:nth-child(2n) {
          width: 55%;
          justify-content: flex-end;
        }
        input {
          width: 300px;
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            appearance: none !important;
          }
        }
        /deep/ .ant-select {
          width: 300px !important;
        }
      }
    }
    > div {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        &:first-child {
          margin-right: 50px;
        }
      }
    }
  }
}
</style>
