---
postedAt: 2024-09-08 18:00
title: 2024-09-08 TIL
description: 本日のメモ
image:
tags:
  - TIL
---

# MongoDBについて調べたことメモ

MongoDBのクエリパフォーマンス向上するために、ざっくり知識をつけたい。
次のメモ等を中心に、公式ドキュメント等にたどり着いて情報収集した。

- [MongoDB データモデリングのベストプラクティス(Zenn)](https://zenn.dev/nakaakist/scraps/b6951cc42d4ecc)
- [MongoDBについて調査・検証しました](https://tech-blog.rakus.co.jp/entry/20211001/mongodb)
- [MongoDBを始めた頃に知っていたら、と思う14のこと](https://www.infoq.com/jp/articles/Starting-With-MongoDB/)

## MongoDB系

- [A Summary of Schema Design Anti-Patterns and How to Spot Them](https://www.mongodb.com/developer/products/mongodb/schema-design-anti-pattern-summary/)
  - Atlas の機能を利用することでアンチパターンの発見が可能
    - スキーマ設計、インデックスなど
- [Separating Data That is Accessed Together](https://www.mongodb.com/developer/products/mongodb/schema-design-anti-pattern-separating-data/)
  - embedding が基本
    - ドキュメント内に nest, array で埋め込むこと
    - lookup 等の余計なクエリ発行数が減り、単純にパフォーマンスが上がる
    - ただし、やりすぎて1ドキュメントのサイズが大きくなると、メモリ効率現象にともないパフォーマンス現象も発生する可能性あり
      - 公式ドキュメントでも、16MBの制限がかけられている
      - [BSON Document Size](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-BSON-Document-Size)
  - アクセスされるデータはソート済みであることが基本
- [Case-Insensitive Queries Without Case-Insensitive Indexes](https://www.mongodb.com/developer/products/mongodb/schema-design-anti-pattern-case-insensitive-query-index/)
  - `$regex` iオプション(大文字小文字区別なし)を指定すると、インデックスの完全利用ができない
  - Atlas が提供している Atlas Search (`$search`) だと、全文検索に特化している
    - 事例は少なめ？
      - [MongoDB Atlas Search のご紹介](https://speakerdeck.com/chie8842/mongodb-atlas-search-nogoshao-jie)
      - [MongoDB Atlasで全文検索を行う:基礎編 #MongoDB #NoSQL](https://www.creationline.com/tech-blog/data-management/mongodb/56353)

## RDB 系

- [PostgreSQL🐘と 比較しながら選ぶデータベース](https://speakerdeck.com/soudai/select-database-usecase)
- [Webアプリケーションのパフォーマンス・チューニングの勘所](https://speakerdeck.com/soudai/web-tuningperformance)
