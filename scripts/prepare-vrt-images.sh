#!/bin/bash

# VRTスクリーンショットをreg-suit用に準備するスクリプト
# Playwrightのスナップショットディレクトリからreg-suitのactualDirにコピー

set -e

echo "📸 Preparing VRT images for reg-suit..."

# 出力ディレクトリをクリーンアップ
rm -rf vrt-images
mkdir -p vrt-images

# Playwrightのスナップショットを収集
# vrt/**/*-snapshots/**/*.png を vrt-images/ にコピー
find vrt -type f -name "*.png" -path "*/snapshots/*" | while read -r file; do
    # ファイル名を取得（パスなし）
    filename=$(basename "$file")
    # プロジェクト名を取得（chromium, firefox, webkit等）
    project=$(echo "$file" | grep -oP '\-snapshots/\K[^/]+(?=\.png)' || echo "")

    # ファイル名からプロジェクト名の部分を削除（重複を避ける）
    # 例: home-page-chromium.png → home-page-chromium.png (そのまま)

    # コピー先のパスを生成
    dest="vrt-images/$filename"

    # ファイルをコピー
    cp "$file" "$dest"
    echo "  ✓ Copied: $filename"
done

echo "✅ VRT images prepared successfully!"
echo "📊 Total images: $(find vrt-images -type f -name "*.png" | wc -l)"
