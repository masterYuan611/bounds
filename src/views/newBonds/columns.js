import { message as Message } from 'ant-design-vue'
export default [
  {
    field: 'is_hot',
    title: '',
    fixed: 'left',
    width: 40,
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
  { type: 'checkbox', fixed: 'left', width: 43 },
  { type: 'seq', fixed: 'left', title: '序号', width: 44 },
  {
    field: 'term',
    title: '剩余期限',
    width: 100,
    sortable: true
  },
  {
    field: 'code',
    title: '代码',
    width: 150,
    sortable: true,
    slots: {
      default: (
        {
          row,
          rowIndex,
          $rowIndex,
          column,
          columnIndex,
          $columnIndex,
          _columnIndex
        },
        h
      ) => {
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
                await window.newBondsqueryBondInfo(row, rowIndex)
              },
              blur: () => {
                window.newBondsqueryBondInfo(row, rowIndex)
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
    width: 200,
    showOverflow: true,
    sortable: true
    // slots: {
    //   default: ({ row, rowIndex }, h) => {
    //     return [
    //       h('name-complete', {
    //         props: {
    //           value: row.name,
    //           required: true
    //         },
    //         on: {
    //           input: value => {
    //             row.name = value
    //           },
    //           select: async () => {
    //             await window.queryBondInfoByName(row, rowIndex)
    //           }
    //         }
    //       })
    //     ]
    //   }
    // }
  },
  {
    field: 'bo',
    title: '方向',
    width: 85,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-select', {
            props: {
              value: row.bo,
              options: [
                { value: 'b', label: 'Bid' },
                { value: 'o', label: 'Ofr' }
              ],
              placeholder: '请选择'
            },
            on: {
              change: value => {
                row.bo = value
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'price',
    title: '报价',
    width: 100,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row, rowIndex }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.price,
              placeholder: '价格'
              // allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.price = value
              },
              blur: dom => {
                const { value } = dom.target
                if (value === '') {
                } else if (
                  /^\d{1,4}$|^\d{1,4}[.]\d{1,4}$/.test(value) &&
                  Number(value) !== 0
                ) {
                } else {
                  Message.warning('价格限制范围4位整数，4位小数，不能为0', 1)
                }
              }
            }
          })
        ]
      }
    }
  },
  // { field: 'xh', title: '是否请示', width: 88, editRender: { name: '$select', placeholder: '请选择', options: [{ value: '0', label: '无' }, { value: '1', label: '需请示' }, { value: '2', label: '必须请示' }] }, sortable: true },
  {
    field: 'xh',
    title: '是否请示',
    width: 100,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-select', {
            props: {
              value: row.xh,
              options: [
                { value: '', label: '无' },
                { value: '*', label: '需请示' },
                { value: '**', label: '必须请示' }
              ],
              placeholder: '请选择'
            },
            on: {
              change: value => {
                row.xh = value
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'pri_eva',
    title: '报价-中债(BP)',
    width: 128,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        if (row.price && row.eva) {
          row.pri_eva = ((row.price - row.eva) * 100).toFixed(2)
        }
        if (row.pri_eva) {
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
        } else {
          return [<span class="vxe-cell--placeholder">计算</span>]
        }
      }
    }
  },
  {
    field: 'vol',
    title: '面额',
    width: 110,
    sortable: true,
    align: 'center',
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.vol,
              placeholder: '万'
              // allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.vol = value
              },
              blur: dom => {
                const { value } = dom.target
                if (value === '') {
                } else if (
                  /^\d{1,8}$|^\d{1,8}[.]\d{1,4}$/.test(value) &&
                  Number(value) !== 0
                ) {
                } else {
                  Message.warning('面额限制范围8位整数，4位小数，不能为0', 1)
                }
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'volxh',
    title: '备注',
    width: 85,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.volxh,
              placeholder: '非必填'
              // allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.volxh = value
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'org_name',
    title: '对手机构',
    width: 150,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.org_name,
              placeholder: '对手机构'
              // allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.org_name = value
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
    width: 109,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.customer_name,
              placeholder: '对手交易员'
              // allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.customer_name = value
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
        if (row.eva) {
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
    }
  },
  { field: 'level', title: '主/债', width: 98, sortable: true },
  {
    field: 'operator_name',
    title: '报价人',
    width: 90,
    sortable: true
  },
  {
    field: '',
    title: '操作',
    width: 110,
    fixed: 'right',
    slots: {
      // 使用 JSX 渲染
      default: ({ rowIndex }, h) => {
        return [
          <a-button
            style="background: #136C5E;color:#f7e1af;"
            onClick={() => window.newBondsdelItem(rowIndex)}
          >
            删除
          </a-button>
        ]
      }
    }
  }
]
