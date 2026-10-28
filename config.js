var config = {
  appName: 'SanGuoAuto',
  defaultTaskId: 'taofa',
  defaultLoopCount: 10,
  loopIntervalMs: 1500,
  imageThreshold: 0.82,
  imageRetryIntervalMs: 500,
  clickRandomOffset: 4,
  randomWaitBeforeClickMinMs: 100,
  randomWaitBeforeClickMaxMs: 1000,
  scaleTemplates: true,
  baseWidth: 1080,
  baseHeight: 2400,
  debugRegionOverlay: {
    enabled: true,
    borderWidth: 2,
    durationMs: 350,
    color: '#FFFF0000'
  },
  floaty: {
    x: 20,
    y: 220,
    width: null,
    height: null
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config
} else {
  toastLog('config.js 是配置文件，请运行 main.js')
}
