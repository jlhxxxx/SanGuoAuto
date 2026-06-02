var regions = require('./regions.js')

function findAndClick (ctx, step) {
  ctx.logger.info('查找: ' + step.desc)
  var match = ctx.image.find(step.image, {
    region: step.region,
    threshold: step.threshold || 0.78,
    maxRetry: step.maxRetry || 6,
    intervalMs: step.intervalMs || 500,
    scaleTemplate: step.scaleTemplate !== false
  })

  if (!match) {
    if (step.optional) {
      ctx.logger.info('未出现可选步骤: ' + step.desc)
      return false
    }
    ctx.logger.warn('未找到: ' + step.desc + ' (' + step.image + ')')
    toast((step.taskName || '任务') + '未找到: ' + step.desc)
    return false
  }

  ctx.logger.info('找到: ' + step.desc + ' @ ' + match.x + ', ' + match.y)
  randomWaitBeforeClick(ctx, step)
  clickMatch(ctx, match, step)

  if (step.waitAfter) {
    ctx.wait(step.waitAfter)
  }
  return !ctx.isStopped()
}

function marchWithRefill (ctx, waitAfterMs) {
  if (!findAndClick(ctx, {
    desc: '阵营数字1图标',
    image: 'camp_1.png',
    region: regions.campOne,
    waitAfter: 300
  })) {
    return false
  }

  if (!clickMarch(ctx, '出征按钮', 1000)) {
    return false
  }
  
  if (findAndClick(ctx, {
    desc: '一键补齐所有',
    image: 'refill_all_button.png',
    region: regions.refillAllButton,
    threshold: 0.76,
    maxRetry: 2,
    waitAfter: 900,
    optional: true
  })) {
    if (findAndClick(ctx, {
      desc: '今日不再显示',
      image: 'not_show_today.png',
      region: regions.notShowToday,
      threshold: 0.76,
      waitAfter: 300,
      optional: true
    })) {
      if (!findAndClick(ctx, {
        desc: '确认',
        image: 'confirm_button.png',
        region: regions.confirmButton,
        threshold: 0.76,
        waitAfter: 500,
      })) {
        return false;
      }
    }
	
    if (!clickMarch(ctx, '补齐后重新出征', 1500)) {
      return false;
    }
  }

  ctx.wait(waitAfterMs)
  return !ctx.isStopped()
}

function clickMarch (ctx, desc, waitAfter) {
  return findAndClick(ctx, {
    desc: desc,
    image: 'march_button.png',
    region: regions.marchButton,
    clickOffsetX: 120,
    waitAfter: waitAfter
  })
}

function randomWaitBeforeClick (ctx, step) {
  if (step.randomWaitBeforeClick === false) {
    return
  }
  var min = step.randomWaitMin || ctx.config.randomWaitBeforeClickMinMs || 100
  var max = step.randomWaitMax || ctx.config.randomWaitBeforeClickMaxMs || 1000
  var ms = min + Math.floor(Math.random() * (max - min + 1))
  ctx.logger.info('点击前随机等待: ' + ms + 'ms')
  ctx.wait(ms)
}

function clickMatch (ctx, match, step) {
  if (step.clickOffsetX || step.clickOffsetY) {
    ctx.automator.click(
      match.x + Math.floor(match.width / 2) + ctx.automator.scaleOffsetX(step.clickOffsetX || 0),
      match.y + Math.floor(match.height / 2) + ctx.automator.scaleOffsetY(step.clickOffsetY || 0)
    )
  } else {
    ctx.automator.clickImage(match)
  }
}

module.exports = {
  findAndClick: findAndClick,
  marchWithRefill: marchWithRefill
}
