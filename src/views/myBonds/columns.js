import { message as Message } from 'ant-design-vue'
export default [
  {
    field: 'page',
    title: '',
    width: 40,
    fixed: 'left',
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        if (row.is_hot === '1') {
          return [
            <img style="width:20px;" src={require('@/assets/images/hot.png')} />
          ]
        } else {
          return [<span></span>]
        }
      }
    }
  },
  { type: 'checkbox', width: 43, fixed: 'left' },
  { type: 'seq', title: '序号', width: 44, fixed: 'left' },
  // {
  //   field: 'tran_type',
  //   title: '类型',
  //   width: 62,
  //   fixed: 'left',
  //   sortable: true,
  //   slots: {
  //     // 使用 JSX 渲染
  //     default: ({ row }, h) => {
  //       let renderColor = ''
  //       switch (row.tran_type) {
  //         case 'GVN':
  //           renderColor = 'redState'
  //           break
  //         case 'TRD':
  //           renderColor = 'greenState'
  //           break
  //         case 'TKN':
  //           renderColor = 'blueState'
  //           break
  //       }
  //       return [<span class={renderColor}>{row.tran_type}</span>]
  //     }
  //   }
  // },
  {
    field: 'state',
    title: '成交状态',
    width: 89,
    fixed: 'left',
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        let renderText = ''
        switch (row.state) {
          case '1':
            renderText = '未成交'
            break
          case '2':
            renderText = '部分成交'
            break
          case '3':
            renderText = '已成交'
            break
          case '4':
            renderText = 'END'
            break
          case '5':
            renderText = '失效'
            break
        }
        return [<span>{renderText}</span>]
      }
    }
  },
  {
    field: 'term',
    title: '剩余期限',
    width: 100,
    fixed: 'left',
    sortable: true
  },
  { field: 'code', title: '代码', width: 102, fixed: 'left', sortable: true },
  { field: 'name', title: '简称', width: 148, fixed: 'left', sortable: true },
  { field: 'bo', title: '方向', width: 62, sortable: true },
  {
    field: 'price',
    title: '报价',
    width: 100,
    editRender: {},
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.price.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val || '请输入'}</span>
              <span style="width: 50%;text-align: left;">{val ? '' : '价格'}</span>
            </div>
          ]
        }
      },
      edit: ({ row, rowIndex }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.price,
              placeholder: '价格',
              allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.price = value
                dom.target.focus()
              },
              blur: dom => {
                const { value } = dom.target
                if (value === '') {
                  window.editRow(row)
                  row.price = '--'
                } else if (
                  /^\d{1,4}$|^\d{1,4}[.]\d{1,4}$/.test(value) &&
                  Number(value) !== 0
                ) {
                  window.editRow(row)
                } else {
                  Message.warning('价格限制范围4位整数，4位小数，不能为0', 1)
                }
              },
              pressEnter: e => {
                e.target.blur()
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'my_tran_price',
    title: '成交价',
    width: 100,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.my_tran_price.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val}</span>
              <span style="width: 50%;text-align: left;"></span>
            </div>
          ]
        }
      }
    }
  },
  { field: 'is_ask', title: '是否请示', width: 88, sortable: true },
  {
    field: 'pri_eva',
    title: '报价-中债(BP)',
    width: 128,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.pri_eva.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val}</span>
              <span style="width: 50%;text-align: left;"></span>
            </div>
          ]
        }
      }
    }
  },
  {
    field: 'vol',
    title: '面额',
    width: 100,
    editRender: {},
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.vol.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val || '请输入'}</span>
              <span style="width: 50%;text-align: left;">{val ? '' : '面额(万)'}</span>
            </div>
          ]
        }
      },
      edit: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.vol,
              placeholder: '万',
              allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.vol = value
                dom.target.focus()
              },
              blur: dom => {
                const { value } = dom.target
                if (value === '') {
                  window.editRow(row)
                  row.vol = '--'
                } else if (
                  /^\d{1,8}$|^\d{1,8}[.]\d{1,4}$/.test(value) &&
                  Number(value) !== 0
                ) {
                  window.editRow(row)
                } else {
                  Message.warning('面额限制范围8位整数，4位小数，不能为0', 1)
                }
              },
              pressEnter: e => {
                e.target.blur()
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'tran_amt_total',
    title: '成交额',
    width: 100,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.tran_amt_total.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val}</span>
              <span style="width: 50%;text-align: left;"></span>
            </div>
          ]
        }
      }
    }
  },
  { field: 'volxh', title: '备注', width: 80, sortable: true },
  {
    field: 'org_name',
    title: '对手机构',
    width: 120,
    editRender: {},
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      edit: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.org_name,
              placeholder: '对手机构',
              allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.org_name = value
                dom.target.focus()
              },
              blur: dom => {
                const { value } = dom.target
                if (value) {
                  window.editRow(row)
                }
              },
              pressEnter: e => {
                e.target.blur()
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'customer_name',
    title: '对手交易员',
    width: 120,
    editRender: {},
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      edit: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.customer_name,
              placeholder: '对手交易员',
              allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.customer_name = value
                dom.target.focus()
              },
              blur: dom => {
                const { value } = dom.target
                if (value) {
                  window.editRow(row)
                }
              },
              pressEnter: e => {
                e.target.blur()
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'eva',
    title: '中债估值',
    width: 105,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.eva.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val}</span>
              <span style="width: 50%;text-align: left;"></span>
            </div>
          ]
        }
      }
    }
  },
  { field: 'level', title: '主/债', width: 98, sortable: true },
  { field: 'price_dt', title: '报价时间', width: 149, sortable: true },
  {
    field: 'src',
    title: '报价来源',
    width: 94,
    sortable: true
  }
]
