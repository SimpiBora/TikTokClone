// stores/useSearchStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import debounce from 'lodash/debounce'

export const useSearchStore = defineStore('search', () => {
    const query = ref('')
    const results = ref([])
    const loading = ref(false)
    const searched = ref(false)
    const showDropdown = ref(false)
    const highlightedIndex = ref(-1)

    const { $axios } = useNuxtApp()

    const search = debounce(async (endpoint) => {
        const trimmed = query.value.trim()
        if (!trimmed) {
            results.value = []
            showDropdown.value = false
            return
        }

        loading.value = true
        searched.value = true
        showDropdown.value = true
        highlightedIndex.value = -1

        try {
            const res = await $axios.get(endpoint, { params: { q: trimmed } })
            results.value = res.data
        } catch (err) {
            console.error('Search error:', err)
            results.value = []
        } finally {
            loading.value = false
        }
    }, 300)

    const clearSearch = () => {
        query.value = ''
        results.value = []
        showDropdown.value = false
        searched.value = false
        highlightedIndex.value = -1
    }

    const moveDown = () => {
        if (!showDropdown.value || results.value.length === 0) return
        highlightedIndex.value = (highlightedIndex.value + 1) % results.value.length
    }

    const moveUp = () => {
        if (!showDropdown.value || results.value.length === 0) return
        highlightedIndex.value =
            (highlightedIndex.value - 1 + results.value.length) % results.value.length
    }

    return {
        query,
        results,
        loading,
        searched,
        showDropdown,
        highlightedIndex,
        search,
        clearSearch,
        moveDown,
        moveUp
    }
})
