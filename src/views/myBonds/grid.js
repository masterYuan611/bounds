// vxe-table相关配置
import XEClipboard from 'xe-clipboard'
import { mapMutations, mapGetters } from 'vuex'
import { getQuoterList, setHot, copyFinePrice } from '@/api/optimalBonds'

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
                // {
                //   code: 'copy',
                //   name: '复制报价',
                //   visible: true,
                //   disabled: false
                // },
                // {
                //   code: 'add',
                //   name: '新增报价',
                //   visible: true,
                //   disabled: false
                // },
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
            copyFinePrice({ ids: row.id }).then(({ data }) => {
              const list = data[row.id]
              let copyStr = ''
              list.forEach(
                ({
                  code,
                  price,
                  vol,
                  bo,
                  org_name: orgName,
                  customer_name: customerName
                }) => {
                  copyStr += `${code || '--'} ${price || '--'} ${vol ||
                    '--'} ${bo || '--'} ${orgName || '--'} ${customerName ||
                    '--'}\n`
                }
              )
              if (XEClipboard.copy(copyStr)) {
                this.$message.success('报价信息已复制到剪贴板！')
              }
            })
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
            // row.is_hot = row.is_hot === '0' ? '1' : '0'
            window.isHot(row.code, row.is_hot)
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
    handleCellDbclick({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) {
      if (column.property === 'price' || column.property === 'vol' || column.property === 'org_name' || column.property === 'customer_name') {
        if (row.state !== '1') {
          this.$message.warning('未成交的数据才能双击修改', 1)
        }
      } else {
        const { id, name, code } = row
        const path = `/layout/bondsDetail?id=${id}&code=${code}`
        this.setCachedPath({ path: { title: name, path }, flag: 'add' })
        this.$router.push(path)
      }
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
