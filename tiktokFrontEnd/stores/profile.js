// // import { defineStore } from 'pinia'
// // import axios from '../plugins/axios'

// // const $axios = axios().provide.axios

// // export const useProfileStore = defineStore('profile', {
// //   state: () => ({
// //     id: '',
// //     name: '',
// //     bio: '',
// //     image: '',
// //     post: null,
// //     posts: null,
// //     allLikes: 0,
// //   }),
// //   actions: {
// //     async getProfile(id) {
// //       this.resetUser()
// //       let res = await $axios.get(`/api/profile/${id}/`)
// //       console.log('response data ---> ', res.data)


// //       this.$state.id = res.data.user[0].id
// //       this.$state.name = res.data.user[0].name
// //       this.$state.bio = res.data.user[0].bio
// //       this.$state.image = res.data.user[0].image

// //       this.$state.posts = res.data.posts

// //       this.allLikesCount()
// //     },




// //     allLikesCount() {
// //       this.allLikes = 0
// //       for (let i = 0; i < this.posts.length; i++) {
// //         const post = this.posts[i];
// //         for (let j = 0; j < post.likes.length; j++) {
// //           this.allLikes++
// //         }
// //       }
// //     },

// //     resetUser() {
// //       this.$state.id = ''
// //       this.$state.name = ''
// //       this.$state.bio = ''
// //       this.$state.image = ''
// //       this.$state.posts = ''
// //     }
// //   },
// //   persist: true,
// // })

// import { defineStore } from 'pinia'
// import axios from '../plugins/axios'

// const $axios = axios().provide.axios

// export const useProfileStore = defineStore('profile', {
//   state: () => ({
//     id: '',
//     name: '',
//     bio: '',
//     image: '',
//     post: null,
//     posts: [],
//     allLikes: 0,
//   }),
//   actions: {
//     async getProfile(id) {
//       // this.resetUser()

//       try {
//         const res = await $axios.get(`/api/profile/${id}/`)
//         console.log('✅ Profile response:', res.data)

//         const user = res.data.user

//         if (!user) {
//           console.warn('⚠️ No user object returned from API')
//           return
//         } else {
//           console.log('object user ---> ', user)
//         }

//         this.$state.id = user.id || ''
//         this.$state.name = user.name || user.username || ''
//         this.$state.bio = user.bio || ''
//         this.$state.image = user.image || ''
//         this.$state.posts = res.data.posts || []

//         this.allLikesCount()

//       } catch (error) {
//         console.error('❌ Failed to fetch profile:', error)
//       }
//     },

//     allLikesCount() {
//       this.allLikes = 0
//       for (let post of this.posts) {
//         if (Array.isArray(post.likes)) {
//           this.allLikes += post.likes.length
//         }
//       }
//     },

//     // resetUser() {
//     //   this.$state.id = ''
//     //   this.$state.name = ''
//     //   this.$state.bio = ''
//     //   this.$state.image = ''
//     //   this.$state.posts = []
//     // }
//   },
//   persist: true,
// })

import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { ref } from 'vue'

const $axios = axios().provide.axios

export const useProfileStore = defineStore('profile', () => {
  const id = ref('')
  const name = ref('')
  const bio = ref('')
  const image = ref('')
  const post = ref(null)
  const posts = ref([])
  const allLikes = ref(0)

  // async function getProfile(userId) {
  //   try {
  //     const res = await $axios.get(`/api/profile/${userId}/`)
  //     console.log('✅ Profile response:', res.data)

  //     const user = res.data.user

  //     if (!user) {
  //       console.warn('⚠️ No user object returned from API')
  //       return
  //     } else {
  //       console.log('object user ---> ', user)
  //     }

  //     id.value = user.id || ''
  //     name.value = user.name || user.username || ''
  //     bio.value = user.bio || ''
  //     image.value = user.image || ''
  //     posts.value = res.data.posts || []

  //     allLikesCount()

  //   } catch (error) {
  //     console.error('❌ Failed to fetch profile:', error)
  //   }
  // }
  async function getProfile(userId) {
    try {
      const res = await $axios.get(`/api/profile/${userId}/`)
      console.log('✅ Profile response:', res.data)

      const { user, posts: userPosts } = res.data

      if (!user) {
        console.warn('⚠️ No user object returned from API')
        return
      }

      id.value = user.id || ''
      name.value = user.name || user.username || ''
      bio.value = user.bio || ''
      image.value = user.image || ''
      posts.value = userPosts || []

      allLikesCount()

      return { user, posts: userPosts }

    } catch (error) {
      console.error('❌ Failed to fetch profile:', error)
      return null
    }
  }

  function allLikesCount() {
    allLikes.value = 0
    for (const postItem of posts.value) {
      if (Array.isArray(postItem.likes)) {
        allLikes.value += postItem.likes.length
      }
    }
  }

  function reset() {
    id.value = ''
    name.value = ''
    bio.value = ''
    image.value = ''
    post.value = null
    posts.value = []
    allLikes.value = 0
  }

  return {
    id,
    name,
    bio,
    image,
    post,
    posts,
    allLikes,
    getProfile,
    allLikesCount,
    reset,
  }
}, {
  persist: true,
})
