function format (level, message) {
  var text = '[' + level + '] ' + message
  return text
}

module.exports = {
  info: function (message) {
    console.log(format('INFO', message))
  },
  warn: function (message) {
    console.warn(format('WARN', message))
  },
  error: function (message) {
    console.error(format('ERROR', message))
  },
  debug: function (message) {
    console.verbose(format('DEBUG', message))
  }
}
