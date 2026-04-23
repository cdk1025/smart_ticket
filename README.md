<div align="center">

# 🧾 Smart Ticket (智票合)

**AI-Powered Invoice & Receipt PDF Merger**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-Atomic-333?logo=unocss&logoColor=white)](https://unocss.dev/)
[![pdf-lib](https://img.shields.io/badge/pdf--lib-PDF_Engine-red)](https://pdf-lib.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Demo-Live-brightgreen?logo=github)](https://cdk1025.github.io/smart_ticket/)

[English](#english) | [中文](#中文)

</div>

---

## English

### Introduction

**Smart Ticket** is a free, privacy-first, browser-based tool for merging invoices, bills, and receipts into print-ready A4 PDFs.

No server. No upload. **100% local processing.** Your documents never leave your device.

### 🌐 Live Demo

👉 **[https://cdk1025.github.io/smart_ticket/](https://cdk1025.github.io/smart_ticket/)**

### ✨ Features

- 📂 **Upload PDF, JPG, PNG files** — drag & drop or click to browse
- 📐 **Smart layout** — invoices 2-per-page, receipts in 2×2 grid
- 🧩 **Mixed layout** — intelligently combines odd invoices with receipts on the same page
- ✂️ **Trim / cut lines** — printed guides between items for easy cutting
- 🔀 **Drag-and-drop reorder** — rearrange, rotate, or delete files freely
- 📄 **One-click merge** — generate a clean A4 PDF in seconds
- 👁️ **Browser preview** — review the result before downloading
- ⬇️ **Instant download** — save your merged PDF with one click
- 🔒 **Pure client-side** — zero server, zero upload, privacy safe

### 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| UI Framework | React 19 + TypeScript |
| Styling | UnoCSS (Atomic CSS) |
| PDF Engine | pdf-lib (merge) + pdfjs-dist (thumbnails) |
| State Management | Zustand |
| Drag & Drop | @dnd-kit |
| Build Tool | Vite 6 |
| File Download | FileSaver.js |

### 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/cdk1025/smart_ticket.git
cd smart_ticket

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 📦 Deployment

This project is configured for **GitHub Pages** deployment:

```bash
npm run deploy
```

### 🗺️ Roadmap

- [ ] 🤖 AI invoice classification & categorization
- [ ] 💰 AI amount extraction & expense ledger generation
- [ ] 📑 Multi-ticket smart layout per page
- [ ] 🧹 Invoice edge cleanup & clarity enhancement
- [ ] 🔍 Duplicate reimbursement detection

### 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 中文

### 简介

**智票合** — AI 一键合并，发票账单轻松打印。

免费、隐私优先的浏览器端工具，将发票、账单、收据合并为可打印的 A4 PDF。

无需服务器，无需上传，**100% 本地处理**。您的文件永远不会离开您的设备。

### 🌐 在线体验

👉 **[https://cdk1025.github.io/smart_ticket/](https://cdk1025.github.io/smart_ticket/)**

### ✨ 功能特性

- 📂 **支持 PDF、JPG、PNG 文件上传** — 拖拽或点击选择
- 📐 **智能排版** — 发票每页 2 张，小票 2×2 网格排列
- 🧩 **混合排版** — 智能组合单数发票与小票在同一页面
- ✂️ **裁切辅助线** — 打印时方便裁剪的分割线
- 🔀 **拖拽排序** — 自由调整顺序、旋转、删除文件
- 📄 **一键合并** — 秒级生成整洁的 A4 PDF
- 👁️ **浏览器预览** — 下载前预览合并结果
- ⬇️ **即时下载** — 一键保存合并后的 PDF
- 🔒 **纯客户端处理** — 零服务器、零上传，隐私安全

### 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| UI 框架 | React 19 + TypeScript |
| 样式方案 | UnoCSS（原子化 CSS） |
| PDF 引擎 | pdf-lib（合并）+ pdfjs-dist（缩略图） |
| 状态管理 | Zustand |
| 拖拽功能 | @dnd-kit |
| 构建工具 | Vite 6 |
| 文件下载 | FileSaver.js |

### 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/cdk1025/smart_ticket.git
cd smart_ticket

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:5173](http://localhost:5173)。

### 📦 部署

本项目已配置 **GitHub Pages** 部署：

```bash
npm run deploy
```

### 🗺️ 开发计划

- [ ] 🤖 AI 发票智能分类与归档
- [ ] 💰 AI 金额提取与报销台账生成
- [ ] 📑 单页多票智能排版
- [ ] 🧹 发票边缘清理与清晰度增强
- [ ] 🔍 重复报销检测

### 📄 开源协议

本项目基于 [MIT 协议](LICENSE) 开源。

---

<div align="center">

## ☕ Donate / 打赏支持

If this project helps you, consider buying me a coffee!

如果这个项目对你有帮助，欢迎打赏支持！

| Alipay 支付宝 | WeChat Pay 微信支付 |
|:---:|:---:|
| <img src="src/assets/ali_pay.jpg" width="200"> | <img src="src/assets/wx_pay.png" width="200"> |

</div>
