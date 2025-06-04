
import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { useGeneralStore } from './general'

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

  // async function getUser() {
  //   try {
  //     const res = await $axios.post('/api/loggedinuser/', {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: {
  //         'X-CSRFToken': useCookie('token').value || '',
  //       },
  //     })

  //     id.value = res.data.id
  //     username.value = res.data.username
  //     bio.value = res.data.bio
  //     image.value = res.data.image
  //     email.value = res.data.email
  //     console.log('returning ', res.data);
  //     return res.data
  //   } catch (err) {
  //     console.error('❌ Failed to fetch user:', err)
  //   }
  // }

  // async function getUser() {
  //   try {
  //     const res = await $axios.post('/api/loggedinuser/', {}, {
  //       withCredentials: true,
  //       headers: {
  //         'X-CSRFToken': csrfToken,
  //       },
  //     })

  //     console.log('🔁 Full response:', res)
  //     console.log('📦 Returned data:', res.data)

  //   } catch (err) {
  //     console.error('❌ Error fetching user:', err.response?.data || err.message)
  //   }

  // }

  async function getUser() {
    // Get the CSRF token from the cookie
    let csrfToken = useCookie('csrftoken').value

    if (!csrfToken) {
      console.warn('⚠️ CSRF token not found. Attempting to fetch tokens...')
      const tokenResult = await $userStore.getTokens()  // Ensure you have this method implemented
      csrfToken = useCookie('csrftoken').value

      if (!csrfToken) {
        console.error('❌ Still no CSRF token after trying to fetch')
        return null
      }
    } else {
      console.log('✅ CSRF token already available:', csrfToken)
    }

    try {
      const res = await $axios.post('/api/loggedinuser/', {}, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      })

      console.log('🔁 Full response:', res)
      console.log('📦 Returned data:', res.data)
      return res.data

    } catch (err) {
      console.error('❌ Error fetching user:', err.response?.data || err.message)
      return null
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
