---
title: "Clash 全平台使用教程：从零开始配置订阅与规则"
slug: "clash-guide"
description: "一步步教你如何在客户端中正确配置 Clash 订阅链接、设置自动更新与分流规则。"
date: 2026-03-22
updated: 2026-10-03
category: "guides"
tags: ["Clash", "订阅教程", "新手入门"]
author: "飞渡机场"
draft: false
---

Clash 是目前最受欢迎的规则分流代理客户端之一。本文将详细讲解如何获取订阅链接并完成初始配置。

## 一、什么是 Clash 订阅链接？

订阅链接是机场提供的一串专属 URL，其中包含了你账户的节点节点信息、密钥以及规则配置。

### 核心优势
1. **自动更新**：节点变动时无需手动修改配置文件。
2. **智能分流**：国内流量直连，国外流量走代理，省流且不影响本地网络速度。

## 二、配置步骤详解

### 步骤 1：复制机场订阅链接
登录你的机场后台，在仪表盘页面找到“一键导入”或“复制 Clash 订阅链接”按钮。

### 步骤 2：导入客户端
打开 Clash 客户端（如 Clash Verge 或 Clash for Windows）：
1. 点击左侧导航栏的 **Profiles (配置)**
2. 在顶部输入框粘贴刚才复制的订阅链接
3. 点击 **Download (下载)** 按钮

```text
https://subscription-provider.invalid/api/v1/client/subscribe?token=your_unique_token
```

### 步骤 3：选择节点与开启系统代理
1. 在 **Proxies (代理)** 界面中，选择规则模式（Rule）。
2. 在节点列表中测试延迟并挑选合适的节点。
3. 勾选 **System Proxy (系统代理)** 开关，开启网络加速。

## 三、常见问题排查

- **提示 Download Profile Failed**：检查网络是否能正常连接机场域名，或尝试开启 Allow LAN / 更换 DNS。
- **网页无法打开**：确认系统代理开关已打开，且选中的节点连通性正常。
