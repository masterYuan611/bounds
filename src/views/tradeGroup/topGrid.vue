<template>
  <vxe-grid
    ref="hangqing"
    :style="{'user-select':isShift ? 'none' : null}"
    v-bind="gridOptions"
    :loading="topLoading"
    :columns="topColumns"
    :data="finallyTopData"
    :cell-class-name="getRowClassName"
    @menu-click="handleContextMenuClick"
    @cell-menu="handleCellMenu"
    @cell-dblclick="handleCellDbclick"
    @scroll="handleScroll"
    @sort-change="handleSortChange"
    @cell-click="handleCellClick"
  ></vxe-grid>
</template>

<script>
import topColumns from './topColumns'
import topGrid from './topGrid.js'
import { getGroupPriceList, exportGroupPriceList } from '@/api/tradeGroup'
import { mapGetters } from 'vuex'
import { handleSocketDataFilter, downloadFile } from '@/utils/util'

export default {
  mixins: [topGrid],
  data() {
    return {
      topColumns, // 行情区展示字段
      topData: [], // 行情区列表数据
      hotList: [], // 热点数据
      topLoading: false, // 行情区数据拉取中
      topCondition: {
        currPage: 1,
        pageSize: 50,
        sortFields: '',
        softType: '',
      }, // 行情区分页及排序
      topIsNextPage: true, // 是否是最后一页
      lockScroll: false,
      socketTimer: null, // 控制推送更新频率
      socketList: [], // 推送数据暂存
      insertNum: 0, // 新插入的数据
    }
  },
  props: {
    // 左侧筛选组件条件
    leftCondition: {
      type: Object,
      default: () => ({
        top: {},
        bottom: {},
      }),
    },
    // 行情区分组
    topGroup: {
      type: String,
      default: '',
    },
    // 是否热点置顶
    hotTop: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['socketDataList', 'userInfo']),
    // 行情区列表请求参数
    topParams() {
      return {
        ...this.topCondition,
        searchInfo: {
          group_id: this.topGroup,
          ...this.leftCondition.top,
          ...this.leftCondition.bottom,
          key_word: this.leftCondition.top.key_word.replace(/\s*/g, ''),
        },
      }
    },
    finallyTopData() {
      if (this.hotTop) {
        return this.hotList
          .concat(this.topData.filter((item) => item.is_hot === '0'))
          .map((item, index) => {
            item._XID = `row_${index}`
            return item
          })
      } else {
        return this.topData.map((item, index) => {
          item._XID = `row_${index}`
          return item
        })
      }
    },
    hideQuoter() {
      return this.$XEUtils.debounce((value) => {
        this.$quoter.hide()
      }, 500)
    },
  },
  mounted() {
    document.addEventListener('click', () => {
      this.$quoter.hide()

      this.lockScroll = false
    })
    this.socketTimer = setInterval(() => {
      if (this.socketList.length > 0) {
        console.log('.....现券报价socket-data.......')
        this.socketList.forEach((item) => (item.map.active = true))
        this.handleSocketData(JSON.parse(JSON.stringify(this.socketList)))
        this.socketList = []
      }
    }, 3000)
  },
  methods: {
    // 重新从第一页开始
    refresh() {
      this.topCondition.currPage = 1
      if (this.$refs.hangqing) {
        this.$refs.hangqing.clearScroll() // 清除滚动信息
      }
      this.getTopData()
    },
    // 获取行情列表
    getTopData() {
      this.topLoading = true
      getGroupPriceList(this.topParams)
        .then(({ data }) => {
          const {
            dataList,
            hot_list: hotList = [],
            isNextPage,
            currPage,
          } = data
          if (currPage === 0) {
            this.topData = []
            this.hotList = []
          } else if (currPage === 1) {
            this.topData = dataList
            this.hotList = hotList
          } else {
            this.topData = [...this.topData, ...dataList]
          }
          this.topIsNextPage = isNextPage
          if (!isNextPage && currPage > 1) {
            this.$message.info('已经是最后一页了！')
          }
        })
        .finally(() => {
          this.topLoading = false
        })
    },
    // 滚动分页
    handleScroll({ scrollTop: top, isX }) {
      //   this.hideQuoter() // 关闭报价人员维护信息弹框
      if (isX || this.topLoading) return // 忽略水平滚动,数据请求过程不计算滚动
      const scrollDom = this.$refs.hangqing.$el.getElementsByClassName(
        'vxe-table--body-wrapper'
      )[0]
      const scrollTop = scrollDom.scrollTop
      const clientHeight = scrollDom.clientHeight
      const scrollHeight = scrollDom.scrollHeight
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (!this.topIsNextPage) {
          return
        }
        this.topCondition.currPage += 1
        this.getTopData()
      }
    },
    // 排序
    handleSortChange({ property, order }) {
      this.topCondition = {
        ...this.topCondition,
        sortFields: order ? property : '',
        softType: order || '',
      }
      this.refresh()
    },
    // 清除排序
    handleSortClear() {
      this.$refs.hangqing.clearSort()
      this.topCondition = {
        ...this.topCondition,
        sortFields: '',
        softType: '',
      }
    },
    download() {
      this.$nprogress.start()
      exportGroupPriceList(this.topParams)
        .then((data) => {
          return downloadFile(data, '现券报价')
        })
        .then(() => {
          this.$nprogress.done()
        })
    },
    priceIsMine(row) {
      if (row.price_user_ids) {
        const userList = row.price_user_ids.split(',')
        const index = userList.findIndex((item) => item === this.userInfo.id)
        if (index > -1) {
          return true
        }
      }
      return false
    },
    // 表格行特殊class
    getRowClassName({ row }) {
      if (this.selectedRow && this.selectedRow.id === row.id) {
        return 'row--current'
      } else if (!this.selectedRow && this.selectedRowIds.includes(row._XID)) {
        return 'row--current'
      } else if (row.active) {
        return 'newest-row'
      } else if (this.priceIsMine(row)) {
        return 'my-row'
      }
    },
    setStatus(item) {
      this.$set(item, 'active', true)
      setTimeout(() => {
        this.$set(item, 'active', false)
      }, 5000)
    },
    // 清除推送数据的高亮状态
    clearActive() {
      setTimeout(() => {
        this.topData.forEach((item) => {
          this.$set(item, 'active', false)
        })
        this.hotList.forEach((item) => {
          this.$set(item, 'active', false)
        })
      }, 5000)
    },
    // 插入新的数据时是否滚动到最顶端
    handleSocketScroll() {
      if (this.lockScroll) return
      setTimeout(() => {
        this.$refs.hangqing.clearScroll()
      }, 300)
    },
    // 锁定滚动时进行修正
    fixScrollTop() {
      const { scrollTop, scrollLeft } = this.$refs.hangqing.getScroll()
      if (this.lockScroll) {
        const rowHeight = parseFloat(
          window.getComputedStyle(
            document.getElementsByClassName('vxe-body--row')[0]
          ).height
        )
        console.log(rowHeight, this.insertNum)
        this.$refs.hangqing.scrollTo(
          scrollLeft,
          scrollTop + rowHeight * this.insertNum
        )
      } else {
        this.$refs.hangqing.scrollTo(scrollLeft, 0)
      }
      this.insertNum = 0
    },
    // 行情数据更新推送
    handleSocketData(list) {
      for (let i = 0; i < list.length; i++) {
        const { flag, map } = list[i]
        let isMeetFilter // 是否符合筛选条件
        if (['insert', 'update'].includes(flag)) {
          isMeetFilter = !!handleSocketDataFilter(
            map,
            this.topParams.searchInfo
          )
        }
        if (flag === 'insert') {
          if (isMeetFilter) {
            this.topData = [{ ...map }, ...this.topData]
            // this.setStatus(this.topData[0])
            // this.handleSocketScroll()
            this.insertNum++
            if (map.is_hot === '0') continue
            this.hotList = [{ ...map }, ...this.hotList]
            // this.setStatus(this.hotList[0])
          }
        } else if (flag === 'update') {
          const index = this.topData.findIndex((item) => item.id === map.id)
          const hotIndex = this.hotList.findIndex((item) => item.id === map.id)
          if (isMeetFilter) {
            if (index === -1) {
              this.topData = [{ ...map }, ...this.topData]
              //   this.setStatus(this.topData[0])
              //   this.handleSocketScroll()
              this.insertNum++
            } else {
              this.topData.splice(index, 1)
              this.topData.unshift({ ...map })
              //   this.setStatus(this.topData[0])
              //   this.handleSocketScroll()
            }
            if (map.is_hot === '0') continue
            if (hotIndex === -1) {
              this.hotList = [{ ...map }, ...this.hotList]
              //   this.setStatus(this.hotList[0])
            } else {
              this.hotList.splice(hotIndex, 1)
              this.hotList.unshift({ ...map })
              //   this.setStatus(this.hotList[0])
            }
          } else {
            if (index > -1) {
              this.topData.splice(index, 1)
            }
            if (hotIndex > -1) {
              this.hotList.splice(hotIndex, 1)
            }
          }
        } else if (flag === 'del') {
          const index = this.topData.findIndex((item) => item.id === map.id)
          const hotIndex = this.hotList.findIndex((item) => item.id === map.id)
          if (index > -1) {
            this.topData.splice(index, 1)
          }
          if (hotIndex > -1) {
            this.hotList.splice(hotIndex, 1)
          }
        }
      }
      this.clearActive()
      setTimeout(() => {
        if (this.lockScroll) {
          this.fixScrollTop()
        } else {
          this.$refs.hangqing.clearScroll()
        }
      }, 300)
    },
    // 热点更新推送
    handleSocketHotData(list) {
      for (let i = 0; i < list.length; i++) {
        const { map } = list[i]
        const { price_ids: priceIds, is_hot: isHot } = map
        if (!priceIds) continue
        const priceIdList = priceIds.split(',')
        for (let j = 0; j < priceIdList.length; j++) {
          const priceId = priceIdList[j]
          const index = this.topData.findIndex((item) => item.id === priceId)
          if (index === -1) continue
          if (isHot === '1') {
            this.topData[index].is_hot = '1'
            this.hotList.unshift({ ...this.topData[index] })
            this.setStatus(this.topData[index])
            this.setStatus(this.hotList[0])
          } else {
            this.topData[index].is_hot = '0'
            this.setStatus(this.topData[index])
            const hotIndex = this.hotList.findIndex(
              (item) => item.id === priceId
            )
            if (hotIndex > -1) {
              this.hotList.splice(hotIndex, 1)
            }
          }
        }
      }
    },
    // 行情成交-中债更新
    handleSocketTranEvaData(list) {
      for (let i = 0; i < list.length; i++) {
        const { map } = list[i]
        const { price_ids: priceIds, tran_eva: tranEva } = map
        if (!priceIds) return
        const priceIdList = priceIds.split(',')
        for (let j = 0; j < priceIdList.length; j++) {
          const priceId = priceIdList[j]
          const index = this.topData.findIndex((item) => item.id === priceId)
          const hotIndex = this.hotList.findIndex((item) => item.id === priceId)
          if (index > -1) {
            this.topData[index].tran_eva = tranEva
            this.setStatus(this.topData[index])
          }
          if (hotIndex > -1) {
            this.hotList[hotIndex].tran_eva = tranEva
            this.setStatus(this.hotList[hotIndex])
          }
        }
      }
    },
  },
  watch: {
    socketDataList: {
      deep: true,
      handler({ message_type: messageType, dataList }) {
        if (messageType === 'Type_homepage_group_price') {
          this.socketList.unshift(...dataList)
          //   this.handleSocketData(dataList)
        }
        if (messageType === 'Type_homepage_hot_bond') {
          this.handleSocketHotData(dataList)
        }
        if (messageType === 'Type_homepage_tran_eva') {
          this.handleSocketTranEvaData(dataList)
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
</style>
