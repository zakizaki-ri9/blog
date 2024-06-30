// import { Feed } from "feed"
// import { serverQueryContent } from "#content/server"

// const host = "https://example.com"

// export default defineEventHandler(async (event) => {
//   const feed = new Feed({
//     title: "Feed title",
//     description: "Feed of recent posts",
//     id: host,
//     link: host,
//     copyright: "John Doe",
//   })

//   const docs = await serverQueryContent(event, "posts")
//     .sort({ date: -1 })
//     .limit(10)
//     .find()

//   docs.forEach((doc) => {
//     const url = `${host}${doc._path}/`
//     feed.addItem({
//       title: doc.title!,
//       id: url,
//       link: url,
//       description: doc.description,
//       date: new Date(Date.parse(doc.date)),
//     })
//   })

//   return feed.rss2()
// })
