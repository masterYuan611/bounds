<template>
  <vxe-grid
    ref="chengjiao"
    v-bind="gridOptions"
    :loading="bottomLoading"
    :columns="bottomColumns"
    :data="bottomData"
    @menu-click="handleContextMenuClick"
    @scroll="handleScroll"
    @sort-change="handleSortChange"
  ></vxe-grid>
</template>

<script>
import bottomColumns from './bottomColumns'
import bottomGrid from './bottomGrid.js'
import {
  getPriceIncludeGranList,
  exportPriceIncludeGranList,
} from '@/api/bondsDetail'
import { mapGetters } from 'vuex'
import { downloadFile } from '@/utils/util'

export default {
  mixins: [bottomGrid],
  data() {
    return {
      bottomColumns, // 成交区展示字段
      bottomData: [], // 成交区列表数据
      bottomLoading: false, // 成交区数据拉取中
      bottomCondition: {
        currPage: 1,
        pageSize: 50,
        sortFields: '',
        softType: '',
      }, // 成交区分页及排序
      bottomIsNextPage: true, // 是否是最后一页
    }
  },
  props: {
    // 行情区分组
    bottomGroup: {
      type: String,
      default: '',
    },
    // 债券代码
    id: {
      type: String,
      default: '',
    },
    // 债券代码
    code: {
      type: String,
      default: '',
    },
    isOnlyTran: {
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
          code: this.code,
          is_only_tran: this.isOnlyTran ? '1' : '',
        },
      }
    },
  },
  created() {
    this.getBottomData()
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
      getPriceIncludeGranList(this.bottomParams)
        .then(({ data }) => {
          const { dataList, isNextPage, currPage } = data.price_list
          if (currPage === 0) {
            this.bottomData = []
          } else if (currPage === 1) {
            this.bottomData = dataList
            this.$emit('updateCount', {
              tranCount: data.tran_count,
              priceCount: data.price_count,
            })
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
      this.bottomCondition = Object.assign(this.bottomCondition, {
        sortFields: order ? property : '',
        softType: order || '',
        currPage: 1,
      })
      this.$refs.chengjiao.clearScroll() // 清除滚动信息
      this.getBottomData()
    },
    // 清除排序
    handleSortClear() {
      this.$refs.chengjiao.clearSort()
      this.topCondition = Object.assign(this.bottomCondition, {
        sortFields: '',
        softType: '',
      })
    },
    download() {
      this.$nprogress.start()
      exportPriceIncludeGranList(this.bottomParams)
        .then((data) => {
          return downloadFile(data, '报价列表')
        })
        .then(() => {
          this.$nprogress.done()
        })
    },
    handleSocketData(list) {
      for (let i = 0; i < list.length; i++) {
        const { flag, map_object: mapObject } = list[i]
        if (flag === this.code) {
          const {
            price_list: priceList,
            price_count: priceCount,
            tran_count: tranCount,
          } = mapObject
          this.bottomData = priceList.dataList
          this.$emit('updateCount', { tranCount, priceCount })
        }
      }
    },
    clearData() {
      this.bottomData = []
      this.$emit('updateCount', { tranCount: 0, priceCount: 0 })
    },
  },
  watch: {
    bottomGroup: {
      handler() {
        this.refresh()
      },
    },
    isOnlyTran: {
      handler() {
        this.refresh()
      },
    },
    socketDataList: {
      deep: true,
      handler({ message_type: messageType, dataList }) {
        if (messageType === 'Type_detail_price') {
          this.handleSocketData(dataList)
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
</style>
