# Money Tracker

一个基于 Next.js 的个人记账应用，用于记录收入、支出、类别、日期和备注，并通过统计卡片与圆环图展示收支概览。

## 功能特性

- 添加收入和支出记录
- 查看总收入、总支出和当前余额
- 按类别展示支出比例和收入比例
- 删除已有记录
- 支持浅色/深色模式切换
- 使用 SQLite 本地数据库保存数据

## 技术栈

- [Next.js](https://nextjs.org/) 15
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) + SQLite
- [Chart.js](https://www.chartjs.org/) / `react-chartjs-2`
- [Framer Motion](https://www.framer.com/motion/)

## 本地运行

安装依赖：

```bash
npm install
```

创建环境变量文件：

```bash
cp .env.example .env
```

默认数据库配置：

```env
DATABASE_URL="file:./dev.db"
```

同步数据库结构：

```bash
npm run db:push
```

启动开发服务器：

```bash
npm run dev
```

打开浏览器访问：

```text
http://localhost:3000
```

## 常用脚本

```bash
npm run dev       # 生成 Prisma Client 并启动开发服务器
npm run build     # 生成 Prisma Client 并构建生产版本
npm run start     # 启动生产构建
npm run lint      # 运行 Next.js lint
npm run db:push   # 将 Prisma schema 同步到数据库
npm run db:studio # 打开 Prisma Studio
```

## 项目结构

```text
app/                    # Next.js App Router 页面、样式和 API
app/components/         # React 组件
app/api/records/        # 记账记录 API
lib/prisma.ts           # Prisma Client 单例
prisma/schema.prisma    # 数据库模型
```

## 数据模型

`Record` 表包含金额、类型、类别、备注、日期，以及创建/更新时间。`type` 字段使用字符串区分 `income` 和 `expense`。

## 开发说明

- `.env` 用于本地配置，不应提交真实敏感信息。
- 修改 `prisma/schema.prisma` 后，请运行 `npm run db:push`。
- 提交前建议运行 `npm run lint` 或 `npm run build` 检查项目状态。
