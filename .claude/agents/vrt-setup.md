# Visual Regression Testing (VRT) セットアップガイド

## 目次
1. [概要](#概要)
2. [前提条件](#前提条件)
3. [依存関係のインストール](#依存関係のインストール)
4. [設定ファイルの構成](#設定ファイルの構成)
5. [VRTテストの作成](#vrtテストの作成)
6. [スクリーンショットの撮影](#スクリーンショットの撮影)
7. [リグレッションテストの実行](#リグレッションテストの実行)
8. [CI/CD統合](#cicd統合)
9. [ベストプラクティス](#ベストプラクティス)
10. [トラブルシューティング](#トラブルシューティング)

---

## 概要

### Visual Regression Testing (VRT) とは？

Visual Regression Testing（ビジュアルリグレッションテスト）は、UIの視覚的な変更を自動的に検出するテスト手法です。スクリーンショットを基準画像と比較することで、意図しないUIの変更やレイアウトの崩れを早期に発見できます。

### なぜVRTが有用なのか？

- **視覚的なバグの早期発見**: コードの変更がUIに与える影響を即座に確認
- **デザインの一貫性**: 複数のページやコンポーネント間でデザインの一貫性を維持
- **リファクタリングの安全性**: CSSやコンポーネントのリファクタリング時の安全性を向上
- **レスポンシブデザインの検証**: 異なるビューポートサイズでの表示を自動検証
- **プルリクエストのレビュー効率化**: 視覚的な変更を画像で確認し、レビューを効率化

### このプロジェクトで使用するツール

- **Playwright**: 最新のE2Eテストフレームワーク。高速で信頼性の高いスクリーンショット機能を提供
- **reg-suit**: スクリーンショットの差分検出とレポート生成ツール
- **GitHub Actions**: CI/CD環境でVRTを自動実行

---

## 前提条件

### 必要な環境

- **Node.js**: 18.0.0以上
- **pnpm**: 9.0.0以上（このプロジェクトの推奨パッケージマネージャー）
- **Git**: バージョン管理とCIワークフローに必要

### 推奨知識

- React/TypeScriptの基本知識
- Playwrightの基本的な使い方
- GitHub Actionsの基本概念

---

## 依存関係のインストール

### 1. Playwrightのインストール

Playwrightは既にプロジェクトに含まれていますが、新規プロジェクトで追加する場合は以下のコマンドを実行します：

```bash
# PlaywrightをdevDependenciesとしてインストール
pnpm add -D @playwright/test

# Playwrightブラウザをインストール
npx playwright install chromium
```

システム依存関係も含めてインストールする場合：

```bash
npx playwright install --with-deps chromium
```

### 2. reg-suitとプラグインのインストール

このプロジェクトでは以下のreg-suit関連パッケージを使用しています：

```bash
# reg-suit本体とプラグインをインストール
pnpm add -D reg-suit reg-cli
pnpm add -D reg-keygen-git-hash-plugin
pnpm add -D reg-publish-s3-plugin
pnpm add -D reg-notify-github-plugin
```

#### プラグインの説明

- **reg-keygen-git-hash-plugin**: Gitのブランチ情報を使用してスクリーンショットのキーを生成
- **reg-publish-s3-plugin**: スクリーンショットをAWS S3にアップロード（オプション）
- **reg-notify-github-plugin**: GitHub PRにVRT結果をコメントとして投稿

### 3. package.jsonのスクリプト設定

以下のスクリプトが`package.json`に設定されています：

```json
{
  "scripts": {
    "test:vrt": "playwright test",
    "test:vrt:ui": "playwright test --ui",
    "test:vrt:update": "playwright test --update-snapshots",
    "test:vrt:report": "playwright show-report",
    "vrt:reg": "reg-cli --config regconfig.json",
    "vrt:capture": "pnpm build && pnpm preview & sleep 5 && pnpm test:vrt:update && kill %1",
    "vrt:compare": "reg-cli visual-regression/actual visual-regression/expected visual-regression/diff --json visual-regression/report.json --report visual-regression/report.html",
    "vrt:serve": "cd visual-regression && python3 -m http.server 8080"
  }
}
```

#### スクリプトの説明

- `test:vrt`: VRTテストを実行
- `test:vrt:ui`: Playwright UIモードでテストを実行（デバッグに便利）
- `test:vrt:update`: スクリーンショットのベースラインを更新
- `test:vrt:report`: テスト結果のHTMLレポートを表示
- `vrt:reg`: reg-suitを使用して差分レポートを生成
- `vrt:capture`: アプリをビルドし、スクリーンショットを撮影
- `vrt:compare`: 手動で画像を比較してレポートを生成
- `vrt:serve`: ローカルでVRTレポートを提供

---

## 設定ファイルの構成

### 1. Playwright設定 (playwright.config.ts)

プロジェクトのルートに`playwright.config.ts`を作成します：

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // VRTテストファイルの場所
  testDir: './vrt',

  // 並列実行の設定
  fullyParallel: true,

  // CI環境では.only()を禁止
  forbidOnly: !!process.env.CI,

  // CI環境では失敗時に2回リトライ
  retries: process.env.CI ? 2 : 0,

  // CI環境では1ワーカーで実行（安定性向上）
  workers: process.env.CI ? 1 : undefined,

  // HTMLレポーターを使用
  reporter: 'html',

  // スクリーンショット比較の設定
  expect: {
    toHaveScreenshot: {
      // アニメーションを無効化
      animations: 'disabled',

      // クロスプラットフォーム対応のパステンプレート
      pathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',

      // 小さなレンダリング差分を許容（0.5%）
      threshold: 0.5,

      // 最大1000ピクセルの差分を許容
      maxDiffPixels: 1000
    },
  },

  use: {
    // テスト対象のベースURL
    baseURL: 'http://localhost:4173',

    // 失敗時のトレース記録
    trace: 'on-first-retry',

    // 失敗時のみスクリーンショットを撮影
    screenshot: 'only-on-failure',
  },

  // テストプロジェクトの設定
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    // 必要に応じて他のブラウザを追加
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1280, height: 720 }
    //   },
    // },
  ],

  // 開発サーバーの設定
  webServer: {
    command: 'pnpm preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
```

#### 重要な設定項目の説明

**threshold（しきい値）**
- スクリーンショット比較時の許容差分率
- 0.5%に設定すると、画像全体の0.5%までの差分を許容
- フォントレンダリングの微妙な違いを吸収

**maxDiffPixels（最大差分ピクセル数）**
- 許容する最大ピクセル差分数
- 1000に設定すると、1000ピクセルまでの差分を許容
- アンチエイリアシングの違いを吸収

**pathTemplate（パステンプレート）**
- スクリーンショットの保存パスをカスタマイズ
- プラットフォーム名を除外してクロスプラットフォーム対応
- macOS、Linux、Windowsで同じベースラインを使用可能

### 2. reg-suit設定 (regconfig.json)

プロジェクトのルートに`regconfig.json`を作成します：

```json
{
  "core": {
    "workingDir": "./visual-regression",
    "actualDir": "./visual-regression/actual",
    "expectedDir": "./visual-regression/expected",
    "diffDir": "./visual-regression/diff",
    "report": {
      "json": "./visual-regression/report.json",
      "html": "./visual-regression/report.html"
    },
    "threshold": 0.01,
    "ximgdiff": {
      "invocationType": "client"
    },
    "enableClientAddon": true
  },
  "plugins": {
    "reg-keygen-git-hash-plugin": {
      "expectedKey": "heads/main",
      "actualKey": "heads/{{branch}}"
    },
    "reg-publish-s3-plugin": {
      "bucketName": "your-s3-bucket-name-for-screenshots"
    },
    "reg-notify-github-plugin": {
      "prComment": true,
      "clientId": "github-actions"
    }
  }
}
```

#### 設定項目の説明

**core.threshold**
- 画像比較の差分しきい値（0.01 = 1%）
- この値を超える差分がある場合、テストが失敗

**reg-keygen-git-hash-plugin**
- `expectedKey`: ベースライン画像のGitブランチ（通常はmain）
- `actualKey`: 比較対象のブランチ（現在のブランチ）

**reg-publish-s3-plugin**
- スクリーンショットをS3にアップロード
- `bucketName`を実際のS3バケット名に置き換える

**reg-notify-github-plugin**
- GitHubのPRに結果をコメント
- `prComment: true`でコメント機能を有効化

### 3. 環境変数の設定

GitHub Actionsで使用する環境変数を設定します。

#### 必要な環境変数

```bash
# AWS S3を使用する場合（オプション）
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-northeast-1

# GitHubトークン（GitHub Actionsで自動提供）
GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}
```

#### GitHub Secretsの設定方法

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」に移動
2. 「New repository secret」をクリック
3. 必要なシークレットを追加：
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

---

## VRTテストの作成

### 1. ディレクトリ構造

```
vrt/
├── helpers/
│   └── screenshot.ts          # スクリーンショット撮影ヘルパー
├── home.spec.ts              # ホームページのVRTテスト
├── user-registration.spec.ts # ユーザー登録ページのVRTテスト
├── location-registration.spec.ts
└── user-list.spec.ts
```

### 2. 基本的なテストの書き方

#### シンプルなページテスト

```typescript
import { test } from '@playwright/test';
import { takeScreenshot } from './helpers/screenshot';

test.describe('HomePage Visual Tests', () => {
  test('should render home page correctly', async ({ page }) => {
    // ページに移動
    await page.goto('/');

    // スクリーンショットを撮影して比較
    await takeScreenshot(page, 'home-page');
  });
});
```

#### 複数の状態をテストする例

```typescript
import { test } from '@playwright/test';
import { takeScreenshot } from './helpers/screenshot';

test.describe('UserRegistrationPage Visual Tests', () => {
  test('should render user registration form correctly', async ({ page }) => {
    await page.goto('/user-registration');

    // 初期状態のスクリーンショット
    await takeScreenshot(page, 'user-registration-initial');

    // フォームに入力
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');

    // 入力後のスクリーンショット
    await takeScreenshot(page, 'user-registration-filled');

    // バリデーションエラー状態
    await page.click('button[type="submit"]');
    await page.waitForSelector('.error-message');
    await takeScreenshot(page, 'user-registration-error');
  });
});
```

### 3. ヘルパー関数の活用

プロジェクトには便利なヘルパー関数が用意されています。

#### screenshot.ts の主要機能

```typescript
// 基本的なスクリーンショット撮影
await takeScreenshot(page, 'page-name', {
  fullPage: true,  // ページ全体を撮影
  timeout: 10000   // タイムアウト時間
});

// 特定のコンポーネントのスクリーンショット
await takeComponentScreenshot(page, '.my-component', 'component-name');

// フォームの各状態を自動撮影
await takeFormStateScreenshots(page, 'form', 'form-test');

// レスポンシブデザインテスト
await takeResponsiveScreenshots(page, 'responsive-page', ['mobile', 'tablet', 'desktop']);
```

### 4. 高度なテストパターン

#### インタラクティブな要素のテスト

```typescript
test('should show modal correctly', async ({ page }) => {
  await page.goto('/');

  // モーダルを開く前
  await takeScreenshot(page, 'before-modal');

  // モーダルを開く
  await page.click('button[data-testid="open-modal"]');
  await page.waitForSelector('[role="dialog"]');

  // モーダルが開いた状態
  await takeScreenshot(page, 'modal-open');

  // モーダルを閉じる
  await page.click('[data-testid="close-modal"]');
  await takeScreenshot(page, 'after-modal');
});
```

#### ホバー状態のテスト

```typescript
test('should show hover states', async ({ page }) => {
  await page.goto('/');

  // 通常状態
  await takeScreenshot(page, 'button-normal');

  // ホバー状態
  await page.hover('button.primary');
  await takeScreenshot(page, 'button-hover');
});
```

#### データローディング状態のテスト

```typescript
test('should handle loading states', async ({ page }) => {
  // APIをモック
  await page.route('**/api/users', async (route) => {
    // ローディング状態を確認するため遅延
    await page.waitForTimeout(1000);
    await route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 1, name: 'Test User' }])
    });
  });

  await page.goto('/users');

  // ローディング状態
  await takeScreenshot(page, 'users-loading');

  // データロード完了後
  await page.waitForSelector('.user-list');
  await takeScreenshot(page, 'users-loaded');
});
```

---

## スクリーンショットの撮影

### 1. ベースライン画像の初回作成

初めてVRTを実行する際は、ベースライン画像を作成します：

```bash
# アプリケーションをビルド
pnpm build

# プレビューサーバーを起動してスクリーンショットを撮影
pnpm test:vrt:update
```

これにより`vrt/**/*-snapshots/`ディレクトリにベースライン画像が保存されます。

### 2. ベースライン画像の更新

意図的にUIを変更した場合、ベースライン画像を更新します：

```bash
pnpm test:vrt:update
```

更新後、変更をコミット：

```bash
git add vrt/
git commit -m "Update VRT baselines"
```

### 3. スクリーンショットの命名規則

わかりやすい命名を使用することで、テスト結果の確認が容易になります：

```typescript
// ✅ 良い例
await takeScreenshot(page, 'user-registration-initial');
await takeScreenshot(page, 'user-registration-validation-error');
await takeScreenshot(page, 'dashboard-mobile');

// ❌ 悪い例
await takeScreenshot(page, 'test1');
await takeScreenshot(page, 'screenshot');
await takeScreenshot(page, 'page');
```

### 4. アニメーションの制御

スクリーンショットの一貫性を保つため、アニメーションを無効化します：

```typescript
// ヘルパー関数が自動的にアニメーションを無効化
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

---

## リグレッションテストの実行

### 1. ローカルでのテスト実行

#### 通常のテスト実行

```bash
pnpm test:vrt
```

#### UIモードでデバッグ

```bash
pnpm test:vrt:ui
```

UIモードでは以下が可能です：
- テストをステップバイステップで実行
- スクリーンショットの差分をリアルタイムで確認
- 特定のテストのみを実行
- タイムトラベルデバッグ

#### HTMLレポートの確認

```bash
pnpm test:vrt:report
```

### 2. reg-suitを使用した差分レポート

```bash
# スクリーンショットを比較してHTMLレポートを生成
pnpm vrt:compare

# レポートをローカルサーバーで表示
pnpm vrt:serve
```

ブラウザで`http://localhost:8080`を開いてレポートを確認できます。

### 3. テスト結果の解釈

#### 成功時

```
✅ All tests passed
  - 0 failed
  - 10 passed
```

すべてのスクリーンショットがベースラインと一致しています。

#### 失敗時

```
❌ 2 failed
  - user-registration-page.png (1234 pixels different)
  - home-page.png (567 pixels different)
```

視覚的な差分が検出されました。以下を確認：
1. 差分が意図的な変更か
2. 意図的な場合：ベースラインを更新
3. 意図しない場合：コードを修正

---

## CI/CD統合

### 1. GitHub Actionsワークフロー

`.github/workflows/vrt.yml`の完全な例：

```yaml
name: Visual Regression Tests

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]

jobs:
  vrt:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: |
          if ! pnpm install --frozen-lockfile; then
            echo "⚠️ Lockfile is outdated, running regular install..."
            pnpm install
          fi

      - name: Install Playwright browsers
        run: |
          npx playwright install --with-deps chromium

      - name: Build application
        run: pnpm build

      - name: Run VRT tests
        continue-on-error: true
        id: vrt-test
        run: |
          pnpm test:vrt
          echo "exit_code=$?" >> $GITHUB_OUTPUT

      - name: Upload test results and screenshots
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: vrt-test-results-${{ github.run_number }}
          path: |
            test-results/
            playwright-report/
            vrt/**/*-snapshots/
          retention-days: 7

      - name: Comment PR with VRT results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const exitCode = '${{ steps.vrt-test.outputs.exit_code }}';

            let comment = '## 📸 Visual Regression Test Results\n\n';

            if (exitCode === '0') {
              comment += '✅ **All visual tests passed - No differences detected**\n\n';
            } else {
              comment += '❌ **Visual differences detected**\n\n';
              comment += '### 🔍 What to do next:\n';
              comment += '1. Download test results to view diff images\n';
              comment += '2. Review the differences\n';
              comment += '3. If changes are correct, update baselines:\n';
              comment += '   ```bash\n   pnpm test:vrt:update\n   ```\n\n';
            }

            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: comment
            });
```

### 2. ワークフローの重要なポイント

#### permissions設定

```yaml
permissions:
  contents: read
  pull-requests: write
```

- `contents: read`: コードのチェックアウトに必要
- `pull-requests: write`: PRへのコメント投稿に必要

#### continue-on-error設定

```yaml
- name: Run VRT tests
  continue-on-error: true
  id: vrt-test
```

テストが失敗してもワークフローを継続し、結果をPRにコメントします。

#### アーティファクトのアップロード

```yaml
- name: Upload test results and screenshots
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: vrt-test-results-${{ github.run_number }}
    path: |
      test-results/
      playwright-report/
      vrt/**/*-snapshots/
    retention-days: 7
```

テスト結果とスクリーンショットを7日間保存します。

### 3. PRへの自動コメント機能

このプロジェクトのワークフローは、PRに詳細な結果を自動コメントします：

- テスト結果のサマリー
- 検出された差分の数
- 修正手順のガイド
- トラブルシューティング情報

---

## ベストプラクティス

### 1. テスト設計のベストプラクティス

#### 適切な粒度でテストを分割

```typescript
// ✅ 良い例：機能ごとにテストを分割
test('should show initial form state', async ({ page }) => {
  await page.goto('/register');
  await takeScreenshot(page, 'register-initial');
});

test('should show validation errors', async ({ page }) => {
  await page.goto('/register');
  await page.click('button[type="submit"]');
  await takeScreenshot(page, 'register-errors');
});

// ❌ 悪い例：1つのテストに詰め込みすぎ
test('should test everything', async ({ page }) => {
  // 初期状態、入力、バリデーション、送信...すべてを1つのテストに
});
```

#### 動的コンテンツの扱い

```typescript
// 日付や時刻をモック
await page.addInitScript(() => {
  Date.now = () => new Date('2024-01-01T00:00:00Z').getTime();
});

// ランダムIDを固定値に置き換え
await page.route('**/api/**', async (route) => {
  const response = await route.fetch();
  const data = await response.json();
  // IDを固定値に置き換え
  const fixedData = data.map((item, index) => ({ ...item, id: index + 1 }));
  await route.fulfill({ json: fixedData });
});
```

#### wait戦略の使用

```typescript
// ✅ 良い例：適切な待機
await page.waitForLoadState('networkidle');
await page.waitForSelector('.content');
await takeScreenshot(page, 'page');

// ❌ 悪い例：固定時間の待機
await page.waitForTimeout(3000); // 不安定
```

### 2. パフォーマンス最適化

#### 並列実行の活用

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined, // ローカルでは並列実行
});
```

#### 不要なブラウザを無効化

```typescript
// 開発中はChromiumのみテスト
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  // リリース前に他のブラウザも有効化
  // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
];
```

### 3. メンテナンス性の向上

#### ページオブジェクトパターンの使用

```typescript
// pages/UserRegistrationPage.ts
export class UserRegistrationPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/user-registration');
  }

  async fillForm(data: { name: string; email: string }) {
    await this.page.fill('input[name="name"]', data.name);
    await this.page.fill('input[name="email"]', data.email);
  }

  async takeScreenshot(name: string) {
    await takeScreenshot(this.page, name);
  }
}

// テストファイルで使用
test('should render form', async ({ page }) => {
  const registrationPage = new UserRegistrationPage(page);
  await registrationPage.goto();
  await registrationPage.takeScreenshot('registration-initial');
});
```

#### 共通セットアップの抽出

```typescript
// vrt/fixtures/auth.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // ログイン処理
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await use(page);
  },
});

// テストで使用
test('should show dashboard', async ({ authenticatedPage }) => {
  await takeScreenshot(authenticatedPage, 'dashboard');
});
```

### 4. スクリーンショット管理

#### gitignoreの設定

```gitignore
# VRTテスト結果（ベースラインは除く）
test-results/
playwright-report/
visual-regression/

# ベースラインは含める（重要！）
!vrt/**/*-snapshots/
```

#### ベースライン更新のワークフロー

1. ローカルで変更を確認
2. `pnpm test:vrt`で差分を確認
3. 意図的な変更の場合：`pnpm test:vrt:update`
4. 変更をコミット：`git add vrt/ && git commit -m "Update VRT baselines"`

---

## トラブルシューティング

### 1. よくある問題と解決方法

#### 問題：クロスプラットフォームでの差分

**症状**
- ローカル（macOS）では成功するが、CI（Linux）で失敗
- フォントレンダリングの違いによる差分

**解決方法**

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      // しきい値を調整
      threshold: 0.5,
      maxDiffPixels: 1000,

      // プラットフォーム名を除外
      pathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
    },
  },
});
```

または、Docker環境でローカルテストを実行：

```bash
# Dockerコンテナ内でテストを実行（Linux環境）
docker run --rm --network host -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.56.1-jammy pnpm test:vrt
```

#### 問題：アニメーションによる不安定さ

**症状**
- 同じページでも実行するたびに結果が異なる
- アニメーション中の状態が撮影される

**解決方法**

```typescript
// グローバル設定
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
    },
  },
});

// または個別にCSS無効化
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `
});
```

#### 問題：動的コンテンツによる差分

**症状**
- 日付、時刻、ランダムデータが原因で毎回差分が発生

**解決方法**

```typescript
// 時刻を固定
await page.addInitScript(() => {
  const mockDate = new Date('2024-01-01T00:00:00Z');
  Date.now = () => mockDate.getTime();
  Date.prototype.getTime = () => mockDate.getTime();
});

// APIレスポンスをモック
await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify([
      { id: 1, name: 'Test User', createdAt: '2024-01-01T00:00:00Z' }
    ])
  });
});
```

#### 問題：テストが遅い

**症状**
- テスト実行に時間がかかりすぎる

**解決方法**

1. 並列実行を有効化：
```typescript
export default defineConfig({
  fullyParallel: true,
  workers: 4, // ワーカー数を増やす
});
```

2. 不要なブラウザを無効化：
```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  // Firefox、WebKitは必要な時のみ有効化
];
```

3. fullPageオプションを見直す：
```typescript
// 全ページスクリーンショットが不要な場合
await takeScreenshot(page, 'name', { fullPage: false });
```

### 2. デバッグ方法

#### Playwright UIモードの使用

```bash
pnpm test:vrt:ui
```

UIモードで可能なこと：
- テストをステップバイステップで実行
- DOM状態の確認
- ネットワークリクエストの監視
- スクリーンショットの即座確認

#### トレース機能の活用

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on', // すべてのテストでトレース記録
  },
});
```

トレースの確認：
```bash
npx playwright show-trace test-results/.../trace.zip
```

#### verbose出力

```bash
# 詳細なログ出力
DEBUG=pw:api pnpm test:vrt
```

### 3. CI環境特有の問題

#### 問題：Playwright browserのインストール失敗

**解決方法**

```yaml
# .github/workflows/vrt.yml
- name: Install Playwright browsers
  run: |
    npx playwright install --with-deps chromium
```

`--with-deps`フラグでシステム依存関係も同時にインストールします。

#### 問題：メモリ不足

**解決方法**

```yaml
# ワーカー数を制限
- name: Run VRT tests
  run: pnpm test:vrt
  env:
    PLAYWRIGHT_WORKERS: 1
```

#### 問題：タイムアウト

**解決方法**

```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 60000, // 60秒に延長
  expect: {
    timeout: 30000, // 30秒に延長
  },
});
```

### 4. ヘルプとサポート

#### 公式ドキュメント

- [Playwright公式ドキュメント](https://playwright.dev/)
- [reg-suit公式ドキュメント](https://github.com/reg-viz/reg-suit)

#### コミュニティ

- [Playwright Discord](https://aka.ms/playwright/discord)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

#### プロジェクト内のリソース

- VRTテストの実例：`vrt/`ディレクトリ
- ヘルパー関数：`vrt/helpers/screenshot.ts`
- CI設定：`.github/workflows/vrt.yml`

---

## まとめ

このガイドでは、React ViteプロジェクトでPlaywrightとreg-suitを使用したVisual Regression Testingのセットアップ方法を説明しました。

### 重要なポイント

1. **一貫性のあるスクリーンショット撮影**
   - アニメーションを無効化
   - 動的コンテンツをモック
   - 適切な待機戦略を使用

2. **適切な設定**
   - しきい値とmaxDiffPixelsを調整
   - クロスプラットフォーム対応のパステンプレート
   - CI環境での安定した実行

3. **効率的なワークフロー**
   - ローカルでのデバッグ（UIモード）
   - CI/CDでの自動実行
   - PRへの結果コメント

4. **保守性の高いテスト**
   - ページオブジェクトパターン
   - 共通ヘルパー関数
   - わかりやすい命名規則

### 次のステップ

1. まずはシンプルなページテストから始める
2. プロジェクトの重要なページをカバー
3. CI/CD統合で自動化
4. チーム全体でベストプラクティスを共有

Visual Regression Testingを活用して、UIの品質を継続的に保ちましょう！
