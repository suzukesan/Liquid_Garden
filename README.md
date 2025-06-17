# Liquid Garden

## 植物育成Webアプリケーション

**Liquid Glass UIを活用した癒し系植物育成アプリ**

### 🌱 プロジェクト概要

- **アプリ名**: Liquid Garden
- **プラットフォーム**: Web（純粋なWebアプリケーション）
- **コンセプト**: Liquid Glass UIを活用した癒し系植物育成アプリ
- **ターゲット**: 癒しを求める植物愛好家、コードベースデザイン重視の開発者

### 🛠️ 技術スタック

**メインフレームワーク**
- React 19 + TypeScript
- Vite（高速開発サーバー）

**UIライブラリ**
- shadcn/ui（Radix Primitives + Tailwind CSSベース）
- 完全カスタマイズ可能、コンポーネント所有権概念

**Liquid Glass実装**
- gracefullight/liquid-glass（React & Tailwind専用）
- albedim/apple-web-liquid-glass-demo（iOS 26スタイル）

**アニメーション・状態管理**
- Framer Motion：流動的なアニメーション
- Zustand：軽量状態管理
- React Query：データフェッチとキャッシュ

**デプロイ環境**
- Vercel（ゼロ設定自動デプロイ、エッジ配信）

### 🌟 主な機能

- 植物の育成（水やり、日光浴、話しかけ）
- Liquid Glass UI エフェクト
- 成長段階システム
- 健康度・愛情レベル管理
- インタラクティブなアニメーション

### 🚀 開発環境セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

### 📦 ESLint設定の拡張

本格的なプロダクション環境での開発には、型対応のlintルールの有効化を推奨：

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

### 🎯 開発状況

現在MVP（Minimum Viable Product）開発段階です。基本的な植物育成機能とLiquid Glass UIエフェクトが実装済み。

詳細な開発進捗は`TODO.md`をご参照ください。
