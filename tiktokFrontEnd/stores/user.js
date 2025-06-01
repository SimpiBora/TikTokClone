// import { defineStore } from 'pinia'
// import axios from '../plugins/axios'
// import { useGeneralStore } from './general'
// import { useLoggedInUser } from '../composables/loggedinuser'

// const getLoggedIntUser = useLoggedInUser()

// const $axios = axios().provide.axios

// export const useUserStore = defineStore('user', {
//   state: () => ({
//     id: '',
//     username: '',
//     bio: '',
//     image: ''
//   }),
//   actions: {

//     async getTokens() {
//       await $axios.get('/api/csrftoken/')
//     },

//     async login(email, password) {
//       await $axios.post('/api/login/', {
//         email: email,
//         password: password
//       })
//       console.log('user store login called');
//     },

//     async register(username, email, password, confirmPassword) {
//       await $axios.post('/api/registeruser/', {
//         username: username,
//         email: email,
//         password: password,
//         password_confirmation: confirmPassword
//       })
//     },

//     async getUser() {
//       try {
//         const res = await $axios.post('/api/loggedinuser/', {
//           method: 'POST',
//           credentials: 'include', // Ensure cookies are sent
//           headers: {
//             'X-CSRFToken': useCookie('token').value || '', // fallback for SSR
//           },
//         })

//         user.value = res
//       } catch (err) {
//         console.error('❌ Failed to fetch user:', err)
//         user.value = null
//       }
//     },

//     async updateUserImage(data) {
//       return await $axios.post('/api/update-user-image', data)
//     },

//     async updateUser(username, bio) {
//       return await $axios.patch('/api/update-user', {
//         username: username,
//         bio: bio
//       })
//     },

//     async createPost(data) {
//       return await $axios.post('/api/posts', data)
//     },

//     async deletePost(post) {
//       return await $axios.delete(`/api/posts/${post.id}`)
//     },

//     async addComment(post, comment) {
//       let res = await $axios.post('/api/comments', {
//         post_id: post.id,
//         comment: comment
//       })

//       if (res.status === 200) {
//         await this.updateComments(post)
//       }
//     },

//     async deleteComment(post, commentId) {
//       let res = await $axios.delete(`/api/comments/${commentId}`, {
//         post_id: post.id
//       })

//       if (res.status === 200) {
//         await this.updateComments(post)
//       }
//     },

//     async updateComments(post) {
//       let res = await $axios.get(`/api/profiles/${post.user.id}`)

//       for (let i = 0; i < res.data.posts.length; i++) {
//         const updatePost = res.data.posts[i];

//         if (post.id == updatePost.id) {
//           useGeneralStore().selectedPost.comments = updatePost.comments
//         }
//       }
//     },

//     async likePost(post, isPostPage) {
//       let res = await $axios.post('/api/likes', {
//         post_id: post.id,
//       })

//       console.log(res)

//       let singlePost = null

//       if (isPostPage) {
//         singlePost = post
//       } else {
//         singlePost = useGeneralStore().posts.find(p => p.id === post.id)
//       }
//       console.log(singlePost)
//       singlePost.likes.push(res.data.like)
//     },

//     async unlikePost(post, isPostPage) {
//       let deleteLike = null
//       let singlePost = null

//       if (isPostPage) {
//         singlePost = post
//       } else {
//         singlePost = useGeneralStore().posts.find(p => p.id === post.id)
//       }

//       singlePost.likes.forEach(like => {
//         if (like.user_id === this.id) { deleteLike = like }
//       });

//       let res = await $axios.delete('/api/likes/' + deleteLike.id)

//       for (let i = 0; i < singlePost.likes.length; i++) {
//         const like = singlePost.likes[i];
//         if (like.id === res.data.like.id) { singlePost.likes.splice(i, 1); }
//       }
//     },

//     async logout() {
//       await $axios.post('/logout')
//       this.resetUser()
//     },

//     resetUser() {
//       this.$state.id = ''
//       this.$state.username = ''
//       this.$state.email = ''
//       this.$state.bio = ''
//       this.$state.image = ''
//     }

//   },
//   persist: true,
// })


import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { useGeneralStore } from './general'
import { useLoggedInUser } from '../composables/loggedinuser'

const $axios = axios().provide.axios

export const useUserStore = defineStore('user', () => {
  // State
  const id = ref('')
  const username = ref('')
  const bio = ref('')
  const image = ref('')
  const email = ref('') // added because it’s used in `resetUser`

  // Actions

  async function getTokens() {
    await $axios.get('/api/csrftoken/')
  }

  async function login(userEmail, password) {
    await $axios.post('/api/login/', {
      email: userEmail,
      password: password,
    })
    console.log('user store login called')
  }

  async function register(userName, userEmail, password, confirmPassword) {
    await $axios.post('/api/registeruser/', {
      username: userName,
      email: userEmail,
      password: password,
      password_confirmation: confirmPassword,
    })
  }

  async function getUser() {
    try {
      const res = await $axios.post('/api/loggedinuser/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': useCookie('token').value || '',
        },
      })

      id.value = res.data.id
      username.value = res.data.username
      bio.value = res.data.bio
      image.value = res.data.image
      email.value = res.data.email
      console.log('returning ', res.data);
      return res.data
    } catch (err) {
      console.error('❌ Failed to fetch user:', err)
    }
  }

  async function updateUserImage(data) {
    return await $axios.post('/api/update-user-image', data)
  }

  async function updateUser(userName, userBio) {
    return await $axios.patch('/api/update-user', {
      username: userName,
      bio: userBio,
    })
  }

  async function createPost(data) {
    return await $axios.post('/api/posts', data)
  }

  async function deletePost(post) {
    return await $axios.delete(`/api/posts/${post.id}`)
  }

  async function addComment(post, comment) {
    const res = await $axios.post('/api/comments', {
      post_id: post.id,
      comment,
    })

    if (res.status === 200) {
      await updateComments(post)
    }
  }

  async function deleteComment(post, commentId) {
    const res = await $axios.delete(`/api/comments/${commentId}`, {
      post_id: post.id,
    })

    if (res.status === 200) {
      await updateComments(post)
    }
  }

  async function updateComments(post) {
    const generalStore = useGeneralStore()
    const res = await $axios.get(`/api/profiles/${post.user.id}`)

    for (let updatedPost of res.data.posts) {
      if (post.id === updatedPost.id) {
        generalStore.selectedPost.comments = updatedPost.comments
      }
    }
  }

  async function likePost(post, isPostPage) {
    const generalStore = useGeneralStore()

    const res = await $axios.post('/api/likes', {
      post_id: post.id,
    })

    const singlePost = isPostPage ? post : generalStore.posts.find(p => p.id === post.id)
    singlePost?.likes?.push(res.data.like)
  }

  async function unlikePost(post, isPostPage) {
    const generalStore = useGeneralStore()

    const singlePost = isPostPage ? post : generalStore.posts.find(p => p.id === post.id)

    const deleteLike = singlePost.likes.find(like => like.user_id === id.value)

    const res = await $axios.delete(`/api/likes/${deleteLike.id}`)

    const index = singlePost.likes.findIndex(like => like.id === res.data.like.id)
    if (index !== -1) {
      singlePost.likes.splice(index, 1)
    }
  }

  async function logout() {
    await $axios.post('/logout')
    resetUser()
  }

  function resetUser() {
    id.value = ''
    username.value = ''
    email.value = ''
    bio.value = ''
    image.value = ''
  }

  return {
    id,
    username,
    bio,
    image,
    email,
    // methods from here
    getTokens,
    login,
    register,
    getUser,
    updateUserImage,
    updateUser,
    createPost,
    deletePost,
    addComment,
    deleteComment,
    updateComments,
    likePost,
    unlikePost,
    logout,
    resetUser,
  }
}, {
  persist: true,
  // pinia persist for persist credentials
})
