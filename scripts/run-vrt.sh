#!/bin/bash

# reg-suit VRTテスト実行スクリプト
# このスクリプトは以下の順序でVRTテストを実行します：
# 1. アプリケーションをビルド
# 2. Playwrightテストを実行してスクリーンショットを生成/更新
# 3. reg-suitで差分を検出・レポート生成

set -e

echo "🚀 Starting VRT test process..."

# 1. アプリケーションのビルド
echo "📦 Building application..."
pnpm build

# 2. Playwrightテストの実行（スクリーンショット生成）
echo "📸 Running Playwright tests to capture screenshots..."
pnpm test:vrt --update-snapshots

# 3. reg-suitでの差分検出とレポート生成
echo "🔍 Running reg-suit for visual regression detection..."
pnpm vrt:reg

echo "✅ VRT test process completed!"
echo "📊 Check the visual-regression/report.html for detailed results"