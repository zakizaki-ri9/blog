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

## 概要

- lookup や mongoose populate を頻繁に行う場合、embedding の考えに従ってネストした方がよい
  - やりすぎると逆にパフォーマンスが落ちるため、要検討
  - 例）ページ情報を1ドキュメントにまとめると肥大化する可能性が高いが、商品＋在庫情報は1ドキュメントにネストしてもよさそう
- 全文検索のパフォーマンス改善を行う場合、Atlas Search 等を検討する
- 基本 lean を利用してパフォーマンス向上を図る（save 等を行わない場合）

### MongoDB系メモ

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
- [mongooseのleanで、クエリを高速化する(Zenn)](https://zenn.dev/nakaakist/scraps/ca8ec2219feb83)
  - [Faster Mongoose Queries With Lean](https://mongoosejs.com/docs/tutorials/lean.html)
    - `lean` を利用することで、Mongoose の `Document` クラスに追加されるメソッド等がなくなる（単純な JSON になる）
    - `virtuals`, `save()` などを利用しない場合、`lean` を利用するとパフォーマンス向上につながる

### RDB 系

ついでに気になって読んだスライド

- [PostgreSQL🐘と 比較しながら選ぶデータベース](https://speakerdeck.com/soudai/select-database-usecase)
- [Webアプリケーションのパフォーマンス・チューニングの勘所](https://speakerdeck.com/soudai/web-tuningperformance)

# ECS 系

GPT に相談一部抜粋

> タスクAに cpu=1024 （1vCPU）、タスクBに cpu=512 （0.5vCPU）を割り当てた場合、タスクAが1vCPUをすべて使用している間、タスクBが同じCPUを超えて使用することはできません。その結果、タスクBはパフォーマンスが低下します。タスクBがリソースを確保できなければ、その負荷はタスクAに偏り、全体的なリソース不足が生じる可能性があります。

ハードリミット、ソフトリミットを確認してみた方がよいかも

- CPU 系のことメモ
  - [Amazon ECS のタスクにメモリを割り当てるにはどうすればよいですか?](https://repost.aws/ja/knowledge-center/allocate-ecs-memory-tasks)
  - [詳解: Amazon ECS による CPU とメモリのリソース管理](https://aws.amazon.com/jp/blogs/news/how-amazon-ecs-manages-cpu-and-memory-resources/)
  - [ECSタスクのCPUとメモリをチューニングする](https://akng-engineer.hatenablog.com/entry/2020/03/03/231142)
- 
