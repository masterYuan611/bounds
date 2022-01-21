export default [
  {
    field: 'name',
    title: '用户姓名',
    width: '10%'
  },
  {
    field: 'part',
    title: '员工角色',
    width: '10%'
  },
  {
    field: 'is_gather',
    title: '汇总报价数据权限',
    width: '10%',
    slots: {
      default: ({ row }, h) => {
        return [
          h('a-switch', {
            props: {
              checked: row.is_gather,
              checkedChildren: '开',
              unCheckedChildren: '关'
            },
            on: {
              click: dom => {
                const value = dom
                row.is_gather = value
                row.isEdit = false
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'group_ids',
    title: '分组（可多选）',
    width: '20%',
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-select', {
            props: {
              value: row.group_ids,
              mode: 'multiple',
              defaultValue: '',
              options: window.groups,
              placeholder: '请选择',
              allowClear: true,
              showArrow: true
            },
            on: {
              change: value => {
                row.group_ids = value
                row.isEdit = false
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'is_view_tran',
    title: '成交明细可见/不可见',
    width: '12%',
    slots: {
      default: ({ row }, h) => {
        return [
          h('a-switch', {
            props: {
              checked: row.is_view_tran,
              checkedChildren: '可见',
              unCheckedChildren: '不可见'
            },
            on: {
              click: dom => {
                const value = dom
                row.is_view_tran = value
                row.isEdit = false
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'qq',
    title: '企业QQ',
    width: '15%',
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.qq,
              placeholder: '请输入',
              allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.qq = value
                row.isEdit = false
              }
            }
          })
        ]
      }
    }
  },
  {
    field: 'qt_no',
    title: 'Q-T号码',
    width: '15%',
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [
          h('a-input', {
            props: {
              value: row.qt_no,
              placeholder: '请输入',
              allowClear: true
            },
            on: {
              input: dom => {
                const { value } = dom.target
                row.qt_no = value
                row.isEdit = false
              }
            }
          })
        ]
      }
    }
  },
  {
    title: '操作',
    width: '8%',
    slots: {
      default: ({ row }, h) => {
        return [
          <a-button
            class={getEditClass(row.isEdit)}
            disabled={row.isEdit}
            onClick={() => window.saveItem(row)}
          >
            保存
          </a-button>
        ]
      }
    }
  }
]

function getEditClass(isEdit) {
  if (!isEdit) {
    return 'edit'
  }
  return 'unedit'
}
