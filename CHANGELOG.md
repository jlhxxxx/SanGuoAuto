# 更新日志

## 1.0.1

- 新增「孙策」任务：行囊 → 其他 → 虎符 → 使用 → 选择孙策目标 → 发起集结 → 阵营 1 / 出征 / 体力不足补齐。
- `lib/regions.js` 中的 `huatuoJijieStartButton`、`huatuoTarget` 改名为 `suipianJijieStartButton`、`suipianTarget`，由华佗和孙策共用；`tasks/huatuo.js` 已同步。
- 新增模板 `hufu.png`、`sunce.png`，并重新截取 `search_icon.png`、`taofa_attack_button.png`。
- 默认循环次数 `defaultLoopCount` 由 `200` 调整为 `10`。
- 讨伐、集结出征后的等待时间分别微调为 `40000ms`、`200000ms`。

## 1.0.0

- 首个版本：支持讨伐、集结、华佗三个任务。
- 浮窗控制开始 / 暂停 / 继续 / 停止 / 退出，支持设置循环次数。
- 图片识别查找红框调试，区域坐标以 `1080x2400` 为基准并按屏幕宽度适配。
