// vxe-table相关配置
import XEClipboard from 'xe-clipboard'
import { mapMutations, mapGetters } from 'vuex'
import { getQuoterList } from '@/api/optimalBonds'
import { toRelease } from '@/api/newBonds.js'

export default {
  data() {
    return {
      selectedRowIds: [], // 选中的行id
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
                  code: 'unref',
                  name: 'Unref',
                  visible: true,
                  disabled: false
                },
                // {
                //   code: 'add',
                //   name: '新增报价',
                //   visible: true,
                //   disabled: false
                // },
                // {
                //   code: 'hot',
                //   name: '取消热点债券',
                //   visible: true,
                //   disabled: false
                // }
              ]
            ]
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'isShift'])
  },
  methods: {
    ...mapMutations('app', ['setCachedPath']),
    ...mapMutations('newBonds', ['setNewBondsList']),
    // 右键菜单操作
    handleContextMenuClick({ menu, row, column }, name) {
      const dataList = JSON.parse(JSON.stringify(this.getRowsById(row)))
      const me = this
      dataList.forEach(item => {
        delete item.src
        delete item.create_dt
        delete item.price_dt
        if (item.bo === 'Ofr') {
          item.bo = 'o'
        } else if (item.bo === 'Bid') {
          item.bo = 'b'
        }
        if (item.price === '--') {
          item.price = ''
        }
        if (item.vol === '--') {
          item.vol = ''
        }
      })
      switch (menu.code) {
        case 'copy':
          if (row && column) {
            let copyStr = ''
            dataList.forEach(item => {
              if (item.bo === 'o') {
                item.bo = 'Ofr'
              } else if (item.bo === 'b') {
                item.bo = 'Bid'
              }
              if (item.is_ask === '否') {
                item.is_ask = ''
              } else if (item.is_ask === '必须请示') {
                item.is_ask = '**'
              } else if (item.is_ask === '需请示') {
                item.is_ask = '*'
              }
              copyStr += `${item.term || '--'} ${item.code || '--'} ${item.name || '--'} ${item.bo === 'Bid' ? `${item.price > 0 && item.operator_name ? item.price : 'Bid'}/--` : `--/${item.price > 0 && item.operator_name ? item.price : 'Ofr'}`}${item.is_ask} ${
                item.bo === 'Bid' ? `${item.vol > 0 ? item.vol : '--'}/--` : `--/${item.vol > 0 ? item.vol : '--'}`
              } ${item.level || '--'} 中债 ${
                item.eva || '--'
              }\n`
            })
            if (XEClipboard.copy(copyStr)) {
              if (copyStr) {
                this.$message.success('报价信息已复制到剪贴板！', 1)
              } else {
                this.$message.warning('无债券信息可复制', 1)
              }
            }
          }
          break
        case 'unref':
          this.$confirm({
            title: '提示确认',
            content: '您将按照选择的报价，重新发布新的报价，是否继续？',
            onOk() {
              toRelease({ loginOperator: me.$store.getters.userInfo.code, dataList: dataList })
                .then((res) => {
                  me.$message.success('发布成功', 1)
                })
                .catch(() => {})
            },
            onCancel() {},
          })
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
    // 展示报价维护人信息列表
    handleCellClick({ row, column, $event }) {
      if (this.isCtrl) {
        this.selectedRowIds.push(row._XID)
      } else if (this.isShift) {
        if (this.selectedRowIds.length > 0) {
          const ids = parseInt(this.selectedRowIds[0].split('_')[1])
          const ide = parseInt(row._XID.split('_')[1])
          const min = Math.min(ids, ide)
          const max = Math.max(ids, ide)
          const rowIds = []
          let i = min
          while (i <= max) {
            rowIds.push(`row_${i}`)
            i++
          }
          this.selectedRowIds = rowIds
        } else {
          this.selectedRowIds = [row._XID]
        }
      } else {
        this.selectedRowIds = [row._XID]
      }
      $event.stopPropagation()
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$quoter.hide()
        this.lockScroll = true
        if (['bid', 'vol_bid', 'vol_ofr', 'ofr'].includes(column.property)) {
          getQuoterList({ id: row.id }).then(({ data }) => {
            this.$quoter.show({
              position: {
                x: $event.pageX,
                y: $event.pageY
              },
              list: data.dataList
            })
          })
        }
      }, 300)
    },
    getRowsById(row) {
      if (
        this.selectedRowIds.includes(row._XID) &&
        this.selectedRowIds.length > 1
      ) {
        return this.tableList.filter(item =>
          this.selectedRowIds.includes(item._XID)
        )
      } else {
        return [row]
      }
    }
  }
}
