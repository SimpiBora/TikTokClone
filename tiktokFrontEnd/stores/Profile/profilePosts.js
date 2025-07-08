// // stores/Profile/profilePosts.js
// import { defineStore } from 'pinia'
// import { useNuxtApp } from '#app'
// import { createCursorStore } from '~/stores/utils/cursorStoreFactory'
// import { computed } from 'vue'

// export const useProfilePostsStore = defineStore('profilePosts', () => {
//     const { $axios } = useNuxtApp()
//     let userId = null

//     const store = createCursorStore({
//         name: 'profilePosts',
//         fetchFn: (cursor) =>
//             $axios.get(`/api/profile/${userId}/posts/`, {
//                 params: { cursor, page_size: 9 },
//             }),
//     })()

//     const loadProfilePosts = async (newUserId) => {
//         userId = newUserId
//         store.reset()
//         await store.fetchItems()
//     }

//     const allLikes = computed(() =>
//         store.items.value.reduce((sum, post) =>
//             sum + (Array.isArray(post.likes) ? post.likes.length : 0), 0
//         )
//     )

//     return {
//         ...store,
//         loadProfilePosts,
//         allLikes
//     }
// })


// stores/Profile/profilePosts.js
import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { createCursorStore } from '~/stores/utils/cursorStoreFactory'
import { computed } from 'vue'

export const useProfilePostsStore = defineStore('profilePosts', () => {
    const { $axios } = useNuxtApp()
    let userId = null

    const store = createCursorStore({
        name: 'profilePosts',
        fetchFn: (cursor) =>
            $axios.get(`/api/profile/${userId}/posts/`, {
                params: { cursor, page_size: 9 },
            }),
    })()

    const loadProfilePosts = async (newUserId) => {
        userId = newUserId
        store.reset()
        await store.fetchItems()
    }

    // const allLikes = computed(() =>
    //     store.items.value.reduce((sum, post) =>
    //         sum + (Array.isArray(post.likes) ? post.likes.length : 0), 0
    //     )
    // )

    return {
        ...store,
        loadProfilePosts,
        // allLikes
    }
})
