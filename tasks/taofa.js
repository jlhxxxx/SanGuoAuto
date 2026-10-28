var taskUtils = require('../lib/taskUtils.js')
var regions = require('../lib/regions.js')

module.exports = {
  id: 'taofa',
  name: '讨伐',
  run: function (ctx) {
    if (!taskUtils.findAndClick(ctx, {
      desc: '左侧放大镜',
      image: 'search_icon.png',
      region: regions.searchIcon,
      waitAfter: 800
    })) {
      return 'failed'
    }

    if (!taskUtils.findAndClick(ctx, {
      desc: '搜索按钮',
      image: 'search_button.png',
      region: regions.searchButton,
      waitAfter: 1600
    })) {
      return 'failed'
    }

    if (!taskUtils.findAndClick(ctx, {
      desc: '攻击按钮',
      image: 'taofa_attack_button.png',
      region: regions.attackButton,
      waitAfter: 900
    })) {
      return 'failed'
    }

    return taskUtils.marchWithRefill(ctx, 40000) ? 'success' : 'failed'
  }
}
