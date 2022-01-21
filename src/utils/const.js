// 产品
export const typCodeis = [
  { label: '国债', value: '国债' },
  { label: '央票', value: '央票' },
  { label: '金融债', value: '金融债' },
  { label: '地方债', value: '地方债' },
  { label: '--', value: '--' }, // 占位
  { label: '短债', value: '短债' },
  { label: '中票', value: '中票' },
  { label: '企业债', value: '企业债' },
  { label: '公司债', value: '公司债' },
  { label: 'PPN', value: 'PPN' },
  { label: 'NCD', value: 'NCD' },
  { label: 'ABS', value: 'ABS' },
  { label: 'CRM', value: 'CRM' },
  { label: '其他', value: '其他' }
]

// 期限
export const terms = [
  { label: '<3M', value: '<3m' },
  { label: '3-6M', value: '3-6m' },
  { label: '6-9M', value: '6-9m' },
  { label: '9-12M', value: '9-12m' },
  { label: '1-3Y', value: '1-3y' },
  { label: '3-5Y', value: '3-5y' },
  { label: '5-7Y', value: '5-7y' },
  { label: '7-10Y', value: '7-10y' },
  { label: '≥10Y', value: '>=10y' }
]

// 永续债
export const perpetualBonds = [
  { label: '永续', value: '1' },
  { label: '非永续', value: '0' }
]

// 城投
export const cityInvestments = [
  { label: '城投', value: '1' },
  { label: '非城投', value: '0' }
]

// 主体
export const issrRats = [
  { label: 'AAA+', value: 'AAA+' },
  { label: 'AAA', value: 'AAA' },
  { label: 'AA+', value: 'AA+' },
  { label: 'AA', value: 'AA' },
  { label: 'AA-', value: 'AA-' },
  { label: 'A+', value: 'A+' },
  { label: '其他', value: '其他' }
]

// 债项
export const debts = [
  { label: 'AAA', value: 'AAA' },
  { label: 'A-1', value: 'A-1' },
  { label: 'AA+', value: 'AA+' },
  { label: 'AA', value: 'AA' },
  { label: 'AA-', value: 'AA-' },
  { label: 'A+', value: 'A+' },
  { label: '其他', value: '其他' }
]

// 金融债
export const financialDebts = [
  { label: '国开', value: '1' },
  { label: '非国开', value: '0' }
]

// 地方债
export const localDebts = [
  { label: '一般债', value: '0' },
  { label: '专项债', value: '1' }
]

// 含权
export const withRights = [
  { label: '含权', value: '1' },
  { label: '非含权', value: '0' }
]

// 特殊
export const specials = [
  { label: '新上市', value: '1' },
  { label: '跨市场', value: '2' },
  { label: '银行间', value: '3' },
  { label: '交易所', value: '4' },
  { label: '不含假期', value: '5', width: 'auto' }
]

// 成交状态
export const dealState = [
  { label: '未成交', value: '1' },
  { label: '部分成交', value: '2' },
  { label: '已成交', value: '3' },
  { label: 'END', value: '4' }
]

// 报价来源
export const quotationSource = [
  { label: '手动', value: '0' },
  { label: 'Q-T新增', value: '1' }
]

// 常规的ctrSelect组件
// key1代表options对应的键值,key2代表接口参数键值
export const simpleCtrSelects = [
  { title: '永续债', key1: 'perpetualBonds', key2: 'perpetual' },
  { title: '城投', key1: 'cityInvestments', key2: 'is_city_investment' },
  { title: '主体', key1: 'issrRats', key2: 'issr_rat' },
  { title: '债项', key1: 'debts', key2: 'rat_lvl' },
  { title: '金融债', key1: 'financialDebts', key2: 'jrz' },
  { title: '地方债', key1: 'localDebts', key2: 'ybz_zxz' },
  { title: '含权', key1: 'withRights', key2: 'b_embopt_type' },
  { title: '特殊', key1: 'specials', key2: 'special' }
]

// 左侧筛选框分割线上方的条件
export const topCondition = {
  key_word: '',
  is_valid: '0',
  bid_s: '', // 买入>=
  bid_e: '', // 买入<=
  ofr_s: '', // 卖出>=
  ofr_e: '', // 卖出<=
  bid_eva_ge: '', // Bid-中债>=
  bid_eva_le: '', // Bid-中债<=
  eva_ofr_ge: '', // 中债-Ofr>=
  eva_ofr_le: '' // 中债-Ofr<=
}

// 左侧筛选框分割线下方的条件
export const bottomCondition = {
  typ_codei: '', // 产品
  term: '', // 期限
  term_s: '',
  term_e: '',
  perpetual: '', // 永续债
  is_city_investment: '', // 城投
  issr_rat: '', // 主体
  rat_lvl: '', // 债项
  jrz: '', // 金融债
  ybz_zxz: '', // 地方债
  b_embopt_type: '', // 含权
  special: '' // 特殊
}

// 我的报价
// key1代表options对应的键值,key2代表接口参数键值
export const myOfferCtrSelects = [
  { title: '成交状态', key1: 'dealState', key2: 'state' },
  { title: '报价来源', key1: 'quotationSource', key2: 'src' }
]

// 历史报价
// key1代表options对应的键值,key2代表接口参数键值
export const oldCtrSelects = [
  { title: '产品', key1: 'typCodei', key2: 'typCodei1' },
  { title: '期限', key1: 'qx', key2: 'qx1' },
  { title: '成交状态', key1: 'dealState', key2: 'state1' }
]

// 成交明细
// key1代表options对应的键值,key2代表接口参数键值
export const transactionSelects = [
  { title: '产品', key1: 'product', key2: 'product1' },
  { title: '期限', key1: 'term', key2: 'term1' },
  { title: '成交来源', key1: 'dealsource', key2: 'dealsource1' }
]

// 历史报价
// 产品
export const typCodei = [
  { label: '国债', value: '国债' },
  { label: '央票', value: '央票' },
  { label: '金融债', value: '金融债' },
  { label: '地方债', value: '地方债' },
  { label: '短债', value: '短债' },
  { label: '中票', value: '中票' },
  { label: '企业债', value: '企业债' },
  { label: '公司债', value: '公司债' },
  { label: 'PPN', value: 'PPN' },
  { label: 'NCD', value: 'NCD' },
  { label: 'ABS', value: 'ABS' },
  { label: 'CRM', value: 'CRM' },
  { label: '其他', value: '其他' }
]

// 历史报价
// 期限
export const qx = [
  { label: '<3m', value: '<3m' },
  { label: '3-6m', value: '3-6m' },
  { label: '6-9m', value: '6-9m' },
  { label: '1-3y', value: '1-3y' },
  { label: '3-5y', value: '3-5y' },
  { label: '5-7y', value: '5-7y' },
  { label: '7-10y', value: '7-10y' },
  { label: '≥10y', value: '>=10y' }
]

// 成交明细
// 产品
export const product = [
  { label: '国债', value: '国债' },
  { label: '央票', value: '央票' },
  { label: '金融债', value: '金融债' },
  { label: '地方债', value: '地方债' },
  { label: '短债', value: '短债' },
  { label: '中票', value: '中票' },
  { label: '企业债', value: '企业债' },
  { label: '公司债', value: '公司债' },
  { label: 'PPN', value: 'PPN' },
  { label: 'NCD', value: 'NCD' },
  { label: 'ABS', value: 'ABS' },
  { label: 'CRM', value: 'CRM' },
  { label: '其他', value: '其他' }
]

// 成交明细
// 期限
export const term = [
  { label: '<3M', value: '<3m' },
  { label: '3-6M', value: '3-6m' },
  { label: '6-9M', value: '6-9m' },
  { label: '1-3Y', value: '1-3y' },
  { label: '3-5Y', value: '3-5y' },
  { label: '5-7Y', value: '5-7y' },
  { label: '7-10Y', value: '7-10y' },
  { label: '≥10Y', value: '>=10y' }
]

// 成交明细
// 来源
export const dealsource = [
  { label: '中介', value: '2' },
  { label: '非中介', value: '1' }
]
