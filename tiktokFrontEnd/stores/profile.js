
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
