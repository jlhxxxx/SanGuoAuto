var taofa = require('./taofa.js')
var jijie = require('./jijie.js')
var huatuo = require('./huatuo.js')
var sunce = require('./sunce.js')

var list = [
  taofa,
  jijie,
  huatuo,
  sunce
]

module.exports = {
  list: list,
  getById: function (id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        return list[i]
      }
    }
    return null
  }
}
