function randomBetween (min, max) {
  return Math.floor(min + Math.random() * (max - min + 1))
}

function clamp (value, min, max) {
  return Math.max(min, Math.min(max, value))
}

module.exports = function createAutomator (config, logger) {
  function scaleX (x) {
    return Math.round(x * device.width / config.baseWidth)
  }

  function scaleY (y) {
    return Math.round(y * device.height / config.baseHeight)
  }

  function scaleOffsetX (x) {
    return Math.round(x * device.width / config.baseWidth)
  }

  function scaleOffsetY (y) {
    return Math.round(y * device.height / config.baseHeight)
  }

  function checkPoint (x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('点击坐标必须是数字: ' + x + ', ' + y)
    }
    if (x < 0 || y < 0 || x >= device.width || y >= device.height) {
      throw new Error('点击坐标超出屏幕: ' + x + ', ' + y)
    }
  }

  function addRandomOffset (x, y, offset) {
    var size = typeof offset === 'number' ? offset : config.clickRandomOffset
    return {
      x: clamp(x + randomBetween(-size, size), 0, device.width - 1),
      y: clamp(y + randomBetween(-size, size), 0, device.height - 1)
    }
  }

  return {
    scaleX: scaleX,
    scaleY: scaleY,
    scaleOffsetX: scaleOffsetX,
    scaleOffsetY: scaleOffsetY,
    click: function (x, y, options) {
      options = options || {}
      if (options.scale) {
        x = scaleX(x)
        y = scaleY(y)
      }
      if (options.random !== false) {
        var point = addRandomOffset(x, y, options.offset)
        x = point.x
        y = point.y
      }
      checkPoint(x, y)
      logger.info('点击: ' + x + ', ' + y)
      return click(x, y)
    },
    clickRegion: function (region, options) {
      options = options || {}
      var x = region[0] + Math.floor(region[2] / 2)
      var y = region[1] + Math.floor(region[3] / 2)
      return this.click(x, y, options)
    },
    clickImage: function (match, options) {
      if (!match) {
        return false
      }
      var x = match.x + Math.floor(match.width / 2)
      var y = match.y + Math.floor(match.height / 2)
      return this.click(x, y, options)
    },
    swipe: function (x1, y1, x2, y2, duration, options) {
      options = options || {}
      if (options.scale) {
        x1 = scaleX(x1)
        y1 = scaleY(y1)
        x2 = scaleX(x2)
        y2 = scaleY(y2)
      }
      logger.info('滑动: ' + [x1, y1, x2, y2, duration || 500].join(', '))
      return swipe(x1, y1, x2, y2, duration || 500)
    },
    back: function () {
      logger.info('返回')
      return back()
    }
  }
}
