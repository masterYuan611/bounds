<template>
  <div class="communicateBar">
    <a-textarea
      class="content"
      placeholder="请输入内容"
      :rows="4"
      maxlength="200"
      v-model="content"
    />
    <div class="operate">
      <a-button
        @click="addDiscuss"
        :disabled="content.trim()===''"
        type="primary"
      >发布</a-button>
    </div>
    <div class="timepick">
      <a-date-picker
        show-time
        placeholder="发帖时间（开始）"
        class="start"
        @change="startChange"
      />
      <a-date-picker
        show-time
        placeholder="发帖时间（结束）"
        class="end"
        @change="endChange"
      />
      <input
        type="button"
        value="筛选"
        class="publish"
        @click="filter"
      />
    </div>
    <div
      class="invitationarea"
      ref="invitationRef"
      @scroll="handleScroll"
    >
      <div
        class="invitation"
        v-for="item in invitationList"
        :key="item.id"
      >
        <p class="name">{{ item.pub_user_name }}</p>
        <div class="time">
          <span>{{ item.pub_dt }}</span>
          <div
            :class="item.is_top === '1' ? 'triangle-down' : 'triangle-up'"
            :title="item.is_top === '1' ? '取消置顶' : '置顶'"
            @click="top(item)"
          ></div>
        </div>
        <p
          class="comment"
          v-html="item.content"
        >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getDiscussPage, addDiscuss, topDiscuss } from '@/api/communicateBar'
export default {
  data() {
    return {
      query: {
        currPage: 1,
        pageSize: 10,
        softType: '',
        sortFields: '', // 排序字段
        searchInfo: {
          beg_d: '', // 开始时间
          end_d: '', // 结束时间
        },
      },
      invitationList: [],
      isNextPage: false,
      isLoading: false,
      content: '',
    }
  },
  created() {
    this.getDiscussList()
  },
  methods: {
    getDiscussList() {
      this.isLoading = true
      getDiscussPage(this.query).then(({ data: res }) => {
        if (this.query.currPage === 1) {
          this.invitationList.push(...res.top_list)
        }
        this.invitationList.push(...res.dataList)
        this.isNextPage = res.isNextPage
        this.isLoading = false
        this.spinningFlag = false
      })
    },
    // 滚动分页
    handleScroll(e) {
      const Scroll = e.target
      const scrollTop = Scroll.scrollTop
      const clientHeight = Scroll.clientHeight
      const scrollHeight = Scroll.scrollHeight
      if (
        scrollTop + clientHeight >= scrollHeight &&
        this.isNextPage &&
        !this.isLoading
      ) {
        this.spinningFlag = true
        this.query.currPage++
        this.getDiscussList()
      }
    },
    addDiscuss() {
      if (!this.content) {
        return this.$message.warning('请输入发布内容')
      }
      addDiscuss({ content: this.content }).then(() => {
        this.$message.info('发布内容成功')
        this.invitationList = []
        this.query.currPage = 1
        this.getDiscussList()
      })
    },
    top(item) {
      let tip = '置顶成功'
      let isTop = '1'
      if (item.is_top === '1') {
        isTop = '0'
        tip = '取消置顶成功'
      }
      topDiscuss({ id: item.id, is_top: isTop }).then(() => {
        this.$message.info(tip)
        this.invitationList = []
        this.query.currPage = 1
        this.getDiscussList()
      })
    },
    startChange(value, startdateString) {
      this.query.searchInfo.beg_d = startdateString
    },
    endChange(value, enddateString) {
      this.query.searchInfo.end_d = enddateString
    },
    filter() {
      this.invitationList = []
      this.query.currPage = 1
      this.getDiscussList()
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ svg {
  color: @mainColor;
}
.communicateBar {
  .publish {
    cursor: pointer;
    border: none;
    width: 60px;
    height: 32px;
    opacity: 1;
    background: rgba(45, 145, 71, 0.78);
    border-radius: 2px;
    font-size: @fontSize_14;
    font-family: PingFangSC-Regular;
    text-align: center;
    color: @mainColor;
  }
  .content {
    padding-top: 10px;
    width: 100%;
    height: 30%;
    opacity: 1;
    text-indent: 20px;
    background: #0d1312;
    border: 1px solid #3d4241;
    border-radius: 2px;
    font-size: @fontSize_14;
    font-family: PingFangSC-Regular;
    text-align: left;
    color: #aaacac;
    line-height: 24px;
  }
  .operate {
    margin-top: 10px;
    text-align: right;
  }
  .timepick {
    margin-top: 40px;
    .start,
    .end {
      margin-right: 20px;
    }
    text-align: left;
    color: #aaacac;
  }
  .invitationarea {
    overflow-y: auto;
    height: 50%;
    margin-top: 20px;
    &::-webkit-scrollbar {
      width: 6px;
      background-color: rgba(255, 255, 255, 0.08);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #4fc295;
    }
    .invitation {
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      text-align: left;
      margin-bottom: 10px;
      min-height: 120px;
      opacity: 1;
      background: rgba(87, 172, 109, 0.12);
      border: 1px solid rgba(38, 117, 59, 0.41);
      border-radius: 2px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      .name {
        margin-top: 5px;
        flex: 1;
        color: @mainColor;
        opacity: 1;
        font-size: @fontSize_18;
        font-weight: 500;
      }
      .time {
        display: flex;
        justify-content: space-between;
        flex: 1;
        opacity: 0.8;
        font-size: @fontSize_14;
        font-weight: 300;
        color: #aaacac;
        line-height: 20px;
        padding-right: 20px;
        .triangle-down {
          cursor: pointer;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 16px solid white;
        }
        .triangle-up {
          cursor: pointer;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 16px solid white;
        }
      }
      .comment {
        flex: 1;
        opacity: 1;
        font-size: @fontSize_16;
        font-weight: 300;
        color: @mainColor;
      }
    }
  }
}
</style>
