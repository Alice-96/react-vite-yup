# SCSS Setup Documentation

## 概要

このプロジェクトでは、CSSプリプロセッサーとして**SCSS (Sass)**を導入しています。

## 導入済みの機能

### 1. パッケージ

- `sass` - SCSSコンパイラー

### 2. ファイル構造

```
src/shared/styles/
├── index.scss          # メインのグローバルスタイル
├── App.scss           # Appコンポーネント用スタイル
├── _variables.scss    # グローバル変数定義
└── _mixins.scss       # 再利用可能なmixins
```

### 3. 利用可能な変数

#### カラーパレット
- `$primary-color`: #1976d2
- `$secondary-color`: #dc004e
- `$success-color`: #2e7d32
- `$warning-color`: #ed6c02
- `$error-color`: #d32f2f
- `$info-color`: #0288d1

#### スペーシング
- `$spacing-xs`: 0.25rem (4px)
- `$spacing-sm`: 0.5rem (8px)
- `$spacing-md`: 1rem (16px)
- `$spacing-lg`: 1.5rem (24px)
- `$spacing-xl`: 2rem (32px)
- `$spacing-xxl`: 3rem (48px)

#### ブレークポイント
- `$breakpoint-sm`: 600px
- `$breakpoint-md`: 960px
- `$breakpoint-lg`: 1280px
- `$breakpoint-xl`: 1920px

### 4. 利用可能なMixins

#### レイアウト
```scss
@include flex-center;    // display: flex + center alignment
@include flex-column;    // flex-direction: column
@include flex-between;   // justify-content: space-between
```

#### レスポンシブデザイン
```scss
@include mobile { ... }   // max-width: 599px
@include tablet { ... }   // 600px - 959px
@include desktop { ... }  // min-width: 960px
```

#### ボタン
```scss
@include button-base;     // 基本のボタンスタイル
@include button-primary;  // プライマリボタンスタイル
```

#### カード
```scss
@include card;           // カードレイアウト（影、角丸など）
```

### 5. 使用方法

#### 新しいSCSSファイルの作成
```scss
// コンポーネント用SCSSファイル例
@use '../path/to/variables' as *;
@use '../path/to/mixins' as *;

.my-component {
  @include card;
  background-color: $primary-color;
  
  @include mobile {
    padding: $spacing-sm;
  }
}
```

#### グローバルユーティリティクラス
```scss
.text-center    // text-align: center
.flex-center    // @include flex-center
.flex-column    // @include flex-column  
.flex-between   // @include flex-between
```

### 6. ベストプラクティス

1. **@use構文の使用**: `@import`は非推奨のため、`@use`を使用
2. **変数の活用**: ハードコードされた値ではなく、定義済みの変数を使用
3. **mixinsの再利用**: 共通のスタイルパターンはmixinsとして定義
4. **ネスト構造の適切な使用**: BEM記法と組み合わせて読みやすいコードを書く
5. **レスポンシブデザイン**: mixinsを使用してブレークポイント管理

### 7. 開発フロー

1. スタイルファイルの作成: `.scss`拡張子を使用
2. 必要な変数・mixinsのインポート
3. コンポーネントスタイルの実装
4. レスポンシブ対応の確認

### 8. ビルド

ViteがSCSSを自動的にコンパイルします：

```bash
pnpm dev    # 開発サーバー起動
pnpm build  # 本番用ビルド
```

## トラブルシューティング

### 警告: legacy-js-api
現在のSassバージョンでlegacy-js-apiの警告が表示されますが、ビルドには影響ありません。

### パフォーマンス最適化
- 不要なnestingを避ける
- mixinsの過度な使用を避ける
- 未使用のスタイル定義を削除する