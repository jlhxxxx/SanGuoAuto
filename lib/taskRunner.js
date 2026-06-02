function TaskRunner (options) {
  this.config = options.config
  this.tasks = options.tasks
  this.logger = options.logger
  this.createContext = options.createContext
  this.state = 'idle'
  this.currentTask = this.tasks.getById(this.config.defaultTaskId) || this.tasks.list[0]
  this.thread = null
  this.progressCallback = function () {}
  this.stateCallback = function () {}
  this.stopRequested = false
  this.pauseRequested = false
}

TaskRunner.prototype.onProgress = function (callback) {
  this.progressCallback = callback || function () {}
}

TaskRunner.prototype.onStateChange = function (callback) {
  this.stateCallback = callback || function () {}
}

TaskRunner.prototype.setState = function (state) {
  this.state = state
  this.stateCallback(state)
}

TaskRunner.prototype.getState = function () {
  return this.state
}

TaskRunner.prototype.isStopped = function () {
  return this.stopRequested
}

TaskRunner.prototype.isPaused = function () {
  return this.pauseRequested
}

TaskRunner.prototype.setTask = function (taskId) {
  if (this.state === 'running') {
    toast('请先暂停或停止，再切换任务')
    return false
  }
  var task = this.tasks.getById(taskId)
  if (!task) {
    toast('任务不存在: ' + taskId)
    return false
  }
  if (this.state === 'paused') {
    this.resetPausedTask()
  }
  this.currentTask = task
  this.progressCallback(0, 0)
  this.logger.info('切换任务: ' + task.name)
  return true
}

TaskRunner.prototype.resetPausedTask = function () {
  this.stopRequested = true
  this.pauseRequested = false
  if (this.thread) {
    try {
      this.thread.interrupt()
    } catch (e) {
      this.logger.warn('中断暂停任务异常: ' + e)
    }
  }
  this.thread = null
  this.stopRequested = false
  this.setState('idle')
}

TaskRunner.prototype.start = function (loopCount) {
  if (this.state === 'running') {
    return false
  }
  if (this.state === 'paused') {
    this.resume()
    return true
  }
  if (!this.currentTask) {
    toast('没有可执行任务')
    return false
  }

  var count = parseInt(loopCount, 10)
  if (isNaN(count) || count < 1) {
    count = this.config.defaultLoopCount
  }

  this.stopRequested = false
  this.pauseRequested = false
  this.progressCallback(0, count)
  this.setState('running')
  this.runInThread(this.currentTask, count)
  return true
}

TaskRunner.prototype.runInThread = function (task, loopCount) {
  var self = this
  this.thread = threads.start(function () {
    var ctx = self.createContext()
    try {
      ctx.image.requestPermission()
      for (var i = 1; i <= loopCount; i++) {
        if (self.stopRequested) {
          break
        }
        self.waitWhilePaused()
        if (self.stopRequested) {
          break
        }

        self.logger.info('执行任务 [' + task.name + '] 第 ' + i + '/' + loopCount + ' 轮')
        var result = task.run(ctx) || 'success'
        self.logger.info('任务结果: ' + result)
        self.progressCallback(i, loopCount)

        if (i < loopCount) {
          self.wait(self.config.loopIntervalMs)
        }
      }

      if (!self.stopRequested) {
        toast('任务完成')
        self.logger.info('任务完成: ' + task.name)
      }
    } catch (e) {
      toast('任务异常: ' + e)
      self.logger.error(e.stack || e)
    } finally {
      self.stopRequested = false
      self.pauseRequested = false
      self.thread = null
      self.setState('idle')
    }
  })
}

TaskRunner.prototype.pause = function () {
  if (this.state !== 'running') {
    return false
  }
  this.pauseRequested = true
  this.setState('paused')
  toast('已暂停')
  return true
}

TaskRunner.prototype.resume = function () {
  if (this.state !== 'paused') {
    return false
  }
  this.pauseRequested = false
  this.setState('running')
  toast('继续执行')
  return true
}

TaskRunner.prototype.stop = function () {
  this.stopRequested = true
  this.pauseRequested = false
  if (this.thread) {
    try {
      this.thread.interrupt()
    } catch (e) {
      this.logger.warn('中断线程异常: ' + e)
    }
  }
  this.setState('idle')
  this.progressCallback(0, 0)
  toast('已停止')
  return true
}

TaskRunner.prototype.waitWhilePaused = function () {
  while (this.pauseRequested && !this.stopRequested) {
    sleep(200)
  }
}

TaskRunner.prototype.wait = function (ms) {
  var passed = 0
  var step = 200
  while (passed < ms) {
    if (this.stopRequested) {
      return false
    }
    this.waitWhilePaused()
    sleep(Math.min(step, ms - passed))
    passed += step
  }
  return true
}

module.exports = TaskRunner
