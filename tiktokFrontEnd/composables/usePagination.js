// composables/usePagination.js
export function usePagination() {
    const page = ref(1)
    const pageSize = ref(10)
    const totalItems = ref(0)

    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

    const setPage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages.value) page.value = newPage
    }

    return {
        page,
        pageSize,
        totalItems,
        totalPages,
        setPage,
    }
}
