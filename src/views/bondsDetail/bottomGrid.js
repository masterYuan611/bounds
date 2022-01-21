// vxe-table相关配置
import XEClipboard from 'xe-clipboard'
import { mapMutations, mapGetters } from 'vuex'
import { setHot } from '@/api/optimalBonds'

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
    ...mapMutations('newBonds', ['setMyBondsList']),
    // 右键菜单操作
    handleContextMenuClick({ menu, row, column }) {
      switch (menu.code) {
        case 'copy':
          if (row && column) {
            // const {
            //   code,
            //   price,
            //   vol,
            //   bo,
            //   org_name: orgName,
            //   customer_name: customerName
            // } = row
            // const copyStr = `${code || '--'} ${price || '--'} ${vol ||
            //   '--'} ${bo || '--'} ${orgName || '--'} ${customerName || '--'}`
            // if (XEClipboard.copy(copyStr)) {
            //   this.$message.success('报价信息已复制到剪贴板！')
            // }
            const { term, code, name, bo, price, vol, level, eva } = row
            let copyStr = ''
            if (bo === 'Ofr') {
              copyStr = `${term} ${code} ${name} --/${price} --/${vol} ${level} 中债 ${eva}`
            } else {
              copyStr = `${term} ${code} ${name} ${price}/-- ${vol}/-- ${level} 中债 ${eva}`
            }
            if (XEClipboard.copy(copyStr)) {
              this.$message.success('报价信息已复制到剪贴板！')
            }
          }
          break
        case 'add':
          this.setMyBondsList([{ ...row }])
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
      return false
    }
  }
}
