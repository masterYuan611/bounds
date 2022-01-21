<template>
  <div class="bonds-navbar">
    <a-tooltip
      v-for="(item, index) in [...fixedNavs]"
      :key="index"
    >
      <template slot="title">
        {{item.title}}
      </template>
      <span
        class="nav-item"
        :class="[currentPath === item.path ?'active' : '', hoverNav === item.path ? 'hover' : '']"
        @mouseenter="hoverNav = item.path"
        @mouseleave="hoverNav = ''"
        @click="handleNavClick(item)"
      >
        {{item.title}}
      </span>
    </a-tooltip>
    <draggable
      v-model="draggableNavs"
      class="draggale-navs"
    >
      <a-tooltip
        v-for="(item, index) in [...cachedPath]"
        :key="index"
      >
        <template slot="title">
          {{item.title}}
        </template>
        <span
          class="nav-item"
          :class="[currentPath === item.path ?'active' : '', hoverNav === item.path ? 'hover' : '']"
          @mouseenter="hoverNav = item.path"
          @mouseleave="hoverNav = ''"
          @click="handleNavClick(item)"
        >{{item.title}}
          <!-- <img
            src="../../assets/images/close.png"
            v-show="hoverNav === item.path"
            @click.stop="handleNavRemove(item)"
          /> -->
          <img
            src="../../assets/images/close.png"
            @click.stop="handleNavRemove(item)"
          />
        </span>
      </a-tooltip>
    </draggable>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  data() {
    return {
      fixedNavs: [
        { title: '最优报价', path: '/layout/optimalBonds' },
        { title: '现券报价', path: '/layout/tradeGroup' },
        { title: '我的报价', path: '/layout/myBonds' },
      ],
      hoverNav: '',
    }
  },
  computed: {
    ...mapGetters(['currentPath', 'cachedPath']),
    draggableNavs: {
      get() {
        return this.cachedPath
      },
      set(value) {
        this.updateCachedPath(value)
      },
    },
  },
  methods: {
    ...mapMutations('app', ['setCachedPath', 'updateCachedPath']),
    handleNavClick(item) {
      this.$router.push(item.path)
    },
    handleNavRemove(item) {
      this.setCachedPath({ path: item, flag: 'remove' })
      if (this.currentPath !== item.path) return
      const lastNav = [...this.fixedNavs, ...this.cachedPath].pop()
      this.$router.push(lastNav.path)
    },
    isFixedNav(path) {
      return this.fixedNavs.findIndex((item) => item.path === path) > -1
    },
  },
}
</script>

<style lang="less" scoped>
.bonds-navbar {
  padding: 16px;
  //   display: grid;
  //   grid-template-columns: repeat(12, 1fr);
  display: flex;
  cursor: pointer;
  .draggale-navs {
    width: 79%;
    display: flex;
    .nav-item {
      width: 9%;
    }
  }
  .nav-item {
    width: 7%;
    position: relative;
    height: 40px;
    padding: 0 14px 0 10px;
    line-height: 40px;
    background: #172422;
    font-size: @fontSize_16;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:last-child {
      border: none;
      border-radius: 0 2px 2px 0;
    }
    &:first-child {
      border-radius: 2px 0 0 2px;
    }
    &.active {
      background: @blockBackground;
    }
    &.hover {
      background: rgba(19, 108, 94, 0.5);
    }
    > img {
      position: absolute;
      right: 2px;
      //   top: 2px;
      top: 12px;
      width: 16px;
    }
  }
}
</style>
