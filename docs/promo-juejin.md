# 从出差报销痛点到开源产品：我用 React + Vite 8 做了个纯前端发票合并工具

> 标签：React, TypeScript, PDF, 开源, Vite, 前端, pdf-lib, WASM

## 前言

每次出差回来，最让我崩溃的不是赶报告，而是**报销发票的打印**。

财务部要求所有电子发票统一打印在 A4 纸上，大小规范、排版整齐。可现实是：电子发票有 PDF 的、有图片的，大小不一、方向各异。手动一张张塞进 Word 调整？效率极低。WPS 的合并功能？会员专属。在线工具？要么收费，要么得上传文件到第三方服务器——公司的发票数据，谁敢随便传？

作为一个前端开发者，我决定自己动手。

## 灵感来源

最早我是在 OpenClaw 平台上做了个 Skill，底层是 Python 脚本来处理 PDF 合并。能用，但每次 AI 调用都消耗 token，成本不低。

后来看到 vibe coding 的理念越来越火——很多优秀的开源产品都是从一个小 idea 开始，用最小成本快速实现。我想：这个需求足够明确，用纯前端就能搞定，为什么不做成一个人人可用的在线工具？

于是，**智票合（Smart Ticket）** 诞生了。

**在线体验**：[https://cdk1025.github.io/smart_ticket/](https://cdk1025.github.io/smart_ticket/)

**GitHub**：[https://github.com/cdk1025/smart_ticket](https://github.com/cdk1025/smart_ticket)

## 产品功能演示

### 首页 — 拖拽上传

![首页截图](../src/assets/home.png)

支持拖拽或点击上传，兼容 PDF 和常见图片格式（JPG/PNG/WebP）。

### 编辑页 — 智能排版 + 图像增强

![编辑页截图](../src/assets/edit.png)

核心功能：
- **智能排版**：发票（PDF）默认 2 张/页上下排列，账单（图片）4 张/页 2×2 网格，混排时自动处理
- **图像增强**：对比度 / 亮度 / 锐化滑块实时调节，AI 边缘检测校正
- **拖拽排序**：自由调整文件顺序
- **旋转 / 删除**：一键操作单个文件

### 结果页 — 一键下载

![结果页截图](../src/assets/result.png)

合并完成后预览效果，满意即可一键下载标准 A4 PDF，直接打印。

## 技术架构

### 整体技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| UI 框架 | React 19 + TypeScript | 类型安全，组件化开发 |
| 构建工具 | Vite 8 | 极速 HMR，ESM 原生支持 |
| 样式方案 | UnoCSS | 原子化 CSS，按需生成，打包体积极小 |
| 状态管理 | Zustand | 轻量级，hooks 风格，无 boilerplate |
| 路由 | react-router (HashRouter) | 适配 GitHub Pages 的 hash 路由 |
| PDF 生成 | pdf-lib | 纯 JS 创建/修改 PDF，零服务端依赖 |
| PDF 渲染 | pdfjs-dist | Mozilla 官方库，CJK 字体完美支持 |
| 图像处理 | Canvas API | 浏览器原生，逐像素操作 |
| 边缘检测 | Scanic (WASM) | 高性能文档边缘检测与校正 |
| 拖拽排序 | @dnd-kit | 现代化拖拽库，无障碍支持好 |
| 部署 | GitHub Pages + gh-pages | 零成本静态托管 |

### 应用路由结构

```tsx
// App.tsx — 基于 HashRouter 的 SPA 路由
<HashRouter>
  <Header />
  <Routes>
    <Route path="/" element={<HomePage />} />        {/* 上传 */}
    <Route path="/editor" element={<EditorPage />} /> {/* 编辑 */}
    <Route path="/result" element={<ResultPage />} /> {/* 结果 */}
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/disclaimer" element={<DisclaimerPage />} />
  </Routes>
  <Footer />
</HashRouter>
```

为什么用 `HashRouter` 而不是 `BrowserRouter`？因为部署在 GitHub Pages 上，不支持服务端路由重写，hash 模式最省心。

## 核心技术实现

### 1. pdf-lib：纯前端生成 A4 PDF

整个合并逻辑的核心在 `pdfMerger.ts` 中。用 pdf-lib 创建 PDF 文档，定义 A4 尺寸和槽位布局：

```typescript
import { PDFDocument, rgb } from 'pdf-lib'

// A4 尺寸（单位：点）
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89
const MARGIN = 16
const GAP = 16

// 可用区域
const USABLE_WIDTH = A4_WIDTH - MARGIN * 2   // 563.28
const USABLE_HEIGHT = A4_HEIGHT - MARGIN * 2 // 809.89

// 上下两格（发票 2/页）
const SLOT_HALF_HEIGHT = (USABLE_HEIGHT - GAP) / 2
// 左右两格（账单 4/页时使用）
const SLOT_HALF_WIDTH = (USABLE_WIDTH - GAP) / 2
```

智能排版的分流逻辑：

```typescript
export async function mergeFiles(files: UploadedFile[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()

  // 分类：PDF 类型为发票，图片类型为账单
  const invoices = files.filter((f) => f.type === 'pdf')
  const bills = files.filter((f) => f.type === 'image')

  // 1. 发票两两配对，每页上下各一张
  // 2. 如果有落单的发票，放在页面上半部分，下半部分塞账单
  // 3. 剩余账单按 2×2 网格排列
  // ...
  return pdfDoc.save()
}
```

图片在槽位内等比缩放并居中绘制：

```typescript
function drawImageInSlot(page: PDFPage, image: PDFImage, slot: Slot): void {
  const imgRatio = image.width / image.height
  const slotRatio = slot.width / slot.height

  let drawWidth: number, drawHeight: number
  if (imgRatio > slotRatio) {
    drawWidth = slot.width
    drawHeight = slot.width / imgRatio
  } else {
    drawHeight = slot.height
    drawWidth = slot.height * imgRatio
  }

  const x = slot.x + (slot.width - drawWidth) / 2
  const y = slot.y + (slot.height - drawHeight) / 2
  page.drawImage(image, { x, y, width: drawWidth, height: drawHeight })
}
```

### 2. pdfjs-dist：PDF 渲染与 CJK 字体

用户上传的 PDF 发票很多包含中文，直接用 pdf-lib 操作可能丢失字体。解决方案是用 pdfjs-dist 先将 PDF 渲染为图片，再嵌入新 PDF：

```typescript
import * as pdfjsLib from 'pdfjs-dist'

// 关键：配置 CMap 和标准字体 CDN，确保中日韩字符正确渲染
const PDFJS_CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/cmaps/'
const PDFJS_STANDARD_FONT_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/standard_fonts/'

async function pdfToImage(file: File): Promise<Uint8Array> {
  const pdf = await pdfjsLib.getDocument({
    data: await file.arrayBuffer(),
    cMapUrl: PDFJS_CMAP_URL,
    cMapPacked: true,
    standardFontDataUrl: PDFJS_STANDARD_FONT_URL,
  }).promise

  const page = await pdf.getPage(1)
  // 2x 分辨率渲染，保证打印清晰度
  const scale = (USABLE_WIDTH * 2) / page.getViewport({ scale: 1 }).width
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport }).promise

  // 导出为 PNG
  return canvasToPngBytes(canvas)
}
```

### 3. Canvas API 图像增强

图像增强模块在 `imageEnhancer.ts` 中实现，核心是逐像素的对比度/亮度调节 + Unsharp Mask 锐化：

```typescript
export function enhanceImage(canvas: HTMLCanvasElement, options: EnhanceOptions) {
  const srcData = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)

  // Step 1: 对比度 + 亮度
  // contrast: 以 128 为中心缩放，brightness: 全局乘数
  const adjusted = new Uint8ClampedArray(srcData.data.length)
  for (let i = 0; i < srcData.data.length; i += 4) {
    adjusted[i] = (128 * (1 - options.contrast) + options.contrast * srcData.data[i]) * options.brightness
    adjusted[i + 1] = /* G channel ... */
    adjusted[i + 2] = /* B channel ... */
    adjusted[i + 3] = srcData.data[i + 3] // alpha 不变
  }

  // Step 2: Unsharp Mask 锐化（3×3 卷积核）
  // 核心公式: result = original * (1 - strength) + sharpened * strength
  // ...
}
```

### 4. Scanic WASM 边缘检测

引入 Scanic（基于 WASM 的文档扫描库），用于自动检测发票/账单的边缘并校正透视变形，让手机拍的歪歪扭扭的发票照片也能整整齐齐。WASM 运行在浏览器端，性能远超纯 JS 实现。

### 5. @dnd-kit 拖拽排序

使用 `@dnd-kit` 实现文件列表的拖拽排序，用户可以直观地调整合并顺序。相比 react-beautiful-dnd，@dnd-kit 更现代、更轻量、无障碍支持更好。

### 6. Zustand 状态管理

全局状态用 Zustand 管理，一个 store 搞定所有状态：

```typescript
import { create } from 'zustand'

interface FileStore {
  files: UploadedFile[]
  mergedPdfUrl: string | null
  isMerging: boolean
  enhanceOptions: EnhanceOptions
  // actions...
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  mergedPdfUrl: null,
  isMerging: false,
  enhanceOptions: { contrast: 1.0, brightness: 1.0, sharpen: 0 },

  addFiles: (newFiles) => set((s) => ({ files: [...s.files, ...newFiles] })),
  removeFile: (id) => { /* 释放 ObjectURL + 过滤 */ },
  rotateFile: (id) => { /* rotation = (rotation + 90) % 360 */ },
  reset: () => { /* 释放所有 ObjectURL，重置状态 */ },
}))
```

注意 `reset` 和 `removeFile` 中都做了 `URL.revokeObjectURL()` 的清理，避免内存泄漏。

## 部署方案：GitHub Pages 零成本

```json
// package.json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "deploy": "gh-pages -d dist"
  }
}
```

```typescript
// vite.config.ts
export default defineConfig({
  base: '/smart_ticket/', // GitHub Pages 子路径
})
```

一行命令 `npm run deploy`，自动构建并推送到 `gh-pages` 分支。零服务器、零运维、零费用。

## 核心卖点总结

- **完全免费**，无广告，无会员
- **隐私安全**：纯浏览器本地处理，文件不上传任何服务器
- **智能排版**：发票 2/页、账单 4/页、智能混排
- **图像增强**：对比度/亮度/锐化 + AI 边缘检测校正
- **操作友好**：拖拽排序、旋转、删除，所见即所得
- **一键输出**：合并生成标准 A4 PDF，下载即可打印
- **完全开源**：MIT 协议，欢迎贡献

## 未来规划

- 批量模板（自定义每页行列数）
- OCR 识别发票金额并自动汇总
- PWA 离线支持
- i18n 国际化
- 更多图像增强算法

## 写在最后

这个项目从一个出差报销的小痛点出发，经历了 OpenClaw Skill → vibe coding 独立产品的演变。技术选型上坚持**纯前端、零服务器**的原则，用 pdf-lib + pdfjs-dist + Canvas API + WASM 在浏览器端实现了完整的文档处理流水线。

如果你也有类似的报销烦恼，欢迎试用：

🌐 **在线体验**：[https://cdk1025.github.io/smart_ticket/](https://cdk1025.github.io/smart_ticket/)

📦 **GitHub**：[https://github.com/cdk1025/smart_ticket](https://github.com/cdk1025/smart_ticket)

觉得有用的话，给个 ⭐ Star 支持一下！有任何问题或建议，欢迎提 Issue 或 PR～
