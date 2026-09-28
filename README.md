# 探访法罗 · 中文旅游体验站

非官方中文演示站，结构与功能参考 [Visit Faroe Islands](https://visitfaroeislands.com/en)，视觉偏向北欧自然风光。

## 本地预览

用浏览器直接打开 `index.html`，或在本目录启动静态服务：

```bash
npx --yes serve .
```

## 页面

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页 Hero、灵感、体验、抵达、活动 |
| `see-do.html` | 观光体验（徒步 / 海上 / 景点 / 美食） |
| `plan.html` | 行程规划（抵达、住宿、交通、安全、72h） |
| `whats-on.html` | 活动日程（分类筛选） |
| `about.html` | 关于法罗（自然、人文、速览） |

## 功能

- 全站搜索
- 收藏（本地 `localStorage`）
- 响应式导航与抽屉菜单
- 滚动显现与 Hero 轻微动效
