/* eslint-disable prefer-const */
import moment from 'moment'
import { message } from 'ant-design-vue'

/**
 * 获取今日日期yyyy-mm-dd格式
 */
export const getTody = () => {
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

/**
 * 获取location.search中的参数
 * @param {*} name 参数名
 * @returns
 */
export const getQueryString = name => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}

/**
 * 个位数对齐(配合v-html使用)
 * @param {*} digital 数值
 * @param {*} number 小数保留位数
 */
export const handleOnesDigitAlign = (digital, number) => {
  if (digital.includes('.')) {
    const start = digital.split('.')[0]
    const end = digital.split('.')[1]
    if (end) {
      return `<span style="display: inline-block;width: 50%;text-align: right;">${start}</span><span style="display: inline-block;width: 50%;text-align: left;">.${end}</span>`
    } else if (start) {
      return `<span>${start}.</span>`
    }
  } else if (!isNaN(Number(digital))) {
    return `<span style="display: inline-block;width: 50%;text-align: right;">${digital}</span><span style="display: inline-block;width: 50%;text-align: left;"></span>`
  } else if (digital.includes('*')) {
    let index = digital.indexOf('*')
    let left = digital.slice(0, index)
    let right = digital.slice(index)
    return `<span style="display: inline-block;width: 50%;text-align: right;">${left}</span><span style="display: inline-block;width: 50%;text-align: left;">${right}</span>`
  } else {
    return digital
  }
}

/**
 * 获取成交的详细分类
 * @param {*} row 行数据
 */
export const getTranDetailType = (row, h) => {
  const {
    price,
    my_tran_price: myTranPrice,
    vol,
    tran_amt_total: tranAmtTotal,
    bo,
    state
  } = row
  if (['2', '3'].includes(state)) {
    if (price === myTranPrice && vol === tranAmtTotal) {
      return bo === 'Ofr'
        ? [<span style="color: #177DDC;">TKN</span>]
        : [<span style="color: #BD7B22;">GVN</span>]
    } else {
      return [<span style="color: #8CBA16;">TRD</span>]
    }
  }
  return '--'
}

/**
 * 新增成交类型取值
 * @param {*} row 行数据
 */
export const getTranType = (row, h) => {
  const {
    seek_price: seekPrice, // 报价
    price, // 成交价
    seel_amount: seelAmount, // 报价量
    amount, // 成交额
    bo
  } = row
  if (
    price &&
    seekPrice &&
    amount &&
    seelAmount &&
    price === seekPrice &&
    seelAmount === amount + '' &&
    bo
  ) {
    row.type = bo === 'Ofr' ? 'TKN' : 'GVN'
    return bo === 'Ofr'
      ? [<span style="color: #177DDC;">TKN</span>]
      : [<span style="color: #BD7B22;">GVN</span>]
  }
  if (
    (price && seekPrice && price !== seekPrice) ||
    (amount && seelAmount && amount !== seelAmount && bo)
  ) {
    row.type = 'TRD'
    return [<span style="color: #8CBA16;">TRD</span>]
  } else {
    if (row.type === 'TKN') {
      return [<span style="color: #177DDC;">TRD</span>]
    }
    if (row.type === 'GVN') {
      return [<span style="color: #BD7B22;">GVN</span>]
    }
    if (row.type === 'TRD') {
      return [<span style="color: #8CBA16;">TRD</span>]
    }
  }
}

/**
 * 行情区域前端过滤
 * @param {*} data
 * @param {*} condition
 */
export const handleSocketDataFilter = (data, condition) => {
  let {
    name,
    code,
    bid,
    ofr,
    bid_eva: bidEva,
    eva_ofr: evaOfr,
    p_class: pClass = '',
    wind_class2: windClass2 = '',
    left_d: leftD,
    left_y: leftY,
    perpetual: isPerpetual,
    is_city_investment: isCityInvestment,
    issr_rat: issrRat,
    rat_lvl: ratLvl,
    b_embopt_type: bEmboptType,
    b_list_date: bListDate,
    ksc_count: kscCount,
    host_market: hostMarket,
    cal_flag: calFlag,
    group_ids: groupIds,
    b_issuer: bIssuer
  } = data
  const {
    key_word: keyWord,
    is_valid: isValid,
    bid_s: bidS,
    bid_e: bidE,
    ofr_s: ofrS,
    ofr_e: ofrE,
    bid_eva_ge: bidEvaGe,
    bid_eva_le: bidEvaLe,
    eva_ofr_ge: evaOfrGe,
    eva_ofr_le: evaOfrLe,
    typ_codei: typCodei,
    term,
    term_s: termS,
    term_e: termE,
    perpetual: isPerpetualC,
    is_city_investment: isCityInvestmentC,
    issr_rat: issrRatC,
    rat_lvl: ratLvlC,
    ybz_zxz: ybzZxz,
    b_embopt_type: bEmboptTypeC,
    special,
    group_id: groupId
  } = condition
  let flag = true
  // 债券名称、code模糊匹配
  if (keyWord && !(name.includes(keyWord) || code.includes(keyWord))) {
    flag = false
  }
  // 有效报价、双边报价
  if (isValid === '1' && !(parseFloat(bid) > 0 && parseFloat(ofr) > 0)) {
    flag = false
  }
  // bid、ofr
  if (bid === '--' || bid === '') {
    bid = 0
  }
  if (ofr === '--' || ofr === '') {
    ofr = 0
  }
  if (bidS && !(parseFloat(bid) >= parseFloat(bidS))) {
    flag = false
  }
  if (bidE && !(parseFloat(bid) <= parseFloat(bidE))) {
    flag = false
  }
  if (ofrS && !(parseFloat(ofr) >= parseFloat(ofrS))) {
    flag = false
  }
  if (ofrE && !(parseFloat(ofr) <= parseFloat(ofrE))) {
    flag = false
  }
  // bid-中债、中债-ofr
  if (bidEvaGe && !(parseFloat(bidEva) >= bidEvaGe)) {
    flag = false
  }
  if (bidEvaLe && !(parseFloat(bidEva) <= bidEvaLe)) {
    flag = false
  }
  if (evaOfrGe && !(parseFloat(evaOfr) >= evaOfrGe)) {
    flag = false
  }
  if (evaOfrLe && !(parseFloat(evaOfr) <= evaOfrLe)) {
    flag = false
  }
  // 产品
  if (typCodei) {
    let typCodeiFlag = false
    const typeList = typCodei.split(',')
    for (let i = 0; i < typeList.length; i++) {
      const type = typeList[i]
      if (type === '国债' && bIssuer === '中华人民共和国财政部') {
        typCodeiFlag = true
        break
      }
      if (type === '央票' && pClass === '央行票据') {
        typCodeiFlag = true
        break
      }
      if (type === '金融债' && pClass === '特种金融债') {
        typCodeiFlag = true
        break
      }
      if (type === '地方债' && pClass === '地方政府债') {
        typCodeiFlag = true
        break
      }
      if (type === '短债' && pClass === '短期融资券') {
        typCodeiFlag = true
        break
      }
      if (type === '中票' && pClass === '中期票据') {
        typCodeiFlag = true
        break
      }
      if (type === '企业债' && pClass === '企债') {
        typCodeiFlag = true
        break
      }
      if (type === '公司债' && pClass === '公司债') {
        typCodeiFlag = true
        break
      }
      if (type === 'PPN' && pClass === '定向工具') {
        typCodeiFlag = true
        break
      }
      if (type === 'ABS' && windClass2 === '交易商协会ABS') {
        typCodeiFlag = true
        break
      }
      if (type === 'NCD' && name.includes('CD')) {
        typCodeiFlag = true
        break
      }
      if (type === 'CRM' && name.includes('CRM')) {
        typCodeiFlag = true
        break
      }
      if (
        type === '其他' &&
        !(
          [
            '国债',
            '央行票据',
            '金融债',
            '地方政府债',
            '短期融资券',
            '中期票据',
            '企债',
            '公司债',
            '定向工具',
            '交易商协会ABS'
          ].includes(pClass) ||
          name.includes('NCD') ||
          name.includes('CRM') ||
          windClass2 === '交易商协会ABS'
        )
      ) {
        typCodeiFlag = true
        break
      }
    }
    if (!typCodeiFlag) {
      flag = false
    }
  }
  // 期限
  if (term) {
    let termFlag = false
    const termList = term.split(',')
    for (let i = 0; i < termList.length; i++) {
      const item = termList[i]
      if (item === '<3m' && parseFloat(leftD) < 90) {
        termFlag = true
        break
      }
      if (
        item === '3-6m' &&
        parseFloat(leftD) >= 90 &&
        parseFloat(leftD) <= 180
      ) {
        termFlag = true
        break
      }
      if (
        item === '6-9m' &&
        parseFloat(leftD) >= 180 &&
        parseFloat(leftD) <= 270
      ) {
        termFlag = true
        break
      }
      if (
        item === '9-12m' &&
        parseFloat(leftD) >= 270 &&
        parseFloat(leftD) <= 360
      ) {
        termFlag = true
        break
      }
      if (item === '1-3y' && parseFloat(leftY) >= 1 && parseFloat(leftY) <= 3) {
        termFlag = true
        break
      }
      if (item === '3-5y' && parseFloat(leftY) >= 3 && parseFloat(leftY) <= 5) {
        termFlag = true
        break
      }
      if (item === '5-7y' && parseFloat(leftY) >= 5 && parseFloat(leftY) <= 7) {
        termFlag = true
        break
      }
      if (
        item === '7-10y' &&
        parseFloat(leftY) >= 7 &&
        parseFloat(leftY) <= 10
      ) {
        termFlag = true
        break
      }
      if (item === '>=10y' && parseFloat(leftY) >= 10) {
        termFlag = true
        break
      }
    }
    if (!termFlag) {
      flag = false
    }
  }
  if (termS) {
    const termSL = termS.toLowerCase()
    let termSV
    if (termSL.endsWith('y')) {
      termSV = parseFloat(termSL.slice(0, -1))
      if (parseFloat(leftY) <= termSV) {
        flag = false
      }
    } else if (termSL.endsWith('d')) {
      termSV = parseFloat(termSL.slice(0, -1))
      if (parseFloat(leftD) <= termSV) {
        flag = false
      }
    } else {
      termSV = parseFloat(termSL)
      if (parseFloat(leftD) <= termSV) {
        flag = false
      }
    }
  }
  if (termE) {
    const termEL = termE.toLowerCase()
    let termEV
    if (termEL.endsWith('y')) {
      termEV = parseFloat(termEL.slice(0, -1))
      if (parseFloat(leftY) >= termEV) {
        flag = false
      }
    } else if (termEL.endsWith('d')) {
      termEV = parseFloat(termEL.slice(0, -1))
      if (parseFloat(leftD) >= termEV) {
        flag = false
      }
    } else {
      termEV = parseFloat(termEL)
      if (parseFloat(leftD) >= termEV) {
        flag = false
      }
    }
  }
  // 是否永续
  if (isPerpetualC && isPerpetual !== isPerpetualC) {
    flag = false
  }
  // 是否城投
  if (isCityInvestmentC && isCityInvestment !== isCityInvestmentC) {
    flag = false
  }
  // 主体
  if (issrRatC) {
    let issrRatFlag = false
    const issrRatList = issrRatC.split(',')
    for (let i = 0; i < issrRatList.length; i++) {
      const item = issrRatList[i]
      if (item !== '其他' && item === issrRat) {
        issrRatFlag = true
        break
      }
      if (
        item === '其他' &&
        !['AAA+', 'AAA', 'AA+', 'AA', 'AA-', 'A+'].includes(issrRat)
      ) {
        issrRatFlag = true
        break
      }
    }
    if (!issrRatFlag) {
      flag = false
    }
  }
  // 债项
  if (ratLvlC) {
    let ratLvlFlag = false
    const ratLvlList = ratLvlC.split(',')
    for (let i = 0; i < ratLvlList.length; i++) {
      const item = ratLvlList[i]
      if (item !== '其他' && item === ratLvl) {
        ratLvlFlag = true
        break
      }
      if (
        item === '其他' &&
        !['A-1', 'AAA', 'AA+', 'AA', 'AA-', 'A+'].includes(ratLvl)
      ) {
        ratLvlFlag = true
        break
      }
    }
    if (!ratLvlFlag) {
      flag = false
    }
  }
  // 地方债
  if (ybzZxz) {
    if (
      !(
        (ybzZxz === '0' && name.includes('(一般)')) ||
        (ybzZxz === '1' && name.includes('(专项)'))
      )
    ) {
      flag = false
    }
  }
  // 是否含权
  if (bEmboptTypeC) {
    if (
      !(
        (bEmboptTypeC === '1' && bEmboptType === '0000') ||
        (bEmboptTypeC === '0' && bEmboptType !== '0000')
      )
    ) {
      flag = false
    }
  }
  // 特殊
  if (special) {
    let specialFlag = false
    const specialList = special.split(',')
    const today = moment().format('YYYY-MM-DD')
    for (let i = 0; i < specialList.length; i++) {
      const item = specialList[i]
      if (item === '1' && bListDate === today) {
        specialFlag = true
        break
      }
      if (item === '2' && parseFloat(kscCount) > 1) {
        specialFlag = true
        break
      }
      if (item === '3' && hostMarket.startsWith('X_CNBD')) {
        specialFlag = true
        break
      }
      if (item === '4' && ['XSHG', 'XSHE'].includes(hostMarket)) {
        specialFlag = true
        break
      }
      if (item === '5' && calFlag === '1') {
        specialFlag = true
        break
      }
    }
    if (!specialFlag) {
      flag = false
    }
  }
  // 分组
  if (groupId && !groupIds.includes(groupId)) {
    flag = false
  }
  return flag ? data : null
}

/**
 *
 * @param {*} content 文件流
 * @param {*} filename 文件名称
 */
export const downloadFile = (content, filename) => {
  return new Promise((resolve, reject) => {
    var a = document.createElement('a')
    var blob = new Blob([content], { type: 'application/vnd.ms-excel' })
    var url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = `${filename}-${moment().format('YYYY-MM-DD')}`
    a.click()
    window.URL.revokeObjectURL(url)
    resolve()
  })
}

// 校验输入框值
export const handleInputCheck = condition => {
  // 自定义期限值
  const { term_s: termS, term_e: termE } = condition.bottom
  const reg = /\d+[DY]?$/
  if (termS && !reg.test(termS)) {
    message.warning('起始期限格式错误，请重新输入！')
    return false
  }
  if (termE && !reg.test(termE)) {
    message.warning('截止期限格式错误，请重新输入！')
    return false
  }
  // 买入价格
  const {
    bid_s: bidS,
    bid_e: bidE,
    ofr_s: ofrS,
    ofr_e: ofrE,
    bid_eva_ge: bidEvaGe,
    bid_eva_le: bidEvaLe,
    eva_ofr_ge: evaOfrGe,
    eva_ofr_le: evaOfrLe
  } = condition.top
  if ((bidS && isNaN(parseFloat(bidS))) || (bidE && isNaN(parseFloat(bidE)))) {
    message.warning('请输入正确的买入价格！')
    return false
  }
  // 卖出价格
  if ((ofrS && isNaN(parseFloat(ofrS))) || (ofrE && isNaN(parseFloat(ofrE)))) {
    message.warning('请输入正确的卖出价格！')
    return false
  }
  // Bid-中债
  if (
    (bidEvaGe && isNaN(parseFloat(bidEvaGe))) ||
    (bidEvaLe && isNaN(parseFloat(bidEvaLe)))
  ) {
    message.warning('请输入正确的Bid-中债！')
    return false
  }
  // 中债-Ofr
  if (
    (evaOfrGe && isNaN(parseFloat(evaOfrGe))) ||
    (evaOfrLe && isNaN(parseFloat(evaOfrLe)))
  ) {
    message.warning('请输入正确的中债-Ofr！')
    return false
  }
  return true
}
