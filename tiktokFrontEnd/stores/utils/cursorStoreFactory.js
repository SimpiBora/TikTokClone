// stores/utils/cursorStoreFactory.js
import { ref } from 'vue'

export function createCursorStore({ name, fetchFn }) {
    return () => {
        const items = ref([])
        const loading = ref(false)
        const nextCursor = ref(null)
        const hasMore = ref(true)

        const fetchItems = async () => {
            if (loading.value || !hasMore.value) return
            loading.value = true
            try {
                const response = await fetchFn(nextCursor.value)
                const data = response.data

                items.value.push(...data.results)

                if (data.next) {
                    const nextUrl = new URL(data.next, window.location.origin)
                    nextCursor.value = nextUrl.searchParams.get('cursor')
                } else {
                    nextCursor.value = null
                }

                hasMore.value = !!data.next
            } catch (err) {
                console.error(`[${name}] fetch failed:`, err)
            } finally {
                loading.value = false
            }
        }

        const reset = () => {
            items.value = []
            nextCursor.value = null
            hasMore.value = true
        }

        // return {
        //     items,
        //     loading,
        //     nextCursor,
        //     hasMore,
        //     fetchItems,
        //     reset,
        // }
        return {
            items,
            loading,
            nextCursor,
            hasMore,
            fetchItems,
            reset,
        }

    }
}
