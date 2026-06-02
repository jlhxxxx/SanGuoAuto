function FloatyController (options) {
  this.config = options.config
  this.tasks = options.tasks
  this.runner = options.runner
  this.logger = options.logger
  this.window = null
  this.currentTask = this.runner.currentTask
  this.currentLoopCount = this.config.defaultLoopCount
}

FloatyController.prototype.show = function () {
  var self = this
  var window = floaty.window(
    <vertical bg="#CC222222" padding="6">
      <horizontal>
        <button id="taskButton" text="任务" w="150" h="36" textSize="12sp" />
        <button id="exitButton" text="退出" w="76" h="36" textSize="12sp" />
      </horizontal>
      <horizontal marginTop="4">
        <text text="次数" textColor="#FFFFFF" textSize="12sp" gravity="center" w="38" h="34" />
        <button id="loopButton" text="200" w="70" h="34" textSize="12sp" />
        <text id="progressText" text="0/0" textColor="#FFFFFF" textSize="12sp" gravity="center" w="44" h="34" />
        <button id="startButton" text="开始" w="58" h="34" textSize="12sp" />
        <button id="stopButton" text="停止" w="58" h="34" textSize="12sp" />
      </horizontal>
    </vertical>
  )

  this.window = window
  window.setPosition(this.config.floaty.x, this.config.floaty.y)
  if (this.config.floaty.width && this.config.floaty.height) {
    window.setSize(this.config.floaty.width, this.config.floaty.height)
  }
  window.loopButton.setText(String(this.config.defaultLoopCount))
  this.updateTaskName()

  window.taskButton.click(function () {
    self.showTaskMenu()
  })

  window.startButton.click(function () {
    self.onStartOrPause()
  })

  window.stopButton.click(function () {
    self.runner.stop()
  })

  window.loopButton.click(function () {
    self.showLoopCountInput()
  })

  window.exitButton.click(function () {
    self.exitScript()
  })

  loggerSafe(this.logger, 'info', '浮窗已显示')
}

FloatyController.prototype.showTaskMenu = function () {
  if (this.runner.getState() === 'running') {
    toast('请先暂停或停止，再切换任务')
    return
  }

  var self = this
  var names = this.tasks.list.map(function (task) {
    return task.name
  })
  dialogs.select('选择任务', names, function (index) {
    if (index < 0) {
      return
    }
    var task = self.tasks.list[index]
    if (self.runner.setTask(task.id)) {
      self.currentTask = task
      self.updateTaskName()
    }
  })
}

FloatyController.prototype.onStartOrPause = function () {
  var state = this.runner.getState()
  if (state === 'running') {
    this.runner.pause()
    return
  }
  if (state === 'paused') {
    this.runner.resume()
    return
  }
  var count = this.readLoopCount()
  this.currentLoopCount = count
  this.runner.start(count)
}

FloatyController.prototype.readLoopCount = function () {
  var text = String(this.window.loopButton.getText())
  var count = parseInt(text, 10)
  if (isNaN(count)) {
    count = this.config.defaultLoopCount
  }
  if (count < 1) {
    count = 1
  }
  this.window.loopButton.setText(String(count))
  return count
}

FloatyController.prototype.showLoopCountInput = function () {
  if (this.runner.getState() === 'running') {
    toast('请先暂停或停止，再修改次数')
    return
  }

  var self = this
  dialogs.rawInput('设置循环次数', String(this.readLoopCount()), function (value) {
    var count = parseInt(value, 10)
    if (isNaN(count)) {
      count = self.config.defaultLoopCount
    }
    if (count < 1) {
      count = 1
    }
    self.currentLoopCount = count
    ui.run(function () {
      self.window.loopButton.setText(String(count))
    })
  })
}

FloatyController.prototype.updateTaskName = function () {
  if (!this.window || !this.currentTask) {
    return
  }
  this.window.taskButton.setText(this.currentTask.name + ' ▼')
}

FloatyController.prototype.updateProgress = function (current, total) {
  if (!this.window) {
    return
  }
  ui.run(function () {
    this.window.progressText.setText(current + '/' + total)
  }.bind(this))
}

FloatyController.prototype.updateState = function (state) {
  if (!this.window) {
    return
  }
  ui.run(function () {
    if (state === 'running') {
      this.window.startButton.setText('暂停')
      this.window.loopButton.setEnabled(false)
    } else if (state === 'paused') {
      this.window.startButton.setText('继续')
      this.window.loopButton.setEnabled(true)
    } else {
      this.window.startButton.setText('开始')
      this.window.loopButton.setEnabled(true)
    }
  }.bind(this))
}

FloatyController.prototype.close = function () {
  if (this.window) {
    this.window.close()
    this.window = null
  }
}

FloatyController.prototype.exitScript = function () {
  try {
    this.runner.stop()
    this.close()
  } finally {
    exit()
  }
}

function loggerSafe (logger, method, message) {
  if (logger && logger[method]) {
    logger[method](message)
  }
}

module.exports = FloatyController
