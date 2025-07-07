
// import { defineStore } from 'pinia'
// import axios from '../plugins/axios'
// import { ref } from 'vue'


// const $axios = axios().provide.axios

// export const useProfileStore = defineStore('profile', () => {
//   const id = ref('')
//   const name = ref('')
//   const username = ref('')
//   // username is not used in the store, but kept for potential future use
//   const bio = ref('')
//   const image = ref('')
//   const post = ref(null)
//   const posts = ref([])
//   const allLikes = ref(0)


//   async function getProfile(userId) {

//     try {
//       const res = await $axios.get(`/api/profile/${userId}/`)
//       console.log('✅ Profile response:', res.data)

//       const { user, posts: userPosts } = res.data

//       if (!user) {
//         console.warn('⚠️ No user object returned from profile ID: 1 API')
//         return
//       }

//       id.value = user.id || ''
//       name.value = user.name || user.username || ''
//       username.value = user.username || ''
//       // username is not used in the store, but kept for potential future use
//       bio.value = user.bio || ''
//       image.value = user.image || ''
//       posts.value = userPosts || []

//       allLikesCount()

//       return { user, posts: userPosts }

//     } catch (error) {
//       console.error('❌ Failed to fetch profile:', error)
//       return null
//     }
//   }

//   function allLikesCount() {
//     allLikes.value = 0
//     for (const postItem of posts.value) {
//       if (Array.isArray(postItem.likes)) {
//         allLikes.value += postItem.likes.length
//       }
//     }
//   }

//   function reset() {
//     id.value = ''
//     name.value = ''
//     username.value = ''
//     // username is not used in the store, but kept for potential future use
//     bio.value = ''
//     image.value = ''
//     post.value = null
//     posts.value = []
//     allLikes.value = 0
//   }

//   return {
//     id,
//     name,
//     username,
//     bio,
//     image,
//     post,
//     posts,
//     allLikes,
//     getProfile,
//     allLikesCount,
//     reset,
//   }
// }, {
//   persist: true,
// })



// stores/profile.js
import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { ref, computed } from 'vue' // 👈 make sure computed is imported

const $axios = axios().provide.axios

export const useProfileStore = defineStore('profile', () => {
  const id = ref('')
  const name = ref('')
  const username = ref('')
  const bio = ref('')
  const image = ref('')
  const post = ref(null)
  const posts = ref([])

  // ✅ Automatically computed from posts
  const allLikes = computed(() => {
    return posts.value.reduce((total, post) => {
      return total + (Array.isArray(post.likes) ? post.likes.length : 0)
    }, 0)
  })

  async function getProfile(userId) {
    try {
      const res = await $axios.get(`/api/profile/${userId}/`)
      console.log('✅ Profile response:', res.data)

      const { user, posts: userPosts } = res.data

      if (!user) {
        console.warn('⚠️ No user object returned from profile API')
        return
      }

      id.value = user.id || ''
      name.value = user.name || user.username || ''
      username.value = user.username || ''
      bio.value = user.bio || ''
      image.value = user.image || ''
      posts.value = userPosts || []

      return { user, posts: userPosts }

    } catch (error) {
      console.error('❌ Failed to fetch profile:', error)
      return null
    }
  }

  function reset() {
    id.value = ''
    name.value = ''
    username.value = ''
    bio.value = ''
    image.value = ''
    post.value = null
    posts.value = []
    // ❌ you don't need to reset allLikes anymore — it's computed
  }

  return {
    id,
    name,
    username,
    bio,
    image,
    post,
    posts,
    allLikes, // ✅ include computed in the returned object
    getProfile,
    reset,
  }
}, {
  persist: true,
})
