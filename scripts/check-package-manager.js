#!/usr/bin/env node

const packageManager = process.env.npm_config_user_agent || '';
const execPath = process.env.npm_execpath || '';

// pnpmが使用されているかチェック
const isPnpm = packageManager.includes('pnpm') || execPath.includes('pnpm');

if (!isPnpm) {
  const usedManager = packageManager.split('/')[0] || 'unknown';
  
  console.error(`
❌ このプロジェクトではpnpmの使用が必須です。

現在使用されているパッケージマネージャー: ${usedManager}

代わりに以下のコマンドを使用してください:
  pnpm install
  pnpm dev
  pnpm build

pnpmがインストールされていない場合は:
  npm install -g pnpm
`);
  
  process.exit(1);
}

console.log('✅ pnpmが使用されています。');