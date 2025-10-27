# reg-suit bot による GitHub PR コメント自動投稿ガイド

このガイドでは、reg-suit botを使用してGitHub Pull Request上に自動でビジュアルリグレッションテストのサマリーコメントを投稿する方法を説明します。

## 📋 目次

- [概要](#概要)
- [reg-suit botとは](#reg-suit-botとは)
- [設定済み内容](#設定済み内容)
- [PRコメントの内容](#prコメントの内容)
- [トラブルシューティング](#トラブルシューティング)

## 概要

reg-suit botは、Visual Regression Testing（VRT）の結果を自動的にGitHub PRにコメントとして投稿するbotです。

### 利点

- 📊 **詳細なレポート**: 差分画像をインラインで表示
- 🤖 **自動投稿**: PR作成時に自動でコメントを投稿
- 🔄 **更新可能**: 新しいコミットで自動的にコメントを更新
- 🎨 **視覚的**: スライダーで差分を比較可能
- 📈 **統計情報**: 変更されたスクリーンショットの数や詳細

## reg-suit botとは

`reg-notify-github-plugin`は、reg-suitの公式プラグインで、GitHub PRに自動的にコメントを投稿します。

### 主な機能

1. **差分の可視化**:
   - Expected（期待値）とActual（実際の値）を並べて表示
   - インタラクティブなスライダーで比較

2. **統計情報**:
   - 新しく追加されたスクリーンショット
   - 変更されたスクリーンショット
   - 削除されたスクリーンショット
   - 変更なしのスクリーンショット

3. **S3レポートへのリンク**:
   - より詳細なインタラクティブレポート
   - ブラウザで全ての差分を確認可能

4. **コミットステータス**:
   - PRのステータスチェックとして表示
   - マージ前に差分を確認可能

## 設定済み内容

このプロジェクトでは、reg-suit botが以下のように設定されています。

### regconfig.json

```json
{
  "plugins": {
    "reg-notify-github-plugin": {
      "prComment": true,
      "prCommentBehavior": "default",
      "clientId": "reg-suit[bot]",
      "customEndpoint": "",
      "setCommitStatus": true,
      "statusContext": "reg-suit"
    }
  }
}
```

**設定項目の説明:**

| 設定項目 | 値 | 説明 |
|---------|-----|------|
| `prComment` | `true` | PRコメントを投稿する |
| `prCommentBehavior` | `"default"` | 既存のコメントを更新（新しいコミットごとに更新） |
| `clientId` | `"reg-suit[bot]"` | コメント投稿者の名前 |
| `setCommitStatus` | `true` | コミットステータスを設定 |
| `statusContext` | `"reg-suit"` | ステータスチェックの名前 |

### GitHub Actionsワークフロー

`.github/workflows/vrt.yml`で以下の環境変数が設定されています：

```yaml
- name: Run reg-suit
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    CI_PULL_REQUEST: ${{ github.event.pull_request.number }}
    CI_REPO_OWNER: ${{ github.repository_owner }}
    CI_REPO_NAME: ${{ github.event.repository.name }}
    CI_COMMIT_MESSAGE: ${{ github.event.head_commit.message }}
    CI_COMMIT_SHA: ${{ github.event.pull_request.head.sha }}
    CI_BRANCH: ${{ github.head_ref }}
```

これらの環境変数により、reg-notify-github-pluginがPR情報を取得してコメントを投稿できます。

## PRコメントの内容

reg-suit botが投稿するPRコメントには以下の情報が含まれます：

### 1. ヘッダー

```
Visual Regression Test Report
by reg-suit[bot]
```

### 2. サマリー統計

```
📊 Summary:
- ✅ Passed: 10 items
- ⚠️ Changed: 2 items
- ➕ New: 1 item
- ➖ Deleted: 0 items
```

### 3. 変更された画像の詳細

差分がある各スクリーンショットについて：
- ファイル名
- Expected（期待値）の画像
- Actual（実際の値）の画像
- Diff（差分）の画像
- インタラクティブなスライダー

### 4. S3レポートへのリンク

```
🔗 View full report on S3
```

### 5. コミットステータス

PRのステータスチェック欄に以下が表示されます：
- ✅ `reg-suit` - Passed（差分なし）
- ❌ `reg-suit` - Failed（差分あり）

## PRコメントの表示例

### 差分がない場合

```markdown
## Visual Regression Test Report

✅ **All tests passed - No visual differences detected**

📊 Summary:
- ✅ Passed: 15 items
- ⚠️ Changed: 0 items
- ➕ New: 0 items
- ➖ Deleted: 0 items

🔗 [View full report on S3](https://your-bucket.s3.amazonaws.com/...)
```

### 差分がある場合

```markdown
## Visual Regression Test Report

⚠️ **Visual differences detected**

📊 Summary:
- ✅ Passed: 13 items
- ⚠️ Changed: 2 items
- ➕ New: 0 items
- ➖ Deleted: 0 items

### Changed Items

#### 1. home-page-chromium.png

**Expected** | **Actual** | **Diff**
[画像] | [画像] | [画像]

[Interactive slider to compare]

#### 2. user-registration-page-chromium.png

**Expected** | **Actual** | **Diff**
[画像] | [画像] | [画像]

[Interactive slider to compare]

---

🔗 [View full report on S3](https://your-bucket.s3.amazonaws.com/...)
```

## 動作フロー

1. **PR作成または更新**
   - 開発者がPRを作成またはコミットをプッシュ

2. **GitHub Actions実行**
   - VRTワークフローが自動実行される

3. **スクリーンショット撮影**
   - Playwrightがスクリーンショットを撮影

4. **reg-suit実行**
   - スクリーンショットをS3にアップロード
   - ベースラインと比較
   - 差分を検出

5. **PRコメント投稿**
   - reg-suit botがPRにコメントを投稿
   - 差分画像をインライン表示
   - S3レポートへのリンクを含める

6. **コミットステータス更新**
   - PRのステータスチェックを更新
   - マージ可能かどうかを表示

## トラブルシューティング

### reg-suit botのコメントが投稿されない

**原因1: GITHUB_TOKENの権限不足**

GitHub Actionsの`GITHUB_TOKEN`には、デフォルトでPRコメントを投稿する権限があります。しかし、リポジトリの設定によっては権限が制限されている場合があります。

**対処法:**
1. リポジトリの Settings → Actions → General を開く
2. "Workflow permissions" セクションで以下を確認：
   - ✅ "Read and write permissions" を選択
   - ✅ "Allow GitHub Actions to create and approve pull requests" にチェック
3. 設定を保存

**原因2: 環境変数の設定ミス**

reg-notify-github-pluginは、以下の環境変数が必要です：
- `GITHUB_TOKEN`
- `CI_PULL_REQUEST`（PR番号）
- `CI_REPO_OWNER`（リポジトリオーナー）
- `CI_REPO_NAME`（リポジトリ名）

**対処法:**
`.github/workflows/vrt.yml`で環境変数が正しく設定されているか確認してください。

**原因3: reg-suitの実行エラー**

reg-suitがエラーで失敗すると、コメントが投稿されません。

**対処法:**
1. GitHub Actionsのログを確認
2. reg-suitのエラーメッセージを確認
3. S3の設定やAWS認証情報を確認

### コメントが重複して投稿される

**原因:** `prCommentBehavior`が`"new"`に設定されている場合、新しいコミットごとに新しいコメントが投稿されます。

**対処法:**
`regconfig.json`で`prCommentBehavior`を`"default"`に設定してください（設定済み）：

```json
{
  "reg-notify-github-plugin": {
    "prCommentBehavior": "default"
  }
}
```

### 画像がインライン表示されない

**原因:** S3バケットのCORS設定またはパブリックアクセス設定が不正

**対処法:**
[VRT_S3_SETUP.md](./VRT_S3_SETUP.md)を参照して、S3バケットのCORS設定とパブリックアクセス設定を確認してください。

### コミットステータスが表示されない

**原因:** `setCommitStatus`が`false`に設定されている

**対処法:**
`regconfig.json`で`setCommitStatus`を`true`に設定してください（設定済み）：

```json
{
  "reg-notify-github-plugin": {
    "setCommitStatus": true,
    "statusContext": "reg-suit"
  }
}
```

### ローカルでのテスト

ローカル環境でreg-suitの動作を確認したい場合：

```bash
# 環境変数を設定
export GITHUB_TOKEN=your-github-token
export CI_PULL_REQUEST=123
export CI_REPO_OWNER=your-username
export CI_REPO_NAME=your-repo-name
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=ap-northeast-1
export S3_BUCKET_NAME=your-bucket-name

# reg-suitを実行
pnpm vrt:reg
```

**注意:** ローカルで実行すると、実際にPRにコメントが投稿されます。テスト用のPRを使用することを推奨します。

## 高度な設定

### コメントのカスタマイズ

`prCommentBehavior`オプションで動作を変更できます：

| 値 | 動作 |
|----|------|
| `"default"` | 既存のコメントを更新（推奨） |
| `"new"` | 新しいコミットごとに新しいコメントを投稿 |
| `"once"` | 最初の一度だけコメントを投稿 |

### カスタムエンドポイント

GitHub Enterpriseを使用している場合は、`customEndpoint`を設定：

```json
{
  "reg-notify-github-plugin": {
    "customEndpoint": "https://github.example.com/api/v3"
  }
}
```

### ステータスチェックのカスタマイズ

`statusContext`を変更してステータスチェックの名前を変更：

```json
{
  "reg-notify-github-plugin": {
    "statusContext": "visual-regression-test"
  }
}
```

## ベストプラクティス

1. **レビュープロセス**
   - PRのレビュー前にreg-suit botのコメントを確認
   - 差分が意図的なものか確認
   - 必要に応じてベースラインを更新

2. **ブランチ保護**
   - ブランチ保護ルールで`reg-suit`ステータスチェックを必須に設定
   - 差分がある場合はマージを防止

3. **チーム教育**
   - reg-suit botの見方をチームに共有
   - 差分の確認方法をオンボーディングに含める

4. **定期的な確認**
   - 偽陽性（意図しない差分）が多い場合は閾値を調整
   - `regconfig.json`の`threshold`を変更

## まとめ

reg-suit botを使用することで、Visual Regression Testingの結果を自動的にPRに投稿し、チーム全体で視覚的な変更を確認できます。

### 次のステップ

1. **PRを作成してテスト**
   - 簡単なUI変更を加えてPRを作成
   - reg-suit botのコメントが投稿されることを確認

2. **チームに共有**
   - reg-suit botの使い方をチームメンバーと共有
   - レビュープロセスに組み込む

3. **設定の最適化**
   - 閾値の調整
   - テストカバレッジの拡大

## 参考資料

- [reg-suit Documentation](https://reg-viz.github.io/reg-suit/)
- [reg-notify-github-plugin](https://github.com/reg-viz/reg-suit/tree/master/packages/reg-notify-github-plugin)
- [VRT_GUIDE.md](./VRT_GUIDE.md) - VRTの使い方
- [VRT_S3_SETUP.md](./VRT_S3_SETUP.md) - S3セットアップ手順

問題が発生した場合は、プロジェクトのIssueトラッカーで報告してください。
