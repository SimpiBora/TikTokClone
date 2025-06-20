// stores/loadMore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'

export const useFeedStore = defineStore('feed', () => {
  const posts = ref([])
  const loading = ref(false)
  const page = ref(1)
  const pageSize = ref(10)
  const hasMore = ref(true)

  const { $axios } = useNuxtApp()

  const fetchPosts = async () => {
    if (loading.value || !hasMore.value) return

    loading.value = true
    try {
      const { data } = await $axios.get('/api/feed/', {
        params: { page: page.value, page_size: pageSize.value },
      })
      if (data.results.length > 0) {
        posts.value.push(...data.results)
        page.value += 1
      } else {
        hasMore.value = false
      }
    } catch (e) {
      console.error('Fetch failed', e)
    } finally {
      loading.value = false
    }
  }

  const resetFeed = () => {
    posts.value = []
    page.value = 1
    hasMore.value = true
  }

  return {
    posts,
    loading,
    hasMore,
    fetchPosts,
    resetFeed,
  }
})
