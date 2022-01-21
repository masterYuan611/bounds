<template>
  <div
    class="bonds-header"
    ref="bondsHeader"
  >
    <a-dropdown
      :getPopupContainer="() => $refs.bondsHeader"
      overlayClassName="bonds-menu"
    >
      <div class="logo">
        <img src="../../assets/images/logo.png" />
        <span @click="e => e.preventDefault()">
          <span class="company">国海证券</span>
          <span class="project">-债券报价</span>
        </span>
      </div>
      <!-- 下拉导航 -->
      <ul
        class="menu-list"
        slot="overlay"
      >
        <li
          v-for="(item, index) in menus"
          :key="index"
        >
          <span
            v-for="({name, path}) in item"
            :key="path"
            :class="[path ? 'menu-item' : 'classification', path === currentPath ? 'active': '']"
            @click="handleMenuClick({name, path})"
          >{{name}}</span>
        </li>
      </ul>
    </a-dropdown>
    <div
      v-if="userInfo.env !== 'prod'"
      style="color: #ffffff;"
    >{{userInfo.env}}</div>
    <div class="right">
      <div class="message">
        <a-popover
          :visible="socket.state === '3'"
          overlayClassName="network-error"
        >
          <template slot="content">
            <p>
              <a-icon
                type="exclamation-circle"
                :style="{color: '#f5222d',marginRight: '6px',fontSize: '14px'}"
                theme="filled"
              />网络连接失败
            </p>
          </template>
          <img src="../../assets/images/link.png" />
        </a-popover>
        <!-- <img src="../../assets/images/link.png" /> -->
        <span
          class="status"
          :style="{color: socket.state === '3' ? '#EC482E': null}"
        >{{socket.text}}</span>
        <img
          class="icon"
          @click="communicate"
          src="../../assets/images/message.png"
        />
      </div>
      <a-dropdown>
        <div class="user">
          <img
            src="../../assets/images/user.png"
            @dblclick="handleConsoleShow"
          />
          <span @click="e => e.preventDefault()">
            {{userInfo.name}}
          </span>
        </div>
        <a-menu slot="overlay">
          <a-menu-item @click="setting">
            <span>设置</span>
          </a-menu-item>
          <a-menu-item @click="handleLogout">
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Vconsole from 'vconsole'

export default {
  data() {
    return {
      menus: [
        [
          { name: '行情' },
          { name: '最优报价', path: '/layout/optimalBonds' },
          { name: '现券报价', path: '/layout/tradeGroup' },
        ],
        [
          { name: '成交' },
          { name: '新增成交', path: '/layout/newTransaction' },
          { name: '成交明细', path: '/layout/transactionDetails' },
        ],
        [
          { name: '报价' },
          { name: '新增报价', path: '/layout/newBonds' },
          { name: '历史报价', path: '/layout/oldBonds' },
          { name: '我的报价', path: '/layout/myBonds' },
        ],
        [{ name: '管理' }, { name: '系统设置', path: '/layout/setting' }],
      ],
    }
  },
  computed: {
    ...mapGetters(['currentPath', 'userInfo', 'socket']),
  },
  methods: {
    ...mapMutations('app', ['setCachedPath']),
    handleMenuClick({ path, name }) {
      if (!path) return
      this.$router.push(path)
      this.setCachedPath({
        path: {
          title: name,
          path,
        },
        flag: 'add',
      })
    },
    communicate() {
      this.$router.push('/layout/communicateBar')
      this.setCachedPath({
        path: {
          title: '交流吧',
          path: '/layout/communicateBar',
        },
        flag: 'add',
      })
    },
    setting() {
      this.$router.push('/layout/setting')
      this.setCachedPath({
        path: {
          title: '系统设置',
          path: '/layout/setting',
        },
        flag: 'add',
      })
    },
    handleLogout() {
      window.close()
    },
    handleConsoleShow() {
      if (process.env.NODE_ENV === 'production') {
        // eslint-disable-next-line
        new Vconsole()
        window.localStorage.setItem('vConsole_switch_y', 50)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.bonds-header {
  line-height: 50px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1f1f1f;
  cursor: pointer;
  .logo {
    display: flex;
    align-items: center;
    margin-left: 11px;
    // margin-right: auto;
    > img {
      width: 28px;
    }
    > span {
      display: flex;
      align-items: center;
      line-height: 18px;
      .company {
        font-size: @fontSize_18;
      }
      .project {
        font-size: @fontSize_16;
      }
    }
  }
  .right {
    display: flex;
    padding-right: 20px;
    font-size: @fontSize_14;
    .message {
      > img {
        width: 16px;
      }
      .icon {
        width: 22px;
      }
      .status {
        padding: 0 37px 0 5px;
      }
    }
    .user {
      margin-left: 25px;
      > img {
        width: 24px;
        margin-right: 8px;
      }
    }
  }
  /deep/ .bonds-menu {
    left: 16px !important;
    top: 58px !important;
    .menu-list {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 20px;
      width: 488px;
      height: 230px;
      background: #1f1f1f;
      text-align: left;
      .classification {
        margin-right: 42px;
        font-size: @fontSize_18;
        color: @blockBackground;
      }
      .menu-item {
        margin-right: 14px;
        padding: 0 8px 6px 8px;
        color: @mainColor;
        &.active {
          border-bottom: 2px solid @blockBackground;
        }
      }
    }
  }
}
</style>
