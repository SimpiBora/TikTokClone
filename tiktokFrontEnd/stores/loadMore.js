

// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { useNuxtApp } from '#app'

// export const useFeedStore = defineStore('feed', () => {
//   const posts = ref([])
//   const loading = ref(false)
//   const nextCursor = ref(null)
//   const hasMore = ref(true)

//   const { $axios } = useNuxtApp()

//   const fetchPosts = async () => {
//     if (loading.value || !hasMore.value) return

//     loading.value = true
//     try {
//       const response = await $axios.get('/api/home/', {
//         params: {
//           cursor: nextCursor.value,
//           page_size: 10
//         }
//       })

//       const data = response.data
//       posts.value.push(...data.results)

//       // ✅ SAFE URL PARSING
//       if (data.next) {
//         const nextUrl = new URL(data.next)
//         nextCursor.value = nextUrl.searchParams.get('cursor')
//       } else {
//         nextCursor.value = null
//       }

//       hasMore.value = !!data.next

//     } catch (error) {
//       console.error('Failed to fetch posts:', error)
//     } finally {
//       loading.value = false
//     }
//   }

//   const resetFeed = () => {
//     posts.value = []
//     nextCursor.value = null
//     hasMore.value = true
//   }

//   return {
//     posts,
//     loading,
//     hasMore,
//     fetchPosts,
//     resetFeed
//   }
// })


// stores/loadMore.js
import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { createCursorStore } from '~/stores/utils/cursorStoreFactory'
// stores/utils/cursorStoreFactory.js
// This store uses the cursorStoreFactory to create a feed store that handles pagination
export const useFeedStore = defineStore('feed', () => {
  const { $axios } = useNuxtApp()
  const store = createCursorStore({
    name: 'feed',
    fetchFn: (cursor) =>
      $axios.get('/api/home/', {
        params: { cursor, page_size: 10 },
      }),
  })() // <-- Don't forget to call it

  return store
})

