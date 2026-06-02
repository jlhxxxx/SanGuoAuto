function RegionOverlay (config, logger) {
  this.config = config.debugRegionOverlay || {}
  this.logger = logger
  this.windows = []
  this.timer = null
  this.enabled = this.config.enabled === true
}

RegionOverlay.prototype.show = function (region) {
  if (!this.enabled || !region) {
    return
  }

  this.hide()

  var borderWidth = this.config.borderWidth || 2
  var color = this.config.color || '#FFFF0000'
  var durationMs = this.config.durationMs || 350
  var left = region[0]
  var top = region[1]
  var width = region[2]
  var height = region[3]

  try {
    this.windows = [
      createLine(left, top, width, borderWidth, color),
      createLine(left, top + height - borderWidth, width, borderWidth, color),
      createLine(left, top, borderWidth, height, color),
      createLine(left + width - borderWidth, top, borderWidth, height, color)
    ]
  } catch (e) {
    loggerSafe(this.logger, 'warn', '显示查找红框失败: ' + e)
    this.hide()
    return
  }

  this.timer = setTimeout(function () {
    this.hide()
  }.bind(this), durationMs)
}

RegionOverlay.prototype.hide = function () {
  if (this.timer) {
    clearTimeout(this.timer)
    this.timer = null
  }

  for (var i = 0; i < this.windows.length; i++) {
    try {
      this.windows[i].close()
    } catch (e) {
      loggerSafe(this.logger, 'debug', '关闭查找红框失败: ' + e)
    }
  }
  this.windows = []
}

RegionOverlay.prototype.close = function () {
  this.hide()
}

function createLine (x, y, width, height, color) {
  var window = floaty.rawWindow(
    <frame id="line" />
  )
  window.line.setBackgroundColor(colors.parseColor(color))
  if (window.setTouchable) {
    window.setTouchable(false)
  }
  window.setPosition(x, y)
  window.setSize(Math.max(1, width), Math.max(1, height))
  return window
}

function loggerSafe (logger, method, message) {
  if (logger && logger[method]) {
    logger[method](message)
  }
}

module.exports = RegionOverlay
