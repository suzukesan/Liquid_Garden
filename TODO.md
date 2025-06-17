# Liquid Garden 開発TODOリスト

## 📋 プロジェクト進行チェックリスト

### 🚀 Phase 1: プロジェクト基盤構築

#### 環境構築
- [ ] React 19 + TypeScript + Vite プロジェクト初期化
- [ ] 基本的なフォルダ構造作成
- [ ] Git リポジトリ初期化
- [ ] `.gitignore` 設定
- [ ] `package.json` 基本設定

#### 依存関係インストール
- [ ] React 19 + TypeScript
- [ ] Vite 開発環境
- [ ] Tailwind CSS セットアップ
- [ ] shadcn/ui 初期導入・設定
- [ ] Framer Motion インストール
- [ ] Zustand 状態管理
- [ ] React Query データフェッチ
- [ ] Liquid Glass ライブラリ調査・導入

### 🌐 Phase 2: Vercel デプロイ環境構築

#### デプロイ準備
- [ ] Vercel アカウント確認
- [ ] GitHub リポジトリ作成・連携
- [ ] `vercel.json` 設定ファイル作成
- [ ] 環境変数設定
- [ ] ビルド設定確認

#### 継続的インテグレーション
- [ ] GitHub Actions 基本設定
- [ ] 自動ビルド・テスト設定
- [ ] 自動デプロイ設定
- [ ] プレビューデプロイ確認

### 🎨 Phase 3: MVP基本機能実装

#### UIコンポーネント基盤
- [ ] Liquid Glass 基本コンポーネント作成
- [ ] Bento Box レイアウトシステム
- [ ] 基本的なレスポンシブ対応
- [ ] ダークモード・ライトモード切り替え

#### 植物育成システム（MVP版）
- [ ] 植物データモデル設計
- [ ] 1種類の植物（パキラ）プロトタイプ
- [ ] 基本ステータス管理（健康度、成長進度、愛情レベル）
- [ ] 成長段階システム（種子→発芽→小さな葉→大きな葉）

#### 基本インタラクション
- [ ] 水やり機能実装
- [ ] 日光浴機能実装
- [ ] 話しかけ機能（基本版）
- [ ] 植物タップ時のガラス変形エフェクト

### 🎯 Phase 4: UI/UXエンハンス

#### Liquid Glass エフェクト実装
- [ ] パキラ専用ガラスエフェクト（緑がかった波打ち）
- [ ] ガラス透明度・屈折効果
- [ ] ホバー・タップ時のガラス変形
- [ ] 光の屈折演出

#### アニメーション実装
- [ ] 水やり時の液滴アニメーション
- [ ] 成長時の光の屈折演出
- [ ] パーティクル効果（基本版）
- [ ] マイクロインタラクション

#### 画面実装
- [ ] メイン画面レイアウト
- [ ] 植物詳細画面
- [ ] 設定画面（基本版）
- [ ] 時間帯別背景（3パターン）

### 🔧 Phase 5: 最適化・仕上げ

#### パフォーマンス最適化
- [ ] Liquid Glass エフェクト軽量化
- [ ] 不要な再レンダリング防止
- [ ] 画像最適化
- [ ] バンドルサイズ最適化

#### 品質保証
- [ ] TypeScript 型安全性確認
- [ ] ESLint・Prettier 設定
- [ ] 基本的なテスト実装
- [ ] クロスブラウザ対応確認

#### アクセシビリティ
- [ ] 基本的なa11y対応
- [ ] キーボードナビゲーション
- [ ] 日本語対応確認
- [ ] カラーコントラスト確認

### 📱 Phase 6: 機能拡張（Post-MVP）

#### 植物種類拡張
- [ ] サンスベリア実装
- [ ] ゴムの木実装
- [ ] ケンチャヤシ実装
- [ ] モンステラ実装

#### 高度な機能
- [ ] 音声認識（話しかけ機能）
- [ ] 成長記録グラフ
- [ ] ケア履歴管理
- [ ] データエクスポート機能
- [ ] 通知システム

#### 上級UI/UX
- [ ] 植物別Liquid Glassカスタマイズ
- [ ] 動的背景動画
- [ ] 高度なパーティクル効果
- [ ] テーマ変更機能

---

## 🎯 当面の優先順位

### 🔥 高優先度（今週）
1. ✅ TODOリスト作成
2. [ ] React 19 + Vite プロジェクト初期化
3. [ ] GitHub リポジトリ作成
4. [ ] Vercel 初回デプロイ

### 📋 中優先度（来週）
1. [ ] shadcn/ui セットアップ
2. [ ] Liquid Glass 基本実装
3. [ ] パキラプロトタイプ作成
4. [ ] 基本的な水やり機能

### 🔮 低優先度（今月末）
1. [ ] アニメーション実装
2. [ ] 植物種類拡張
3. [ ] 高度なUI効果
4. [ ] 音声認識機能

---

## 📊 進捗管理

- **開始日**: 2025年6月17日
- **MVP目標完了日**: 2025年7月15日
- **フル機能完了目標**: 2025年8月31日

### 週次チェックポイント
- [ ] Week 1: 基盤構築完了
- [ ] Week 2: デプロイ環境構築
- [ ] Week 3: MVP基本機能実装
- [ ] Week 4: UI/UXエンハンス

---

## 🔗 参考リンク・リソース

### 技術ドキュメント
- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### Liquid Glass参考
- [gracefullight/liquid-glass](https://github.com/gracefullight/liquid-glass)
- [albedim/apple-web-liquid-glass-demo](https://github.com/albedim/apple-web-liquid-glass-demo)

### デプロイ
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/cli)

---

## 📝 メモ・課題

### 技術的検討事項
- [ ] Liquid Glass パフォーマンスへの影響調査
- [ ] React 19 最新機能の活用方法
- [ ] 植物成長ロジックのデータ永続化方法
- [ ] リアルタイム更新の必要性検討

### デザイン検討事項
- [ ] 時間帯別背景のデザイン詳細
- [ ] 植物ごとのガラス効果差別化
- [ ] モバイル対応でのLiquid Glass表現
- [ ] アクセシビリティとガラス効果の両立

---

*最終更新: 2025年6月17日*
