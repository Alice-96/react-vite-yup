# React Vite Yup Trial App

A React application with Vite for trying out Yup validation with Formik, organized using a **feature-based architecture**.

## ⚠️ 重要: パッケージマネージャーについて

このプロジェクトでは **pnpm** の使用が必須です。

```bash
# ✅ 正しい方法
pnpm install
pnpm dev
pnpm build

yarn install # エラーになります
```

## Features

- **Basic Validation**: Simple form validation with Yup and Formik
- **Nested Validation**: Complex nested object validation examples
- **Material-UI Integration**: Clean UI with Material-UI components

## Project Structure

This project follows a **feature-based architecture** for better maintainability and scalability:

```
src/
├── features/                 # Feature-based modules
│   ├── home/                # Home page feature
│   │   ├── HomePage.tsx
│   │   └── index.ts
│   ├── validation/          # Validation features
│   │   ├── basic/           # Basic validation examples
│   │   │   ├── BasicValidationPage.tsx
│   │   │   └── index.ts
│   │   ├── nested/          # Nested validation examples
│   │   │   ├── NestedValidationPage.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
├── shared/                   # Shared resources
│   ├── components/          # Reusable components
│   │   └── Page.tsx
│   ├── styles/              # Global styles
│   │   ├── App.css
│   │   └── index.css
│   └── index.ts
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── vite-env.d.ts           # Vite type definitions
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Architecture Benefits

- **Feature Isolation**: Each feature is self-contained with its own components and logic
- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Clear separation of concerns and organized code structure
- **Reusability**: Shared components and utilities in the `shared` directory

## Testing

### Visual Regression Testing (VRT)

このプロジェクトでは、Playwright + reg-suitを使用してVRTを実装しています。

```bash
# VRTテストを実行
pnpm test:vrt

# スクリーンショットを更新
pnpm test:vrt:update

# UIモードでデバッグ
pnpm test:vrt:ui

# HTMLレポートを表示
pnpm test:vrt:report
```

詳細は以下のドキュメントを参照してください：
- **[VRT_GUIDE.md](./VRT_GUIDE.md)** - VRTの使い方と開発ワークフロー
- **[VRT_S3_SETUP.md](./VRT_S3_SETUP.md)** - AWS S3統合のセットアップ手順
