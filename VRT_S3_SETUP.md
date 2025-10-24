# VRT用AWS S3セットアップガイド

このガイドでは、Visual Regression Testing（VRT）でAWS S3を使用してスクリーンショットを保存し、CIで差分を比較してPRコメントに表示する手順を説明します。

## 📋 目次

- [概要](#概要)
- [前提条件](#前提条件)
- [手順1: S3バケットの作成](#手順1-s3バケットの作成)
- [手順2: IAMユーザーの作成とポリシー設定](#手順2-iamユーザーの作成とポリシー設定)
- [手順3: GitHub Secretsの設定](#手順3-github-secretsの設定)
- [手順4: 動作確認](#手順4-動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [セキュリティのベストプラクティス](#セキュリティのベストプラクティス)

## 概要

### アーキテクチャ

```
GitHub Actions (PR時)
  ↓
1. Playwrightでスクリーンショット撮影
  ↓
2. reg-suitで差分検出
  ↓
3. 結果をS3にアップロード
  ↓
4. S3上のインタラクティブなレポートURLをPRコメントに投稿
  ↓
5. レビュワーがブラウザで差分を確認
```

### 使用するAWSサービス

- **Amazon S3**: スクリーンショットとレポートの保存
- **IAM**: GitHub Actionsからのアクセス権限管理

## 前提条件

- AWSアカウント
- AWSマネジメントコンソールへのアクセス権限
- GitHubリポジトリの管理者権限

## 手順1: S3バケットの作成

### 1.1 AWSマネジメントコンソールにログイン

https://console.aws.amazon.com/

### 1.2 S3サービスに移動

- サービス検索で「S3」を検索
- S3ダッシュボードを開く

### 1.3 バケットを作成

1. **「バケットを作成」ボタンをクリック**

2. **バケット名を設定**
   ```
   例: my-project-vrt-screenshots
   ```
   - バケット名はグローバルで一意である必要があります
   - 小文字、数字、ハイフンのみ使用可能

3. **リージョンを選択**
   ```
   推奨: ap-northeast-1 (東京)
   ```

4. **パブリックアクセス設定**

   VRTレポートをブラウザで表示するため、以下を設定：

   ✅ **「パブリックアクセスをすべてブロック」のチェックを外す**

   ⚠️ **重要**: 以下の設定を個別に調整
   - ☑️ 新しいアクセスコントロールリスト (ACL) を介して付与されたバケットとオブジェクトへのパブリックアクセスをブロックする
   - ☐ **任意のアクセスコントロールリスト (ACL) を介して付与されたバケットとオブジェクトへのパブリックアクセスをブロックする** ← チェックを外す
   - ☐ **新しいパブリックバケットポリシーまたはアクセスポイントポリシーを介して付与されたバケットとオブジェクトへのパブリックアクセスをブロックする** ← チェックを外す
   - ☐ **任意のパブリックバケットポリシーまたはアクセスポイントポリシーを介したバケットとオブジェクトへのパブリックアクセスとクロスアカウントアクセスをブロックする** ← チェックを外す

   警告が表示されますが、「承認する」をチェック

5. **バケットのバージョニング**
   ```
   無効のまま（オプション）
   ```

6. **デフォルトの暗号化**
   ```
   Amazon S3 マネージドキー (SSE-S3) を選択
   ```

7. **「バケットを作成」をクリック**

### 1.4 バケットポリシーの設定

バケットを作成後、パブリック読み取りアクセスを許可します：

1. 作成したバケットをクリック
2. 「アクセス許可」タブを選択
3. 「バケットポリシー」セクションで「編集」をクリック
4. 以下のポリシーを貼り付け（`YOUR-BUCKET-NAME`を実際のバケット名に置き換え）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

5. 「変更を保存」をクリック

### 1.5 CORSの設定（オプション）

ブラウザから直接レポートを表示する場合は、CORSを設定します：

1. 「アクセス許可」タブ
2. 「クロスオリジンリソース共有 (CORS)」セクションで「編集」
3. 以下のCORS設定を貼り付け：

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

4. 「変更を保存」をクリック

## 手順2: IAMユーザーの作成とポリシー設定

### 2.1 IAMサービスに移動

- AWSマネジメントコンソールで「IAM」を検索
- IAMダッシュボードを開く

### 2.2 新しいIAMユーザーを作成

1. 左メニューから「ユーザー」を選択
2. 「ユーザーを追加」ボタンをクリック
3. ユーザー名を入力（例: `github-actions-vrt`）
4. 「次へ」をクリック

### 2.3 アクセス許可の設定

1. **「ポリシーを直接アタッチする」を選択**
2. 「ポリシーを作成」をクリック
3. 「JSON」タブを選択
4. 以下のポリシーを貼り付け（`YOUR-BUCKET-NAME`を実際のバケット名に置き換え）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    }
  ]
}
```

5. 「次へ: タグ」をクリック
6. タグは省略可能（必要に応じて追加）
7. 「次へ: 確認」をクリック
8. ポリシー名を入力（例: `GitHubActionsVRTPolicy`）
9. 説明を入力（例: `Policy for GitHub Actions to upload VRT screenshots to S3`）
10. 「ポリシーの作成」をクリック

### 2.4 ポリシーをユーザーにアタッチ

1. ユーザー作成画面に戻る
2. 作成したポリシー（`GitHubActionsVRTPolicy`）を検索して選択
3. 「次へ」をクリック
4. 「ユーザーの作成」をクリック

### 2.5 アクセスキーの作成

1. 作成したユーザー（`github-actions-vrt`）をクリック
2. 「セキュリティ認証情報」タブを選択
3. 「アクセスキーを作成」をクリック
4. **ユースケース**: 「サードパーティーサービス」を選択
5. 確認のチェックボックスにチェック
6. 「次へ」をクリック
7. 説明タグを入力（例: `GitHub Actions VRT`）
8. 「アクセスキーを作成」をクリック

⚠️ **重要**:
- **アクセスキーID**と**シークレットアクセスキー**をメモしてください
- シークレットアクセスキーは**この画面でのみ表示**されます
- `.csv ファイルをダウンロード`しておくことを推奨

## 手順3: GitHub Secretsの設定

### 3.1 GitHubリポジトリのSettings画面を開く

1. GitHubリポジトリページにアクセス
2. 「Settings」タブをクリック
3. 左メニューから「Secrets and variables」→「Actions」を選択

### 3.2 必要なSecretsを追加

以下の4つのSecretsを追加します：

#### 1. AWS_ACCESS_KEY_ID

- 「New repository secret」をクリック
- **Name**: `AWS_ACCESS_KEY_ID`
- **Secret**: 手順2.5で取得したアクセスキーIDを貼り付け
- 「Add secret」をクリック

#### 2. AWS_SECRET_ACCESS_KEY

- 「New repository secret」をクリック
- **Name**: `AWS_SECRET_ACCESS_KEY`
- **Secret**: 手順2.5で取得したシークレットアクセスキーを貼り付け
- 「Add secret」をクリック

#### 3. AWS_REGION

- 「New repository secret」をクリック
- **Name**: `AWS_REGION`
- **Secret**: バケットを作成したリージョン（例: `ap-northeast-1`）
- 「Add secret」をクリック

#### 4. S3_BUCKET_NAME

- 「New repository secret」をクリック
- **Name**: `S3_BUCKET_NAME`
- **Secret**: 手順1で作成したバケット名（例: `my-project-vrt-screenshots`）
- 「Add secret」をクリック

### 3.3 Secretsの確認

4つのSecretsが正しく追加されたことを確認：
- ✅ AWS_ACCESS_KEY_ID
- ✅ AWS_SECRET_ACCESS_KEY
- ✅ AWS_REGION
- ✅ S3_BUCKET_NAME

## 手順4: 動作確認

### 4.1 ベースラインスクリーンショットの生成

ローカル環境で初回のスクリーンショットを生成してコミット：

```bash
# スクリーンショットを生成
pnpm test:vrt:update

# 変更をコミット
git add vrt/
git commit -m "feat: add baseline VRT screenshots"
git push origin main
```

### 4.2 テストPRの作成

1. 新しいブランチを作成：
```bash
git checkout -b test-vrt-setup
```

2. 簡単なUI変更を加える（例: CSSの色変更）

3. 変更をコミット：
```bash
git add .
git commit -m "test: UI change to test VRT"
git push origin test-vrt-setup
```

4. GitHubでPRを作成

### 4.3 GitHub Actionsの実行確認

1. PRページの「Checks」タブを確認
2. 「Visual Regression Tests」ワークフローが実行されることを確認
3. 実行完了後、PRコメントに以下が表示されることを確認：
   - ✅ VRTテスト結果のサマリー
   - 🔗 S3上のレポートへのリンク（差分がある場合）
   - 📊 差分の詳細

### 4.4 S3レポートの確認

1. PRコメントのS3レポートリンクをクリック
2. インタラクティブなレポートページが開くことを確認
3. 差分画像をスライダーで比較できることを確認

## トラブルシューティング

### エラー: Access Denied

**原因**: IAMポリシーまたはバケットポリシーの設定が不正

**対処法**:
1. IAMユーザーに正しいポリシーがアタッチされているか確認
2. バケットポリシーが正しく設定されているか確認
3. バケット名が正しいか確認

### エラー: NoSuchBucket

**原因**: バケット名が間違っているか、リージョンが異なる

**対処法**:
1. GitHub Secretsの`S3_BUCKET_NAME`が正しいか確認
2. `AWS_REGION`が正しいか確認

### S3レポートが表示されない

**原因**: パブリックアクセス設定が不正

**対処法**:
1. バケットのパブリックアクセス設定を確認
2. バケットポリシーでパブリック読み取りが許可されているか確認
3. CORS設定が正しいか確認

### GitHub Actionsでreg-suitが失敗する

**原因**: 環境変数が正しく設定されていない

**対処法**:
1. GitHub Secretsが正しく設定されているか確認
2. ワークフローファイル（`.github/workflows/vrt.yml`）でSecretsが正しく参照されているか確認

### ローカルでreg-suitを実行したい

ローカル環境でもreg-suitを実行できます：

```bash
# 環境変数を設定
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_REGION=ap-northeast-1
export S3_BUCKET_NAME=your-bucket-name

# reg-suitを実行
pnpm vrt:reg
```

または、`.env.local`ファイルに環境変数を設定：

```bash
# .env.local
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=ap-northeast-1
S3_BUCKET_NAME=your-bucket-name
```

⚠️ **注意**: `.env.local`は`.gitignore`に含まれていることを確認してください

## セキュリティのベストプラクティス

### 1. 最小権限の原則

IAMポリシーは必要最小限の権限のみを付与してください。

### 2. アクセスキーのローテーション

定期的にアクセスキーをローテーションすることを推奨します：

1. 新しいアクセスキーを作成
2. GitHub Secretsを更新
3. 古いアクセスキーを無効化
4. 動作確認後、古いアクセスキーを削除

### 3. CloudTrailでの監査

AWS CloudTrailを有効にして、S3バケットへのアクセスを監査できます。

### 4. S3バケットの暗号化

S3バケットのデフォルト暗号化を有効にすることを推奨します（手順1で設定済み）。

### 5. バケットポリシーの定期的な確認

パブリックアクセスが本当に必要か定期的に確認してください。

### 6. 代替案: S3 Pre-signed URLs

よりセキュアな方法として、Pre-signed URLsを使用することもできます：

```javascript
// 例: Lambda関数でPre-signed URLを生成
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const params = {
  Bucket: 'your-bucket-name',
  Key: 'path/to/report.html',
  Expires: 3600 // 1時間有効
};

const url = s3.getSignedUrl('getObject', params);
```

## コスト最適化

### S3ライフサイクルポリシーの設定

古いVRTレポートを自動削除してコストを削減：

1. S3バケットを開く
2. 「管理」タブ → 「ライフサイクルルール」
3. 「ライフサイクルルールを作成」
4. ルール名: `delete-old-vrt-reports`
5. ルールスコープ: 全てのオブジェクトに適用
6. ライフサイクルルールアクション:
   - ☑️ オブジェクトの現在のバージョンを失効させる
   - 失効後の日数: `30`（30日後に削除）
7. 「ルールを作成」

これにより、30日以上経過したレポートは自動的に削除されます。

## まとめ

これで、AWS S3を使用したVRTのセットアップが完了しました！

### 次のステップ

1. **定期的な運用**
   - PRごとにVRTが自動実行されます
   - 差分がある場合はS3レポートで確認
   - 意図的な変更の場合はベースラインを更新

2. **チームへの共有**
   - このガイドをチームメンバーと共有
   - VRTの使い方をオンボーディングプロセスに含める

3. **継続的な改善**
   - テストカバレッジの拡大
   - 新しいページやコンポーネントのVRT追加
   - 閾値の調整（`regconfig.json`）

## 参考資料

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [reg-suit Documentation](https://reg-viz.github.io/reg-suit/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

問題が発生した場合は、プロジェクトのIssueトラッカーで報告してください。
