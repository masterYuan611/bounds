<template>
  <div class="bonds-layout">
    <Header />
    <Navbar />
    <keep-cache :include="keepCaches">
      <router-view
        class="bonds-main"
        :key="$route.fullPath"
      />
    </keep-cache>
  </div>
</template>

<script>
import Header from './header.vue'
import Navbar from './navbar.vue'
import { mapMutations, mapGetters } from 'vuex'
import { heart } from '@/api/user'

export default {
  components: {
    Header,
    Navbar,
  },
  data() {
    return {
      timer: null,
      number: 0,
    }
  },
  computed: {
    ...mapGetters(['cachedPath', 'userInfo']),
    keepCaches() {
      const fixed = [
        '/layout/optimalBonds',
        '/layout/tradeGroup',
        '/layout/myBonds',
      ]
      return [...fixed, ...this.cachedPath.map((item) => item.path)]
    },
  },
  mounted() {
    this.getNetworkType()
    this.addEventListener()
    const { code, Authorization } = this.userInfo
    this.$socket.init(code, Authorization, 'common')
    this.$socket.heart()
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('keyup', this.handleKeyup)
    clearInterval(this.timer)
  },
  methods: {
    ...mapMutations('app', ['setIsCtrl', 'setIsShift']),
    ...mapMutations('socket', ['setSocket']),
    // 轮询heart接口判断网络状态
    getNetworkType() {
      this.timer = setInterval(() => {
        heart()
          .then(() => {
            this.number = 0
          })
          .catch((error) => {
            const errorInfo = error.toJSON()
            if (errorInfo.message === 'Network Error') {
              this.number++
            }
          })
          .finally(() => {
            if (this.number >= 6) {
              this.setSocket({
                state: '3',
                text: '服务异常',
              })
            }
          })
      }, 20000)
    },
    addEventListener() {
      window.addEventListener('keydown', this.handleKeydown)
      window.addEventListener('keyup', this.handleKeyup)
    },
    handleKeydown(event) {
      const { ctrlKey, shiftKey, altKey } = event
      if ([ctrlKey, shiftKey, altKey].filter((item) => item).length > 1) {
        this.setIsShift(false)
        this.setIsCtrl(false)
      } // 使用组合键后进行重置，例如截屏快捷键组合
      switch (event.keyCode) {
        case 16:
          this.setIsShift(true)
          break
        case 17:
          this.setIsCtrl(true)
          break
      }
    },
    handleKeyup(event) {
      switch (event.keyCode) {
        case 16:
          this.setIsShift(false)
          break
        case 17:
          this.setIsCtrl(false)
          break
      }
    },
  },
}
</script>

<style lang="less" scoped>
.bonds-layout {
  height: 100%;
  background: #090f0e;
  color: @mainColor;
  display: flex;
  flex-direction: column;
  .bonds-main {
    flex: 1;
    height: 0;
    padding: 0 16px 16px 16px;
  }
}
</style>
