// vxe-table相关配置
import XEClipboard from 'xe-clipboard'
import { mapMutations, mapGetters } from 'vuex'
import { copyTranFromFine } from '@/api/optimalBonds'

export default {
  data() {
    return {
      gridOptions: {
        height: 'auto',
        border: 'none',
        align: 'center',
        autoResize: true,
        resizable: true,
        stripe: true,
        size: 'mini',
        highlightCurrentRow: true,
        showOverflow: 'title',
        'column-config': {
          width: '100px'
        },
        'sort-config': {
          multiple: false, // 一次只对单个字段排序
          remote: true // 服务端排序
        },
        'scroll-y': {
          oSize: 100,
          gt: 0
        },
        menuConfig: {
          enabled: true,
          body: {
            options: [
              [
                {
                  code: 'copy',
                  name: '复制报价',
                  visible: true,
                  disabled: false
                }
              ]
            ]
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations('app', ['setCachedPath']),
    handleCellMenu() {
      this.lockScroll = true
    },
    // 右键菜单操作
    handleContextMenuClick({ menu, row, column }) {
      switch (menu.code) {
        case 'copy':
          if (row && column) {
            copyTranFromFine({ ids: row.id }).then(({ data }) => {
              let copyStr = ''
              const arr = Object.values(data)
              for (let i = 0; i < arr.length; i++) {
                copyStr += `${arr[i]}${i < arr.length - 1 ? '\n' : ''}`
              }
              if (XEClipboard.copy(copyStr)) {
                this.$message.success('成交信息已复制到剪贴板！')
              }
            })
          }
          break
      }
    },
    // 双击跳转详细页
    handleCellDbclick({ row }) {
      const { id, name, code } = row
      const path = `/layout/bondsDetail?id=${id}&code=${code}`
      this.setCachedPath({ path: { title: name, path }, flag: 'add' })
      this.$router.push(path)
    },
    handleCellClick({ row, column, $event }) {
      $event.stopPropagation()
      this.lockScroll = true
    }
  }
}
