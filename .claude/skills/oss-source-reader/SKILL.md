---
name: oss-source-reader
description: OSS ライブラリの内部実装をソースコードから調査する。型定義・関数シグネチャ・API契約の真偽確認時は WebSearch より優先。ghq クローン、scoped rg 検索、Read 精読、Serena シンボル調査で確認する。
allowed-tools: Read, Grep, Glob, Bash(which:*), Bash(ghq:*), Bash(rg:*), Bash(brew install ghq*), Bash(brew install ripgrep*), WebSearch
---

# OSS ソースコード調査スキル（/oss-source-reader）

目的: OSS の実装詳細（型定義・関数シグネチャ・内部ロジック）を **ソースコードから直接読む** ことで、ハルシネーション防止と精度向上を実現する。

## 優先順位（重要）

- 単独依頼でない限り、このスキルだけで工程を進めない
- **WebSearch/WebFetch より本スキルを優先する**（ソースコードが正確な情報源）

## 適用場面

- ライブラリの内部実装を理解したい（例: Astro のレンダリングフロー）
- 型定義・インターフェースを正確に把握したい（例: Playwright の API 型）
- バグの原因を OSS 側のコードで追いたい
- 特定バージョンの挙動を確認したい

## 適用しない場面

- ライブラリの概要・用途を知りたい → [research](../research/SKILL.md) の WebSearch
- 公式 API・設定 → Context7 MCP（[research](../research/SKILL.md) 経由）
- 既知の問題・バグ情報を探す（`gh` CLI での Issue 検索も活用）
- バージョン間の差分・マイグレーション情報

## 前提チェック（初回のみ）

```bash
which ghq
which rg
```

- **両方インストール済み** → 「調査手順」へ進む
- **未インストール** → 開発者に以下を提示して **承認を求める**（承認されるまでインストールを実行しない）:
  - 「OSS ソースの正確な調査のため ghq / ripgrep のインストールが必要です」
  - ghq 未インストール → `brew install ghq`
  - rg 未インストール → `brew install ripgrep`
- **承認されない場合** → 「フォールバック」へ進む

## 調査手順（Scout → Narrow → Read）

### Step 1: ソースをクローン

```bash
ghq get --shallow <repository_url>
```

**重要**: `<repository_url>` は **公開の HTTPS リポジトリ**（github.com / gitlab.com 等）に限定する。

### Step 2: Scout（候補を少量取得）

ghq クローン先で scoped 検索を実行する（生の巨大 `rg` 出力を context に流さない）:

```bash
.claude/skills/oss-source-reader/scripts/rg-scoped.sh "<検索文字列>" "$(ghq root)/<host>/<owner>/<repo>"
```

または同等の `rg`（`-m 50`、テスト・dist・node_modules 除外、`-F` でリテラル検索）。

**Serena MCP が利用可能な場合**（`user-serena` が接続済み）:

- `get_symbols_overview` でファイル構造を把握
- `find_symbol` で定義箇所のみ取得
- 全文 Read よりトークン効率が良いため、scoped rg より優先してよい

### Step 3: Narrow（2〜3 ファイルに絞る）

- Scout 結果から関連度の高いファイルを **最大 3 件** に限定する
- 関係の薄いマッチは捨てる

### Step 4: Read（該当範囲のみ精読）

- 特定されたファイルを Read ツールで精読する
- 可能なら関数・型定義周辺の行範囲のみ読む（ファイル全体を読まない）

## セキュリティ必須事項

- rg の対象パスは **必ず `$(ghq root)` のサブパス** とすること
- **ワークスペース内を rg / Grep / Glob で .env / secrets 等の機密情報を検索してはならない**
- Grep / Glob はスキルファイルの参照や ghq クローン先の補助検索にのみ使用する
- リテラル検索には `-F` オプションを使用する（ReDoS 防止）

## フォールバック

ghq / rg が使えない場合（承認なし・インストール不可）:

- WebSearch の結果のみで整理する
- 結果に「**ソースコード未確認のため精度に限界あり**」と必ず明記する

## 保存ルール

- [research](../research/SKILL.md) スキルと組み合わせて使用する場合: 調査結果は sibling `../private-memo/docs/research/` に統合する
- 単独で使用する場合: 結果を直接報告する
