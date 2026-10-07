# 飞渡机场项目规则

- 项目名称：飞渡机场；正式域名：https://feidujc.com。
- 技术栈为 Astro、TypeScript、Tailwind CSS，使用 npm 与现有 `package-lock.json`；不要重新初始化或随意更换技术栈。
- 修改前先理解现有架构，不随意重构无关代码；优先复用现有组件，避免重复实现。
- 保持蓝白、简洁、现代、阅读优先的设计语言；移动端优先，并避免页面横向溢出。
- 机场数据必须读取统一数据源 `src/data/airports.ts`，不得创建重复数据源。
- 禁止编造价格、流量、线路、AI、流媒体、速度、延迟、节点数量、稳定性或评分等数据；未知值使用“待实测”“暂无数据”或“—”。
- 文章必须提供独立、有价值的正文，不得复制同一正文批量生成；Markdown/MDX 内容必须正常渲染。
- 每个页面只能有一个 H1；正式链接不得包含 localhost；避免关键词堆砌、隐藏 SEO 内容和低质量页面。
- 修改后运行与改动相关的现有验证；较大改动至少执行 production build。不得通过关闭 TypeScript、删除测试或删除功能掩盖错误。

## 命令

- 开发：`npm run dev`（或 `npm start`）
- 类型检查与生产构建：`npm run build`（依次执行 `astro check` 和 `astro build`）
- 本地预览：`npm run preview`
- Astro CLI：`npm run astro -- <command>`

当前项目未定义独立的 lint、typecheck 或 test script，不要凭空执行。
