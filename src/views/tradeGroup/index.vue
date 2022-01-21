<template>
  <div class="trade-group">
    <LeftFilter
      path="tradeGroup"
      :hotTop="hotTop"
      @change="handleFilterChange"
      @hot-top="handleHotTop"
    />
    <div class="main">
      <div class="top">
        <div class="header">
          <Grouping
            :active.sync="topGroup"
            @change="handleTopGroupChange"
          />
        </div>
        <div class="operate-line">
          <span class="title">报价行情</span>
          <img
            src="../../assets/images/download.png"
            @click="handleTopDownload"
          />
        </div>
        <div class="table-wrapper">
          <TopGrid
            ref="topGrid"
            :leftCondition="leftCondition"
            :topGroup="topGroup"
            :hotTop="hotTop"
          />
        </div>
      </div>
      <div
        class="bottom"
        v-show="!bottomFold"
      >
        <div class="header">
          <Grouping
            :active.sync="bottomGroup"
            @change="handleBottomGroupChange"
          />
        </div>
        <div class="operate-line">
          <span class="title">今日成交</span>
          <img
            src="../../assets/images/download.png"
            @click="handleBottomDownload"
          />
          <img
            src="../../assets/images/down-fold.png"
            @click="handleFold"
          />
        </div>
        <div class="table-wrapper">
          <BottomGrid
            ref="bottomGrid"
            :leftCondition="leftCondition"
            :bottomGroup="bottomGroup"
            :hotTop="hotTop"
          />
        </div>
      </div>
      <div
        class="bottom-fold operate-line"
        v-show="bottomFold"
      >
        <span class="title">今日成交</span>
        <img
          src="../../assets/images/download.png"
          @click="handleBottomDownload"
        />
        <img
          class="unfold"
          src="../../assets/images/down-fold.png"
          @click="handleFold"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LeftFilter from '@/components/leftFilter'
import Grouping from '@/components/grouping'
import { getGroupList } from '@/api/user'
import { mapMutations } from 'vuex'
import TopGrid from './topGrid.vue'
import BottomGrid from './bottomGrid.vue'
import { topCondition, bottomCondition } from '@/utils/const'
import { handleInputCheck } from '@/utils/util'

export default {
  components: {
    LeftFilter,
    Grouping,
    TopGrid,
    BottomGrid,
  },
  data() {
    return {
      topGroup: '', // 行情区当前分组
      bottomGroup: '', // 成交区当前分组
      bottomFold: false, // 成交区是否折叠收起
      hotTop: false, // 热点数据是否置顶
      leftCondition: {
        top: JSON.parse(JSON.stringify(topCondition)),
        bottom: JSON.parse(JSON.stringify(bottomCondition)),
      }, // 左侧筛选条件
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapMutations('user', ['setGroups']),
    init() {
      getGroupList().then(({ data }) => {
        this.setGroups([{ group_name: '全部', id: '' }, ...data.dataList])
      })
    },
    /**
     * @param {*} type hangqing:只刷新行情区,all/reset:同时刷新行情区和成交区,reset: 清除排序
     * @param {*} condition 左侧筛选条件
     */
    handleFilterChange(type, condition) {
      this.leftCondition = condition
      if (!handleInputCheck(condition)) return
      this.$nextTick(() => {
        if (type === 'reset') {
          this.handleSortClear()
        }
        this.$refs.topGrid.refresh()
        if (type !== 'hangqing') {
          this.$refs.bottomGrid.refresh()
        }
      })
    },
    handleFold() {
      this.bottomFold = !this.bottomFold
    },
    handleSortClear() {
      this.$refs.topGrid.handleSortClear()
      this.$refs.bottomGrid.handleSortClear()
    },
    // 行情区分组变化
    handleTopGroupChange(topGroup) {
      this.topGroup = topGroup
      this.bottomGroup = topGroup
      this.$nextTick(() => {
        this.$refs.topGrid.refresh()
        this.$refs.bottomGrid.refresh()
      })
    },
    // 成交区分组变化
    handleBottomGroupChange(bottomGroup) {
      this.bottomGroup = bottomGroup
      this.$nextTick(() => {
        this.$refs.bottomGrid.refresh()
      })
    },
    handleHotTop(hotTop) {
      this.hotTop = hotTop
    },
    handleTopDownload() {
      this.$refs.topGrid.download()
    },
    handleBottomDownload() {
      this.$refs.bottomGrid.download()
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .vxe-body--row {
  .vxe-body--column {
    background-color: rgba(87, 172, 109, 0.12);
  }
  &.row--stripe {
    .vxe-body--column {
      background-color: #090f0e;
    }
  }
}
.trade-group {
  display: flex;
  .main {
    flex: 1;
    width: 0;
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    .top,
    .bottom {
      //   height: 553px;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(19, 108, 94, 0.5);
      border-radius: 2px;
      .header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }
      .table-wrapper {
        flex: 1;
        height: 0;
        margin: 0 12px 8px 12px;
      }
    }
    .top {
      flex: 2;
      height: 0;
    }
    .bottom {
      flex: 1;
      //   height: 373px;
      margin-top: 16px;
    }
    .operate-line {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 48px;
      .title {
        margin-right: auto;
        font-size: @fontSize_16;
        color: rgba(255, 255, 255, 0.65);
      }
      > img {
        width: 20px;
        margin-left: 22px;
        cursor: pointer;
      }
    }
    .bottom-fold {
      height: 32px;
      margin-top: 16px;
      border: 1px solid rgba(19, 108, 94, 0.5);
      border-radius: 2px;
      .unfold {
        transform: rotate(180deg);
      }
    }
  }
  /deep/ .ant-dropdown {
    .quoter-list {
      width: 680px;
      height: 206px;
      padding: 20px 0 20px 20px;
      background-color: #203e3e;
      font-size: @fontSize_14;
      text-align: left;
      .title {
        font-size: @fontSize_16;
        margin-bottom: 4px;
      }
      > li {
        display: flex;
        margin-top: 9px;
        .bovol {
          width: 80px;
        }
        .name {
          width: 140px;
        }
        .phone {
          width: 170px;
        }
        .qq {
          width: 180px;
        }
        .is_ask {
          flex: 1;
        }
      }
    }
    .hover-title {
      padding: 12px;
      background-color: #203e3e;
      font-size: @fontSize_14;
    }
  }
}
</style>
