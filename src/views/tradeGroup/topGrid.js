// vxe-table相关配置
import XEClipboard from 'xe-clipboard'
import { mapMutations, mapGetters } from 'vuex'
import { setHot } from '@/api/optimalBonds'
import { getGroupQuoterList } from '@/api/tradeGroup'

export default {
  data() {
    return {
      selectedRowIds: [], // 选中的行id
      selectedRow: null,
      gridOptions: {
        height: 'auto',
        border: 'none',
        align: 'center',
        autoResize: true,
        resizable: true,
        stripe: true,
        size: 'mini',
        highlightCurrentRow: false,
        showOverflow: 'title',
        'column-config': {
          width: '100px'
        },
        'sort-config': {
          multiple: false, // 一次只对单个字段排序
          remote: true // 服务端排序
        },
        'scroll-y': {
          oSize: 200,
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
    ...mapGetters(['userInfo', 'isCtrl', 'isShift'])
  },
  methods: {
    ...mapMutations('app', ['setCachedPath']),
    ...mapMutations('newBonds', ['setMyBondsList']),
    handleCellMenu() {
      this.lockScroll = true
      this.$quoter.hide()
    },
    // 右键菜单操作
    handleContextMenuClick({ menu, row, column }) {
      switch (menu.code) {
        case 'copy':
          if (row && column) {
            // const rows = this.getRowsById(row)
            // let copyStr = ''
            // rows.forEach(item => {
            //   const {
            //     code,
            //     price,
            //     vol,
            //     bo,
            //     org_name: orgName,
            //     customer_name: customerName
            //   } = item
            //   let firstLine
            //   if (!customerName && !orgName) {
            //     firstLine = ''
            //   } else {
            //     firstLine = `${customerName || ''}-${orgName || ''} \n`
            //   }
            //   copyStr += `${firstLine}${code || '--'} ${price || '--'} ${vol ||
            //     '--'} ${bo || '--'} \n`
            // })

            const rows = this.getRowsById(row)
            let copyStr = ''
            rows.forEach(
              ({
                term,
                code,
                name,
                bid,
                ofr,
                vol_bid: volBid,
                vol_ofr: volOfr,
                level,
                eva
              }) => {
                copyStr += `${term} ${code} ${name} ${bid || '--'}/${ofr ||
                  '--'} ${volBid || '--'}/${volOfr ||
                  '--'} ${level} 中债 ${eva}\n`
              }
            )
            if (XEClipboard.copy(copyStr)) {
              this.$message.success('报价信息已复制到剪贴板！')
            }
          }
          break
        case 'add':
          //   this.setMyBondsList([{ ...row }])
          this.setMyBondsList(JSON.parse(JSON.stringify(this.getRowsById(row))))
          this.setCachedPath({
            path: { title: '新增报价', path: '/layout/newBonds' },
            flag: 'add'
          })
          this.$router.push('/layout/newBonds')
          break
        case 'hot':
          setHot({
            user_id: this.userInfo.id,
            is_hot: row.is_hot === '0' ? '1' : '0',
            bond_code: row.code
          }).then(() => {
            this.$message.success('热点债券设置成功！')
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
    handleCellDbclick({ row, column }) {
      if (['bid', 'vol_bid', 'vol_ofr', 'ofr'].includes(column.property)) {
        return
      }
      this.$quoter.hide()
      const { id, name, code } = row
      const path = `/layout/bondsDetail?id=${id}&code=${code}`
      this.setCachedPath({ path: { title: name, path }, flag: 'add' })
      this.$router.push(path)
    },
    // 展示报价维护人信息列表
    handleCellClick({ row, column, $event }) {
      this.selectedRow = null
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
        this.selectedRow = row
      }
      $event.stopPropagation()
      this.lockScroll = true
      this.$quoter.hide()
      if (['bid', 'vol_bid', 'vol_ofr', 'ofr'].includes(column.property)) {
        getGroupQuoterList({ id: row.id }).then(({ data }) => {
          this.$quoter.show({
            position: {
              x: $event.pageX,
              y: $event.pageY
            },
            list: data.dataList
          })
        })
      }
    },
    getRowsById(row) {
      if (
        this.selectedRowIds.includes(row._XID) &&
        this.selectedRowIds.length > 1
      ) {
        return this.finallyTopData.filter(item =>
          this.selectedRowIds.includes(item._XID)
        )
      } else {
        return [row]
      }
    }
  }
}
