var templateCache = {}
var scaledTemplateCache = {}

function scaleX (config, x) {
  return Math.round(x * device.width / config.baseWidth)
}

function scaleRate (config) {
  return device.width / config.baseWidth
}

function scaleByWidth (config, value) {
  return Math.round(value * scaleRate(config))
}

function normalizeRegion (config, region) {
  if (!region) {
    return null
  }
  if (Object.prototype.toString.call(region) === '[object Array]') {
    if (region.length !== 4) {
      throw new Error('region 必须是 [x, y, width, height]')
    }
    return [
      scaleX(config, region[0]),
      scaleByWidth(config, region[1]),
      scaleByWidth(config, region[2]),
      scaleByWidth(config, region[3])
    ]
  }
  return normalizeAnchoredRegion(config, region)
}

function normalizeAnchoredRegion (config, region) {
  if (typeof region.centerX === 'number' || typeof region.centerY === 'number') {
    return normalizeCenterRegion(config, region)
  }
  var left = typeof region.left === 'number'
    ? scaleX(config, region.left)
    : null
  var right = typeof region.right === 'number'
    ? scaleX(config, region.right)
    : null
  var top = typeof region.top === 'number'
    ? scaleByWidth(config, region.top)
    : null
  var bottom = typeof region.bottom === 'number'
    ? scaleByWidth(config, region.bottom)
    : null
  var width = typeof region.width === 'number'
    ? scaleByWidth(config, region.width)
    : device.width - left - right
  var height = typeof region.height === 'number'
    ? scaleByWidth(config, region.height)
    : device.height - top - bottom
  left = left !== null ? left : device.width - right - width
  top = top !== null ? top : device.height - bottom - height
  return [left, top, width, height]
}

function normalizeCenterRegion (config, region) {
  var rate = scaleRate(config)
  var width = scaleByWidth(config, region.width)
  var height = scaleByWidth(config, region.height)
  var baseCenterX = config.baseWidth / 2
  var baseCenterY = config.baseHeight / 2
  var centerX = device.width / 2 + (region.centerX - baseCenterX) * rate
  var centerY = device.height / 2 + (region.centerY - baseCenterY) * rate
  return [
    Math.round(centerX - width / 2),
    Math.round(centerY - height / 2),
    width,
    height
  ]
}

module.exports = function createImageHelper (config, logger, regionOverlay) {
  function readTemplate (name) {
    var path = files.path('./resources/images/' + name)
    if (!templateCache[path]) {
      if (!files.exists(path)) {
        throw new Error('模板图片不存在: ' + path)
      }
      templateCache[path] = images.read(path)
    }
    return templateCache[path]
  }

  function getTemplate (name, scaleTemplate) {
    var template = readTemplate(name)
    if (scaleTemplate === false || config.scaleTemplates === false) {
      return template
    }
    var rate = scaleRate(config)
    if (Math.abs(rate - 1) < 0.01) {
      return template
    }
    var width = Math.max(1, Math.round(template.getWidth() * rate))
    var height = Math.max(1, Math.round(template.getHeight() * rate))
    var key = name + '@' + width + 'x' + height
    if (!scaledTemplateCache[key]) {
      scaledTemplateCache[key] = images.resize(template, [width, height])
      logger.debug('缩放模板: ' + name + ' -> ' + width + 'x' + height)
    }
    return scaledTemplateCache[key]
  }

  function capture () {
    if (regionOverlay) {
      regionOverlay.hide()
    }
    var screen = captureScreen()
    if (!screen) {
      throw new Error('截图失败，请确认已授予截图权限')
    }
    return screen
  }

  return {
    requestPermission: function () {
      logger.info('请求截图权限')
      var ok = requestScreenCapture(false)
      if (!ok) {
        throw new Error('请求截图权限失败')
      }
      return ok
    },
    capture: capture,
    find: function (name, options) {
      options = options || {}
      var maxRetry = options.maxRetry || 1
      var intervalMs = options.intervalMs || config.imageRetryIntervalMs
      var template = getTemplate(name, options.scaleTemplate)
      var threshold = options.threshold || config.imageThreshold
      var region = normalizeRegion(config, options.region)
      var lastScreen = null
      if (region) {
        logger.debug('查找图片区域: ' + name + ' -> [' + region.join(',') + ']')
      }

      for (var i = 0; i < maxRetry; i++) {
        lastScreen = capture()
        if (region && regionOverlay) {
          regionOverlay.show(region)
        }
        var findOptions = {
          threshold: threshold
        }
        if (region) {
          findOptions.region = region
        }
        var point = images.findImage(lastScreen, template, findOptions)
        if (point) {
          return {
            x: point.x,
            y: point.y,
            width: template.getWidth(),
            height: template.getHeight(),
            name: name
          }
        }
        if (i < maxRetry - 1) {
          sleep(intervalMs)
        }
      }
      return null
    },
    exists: function (name, options) {
      return !!this.find(name, options)
    }
  }
}
