var config = require('./config.js')
var logger = require('./lib/logger.js')
var tasks = require('./tasks/index.js')
var TaskRunner = require('./lib/taskRunner.js')
var FloatyController = require('./lib/floatyController.js')
var createAutomator = require('./lib/automator.js')
var createImageHelper = require('./lib/image.js')
var RegionOverlay = require('./lib/regionOverlay.js')

logger.info('启动 ' + config.appName)
logger.info('请先手动进入游戏目标界面，再点击浮窗开始任务')

auto.waitFor()

var regionOverlay = new RegionOverlay(config, logger)

var runner = new TaskRunner({
  config: config,
  tasks: tasks,
  logger: logger,
  createContext: function () {
    return {
      config: config,
      logger: logger,
      automator: createAutomator(config, logger),
      image: createImageHelper(config, logger, regionOverlay),
      wait: function (ms) {
        return runner.wait(ms)
      },
      isStopped: function () {
        return runner.isStopped()
      },
      isPaused: function () {
        return runner.isPaused()
      }
    }
  }
})

var floatyController = new FloatyController({
  config: config,
  tasks: tasks,
  runner: runner,
  logger: logger
})

runner.onProgress(function (current, total) {
  floatyController.updateProgress(current, total)
})

runner.onStateChange(function (state) {
  floatyController.updateState(state)
})

events.on('exit', function () {
  try {
    runner.stop()
    regionOverlay.close()
    floatyController.close()
  } catch (e) {
    logger.warn('退出清理异常: ' + e)
  }
})

floatyController.show()
setInterval(function () {}, 1000)
