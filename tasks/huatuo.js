var taskUtils = require('../lib/taskUtils.js')
var regions = require('../lib/regions.js')

module.exports = {
  id: 'huatuo',
  name: '华佗',
  run: function (ctx) {
    if (!taskUtils.findAndClick(ctx, {
      desc: '行囊',
      image: 'package.png',
      region: regions.packageButton,
      waitAfter: 2000
    })) {
      return 'failed'
    }

    if (!taskUtils.findAndClick(ctx, {
      desc: '其他',
      image: 'others.png',
      region: regions.bagOtherTab,
      waitAfter: 900
    })) {
      return 'failed'
    }

    if (!taskUtils.findAndClick(ctx, {
      desc: '葫芦',
      image: 'hulu.png',
      region: regions.bagItems,
      waitAfter: 600
    })) {
      return 'failed'
    }

    if (!taskUtils.findAndClick(ctx, {
      desc: '使用',
      image: 'use.png',
      region: regions.useButton,
      waitAfter: 1600
    })) {
      return 'failed'
    }

    if (!selectHuatuoTarget(ctx)) {
      return 'failed'
    }

    if (!taskUtils.findAndClick(ctx, {
      desc: '发起集结按钮',
      image: 'jijie_start_button.png',
      region: regions.suipianJijieStartButton,
      waitAfter: 900
    })) {
      return 'failed'
    }

    return taskUtils.marchWithRefill(ctx, 170000) ? 'success' : 'failed'
  }
}

function selectHuatuoTarget (ctx) {
  if (taskUtils.findAndClick(ctx, {
    desc: '集结攻击按钮',
    image: 'jijie_attack_button.png',
    region: regions.attackButton,
    threshold: 0.76,
    maxRetry: 2,
    waitAfter: 900,
    optional: true
  })) {
    return true
  }

  if (!taskUtils.findAndClick(ctx, {
    desc: '华佗',
    image: 'huatuo.png',
    region: regions.suipianTarget,
    waitAfter: 900
  })) {
    return false
  }

  return taskUtils.findAndClick(ctx, {
    desc: '集结攻击按钮',
    image: 'jijie_attack_button.png',
    region: regions.attackButton,
    threshold: 0.76,
    maxRetry: 2,
    waitAfter: 900
  })
}
