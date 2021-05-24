---
postedAt: 2021-05-17
title: "@nuxtjs/composition-api コードリーディングメモ / useContext が実行される仕組み"
description: hogehoge
tags:
  - Vue.js
  - Nuxt.js
  - コードリーディング
---

`@nuxtjs/composition-api` の `useContext` を使う場合、次のように記述する。

```ts
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { params, $config } = useContext()
    // TODO: 必要な処理を記述
  },
})
```

`setup` の引数 `context` にも `useContext` と同等の値が代入されるが、`useContext` はどのようにして `context` を返しているのかが気になり、コードリーディングしてみた。

この記事は、そのときのメモ。

---

https://github.com/vuejs/composition-api/blob/73edb337899354e749696cfb78fbeda5e7d9bd11/src/mixin.ts#L30-L81
