# AWS S3デプロイ設定手順

## 1. S3バケットの作成

### AWS Consoleでの作成手順：
1. [AWS S3 Console](https://s3.console.aws.amazon.com/)にアクセス
2. 「バケットを作成」をクリック
3. 設定内容：
   - **バケット名**: `react-vite-yup-hosting-[your-unique-suffix]`
   - **AWS リージョン**: `ap-northeast-1` (東京)
   - **パブリックアクセスをブロック**: **すべてのチェックを外す**
   - **バケットバージョニング**: 無効
   - **暗号化**: デフォルト

### 静的ウェブサイトホスティングの設定：
1. 作成したバケットを選択
2. 「プロパティ」タブ → 「静的ウェブサイトホスティング」
3. **有効にする**を選択
4. 設定：
   - **インデックスドキュメント**: `index.html`
   - **エラードキュメント**: `index.html` (SPAのため)

### バケットポリシーの設定：
1. 「アクセス許可」タブ → 「バケットポリシー」
2. 以下のポリシーを追加（バケット名を置き換えてください）：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

## 2. IAMユーザーの作成（GitHub Actions用）

### IAMユーザー作成：
1. [AWS IAM Console](https://console.aws.amazon.com/iam/)にアクセス
2. 「ユーザー」→「ユーザーを作成」
3. **ユーザー名**: `github-actions-deploy`
4. **アクセスキーを作成** → **ユースケース**: 「サードパーティーサービス」を選択
5. **説明**: `GitHub Actions用のS3デプロイ自動化`

### ポリシーの添付：
1. **既存のポリシーを直接アタッチ**を選択
2. カスタムポリシーを作成：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

### アクセスキーの保存：
- **Access Key ID**と**Secret Access Key**をメモ

## 3. GitHub Secretsの設定

GitHub リポジトリの「Settings」→「Secrets and variables」→「Actions」で以下を追加：

- `AWS_ACCESS_KEY_ID`: IAMユーザーのアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: IAMユーザーのシークレットアクセスキー
- `AWS_REGION`: `ap-northeast-1`
- `S3_BUCKET_NAME`: 作成したS3バケット名

## 4. 初回デプロイテスト

### AWS CLIのインストール（まだインストールしていない場合）：
```bash
# macOSの場合（Homebrewを使用）
brew install awscli

# インストール確認
aws --version
```

### ローカルでのテスト：
```bash
# ビルド確認
pnpm build

# AWS CLIの設定（初回のみ）
aws configure
# 入力項目:
# - AWS Access Key ID: [IAMユーザーのアクセスキーID]
# - AWS Secret Access Key: [IAMユーザーのシークレットアクセスキー]  
# - Default region name: ap-northeast-1
# - Default output format: json

# S3バケット名の環境変数設定
export S3_BUCKET_NAME=your_bucket_name

# または .env.local ファイルを使用
echo "S3_BUCKET_NAME=your_bucket_name" > .env.local
source .env.local

# 手動デプロイテスト
pnpm deploy:s3
pnpm deploy:s3:index
```

## 5. サイトの確認

静的ウェブサイトのURL：
`http://YOUR_BUCKET_NAME.s3-website-ap-northeast-1.amazonaws.com`

## 後からCloudFrontを追加する場合

CloudFrontディストリビューションを作成：
1. **Origin Domain**: S3バケットの静的ウェブサイトエンドポイント
2. **Default Root Object**: `index.html`
3. **Error Pages**: 404 → `/index.html` (SPAのため)
4. **Caching**: 適切なキャッシュポリシー設定

## コスト概算

### S3のみ：
- ストレージ: ~$0.025/GB/月
- リクエスト: ~$0.0004/1000リクエスト
- データ転送: ~$0.09/GB

### 月間10,000PV程度の場合：
- **S3のみ**: 約$1-3/月
- **S3 + CloudFront**: 約$5-10/月

## トラブルシューティング

### よくある問題：
1. **403エラー**: バケットポリシーの確認
2. **404エラー**: インデックスドキュメントの設定確認
3. **デプロイ失敗**: IAMポリシーの権限確認

### 具体的なエラーと解決方法：

#### `AccessDenied: s3:ListBucket`エラー
```
User: arn:aws:iam::xxx:user/github-actions-deploy is not authorized to perform: s3:ListBucket
```
**解決方法**: IAMポリシーで`s3:ListBucket`をバケットレベル（`arn:aws:s3:::BUCKET_NAME`）で許可

#### `NoSuchBucket`エラー
```
The specified bucket does not exist
```
**解決方法**: 
1. S3バケットが作成されているか確認
2. `S3_BUCKET_NAME`環境変数が正しく設定されているか確認
3. リージョンが正しいか確認

#### `Access Denied`（Web表示時）
**解決方法**:
1. バケットポリシーでパブリック読み取りを許可
2. 「パブリックアクセスをブロック」設定を無効化
3. 静的ウェブサイトホスティングが有効になっているか確認