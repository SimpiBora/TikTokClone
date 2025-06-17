<template>
    <div class="p-4 max-w-[1150px] mx-auto">
        <h1 class="text-xl font-semibold mb-4">Search Results for "{{ route.query.q }}"</h1>
        <div v-if="loading">Loading...</div>
        <div v-else-if="results.length === 0">No accounts found.</div>
        <div v-else>
            <div v-for="user in results" :key="user.id" class="p-3 border-b">
                <NuxtLink :to="`/profile/${user.id}`" class="font-medium text-blue-500">
                    {{ user.username }}
                </NuxtLink>
                <p class="text-sm text-gray-500">{{ user.name }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const route = useRoute()

const results = ref([])
const loading = ref(true)

onMounted(async () => {
    const query = route.query.q
    if (!query) return

    try {
        const { data } = await useFetch(`/api/search?q=${encodeURIComponent(query)}`)
        results.value = data.value || []
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>
