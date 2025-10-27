# Visual Regression Testing (VRT) ガイド

このプロジェクトでは、Playwright + reg-suitを使用してVisual Regression Testing（ビジュアルリグレッションテスト）を実装しています。

## 📋 目次

- [概要](#概要)
- [セットアップ](#セットアップ)
- [クイックスタート](#クイックスタート)
- [使用方法](#使用方法)
- [テストの種類](#テストの種類)
- [開発ワークフロー](#開発ワークフロー)
- [CI/CDでの活用](#cicdでの活用)
- [AWS S3統合](#aws-s3統合)
- [トラブルシューティング](#トラブルシューティング)
- [ベストプラクティス](#ベストプラクティス)

## 概要

### VRTとは？

Visual Regression Testing（VRT）は、UIの見た目の変化を自動的に検出するテスト手法です。コードの変更がUIに意図しない影響を与えていないかを確認できます。

### 使用技術

- **Playwright**: E2Eテストフレームワーク（スクリーンショット撮影）
- **reg-suit**: ビジュアルリグレッション検出ツール（差分比較・レポート生成）
- **GitHub Actions**: CI/CDでの自動実行

## セットアップ

### 必要な依存関係

以下のパッケージがインストール済みです：

```json
{
  "@playwright/test": "^1.56.1",
  "playwright": "^1.56.1",
  "reg-suit": "^0.14.5",
  "reg-cli": "^0.18.10",
  "reg-keygen-git-hash-plugin": "^0.14.5",
  "reg-publish-gcs-plugin": "^0.14.4",
  "reg-notify-github-plugin": "^0.14.5",
  "storycap": "^5.0.1",
  "puppeteer": "^24.25.0"
}
```

### 設定ファイル

| ファイル | 説明 |
|---------|------|
| `playwright.config.ts` | Playwrightの設定（ブラウザ、ビューポート、タイムアウトなど） |
| `regconfig.json` | reg-suitの設定（閾値、保存場所、プラグインなど） |
| `vrt/helpers/screenshot.ts` | スクリーンショット撮影用のヘルパー関数 |
| `.github/workflows/vrt.yml` | GitHub ActionsでのVRT実行ワークフロー |

## クイックスタート

### 1. 初回セットアップ（基準スクリーンショット生成）

```bash
# アプリケーションをビルドしてベースラインスクリーンショットを生成
pnpm test:vrt:update
```

### 2. VRTテストの実行

```bash
# VRTテストを実行して差分をチェック
pnpm test:vrt
```

### 3. UIモードでテストをデバッグ

```bash
# ブラウザでテストの実行状況を確認
pnpm test:vrt:ui
```

### 4. テストレポートの表示

```bash
# HTMLレポートを表示
pnpm test:vrt:report
```

## 使用方法

### 基本コマンド

| コマンド | 説明 |
|----------|------|
| `pnpm test:vrt` | VRTテストを実行（Playwright） |
| `pnpm test:vrt:update` | スクリーンショットを更新（意図的な変更後） |
| `pnpm test:vrt:ui` | UIモードでテスト実行（デバッグに便利） |
| `pnpm test:vrt:report` | HTMLレポートを表示（Playwright） |
| `pnpm vrt:prepare` | Playwrightのスナップショットをreg-suit用に準備 |
| `pnpm vrt:reg` | reg-suitで差分検出・レポート生成・PRコメント投稿 |
| `npx reg-suit run` | reg-suitを直接実行（vrt:prepareの後に実行） |
| `pnpm vrt:capture` | ビルド→スクリーンショット生成の一連の流れを実行 |

### テストファイルの構成

```
vrt/
├── helpers/
│   └── screenshot.ts              # スクリーンショット撮影ヘルパー
├── home.spec.ts                   # ホームページのVRTテスト
├── user-registration.spec.ts      # ユーザー登録ページのVRTテスト
├── location-registration.spec.ts  # 拠点登録ページのVRTテスト
└── user-list.spec.ts              # ユーザー一覧ページのVRTテスト
```

## テストの種類

### 1. ページ全体のスクリーンショット

各ページの全体的な外観をテストします。

```typescript
test('should render home page correctly', async ({ page }) => {
  await page.goto('/');
  await takeScreenshot(page, 'home-page');
});
```

### 2. レスポンシブデザインのテスト

複数のビューポートサイズでスクリーンショットを撮影します。

```typescript
test('should render home page responsively', async ({ page }) => {
  await takeResponsiveScreenshots(page, 'home-page', ['mobile', 'tablet', 'desktop']);
});
```

**対応ビューポート:**
- **モバイル**: 375x667 (iPhone SE)
- **タブレット**: 768x1024 (iPad)
- **デスクトップ**: 1280x720
- **大画面**: 1920x1080

### 3. インタラクション状態のテスト

UIコンポーネントの各状態をテストします。

```typescript
test('should handle hover states correctly', async ({ page }) => {
  const button = page.locator('button').first();
  await button.hover();
  await takeScreenshot(page, 'home-page-hover');
});
```

**テスト対象:**
- ホバー状態
- フォーカス状態
- エラー状態
- ローディング状態

### 4. フォームのテスト

フォーム関連の特別なテストを実施します。

```typescript
test('should display form states correctly', async ({ page }) => {
  await takeFormStateScreenshots(page, 'form', 'registration-form');
});
```

**テスト状態:**
- 初期状態
- フィールドフォーカス状態
- バリデーションエラー状態
- 入力済み状態

### 5. マルチブラウザテスト

Chromium、Firefox、WebKitでテストを実行します。

**設定済みブラウザ:**
- Chrome (Chromium) - Desktop & Mobile
- Firefox
- Safari (WebKit)
- iPad Pro

## 開発ワークフロー

### 新機能開発時

1. **開発前**: 現在のUIをベースラインとして保存

```bash
pnpm test:vrt:update
git add vrt/
git commit -m "Update VRT baselines before feature development"
```

2. **開発中**: 定期的にVRTテストを実行

```bash
pnpm test:vrt
```

3. **完了時**: 意図的な変更のベースライン更新

```bash
pnpm test:vrt:update
git add vrt/
git commit -m "Update VRT baselines after UI changes"
```

### Pull Request時

1. **PR作成前**にVRTテストを実行

```bash
pnpm test:vrt
```

2. **CI**で自動的にVRTテストが実行される

3. **差分がある場合**はレビュワーと確認
   - PRコメントに差分レポートが自動投稿される
   - アーティファクトから差分画像をダウンロード可能

### 特定のテストファイルのみ実行

```bash
# 特定のテストファイルを実行
npx playwright test home.spec.ts

# 特定のテストファイルのスナップショットを更新
npx playwright test home.spec.ts --update-snapshots
```

### ローカルでreg-suitを実行

ローカル環境でreg-suitを実行して、S3上のレポートを確認できます：

```bash
# 1. VRTテストを実行（スナップショットを生成）
pnpm test:vrt

# 2. 環境変数を設定（.env.localまたはexport）
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_REGION=ap-northeast-1
export S3_BUCKET_NAME=your-bucket-name

# 3. reg-suitを実行
pnpm vrt:reg

# または直接実行
pnpm vrt:prepare  # スナップショットを準備
npx reg-suit run  # reg-suitを実行
```

**注意**: ローカルで実行すると、実際にS3にアップロードされます。テスト用のS3バケットを使用することを推奨します。

## CI/CDでの活用

### GitHub Actions

`.github/workflows/vrt.yml`でPR時に自動実行されます。

**ワークフローの流れ:**

1. コードのチェックアウト
2. 依存関係のインストール
3. Playwrightブラウザのインストール
4. アプリケーションのビルド
5. VRTテストの実行
6. reg-suitでの差分検出
7. 結果のPRコメント投稿
8. テスト結果のアーティファクトアップロード

**自動生成されるPRコメント:**

reg-suit botにより、以下の情報を含む詳細なコメントが自動投稿されます：

- ✅ テスト結果のサマリー統計
- 📊 差分があった場合の画像をインライン表示
- 🎨 インタラクティブなスライダーで差分を比較
- 🔗 S3上の詳細レポートへのリンク
- 📈 コミットステータスチェック

詳細は **[VRT_REG_SUIT_BOT.md](./VRT_REG_SUIT_BOT.md)** を参照してください。

## AWS S3統合

VRTレポートをAWS S3に保存して、PRコメントから直接アクセスできます。

### メリット

- 🌐 **インタラクティブなレポート**: ブラウザで差分を視覚的に比較
- 📊 **履歴管理**: 過去のVRT結果をS3に保存
- 🔗 **簡単な共有**: URLでチームメンバーと共有
- 💾 **ストレージの節約**: Gitリポジトリにスクリーンショットを含めない

### セットアップ

詳細なセットアップ手順は **[VRT_S3_SETUP.md](./VRT_S3_SETUP.md)** を参照してください。

**概要:**
1. AWS S3バケットの作成
2. IAMユーザーの作成とポリシー設定
3. GitHub Secretsの設定
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `S3_BUCKET_NAME`
4. 動作確認

### 使用方法

S3が設定されると、PR作成時に自動的に：
1. reg-suitがスクリーンショットと差分レポートをS3にアップロード
2. S3上のレポートURLがPRコメントに投稿される
3. レビュワーがブラウザで差分を確認できる

## トラブルシューティング

### よくある問題

#### 1. スクリーンショットの差分が発生する

**原因:**
- フォントの違い（OS間）
- アニメーションの無効化不足
- 動的コンテンツ（時間、ランダムデータ）
- ブラウザバージョンの違い

**対処法:**

```bash
# 差分を確認
pnpm test:vrt:ui

# 意図的な変更の場合はベースラインを更新
pnpm test:vrt:update

# 特定のテストファイルのみ更新
npx playwright test home.spec.ts --update-snapshots
```

#### 2. テストがタイムアウトする

**対処法:**
- `playwright.config.ts`のタイムアウト設定を確認
- ネットワークの状態を確認（`networkidle`の待機）

```typescript
// テスト内で待機時間を調整
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500);
```

#### 3. ブラウザが起動しない

**対処法:**

```bash
# Playwrightブラウザの再インストール
npx playwright install --with-deps
```

#### 4. CIとローカルで差分が出る

**原因:**
- フォントの違い
- OS固有のレンダリング差異

**対処法:**
- CI環境でベースラインを生成し直す
- `playwright.config.ts`で閾値を調整

```typescript
expect: {
  toHaveScreenshot: {
    threshold: 0.2,  // 閾値を調整
    maxDiffPixels: 100,
  },
}
```

### デバッグ方法

#### UIモードを使用

```bash
pnpm test:vrt:ui
```

- ブラウザでテストを実行
- ステップバイステップでデバッグ
- スクリーンショットをリアルタイムで確認

#### トレース機能

失敗したテストのトレースを確認:

```bash
# トレースビューアーを開く
npx playwright show-trace test-results/.../trace.zip
```

#### より確実な待機

```typescript
// 特定の要素の表示待ち
await page.waitForSelector('[data-testid="component"]');

// ネットワークが安定するまで待機
await page.waitForLoadState('networkidle');

// 明示的な待機（最終手段）
await page.waitForTimeout(500);
```

## ベストプラクティス

### 1. 一貫した環境でテストを実行

- 同じOS、ブラウザバージョンを使用
- CI環境でベースラインを生成
- フォントの統一

### 2. アニメーションの無効化

```typescript
// ヘルパー関数で自動的に無効化
await takeScreenshot(page, 'page-name');

// または手動で無効化
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `
});
```

### 3. 動的コンテンツの対策

- モックデータの使用
- 固定の時刻・日付
- ランダム要素の除外

```typescript
// MSWでモックデータを使用
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify(mockUsers)
  });
});
```

### 4. 適切な粒度でテスト

- ページ全体とコンポーネント単位の両方
- 重要なインタラクション状態の包括
- 過度に細かいテストは避ける

### 5. 定期的なベースライン更新

- 意図的なデザイン変更後のスクリーンショット更新
- レビュープロセスでの承認
- バージョン管理システムでの追跡

### 6. テストの安定性向上

```typescript
// ページが完全に読み込まれるまで待機
await page.waitForLoadState('networkidle');

// 短時間待機してスタイルが適用されるのを確保
await page.waitForTimeout(100);

// 特定の要素が表示されるまで待機
await page.waitForSelector('[data-testid="component"]', {
  state: 'visible',
  timeout: 10000
});
```

## テスト対象ページ

| ページ | URL | テストファイル | テスト内容 |
|--------|-----|----------------|-----------|
| ホーム | `/` | `home.spec.ts` | 基本表示、レスポンシブ、ホバー/フォーカス |
| ユーザー登録 | `/user-registration` | `user-registration.spec.ts` | フォーム各状態、バリデーション、入力済み状態 |
| 拠点登録 | `/location-registration` | `location-registration.spec.ts` | フォーム、セレクト、条件付きフィールド |
| ユーザー一覧 | `/user-list` | `user-list.spec.ts` | ローディング、データ表示、テーブルインタラクション |

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

## カスタマイズ

### 新しいページのテスト追加

1. `vrt/` フォルダに `new-page.spec.ts` を作成

```typescript
import { test } from '@playwright/test';
import { takeScreenshot } from './helpers/screenshot';

test.describe('NewPage Visual Tests', () => {
  test('should render new page correctly', async ({ page }) => {
    await page.goto('/new-page');
    await takeScreenshot(page, 'new-page');
  });
});
```

2. 初回実行でベースラインを生成

```bash
pnpm test:vrt:update
```

### テスト設定のカスタマイズ

**`playwright.config.ts`:**
- ブラウザの選択
- ビューポートサイズ
- タイムアウト設定
- 並列実行数

**`regconfig.json`:**
- 差分の閾値（threshold）
- 出力ディレクトリ
- プラグインの設定

**`vrt/helpers/screenshot.ts`:**
- 共通機能の追加
- カスタムヘルパー関数

## 参考資料

- [Playwright Documentation](https://playwright.dev/)
- [reg-suit Documentation](https://reg-viz.github.io/reg-suit/)
- [Visual Testing Best Practices](https://playwright.dev/docs/test-snapshots)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## まとめ

VRTは、UIの品質を保つための強力なツールです。このガイドに従って、効果的なビジュアルリグレッションテストを実装し、UI変更の影響を早期に検出しましょう。

質問や問題がある場合は、プロジェクトのIssueトラッカーで報告してください。
