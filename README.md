<p align="center">
  <img src="public/logo.svg" alt="Smart Ticket Logo" width="400">
</p>

<div align="center">

# 🧾 Smart Ticket

**AI-Powered Invoice & Receipt PDF Merger**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-Atomic-333?logo=unocss&logoColor=white)](https://unocss.dev/)
[![pdf-lib](https://img.shields.io/badge/pdf--lib-PDF_Engine-red)](https://pdf-lib.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Demo-Live-brightgreen?logo=github)](https://cdk1025.github.io/smart_ticket/)

English | [中文](README.zh-CN.md)

</div>

---

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
| Build Tool | Vite 8 |
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

<div align="center">

## ☕ Donate

If this project helps you, consider buying me a coffee!

| Alipay | WeChat Pay |
|:---:|:---:|
| <img src="src/assets/ali_pay.jpg" width="200"> | <img src="src/assets/wx_pay.png" width="200"> |

</div>
