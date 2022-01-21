<template>
  <vxe-grid
    ref="chengjiao"
    v-bind="gridOptions"
    :loading="bottomLoading"
    :columns="bottomColumns"
    :data="finallyBottomData"
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
import bottomColumns from './bottomColumns'
import bottomGrid from './bottomGrid.js'
import { getTodayTranPage, exportTodayTranPage } from '@/api/optimalBonds'
import { mapGetters } from 'vuex'
import { handleSocketDataFilter, downloadFile } from '@/utils/util'

export default {
  mixins: [bottomGrid],
  data() {
    return {
      bottomColumns, // 成交区展示字段
      bottomData: [], // 成交区列表数据
      hotList: [], // 热点数据
      bottomLoading: false, // 成交区数据拉取中
      bottomCondition: {
        currPage: 1,
        pageSize: 50,
        sortFields: '',
        softType: '',
      }, // 成交区分页及排序
      bottomIsNextPage: true, // 是否是最后一页
      lockScroll: false,
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
    bottomGroup: {
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
    ...mapGetters(['socketDataList']),
    bottomParams() {
      return {
        ...this.bottomCondition,
        searchInfo: {
          group_id: this.bottomGroup,
          key_word: this.leftCondition.top.key_word.replace(/\s*/g, ''),
          ...this.leftCondition.bottom,
        },
      }
    },
    finallyBottomData() {
      if (this.hotTop) {
        return [
          ...this.hotList,
          ...this.bottomData.filter((item) => item.is_hot === '0'),
        ]
      } else {
        return [...this.bottomData]
      }
    },
  },
  mounted() {
    document.addEventListener('click', () => {
      this.lockScroll = false
    })
  },
  methods: {
    // 重新从第一页开始
    refresh() {
      this.bottomCondition.currPage = 1
      if (this.$refs.chengjiao) {
        this.$refs.chengjiao.clearScroll() // 清除滚动信息
      }
      this.getBottomData()
    },
    // 获取行情列表
    getBottomData() {
      this.bottomLoading = true
      getTodayTranPage(this.bottomParams)
        .then(({ data }) => {
          const { dataList, hot_list: hotList, isNextPage, currPage } = data
          if (currPage === 0) {
            this.bottomData = []
            this.hotList = []
          } else if (currPage === 1) {
            this.bottomData = dataList
            this.hotList = hotList
          } else {
            this.bottomData = [...this.bottomData, ...dataList]
          }
          this.bottomIsNextPage = isNextPage
          if (!isNextPage && currPage > 1) {
            this.$message.info('已经是最后一页了！')
          }
        })
        .finally(() => {
          this.bottomLoading = false
        })
    },
    // 滚动分页
    handleScroll({ scrollTop: top, isX }) {
      if (isX || this.bottomLoading) return // 忽略水平滚动,数据请求过程不计算滚动
      const scrollDom = this.$refs.chengjiao.$el.getElementsByClassName(
        'vxe-table--body-wrapper'
      )[0]
      const scrollTop = scrollDom.scrollTop
      const clientHeight = scrollDom.clientHeight
      const scrollHeight = scrollDom.scrollHeight
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (!this.bottomIsNextPage) {
          return
        }
        this.bottomCondition.currPage += 1
        this.getBottomData()
      }
    },
    // 排序
    handleSortChange({ property, order }) {
      this.bottomCondition = {
        ...this.bottomCondition,
        sortFields: order ? property : '',
        softType: order || '',
      }
      this.refresh()
    },
    // 清除排序
    handleSortClear() {
      this.$refs.chengjiao.clearSort()
      this.bottomCondition = {
        ...this.bottomCondition,
        sortFields: '',
        softType: '',
      }
    },
    download() {
      this.$nprogress.start()
      exportTodayTranPage(this.bottomParams)
        .then((data) => {
          return downloadFile(data, '今日成交')
        })
        .then(() => {
          this.$nprogress.done()
        })
    },
    // 表格行特殊class
    getRowClassName({ row }) {
      if (row.active) {
        return 'newest-row'
      }
    },
    // 插入新的数据时是否滚动到最顶端
    handleSocketScroll() {
      if (this.lockScroll) return
      setTimeout(() => {
        this.$refs.chengjiao.clearScroll()
      }, 300)
    },
    setStatus(item) {
      this.$set(item, 'active', true)
      setTimeout(() => {
        this.$set(item, 'active', false)
      }, 5000)
    },
    handleSocketData(list) {
      for (let i = 0; i < list.length; i++) {
        const { flag, map } = list[i]
        if (flag === 'insert') {
          if (handleSocketDataFilter(map, this.bottomParams.searchInfo)) {
            this.bottomData = [{ ...map }, ...this.bottomData]
            this.setStatus(this.bottomData[0])
            this.handleSocketScroll()
            if (map.is_hot === '1') {
              this.hotList = [{ ...map }, ...this.hotList]
              this.setStatus(this.hotList[0])
            }
          }
        } else if (flag === 'del') {
          const index = this.bottomData.findIndex((item) => item.id === map.id)
          if (index > -1) {
            this.bottomData.splice(index, 1)
          }
        }
      }
    },
    // 热点更新推送
    handleSocketHotData(list) {
      for (let i = 0; i < list.length; i++) {
        const { map } = list[i]
        const { tran_ids: tranIds, is_hot: isHot } = map
        if (!tranIds) continue
        const tranIdList = tranIds.split(',')
        for (let j = 0; j < tranIdList.length; j++) {
          const tranId = tranIdList[j]
          const index = this.bottomData.findIndex((item) => item.id === tranId)
          if (index === -1) continue
          if (isHot === '1') {
            this.bottomData[index].is_hot = '1'
            this.hotList.unshift({ ...this.bottomData[index] })
            this.setStatus(this.bottomData[index])
            this.setStatus(this.hotList[0])
          } else {
            this.bottomData[index].is_hot = '0'
            this.setStatus(this.bottomData[index])
            const hotIndex = this.hotList.findIndex(
              (item) => item.id === tranId
            )
            if (hotIndex > -1) {
              this.hotList.splice(hotIndex, 1)
            }
          }
        }
      }
    },
  },
  watch: {
    socketDataList: {
      deep: true,
      handler({ message_type: messageType, dataList }) {
        if (messageType === 'Type_homepage_today_tran') {
          this.handleSocketData(dataList)
        }
        if (messageType === 'Type_homepage_hot_bond') {
          this.handleSocketHotData(dataList)
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
</style>
