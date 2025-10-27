# VRT使用ガイド - ステップバイステップ

このガイドでは、Visual Regression Testing（VRT）を実際に使用する手順を、初めての方にもわかりやすく説明します。

## 📋 目次

- [基本的な使い方](#基本的な使い方)
- [開発ワークフロー](#開発ワークフロー)
- [コマンド一覧](#コマンド一覧)
- [よくある質問](#よくある質問)

## 基本的な使い方

### 1. 初回セットアップ（初回のみ）

プロジェクトでVRTを初めて使う場合、ベースラインスクリーンショットを生成します。

```bash
# スクリーンショットを生成
pnpm test:vrt:update

# 生成されたスクリーンショットをコミット
git add vrt/
git commit -m "feat: add VRT baseline screenshots"
git push origin main
```

**何が起こるか:**
- Playwrightがアプリケーションの各ページのスクリーンショットを撮影
- `vrt/**/*-snapshots/` にスクリーンショットが保存される
- これらが「期待値（expected）」として扱われる

### 2. UI変更時の確認

UI変更を加えたら、VRTテストを実行して差分を確認します。

```bash
# VRTテストを実行
pnpm test:vrt
```

**何が起こるか:**
- 新しくスクリーンショットを撮影
- ベースライン（期待値）と比較
- 差分があればテストが失敗

**結果の確認方法:**

#### 1. コマンドラインで確認
```
  1 failed
    [chromium] › home.spec.ts:9:3 › HomePage Visual Tests › should render home page correctly

  Error: Screenshot comparison failed:
    1234 pixels (ratio 0.05 of all image pixels) are different.
```

#### 2. UIモードで確認（推奨）
```bash
pnpm test:vrt:ui
```
- ブラウザが開き、視覚的に差分を確認できる
- スライダーで期待値と実際の値を比較
- どこが変わったか一目瞭然

#### 3. HTMLレポートで確認
```bash
pnpm test:vrt:report
```
- 詳細なHTMLレポートが開く
- 全ての差分を一覧表示

### 3. 差分が意図的な変更の場合

UI変更が意図的なもので、新しいスクリーンショットを「正解」としたい場合：

```bash
# ベースラインを更新
pnpm test:vrt:update

# 更新されたスクリーンショットをコミット
git add vrt/
git commit -m "chore: update VRT baselines after UI changes"
git push
```

### 4. reg-suitでS3レポートを生成（オプション）

S3にレポートをアップロードして、チームで共有できます：

```bash
# 環境変数を設定（初回のみ）
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_REGION=ap-northeast-1
export S3_BUCKET_NAME=your-bucket-name

# reg-suitを実行
pnpm vrt:reg
```

**何が起こるか:**
1. Playwrightのスナップショットを収集
2. S3から前回のスナップショットを取得
3. 差分を検出
4. インタラクティブなレポートをS3にアップロード
5. レポートURLが表示される

## 開発ワークフロー

### パターン1: 新機能開発

```bash
# 1. 新しいブランチを作成
git checkout -b feature/new-button

# 2. 開発前にベースラインを確認
pnpm test:vrt

# 3. 新機能を実装
# ボタンコンポーネントを追加...

# 4. VRTテストを実行して差分を確認
pnpm test:vrt:ui

# 5. 意図的な変更の場合、ベースラインを更新
pnpm test:vrt:update

# 6. 変更をコミット
git add .
git commit -m "feat: add new button component"

# 7. VRTのベースラインもコミット
git add vrt/
git commit -m "chore: update VRT baselines for new button"

# 8. プッシュしてPRを作成
git push origin feature/new-button
```

### パターン2: バグ修正

```bash
# 1. バグ修正用のブランチを作成
git checkout -b fix/button-alignment

# 2. バグを修正
# CSSを修正...

# 3. VRTテストを実行
pnpm test:vrt

# 4. 差分が期待通りか確認
pnpm test:vrt:ui

# 5. 問題なければベースラインを更新
pnpm test:vrt:update

# 6. コミット＆プッシュ
git add .
git commit -m "fix: correct button alignment"
git add vrt/
git commit -m "chore: update VRT baselines"
git push origin fix/button-alignment
```

### パターン3: PR作成時

```bash
# 1. PRを作成
# GitHub上でPRを作成

# 2. GitHub Actionsが自動実行される
# - VRTテストが実行される
# - reg-suitが差分を検出
# - reg-suit[bot]がPRコメントを投稿

# 3. PRコメントで差分を確認
# - reg-suit[bot]のコメントを確認
# - S3レポートへのリンクをクリック
# - インタラクティブに差分を確認

# 4. 差分が意図的でない場合
# - ローカルで修正
# - 再度コミット＆プッシュ
# - GitHub Actionsが再実行

# 5. 差分が意図的な場合
# - レビュワーに説明
# - 承認後マージ
```

## コマンド一覧

### Playwright VRTコマンド

| コマンド | 説明 | いつ使う？ |
|---------|------|-----------|
| `pnpm test:vrt` | VRTテストを実行 | UI変更後、差分を確認したいとき |
| `pnpm test:vrt:update` | ベースラインを更新 | 意図的なUI変更をベースラインに反映したいとき |
| `pnpm test:vrt:ui` | UIモードで実行 | 差分を視覚的に確認したいとき |
| `pnpm test:vrt:report` | HTMLレポートを表示 | 詳細なレポートを見たいとき |

### reg-suitコマンド

| コマンド | 説明 | いつ使う？ |
|---------|------|-----------|
| `pnpm vrt:prepare` | スナップショットを準備 | reg-suitを実行する前 |
| `pnpm vrt:reg` | reg-suitを実行 | S3レポートを生成・共有したいとき |
| `npx reg-suit run` | reg-suitを直接実行 | vrt:prepareの後に直接実行したいとき |

### その他のコマンド

| コマンド | 説明 |
|---------|------|
| `npx playwright test home.spec.ts` | 特定のテストのみ実行 |
| `npx playwright test home.spec.ts --update-snapshots` | 特定のテストのベースラインのみ更新 |

## よくある質問

### Q1: テストが失敗しました。どうすればいいですか？

**A:** まず、差分が意図的なものか確認してください。

```bash
# UIモードで差分を確認
pnpm test:vrt:ui
```

**意図的な変更の場合:**
```bash
pnpm test:vrt:update
git add vrt/
git commit -m "chore: update VRT baselines"
```

**意図的でない変更の場合:**
- CSSやコンポーネントを修正
- 再度テストを実行

### Q2: ローカルとCIで結果が異なります

**原因:**
- フォントの違い
- ブラウザバージョンの違い
- OSの違い

**対処法:**
```bash
# CIと同じ環境でベースラインを生成
# （GitHub Actionsで`test:vrt:update`を実行）
```

または、`playwright.config.ts`の閾値を調整：
```typescript
expect: {
  toHaveScreenshot: {
    threshold: 0.2,  // 0.2%の差分を許容
    maxDiffPixels: 100,  // 100ピクセルの差分を許容
  },
}
```

### Q3: 特定のページだけテストしたい

```bash
# ホームページだけテスト
npx playwright test home.spec.ts

# ユーザー登録ページだけベースライン更新
npx playwright test user-registration.spec.ts --update-snapshots
```

### Q4: reg-suitのレポートが表示されない

**原因:**
- AWS認証情報が設定されていない
- S3バケットの権限が不正

**対処法:**
1. 環境変数を確認
```bash
echo $AWS_ACCESS_KEY_ID
echo $S3_BUCKET_NAME
```

2. S3バケットの権限を確認（[VRT_S3_SETUP.md](./VRT_S3_SETUP.md)参照）

### Q5: PRでreg-suit[bot]のコメントが表示されない

**原因:**
- GitHub Actionsの権限が不足

**対処法:**
1. Settings → Actions → General
2. "Read and write permissions" を選択
3. "Allow GitHub Actions to create and approve pull requests" にチェック

詳細は [VRT_REG_SUIT_BOT.md](./VRT_REG_SUIT_BOT.md) を参照

### Q6: vrt-imagesディレクトリとは何ですか？

**A:** `pnpm vrt:prepare`を実行すると、Playwrightのスナップショット（`vrt/**/*-snapshots/`）が`vrt-images/`にコピーされます。これはreg-suitが読み込むためのディレクトリです。

- `vrt-images/`は自動生成されるので、Gitにコミット不要
- `.gitignore`に含まれている

### Q7: どのファイルをGitにコミットすべきですか？

**コミットすべき:**
- ✅ `vrt/**/*-snapshots/**/*.png` - ベースラインスクリーンショット
- ✅ `vrt/**/*.spec.ts` - テストファイル
- ✅ `playwright.config.ts` - Playwright設定
- ✅ `regconfig.json` - reg-suit設定

**コミット不要（.gitignoreに含まれる）:**
- ❌ `vrt-images/` - 一時的なスナップショット
- ❌ `.reg/` - reg-suitの作業ディレクトリ
- ❌ `test-results/` - Playwrightのテスト結果
- ❌ `playwright-report/` - Playwrightのレポート

## 次のステップ

- [VRT_GUIDE.md](./VRT_GUIDE.md) - VRTの詳細ガイド
- [VRT_S3_SETUP.md](./VRT_S3_SETUP.md) - S3セットアップ手順
- [VRT_REG_SUIT_BOT.md](./VRT_REG_SUIT_BOT.md) - reg-suit botの使い方

問題が発生した場合は、プロジェクトのIssueトラッカーで報告してください。
