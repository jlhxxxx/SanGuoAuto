# 添加任务与定位图标指南

这份指南用于给《三国：冰河时代》新增自己的 AutoJS 自动化任务。

## 任务开发流程

1. 明确任务起始界面和每一步点击目标。
2. 为每个需要识别的图标截取模板图。
3. 为每个模板选择查找区域。
4. 在 `tasks/` 中新增任务脚本。
5. 在 `tasks/index.js` 注册任务。
6. 在手机上运行，用红框确认查找区域是否正确。
7. 把模板位置记录到 `docs/image-reference.md`。

## 截取模板图

模板图放在 `resources/images/`。

建议：

- 只截取稳定部分，不要截太大。
- 尽量避开会变化的数字、背景、倒计时、数量文本。
- 按用途命名，例如 `daily_reward_button.png`。
- 通用按钮不要加任务前缀，例如 `search_button.png`。
- 任务专属图标加任务前缀，例如 `taofa_attack_button.png`。

如果红框已经覆盖目标但仍识别不到，优先重新截取模板图。

## 选择查找区域

区域写在 `lib/regions.js`，任务脚本中引用 `regions.xxx`。

坐标以 `1080x2400` 为基准。

### 底部锚定

适合贴近底部的 UI、底部弹窗、底部按钮、底部标签栏。

```js
myBottomButton: { left: 260, bottom: 120, width: 600, height: 260 }
```

运行时会从当前屏幕底部反推位置。不同高度手机上，这种方式通常最稳定。

### 中心锚定

适合屏幕中部弹窗、地图中部目标。

```js
myCenterTarget: { centerX: 540, centerY: 1300, width: 700, height: 500 }
```

运行时会按当前屏幕中心加偏移计算位置。

### 上下边界区域

适合背包列表、物品网格、位置可能换行的目标。

```js
bagItems: { left: 0, top: 180, right: 0, bottom: 360 }
```

这个区域会覆盖从顶部偏移到距离底部偏移之间的大范围。

### 数组区域

旧写法：

```js
[250, 700, 620, 360]
```

尽量少用，只建议用于真正固定在顶部或中部的页面。

## 编写任务脚本

在 `tasks/` 下新建一个 JS 文件，例如 `daily.js`：

```js
var taskUtils = require('../lib/taskUtils.js')
var regions = require('../lib/regions.js')

module.exports = {
  id: 'daily',
  name: '每日',
  run: function (ctx) {
    if (!taskUtils.findAndClick(ctx, {
      desc: '每日按钮',
      image: 'daily_button.png',
      region: regions.dailyButton,
      waitAfter: 1000
    })) {
      return 'failed'
    }

    if (!taskUtils.findAndClick(ctx, {
      desc: '领取按钮',
      image: 'reward_button.png',
      region: regions.rewardButton,
      threshold: 0.78,
      maxRetry: 6,
      waitAfter: 1000
    })) {
      return 'failed'
    }

    return 'success'
  }
}
```

如果任务最后也需要走“阵营 1 -> 出征 -> 体力不足补齐 -> 重新出征”的公共流程，可以调用：

```js
return taskUtils.marchWithRefill(ctx, 45000) ? 'success' : 'failed'
```

参数是出征后等待下一轮的时间，单位毫秒。

## 注册任务

在 `tasks/index.js` 中引入并加入列表：

```js
var daily = require('./daily.js')

var list = [
  taofa,
  jijie,
  huatuo,
  sunce,
  daily
]
```

重新运行 `main.js` 后，浮窗任务菜单里会出现新任务。

如果新任务和目标已有任务走同一套流程、只是目标图标不同，可以保留同一张通用模板，用一张新模板图配合已有的 region（现例：`huatuo.png` 与 `sunce.png` 共用 `regions.suipianTarget`，`tasks/huatuo.js` 与 `tasks/sunce.js` 共用 `regions.suipianJijieStartButton`）。

## findAndClick 常用参数

```js
taskUtils.findAndClick(ctx, {
  desc: '日志里显示的步骤名',
  image: 'template.png',
  region: regions.someRegion,
  threshold: 0.78,
  maxRetry: 6,
  intervalMs: 500,
  waitAfter: 1000,
  optional: false,
  clickOffsetX: 0,
  clickOffsetY: 0
})
```

- `desc`：步骤名称，用于日志和 toast。
- `image`：模板文件名。
- `region`：查找区域。
- `threshold`：匹配阈值，默认通常不用改；模板不稳定时可尝试 `0.72-0.78`。
- `maxRetry`：重试次数。
- `intervalMs`：重试间隔。
- `waitAfter`：点击后等待时间。
- `optional`：可选步骤，找不到时不报错。
- `clickOffsetX/Y`：匹配到模板后，在模板中心基础上偏移点击。

## 调试方法

1. 先开启 `config.debugRegionOverlay.enabled`。
2. 运行任务，看红框是否覆盖目标图标。
3. 如果红框偏了，调整 `lib/regions.js`。
4. 如果红框正确但仍找不到，重新截模板或降低 `threshold`。
5. 如果同一模板在不同流程里位置不同，保留同一张模板，使用两个不同 region。

## 更新定位参考

新增模板后，在 `docs/image-reference.md` 中记录：

- 模板文件名。
- 对应截图。
- 旧手机或基准手机里的大致位置。
- 新手机里的对照位置。
- 使用的 region 常量。
- 是否存在同图不同位置。
