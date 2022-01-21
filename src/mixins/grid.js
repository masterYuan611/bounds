// vxe-table相关配置
import XEClipboard from 'xe-clipboard'
import { mapMutations, mapGetters } from 'vuex'
import { getQuoterList, setHot } from '@/api/optimalBonds'

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
        'column-config': {
          width: '100px'
        },
        'sort-config': {
          multiple: false, // 一次只对单个字段排序
          remote: true // 服务端排序
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
                },
                {
                  code: 'add',
                  name: '新增报价',
                  visible: true,
                  disabled: false
                },
                {
                  code: 'hot',
                  name: '取消热点债券',
                  visible: true,
                  disabled: false
                }
              ]
            ]
          },
          visibleMethod: this.visibleMethod
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations('app', ['setCachedPath']),
    ...mapMutations('newBonds', ['setNewBondsList']),
    // 右键菜单操作
    handleContextMenuClick({ menu, row, column }, name) {
      //   const $grid = this.$refs[name]
      switch (menu.code) {
        case 'copy':
          if (row && column) {
            if (XEClipboard.copy(row[column.property])) {
              this.$message.success('已复制到剪贴板！')
            }
          }
          break
        case 'add':
          this.setNewBondsList([Object.assign({}, row)])
          this.$router.push('/layout/newBonds')
          break
        case 'hot':
          setHot({
            user_id: this.userInfo.id,
            is_hot: row.is_hot === '0' ? '1' : '0',
            bond_code: row.code
          }).then(({ data }) => {
            row.is_hot = row.is_hot === '0' ? '1' : '0'
          })
          break
      }
    },
    visibleMethod({ options, row, column }) {
      options.forEach(list => {
        const hot = list.find(item => item.code === 'hot')
        if (row.is_hot === '1') {
          hot.name = '取消热点债券'
        } else {
          hot.name = '设为热点债券'
        }
      })
      return true
    },
    // 双击跳转详细页
    handleCellDbclick({ row }) {
      const { id, name } = row
      const path = `/layout/bondsDetail?id=${id}&name=${name}`
      this.setCachedPath({ path: { title: name, path }, flag: 'add' })
      this.$router.push(path)
    },
    // 展示报价维护人信息列表
    handleCellClick({ row, rowIndex, $rowIndex, column, columnIndex }) {
      if (['bid', 'vol_bid', 'vol_ofr', 'ofr'].includes(column.property)) {
        getQuoterList({ id: row.id }).then(({ data }) => {
          this.$set(row, `${column.property}_quoterVisible`, true)
          this.$set(row, 'quoterList', data.dataList)
        })
      }
    }
  }
}
