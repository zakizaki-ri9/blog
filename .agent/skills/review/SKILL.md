---
name: review
description: コード品質とガイドラインのレビューを実行するスキル
---

# Review Skill

このスキルは、プロジェクトのコーディングガイドラインに基づき、自動チェックと手動レビューのポイントを提示します。

## 1. 自動チェックの実行

まず、以下のコマンドを実行してコードの品質を機械的に検証します。

// turbo
1. Lintチェックを実行
```bash
pnpm lint
```

// turbo
2. 型チェックを実行
```bash
pnpm type-check
```

// turbo
3. セキュリティチェックを実行
```bash
pnpm security-check
```

## 2. 手動レビュー項目

自動チェックが通過したら、以下のドキュメントを参照して手動レビューを行ってください。

> [!IMPORTANT]
> **必ず日本語で**思考・回答・記述してください。

### ガイドライン参照
- [コーディングガイドライン](../../../docs/coding-guidelines/README.md)
- [アーキテクチャ設計](../../../docs/coding-guidelines/architecture.md)
- [Astro/TypeScript](../../../docs/coding-guidelines/astro-typescript.md)
- [セキュリティ](../../../docs/coding-guidelines/security.md)
- [コード品質](../../../docs/coding-guidelines/code-quality.md)

### チェックリスト

**アーキテクチャ**
- [ ] 依存逆転（DIP）は守られているか？
- [ ] ビジネスロジックはフレームワークから独立しているか？
- [ ] 副作用（I/O）はアダプタに隔離されているか？

**Astro/TypeScript**
- [ ] `strict: true` 準拠の型定義か？ `any` は排除されているか？
- [ ] Astroコンポーネントのサーバー/クライアント境界は適切か？
- [ ] 画像やフォントは最適化されているか？

**セキュリティ**
- [ ] XSS対策（ユーザー入力のサニタイズ）は完全か？
- [ ] 機密情報がコードに含まれていないか？

**コード品質**
- [ ] 命名は適切で、日本語コメントは十分か？
- [ ] DRY原則は守られているか？
- [ ] エラーハンドリングは適切か？

## 完了

全ての問題が解決され、チェックリストが埋まったら、次のステップ（branch作成やcommit）へ進んでください。
