---
name: browser-reader
description: WebFetch で取得できない SPA・JSレンダ必須・認証後ページを Playwright CLI で読み取る。WebFetch が空・薄い・403 のとき、動的ドキュメント、ダッシュボード UI の調査時に使用。静的 HTML や Context7 で足りる公式 docs には使わない。
allowed-tools: Read, Write, Grep, Glob, Bash(which:*), Bash(playwright-cli:*), Bash(npm install -g @playwright/cli*), WebFetch
---

# ブラウザ取得スキル（/browser-reader）

目的: WebFetch では取れない動的ページを **Playwright CLI** で取得し、必要なテキストのみ context に載せる。

## 優先順位（重要）

- [research](../research/SKILL.md) が **先に WebFetch を試した後** のエスカレーションとして使う
- Context7 / 静的 WebFetch で足りる公式 docs には使わない
- **Playwright MCP は使わない**（CLI の方がトークン効率が良い）
- 本リポジトリの E2E は `@playwright/test` を使用するが、**調査用ブラウザ取得は Playwright CLI** を使う

## 適用場面

- WebFetch の結果が空・極端に短い
- SPA（React/Vue/Angular 等）でクライアントレンダ必須
- 認証後・操作後にしか見えない UI（ユーザー指定時）
- WebFetch が 403 等で失敗しブラウザ文脈が必要

## 適用しない場面

- 静的 HTML・SSR・多くの公式 docs
- Context7 / llms.txt で取得できる API リファレンス
- 公開 API の JSON エンドポイント

## 前提チェック（初回のみ）

```bash
which playwright-cli
```

- **インストール済み** → 「手順」へ進む
- **未インストール** → 開発者に承認を求める:
  - 「動的ページ取得のため `@playwright/cli` のインストールが必要です」
  - `npm install -g @playwright/cli@latest`
  - 必要に応じて `playwright-cli install --skills`
- **承認されない場合** → WebSearch で代替し、「ブラウザ未取得のため精度に限界あり」と明記

## 手順

1. **WebFetch を既に試したことを確認**（research からの委譲を想定）
2. **ページを開く**
   ```bash
   playwright-cli open "<url>"
   ```
3. **スナップショット取得**（YAML はディスクに保存、全文をチャットに流さない）
   ```bash
   playwright-cli snapshot
   ```
4. **必要テキストのみ Read**
   - スナップショット YAML のパスを Read し、調査に必要な箇所だけ抽出する
   - または `playwright-cli eval "document.body.innerText"` でテキストのみ取得（長い場合は要約してから context に）
5. **終了**
   ```bash
   playwright-cli close
   ```

## トークン効率の原則

- スナップショット全文を会話に貼らない
- screenshot は必要時のみ（画像全文読みは避ける）
- 1 URL あたり取得→抽出→`close` をセットで行う

## フォールバック

playwright-cli が使えない場合:

- WebSearch の結果のみで整理する
- 「**ブラウザレンダ未確認のため精度に限界あり**」と明記する

## 保存ルール

- [research](../research/SKILL.md) と併用時: `docs/research/YYYYMMDD_{title}/README.md` に統合する
- 取得方法として「Playwright CLI（ブラウザレンダ）」と取得日時を記載する
