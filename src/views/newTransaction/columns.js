import { message as Message } from 'ant-design-vue'
import { getTranType } from '@/utils/util'
export default [
  {
    field: 'is_hot',
    title: '',
    width: 33,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        if (row.is_hot === 1) {
          return [
            <img style="width:11px;" src={require('@/assets/images/hot.png')} />
          ]
        } else {
          return [<span></span>]
        }
      }
    }
  },
  { type: 'checkbox', width: 43 },
  { type: 'seq', title: '序号', width: 44, fixed: 'left' },
  {
    field: 'type',
    title: '类型',
    width: 70,
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return getTranType(row, h)
      }
    }
  },
  {
    field: 'term',
    title: '剩余期限',
    width: 100,
    sortable: true
  },
  {
    field: 'code',
    title: '代码',
    width: 200,
    sortable: true,
    slots: {
      default: ({ row, rowIndex }, h) => {
        return [
          h('auto-complete', {
            props: {
              value: row.code
            },
            on: {
              input: value => {
                row.code = value
              },
              select: async () => {
                await window.queryBondInfo(row, rowIndex)
              },
              blur: () => {
                window.queryBondInfo(row, rowIndex)
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'name',
    title: '简称',
    width: 150,
    sortable: true
  },
  {
    field: 'eva',
    title: '中债估值',
    width: 100,
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        if (!row.eva) {
          return [<span>--</span>]
        } else {
          return [<span>{row.eva}</span>]
        }
      }
    }
  },
  {
    field: 'level',
    title: '主/债',
    width: 88,
    sortable: true
  },
  {
    field: 'bo',
    title: '方向',
    width: 100,
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        if (!row.bo) {
          return [<span>--</span>]
        } else {
          return [<span>{row.bo}</span>]
        }
      }
    }
  },
  {
    field: 'seek_price',
    title: '报价',
    width: 100,
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        if (!row.seek_price) {
          return [<span>--</span>]
        } else {
          return [<span>{row.seek_price}</span>]
        }
      }
    }
  },
  {
    field: 'price',
    title: '成交价',
    width: 120,
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.price,
              placeholder: '成交价'
            },
            on: {
              blur: dom => {
                const { value } = dom.target
                if (
                  /^\d{1,4}$|^\d{1,4}[.]\d{1,5}$/.test(value) &&
                  value !== '0'
                ) {
                  row.price = value
                } else {
                  Message.warning('成交价限制范围4位整数，5位小数，不能为0', 1)
                }
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'seel_amount',
    title: '面额',
    width: 97,
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        if (!row.seel_amount) {
          return [<span>--</span>]
        } else {
          return [<span>{row.seel_amount}</span>]
        }
      }
    }
  },
  {
    field: 'amount',
    title: '成交额',
    width: 109,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.amount,
              placeholder: '万',
              style: 'text-align: right'
            },
            on: {
              blur: dom => {
                const { value } = dom.target
                if (
                  /^\d{1,8}$|^\d{1,8}[.]\d{1,4}$/.test(value) &&
                  value !== '0'
                ) {
                  row.amount = value
                } else {
                  Message.warning('成交额限制范围8位整数，4位小数，不能为0', 1)
                }
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'tran_user_name',
    title: '成交人',
    width: 105,
    sortable: true
  },
  {
    field: 'strategy_type_id',
    title: '策略类型',
    width: 200,
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return [
          h('a-select', {
            props: {
              value: row.strategy_type_id,
              mode: 'multiple',
              placeholder: '可多选',
              showArrow: true,
              allowClear: true,
              options: [
                { value: 'a', label: '利率策略a' },
                { value: 'b', label: '利率策略b' },
                { value: 'c', label: '信用策略' },
                { value: 'd', label: '销售组' },
                { value: 'e', label: '存单策略' },
                { value: 'f', label: '交易组' },
                { value: 'g', label: '其他' },
                { value: 'h', label: '空' }
              ]
            },
            on: {
              change: value => {
                if (value.indexOf('h') === 0 && value.length > 1) {
                  return window.tip1()
                }
                if (value.indexOf('h') > 0 && value.length > 1) {
                  return window.tip2()
                }
                row.strategy_type_id = value
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'buy_org_name',
    title: '买方机构',
    width: 149,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.buy_org_name,
              placeholder: '买方机构'
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.buy_org_name = value
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'buy_customer_name',
    title: '买方交易员',
    sortable: true,
    width: 100,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.buy_customer_name,
              placeholder: '买方交易员'
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.buy_customer_name = value
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'sell_org_name',
    title: '卖方机构',
    width: 98,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.sell_org_name,
              placeholder: '卖方机构'
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.sell_org_name = value
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'sell_customer_name',
    title: '卖方交易员',
    width: 98,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.sell_customer_name,
              placeholder: '卖方交易员'
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.sell_customer_name = value
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'seek_src',
    title: '报价来源',
    width: 98,
    sortable: true
  },
  {
    field: 'src',
    title: '成交来源',
    width: 98,
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return [
          h('a-select', {
            props: {
              value: row.src,
              options: [
                { value: '1', label: '非中介' },
                { value: '2', label: '中介' }
              ],
              placeholder: '请选择'
            },
            on: {
              change: value => {
                row.src = value
              }
            }
          })
        ]
      }
    }
  },
  {
    title: '操作',
    width: 98,
    fixed: 'right',
    slots: {
      default: ({ row }, h) => {
        return [
          <a-button
            style="background: #136C5E;color:#f7e1af;"
            onClick={() => window.delItem(row)}
          >
            删除
          </a-button>
        ]
      }
    }
  }
]
