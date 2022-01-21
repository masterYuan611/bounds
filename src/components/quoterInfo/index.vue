<template>
  <ul
    class="quoter-list"
    :style="style"
    ref="quoter"
    v-if="show"
  >
    <span class="title">报价维护人信息</span>

    <li
      v-for="(item, index) in list"
      :key="index"
    >
      <a-tooltip>
        <template slot="title">
          {{item.bovol || '--'}}
        </template>
        <span class="bovol">{{item.bovol || '--'}}</span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title">
          {{item.name || '--'}}
        </template>
        <span class="name">姓名：{{item.name || '--'}}</span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title">
          {{item.phone || '--'}}
        </template>
        <span class="phone">电话：{{item.phone || '--'}}</span>
      </a-tooltip>
      <span class="qq">
        <!-- <a
          v-if="item.qt_no"
          href="https://wpa1.qq.com/sl4GApUs?_type=wpa&qidian=true"
        >
          QT交谈
        </a>
        <div v-else>QT交谈</div> -->
        <div>QT交谈</div>
        <a-tooltip>
          <template slot="title">
            {{item.qt_no || '--'}}
          </template>{{item.qt_no || '--'}}
        </a-tooltip>
      </span>
      <a-tooltip>
        <template slot="title">
          {{item.is_ask}}
        </template>
        <span class="is_ask">{{item.is_ask}}</span>
      </a-tooltip>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      list: [],
      position: {
        x: 0,
        y: 0,
      },
      style: {},
    }
  },
  watch: {
    show: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            const { clientWidth, clientHeight } = document.body
            const { clientWidth: quoterWidth, clientHeight: quoterHeight } =
              this.$refs.quoter
            const { x, y } = this.position
            if (clientWidth - x > quoterWidth) {
              if (clientHeight - y > quoterHeight) {
                this.style = {
                  left: `${x}px`,
                  top: `${y + 20}px`,
                }
              } else {
                this.style = {
                  bottom: 0,
                  left: `${x}px`,
                }
              }
            } else {
              if (clientHeight - y > quoterHeight) {
                this.style = {
                  right: 0,
                  top: `${y + 20}px`,
                }
              } else {
                this.style = {
                  right: 0,
                  bottom: `${clientHeight - y + 20}px`,
                }
              }
            }
          })
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
.quoter-list {
  position: absolute;
  width: 700px;
  max-height: 300px;
  overflow: auto;
  z-index: 2;
  //   height: 206px;
  padding: 20px 0 20px 20px;
  background-color: #203e3e;
  color: @mainColor;
  font-size: @fontSize_14;
  text-align: left;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  &::-webkit-scrollbar {
    width: 6px !important;
    background-color: rgba(255, 255, 255, 0.08);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: @blockBackground;
  }
  .title {
    font-size: @fontSize_16;
    margin-bottom: 4px;
  }
  > li {
    display: flex;
    align-items: center;
    margin-top: 4px;
    > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bovol {
      width: 140px;
    }
    .name {
      width: 120px;
    }
    .phone {
      width: 170px;
    }
    .qq {
      width: 180px;
      > a,
      > div {
        display: inline-flex;
        justify-content: center;
        padding: 6px 12px;
        border-radius: 2px;
        margin-right: 10px;
      }
      > a {
        background: #2286bd;
        color: #fff;
        &:hover {
          background: #74caf9;
        }
      }
      > div {
        color: #444444;
        background: #636665;
        cursor: not-allowed;
      }
    }
    .is_ask {
      flex: 1;
    }
  }
}
</style>
