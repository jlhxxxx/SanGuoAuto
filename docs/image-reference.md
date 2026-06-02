# 图片定位参考

本文记录《三国：冰河时代》当前模板图片在不同手机截图中的位置，用于维护 `lib/regions.js` 和排查图片识别失败问题。

坐标以旧手机截图 `1080x2400` 为基准；新手机截图宽度同为 `1080`，高度为 `2520`，文件名以 `-1` 结尾。脚本里的 `region` 仍按旧手机基准填写，运行时由 `lib/image.js` 换算。

## 区域规则

- 贴近底部、侧边的游戏 UI：使用 `{ left/right, bottom, width, height }`。
- 中间弹窗、地图中部目标：使用 `{ centerX, centerY, width, height }`。
- 背包物品列表这种高度会随内容和屏幕变化的区域：使用 `{ left, top, right, bottom }`。
- 模板图片按屏幕宽度等比缩放，不按高度拉伸。

## 当前模板位置

| 模板 | 参考截图 | 旧机位置 | 新机位置 | 当前 region | 备注 |
| --- | --- | --- | --- | --- | --- |
| `search_icon.png` | `home.jpg` / `home-1.png` | 左侧菜单，约 `x=40-120` | 左侧菜单整体下移 | `regions.searchIcon` | 底部锚定 |
| `package.png` | `home.jpg` / `home-1.png` | 底部行囊，约 `x=300-680` | 底部行囊整体下移 | `regions.packageButton` | 底部锚定 |
| `search_button.png` | `search_button.jpg` / `search_button-1.png` | 底部搜索按钮区域 | 底部搜索按钮整体下移 | `regions.searchButton` | 底部锚定 |
| `taofa_attack_button.png` | `attack_button.jpg` / `attack_button-1.png` | 中部偏上攻击按钮区域 | 随地图内容下移 | `regions.attackButton` | 底部锚定，讨伐复用 |
| `jijie_attack_button.png` | `attack_button.jpg` / `attack_button-1.png`, `huatuo.jpg` / `huatuo-1.png` | 中部偏上攻击按钮区域 | 随地图内容下移 | `regions.attackButton` | 集结、华佗复用 |
| `jijie_start_button.png` | `jijie_start_button.jpg` / `jijie_start_button-1.png` | 普通集结发起按钮 | 普通集结发起按钮整体下移 | `regions.normalJijieStartButton` | 同一模板在不同流程位置不同 |
| `jijie_start_button.png` | `huatuo_jijie_start_button.jpg` / `huatuo_jijie_start_button-1.png` | 华佗流程发起按钮 | 华佗流程发起按钮整体下移 | `regions.huatuoJijieStartButton` | 同图不同 region |
| `others.png` | `others.jpg` / `others-1.png` | 背包底部“其他”标签 | 标签整体贴底下移 | `regions.bagOtherTab` | 底部锚定 |
| `hulu.png` | `hulu.jpg` / `hulu-1.png` | 背包物品网格内，位置可变 | 背包物品网格内，位置可变 | `regions.bagItems` | 大范围列表区域 |
| `use.png` | `use.jpg` / `use-1.png` | 蓝色按钮约 `x=359-720, y=1397-1489` | 蓝色按钮约 `x=359-720, y=1459-1549` | `regions.useButton` | 中心锚定，旧机中心约 `y=1445` |
| `huatuo.png` | `huatuo.jpg` / `huatuo-1.png` | 地图中部华佗目标 | 地图目标随中心下移 | `regions.huatuoTarget` | 中心锚定 |
| `camp_1.png` | `4.jpg` / `4-1.png` | 出征页底部阵营 1 | 出征页底部整体下移 | `regions.campOne` | 底部锚定 |
| `march_button.png` | `4.jpg` / `4-1.png` | 出征按钮 | 出征按钮贴底下移 | `regions.marchButton` | 底部锚定 |
| `refill_all_button.png` | `refill_all_button.jpg` / `refill_all_button-1.png` | 底部弹窗“一键补齐所有” | 底部弹窗整体下移 | `regions.refillAllButton` | 底部锚定 |
| `not_show_today.png` | `not_show_today and confirm_button.jpg` / `not_show_today and confirm_button-1.png` | checkbox 约 `y=1973-2022`，距底 `378-427` | checkbox 约 `y=2092-2141`，距底 `379-428` | `regions.notShowToday` | 底部锚定 |
| `confirm_button.png` | `not_show_today and confirm_button.jpg` / `not_show_today and confirm_button-1.png` | 确定按钮约 `y=2096-2212`，距底 `188-304` | 确定按钮约 `y=2219-2332`，距底 `188-301` | `regions.confirmButton` | 底部锚定 |

## 更新约定

新增模板或截图后，先在这里记录：

1. 模板文件名。
2. 旧机截图里图标的大致 `x/y` 范围。
3. 新机 `-1` 截图里是否只是整体下移。
4. 采用的 region 常量。
5. 是否存在“同一模板、不同位置”的情况。
