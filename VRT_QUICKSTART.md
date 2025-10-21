# VRTクイックスタートガイド

## 📸 基本的な使い方

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

## 🔧 よく使うコマンド

| コマンド | 説明 |
|----------|------|
| `pnpm test:vrt` | VRTテストを実行 |
| `pnpm test:vrt:update` | スクリーンショットを更新（意図的な変更後） |
| `pnpm test:vrt:ui` | UIモードでテスト実行 |
| `pnpm test:vrt:report` | HTMLレポートを表示 |
| `pnpm vrt:reg` | reg-suitで差分検出・レポート生成 |

## 🚀 開発ワークフロー

### 新機能開発時

1. **開発前**：現在のUIをベースラインとして保存
   ```bash
   pnpm test:vrt:update
   git add vrt/
   git commit -m "Update VRT baselines before feature development"
   ```

2. **開発中**：定期的にVRTテストを実行
   ```bash
   pnpm test:vrt
   ```

3. **完了時**：意図的な変更のベースライン更新
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

## 🎯 テスト対象ページ

| ページ | テストファイル | 内容 |
|--------|----------------|------|
| ホーム | `vrt/home.spec.ts` | 基本表示、レスポンシブ、ホバー/フォーカス |
| ユーザー登録 | `vrt/user-registration.spec.ts` | フォーム各状態、バリデーション |
| 拠点登録 | `vrt/location-registration.spec.ts` | フォーム、セレクト、条件付きフィールド |
| ユーザー一覧 | `vrt/user-list.spec.ts` | ローディング、データ表示、エラー状態 |

## 📱 テストビューポート

- **モバイル**: 375x667 (iPhone SE)
- **タブレット**: 768x1024 (iPad)
- **デスクトップ**: 1280x720
- **大画面**: 1920x1080

## 🔍 テストブラウザ

- Chrome (Chromium)
- Firefox
- Safari (WebKit)
- Mobile Chrome
- Mobile Safari

## ⚠️ トラブルシューティング

### スクリーンショットの差分が発生する

```bash
# 差分を確認
pnpm test:vrt:ui

# 意図的な変更の場合はベースラインを更新
pnpm test:vrt:update

# 特定のテストファイルのみ更新
npx playwright test home.spec.ts --update-snapshots
```

### フォントやレンダリングの違い

- CI環境とローカル環境でフォントが異なる場合
- ブラウザバージョンの違いによるレンダリング差分

```bash
# 同じ環境でベースラインを再生成
pnpm test:vrt:update
```

### アニメーションの問題

- CSSアニメーションが完全に無効化されていない場合
- JavaScript アニメーションライブラリの影響

### テストの安定性向上

```javascript
// より確実な待機
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500);

// 特定の要素の表示待ち
await page.waitForSelector('[data-testid="component"]');
```

## 📈 CI/CDでの活用

### GitHub Actions設定済み

- `.github/workflows/vrt.yml`でPR時に自動実行
- reg-suitレポートをPRコメントに自動投稿
- S3への結果保存（設定すれば）

### 必要な環境変数（オプション）

```
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx  
AWS_REGION=ap-northeast-1
```

## 🎨 カスタマイズ

### 新しいページのテスト追加

1. `vrt/` フォルダに `new-page.spec.ts` を作成
2. ヘルパー関数を活用してテストを記述
3. 初回実行でベースラインを生成

### テスト設定のカスタマイズ

- `playwright.config.ts`: ブラウザ、ビューポート設定
- `regconfig.json`: reg-suite設定（閾値、保存場所等）
- `vrt/helpers/screenshot.ts`: 共通機能の追加

## 📚 参考資料

- [Playwright Documentation](https://playwright.dev/)
- [reg-suit Documentation](https://reg-viz.github.io/reg-suit/)
- [Visual Testing Best Practices](https://playwright.dev/docs/test-snapshots)