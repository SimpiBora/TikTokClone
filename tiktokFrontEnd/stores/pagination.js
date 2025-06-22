// stores/pagination.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useVideosStore = defineStore('videos', () => {
    const videos = ref([])
    const loading = ref(false)
    const error = ref(null)
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const fetchVideos = async () => {
        loading.value = true
        try {
            const { data } = await axios.get('/api/videos/', {
                params: {
                    page: page.value,
                    page_size: pageSize.value,
                },
            })
            videos.value = data.results
            total.value = data.count
        } catch (err) {
            error.value = err
        } finally {
            loading.value = false
        }
    }

    const setPage = async (newPage: number) => {
        page.value = newPage
        await fetchVideos()
    }

    return {
        videos,
        loading,
        error,
        page,
        pageSize,
        total,
        fetchVideos,
        setPage,
    }
})
