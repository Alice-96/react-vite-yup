# Visual Regression Testing (VRT) with reg-suit

このプロジェクトでは、reg-suitとPlaywrightを使用してVisual Regression Testing（VRT）を実装しています。

## セットアップ

### 必要な依存関係

以下のパッケージがインストールされています：

- `@playwright/test`: E2Eテストフレームワーク
- `playwright`: ブラウザ自動化ライブラリ
- `reg-suit`: Visual Regression Testingツール
- `reg-cli`: reg-suitのCLIツール

### 設定ファイル

- `playwright.config.ts`: Playwrightの設定
- `regconfig.json`: reg-suitの設定
- `vrt/helpers/screenshot.ts`: スクリーンショット撮影用のヘルパー関数

## テストファイルの構成

```
vrt/
├── helpers/
│   └── screenshot.ts          # スクリーンショット撮影ヘルパー
├── home.spec.ts              # ホームページのVRTテスト
├── user-registration.spec.ts  # ユーザー登録ページのVRTテスト
├── location-registration.spec.ts # 拠点登録ページのVRTテスト
└── user-list.spec.ts         # ユーザー一覧ページのVRTテスト
```

## 使用方法

### 1. 初回スクリーンショットの生成

初回実行時は、基準となるスクリーンショットを生成します：

```bash
# アプリケーションをビルドしてスクリーンショットを生成
pnpm vrt:capture
```

このコマンドは以下の処理を実行します：
1. アプリケーションをビルド
2. プレビューサーバーを起動
3. Playwrightテストを実行してスクリーンショットを生成
4. サーバーを停止

### 2. VRTテストの実行

```bash
# VRTテストを実行
pnpm test:vrt

# UIモードでテストを実行（デバッグに便利）
pnpm test:vrt:ui

# スクリーンショットを更新（意図的な変更後）
pnpm test:vrt:update

# テストレポートを表示
pnpm test:vrt:report
```

### 3. reg-suitでの比較とレポート生成

```bash
# reg-suitを使用して差分を検出・レポート生成
pnpm vrt:reg
```

## テストの種類

### 1. ページ全体のスクリーンショット

各ページの全体的な外観をテストします：

- ホームページ
- ユーザー登録ページ
- 拠点登録ページ
- ユーザー一覧ページ

### 2. レスポンシブデザインのテスト

複数のビューポートサイズでスクリーンショットを撮影：

- モバイル (375x667)
- タブレット (768x1024)
- デスクトップ (1280x720)
- 大画面デスクトップ (1920x1080)

### 3. インタラクション状態のテスト

UIコンポーネントの各状態をテスト：

- ホバー状態
- フォーカス状態
- エラー状態
- ローディング状態

### 4. フォームのテスト

フォーム関連の特別なテスト：

- 初期状態
- フィールドフォーカス状態
- バリデーションエラー状態
- 入力済み状態

## ヘルパー関数

### `takeScreenshot(page, name, options)`

基本的なスクリーンショット撮影

```typescript
await takeScreenshot(page, 'page-name');
```

### `takeComponentScreenshot(page, selector, name, options)`

特定のコンポーネントのスクリーンショット

```typescript
await takeComponentScreenshot(page, '.my-component', 'component-name');
```

### `takeFormStateScreenshots(page, formSelector, testName)`

フォームの各状態を自動的にテスト

```typescript
await takeFormStateScreenshots(page, 'form', 'registration-form');
```

### `takeResponsiveScreenshots(page, name, viewportSizes)`

レスポンシブデザインのテスト

```typescript
await takeResponsiveScreenshots(page, 'page-name', ['mobile', 'tablet', 'desktop']);
```

## CI/CDでの使用

### GitHub Actions例

```yaml
name: Visual Regression Tests

on:
  pull_request:
    branches: [main]

jobs:
  vrt:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        
      - name: Build application
        run: pnpm build
        
      - name: Run VRT tests
        run: pnpm test:vrt
        
      - name: Run reg-suit
        run: pnpm vrt:reg
        
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: vrt-results
          path: |
            test-results/
            visual-regression/
```

## トラブルシューティング

### よくある問題

1. **スクリーンショットの差分が発生する**
   - フォントの違い（OS間）
   - アニメーションの無効化不足
   - 動的コンテンツ（時間、ランダムデータ）

2. **テストがタイムアウトする**
   - `playwright.config.ts`のタイムアウト設定を確認
   - ネットワークの状態を確認（`networkidle`の待機）

3. **ブラウザが起動しない**
   - Playwrightブラウザの再インストール: `npx playwright install`

### 設定の調整

`playwright.config.ts`で以下を調整できます：

- テストの並列実行数
- タイムアウト設定
- ブラウザの選択
- ビューポートサイズ

`regconfig.json`で以下を調整できます：

- 差分の閾値（threshold）
- 出力ディレクトリ
- プラグインの設定

## ベストプラクティス

1. **一貫した環境でテストを実行**
   - 同じOS、ブラウザバージョンを使用
   - フォントの統一

2. **アニメーションの無効化**
   - CSSアニメーションを無効化
   - ローディングの完了を確実に待機

3. **動的コンテンツの対策**
   - モックデータの使用
   - 固定の時刻・日付

4. **適切な粒度でテスト**
   - ページ全体とコンポーネント単位の両方
   - 重要なインタラクション状態の包括

5. **定期的なベースライン更新**
   - 意図的なデザイン変更後のスクリーンショット更新
   - レビュープロセスでの承認