// import { defineStore } from 'pinia'
// import { useUserStore } from './user'
// import axios from '../plugins/axios'

// const $axios = axios().provide.axios

// export const useGeneralStore = defineStore('general', {
//   state: () => ({
//     isLoginOpen: false,
//     isEditProfileOpen: false,
//     selectedPost: null,
//     ids: null,
//     isBackUrl: "/",
//     posts: null,
//     suggested: null,
//     following: null,
//   }),
//   actions: {
//     bodySwitch(val) {
//       if (val) {
//         document.body.style.overflow = 'hidden'
//         return
//       }
//       document.body.style.overflow = 'visible'
//     },

//     allLowerCaseNoCaps(str) {
//       if (!str || typeof str !== 'string') return ''
//       return str.split(' ').join('-').toLowerCase()
//     },


//     setBackUrl(url) {
//       this.isBackUrl = url
//     },

//     async hasSessionExpired() {
//       await $axios.interceptors.response.use((response) => {
//         // Call was successful, continue.
//         return response;
//       }, (error) => {
//         switch (error.response.status) {
//           case 401: // Not logged in
//           case 419: // Session expired
//           case 503: // Down for maintenance
//             // Bounce the user to the login screen with a redirect back
//             useUserStore().resetUser()
//             window.location.href = '/';
//             break;
//           case 500:
//             alert('Oops, something went wrong!  The team has been notified.');
//             break;
//           default:
//             // Allow individual requests to handle other errors
//             return Promise.reject(error);
//         }
//       });
//     },

//     async getPostById(id) {
//       let res = await $axios.get(`/api/posts/${id}`)

//       this.$state.selectedPost = res.data.post[0]
//       this.$state.ids = res.data.ids
//     },

//     async getRandomUsers(type) {
//       // let res = await $axios.get(`/api/get-random-users`)
//       let res = await $axios.get(`/api/getrandomusers/`)

//       if (type === 'suggested') {
//         this.suggested = res.data.suggested
//       }

//       if (type === 'following') {
//         this.following = res.data.following
//       }
//     },

//     updateSideMenuImage(array, user) {
//       for (let i = 0; i < array.length; i++) {
//         const res = array[i];
//         if (res.id == user.id) {
//           res.image = user.image
//         }
//       }
//     },

//     async getAllUsersAndPosts() {
//       let res = await $axios.get('/api/home/')
//       this.posts = res.data
//     }
//   },
//   persist: true,
// })

import { defineStore } from 'pinia'
import { useUserStore } from './user'
import axios from '../plugins/axios'
import { ref } from 'vue'

const $axios = axios().provide.axios

export const useGeneralStore = defineStore('general', () => {
  const isLoginOpen = ref(false)
  const isEditProfileOpen = ref(false)
  const selectedPost = ref(null)
  const ids = ref(null)
  const isBackUrl = ref('/')
  const posts = ref(null)
  const suggested = ref(null)
  const following = ref(null)

  function bodySwitch(val) {
    document.body.style.overflow = val ? 'hidden' : 'visible'
  }

  function allLowerCaseNoCaps(str) {
    if (!str || typeof str !== 'string') return ''
    return str.split(' ').join('-').toLowerCase()
  }

  function setBackUrl(url) {
    isBackUrl.value = url
  }

  async function hasSessionExpired() {
    $axios.interceptors.response.use(
      (response) => response,
      (error) => {
        switch (error.response.status) {
          case 401:
          case 419:
          case 503:
            useUserStore().resetUser()
            window.location.href = '/'
            break
          case 500:
            alert('Oops, something went wrong! The team has been notified.')
            break
          default:
            return Promise.reject(error)
        }
      }
    )
  }

  async function getPostById(id) {
    const res = await $axios.get(`/api/posts/${id}`)
    selectedPost.value = res.data.post[0]
    ids.value = res.data.ids
  }

  async function getRandomUsers(type) {
    const res = await $axios.get('/api/getrandomusers/')
    if (type === 'suggested') suggested.value = res.data.suggested
    if (type === 'following') following.value = res.data.following
  }

  function updateSideMenuImage(array, user) {
    array.forEach((res) => {
      if (res.id === user.id) res.image = user.image
    })
  }

  async function getAllUsersAndPosts() {
    const res = await $axios.get('/api/home/')
    posts.value = res.data
  }

  return {
    isLoginOpen,
    isEditProfileOpen,
    selectedPost,
    ids,
    isBackUrl,
    posts,
    suggested,
    following,
    bodySwitch,
    allLowerCaseNoCaps,
    setBackUrl,
    hasSessionExpired,
    getPostById,
    getRandomUsers,
    updateSideMenuImage,
    getAllUsersAndPosts,
  }
}, {
  persist: true,
})
