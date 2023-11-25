---
postedAt: 2023-11-25 22:00
title: 2023-11-25 TIL
description: 本日のメモ
image:
tags:
  - TIL
---

# 仕事系

- Nuxt3 で Tailwind を導入する際、Scoped or CSS Module との相性を調べた
  - https://github.com/zakizaki-ri9/typescript-sandbox/tree/master/nuxt-css-scope-module
    - 結論、CSS Module の方がよさそう
      - Scoped だと Tailwind と競合する可能性あり（競合しない設計が必要）
        - `blocklist` とかで対処できそうだが、既存 css との競合を調べるのが大変そう
        - ref. https://tailwindcss.com/docs/content-configuration#discarding-classes
      - CSS Module だと競合しない
    - そもそも Scoped だと Tailwind に限らずグローバルなスタイルと組み合う形になるのでメンテナンスが大変
  - 記事にまとめる

# 雑記

- TIL, ブログもさぼってたけど、アドベントカレンダーやることになったからリハビリする
  - https://qiita.com/advent-calendar/2023/tential
- [龍が如く7外伝クリアした](https://x.com/zucky_sub/status/1723244737078124945?s=20)
- ストリートファイター6
  - ステップのときだけ十字キー、他操作はアナログスティックというやり方試して見たけど、アナログスティックの入力化けてしまってきつい
    - [【スト６・初中級者向け】モダン用のおすすめボタン配置と各コントローラーの違いを解説! ㊙入力方も公開!?](https://www.youtube.com/watch?v=5BO9mP6A8hI)
