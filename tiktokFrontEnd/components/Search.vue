<template>
    <div ref="searchBoxRef" class="relative hidden md:flex flex-col max-w-[380px] w-full">
        <div class="flex items-center bg-[#F1F1F2] p-1 rounded-full w-full">
            <input v-model="query" @input="handleInput" @keydown.enter.prevent="handleEnter"
                @keydown.down.prevent="moveDown" @keydown.up.prevent="moveUp" :placeholder="placeholder"
                class="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none" />

            <!-- Clear -->
            <button v-if="query && !loading" @click="clearSearch" class="text-gray-400 hover:text-gray-600 pr-2">
                <Icon name="ic:round-close" size="20" />
            </button>

            <!-- Search Icon -->
            <div class="px-3 py-1 flex items-center border-l border-l-gray-300 cursor-pointer"
                :class="query.trim() ? 'text-[#F02C56]' : 'text-[#A1A2A7]'" @click="handleSearch">
                <Icon v-if="!loading" name="ri:search-line" size="22" />
                <Icon v-else name="eos-icons:loading" size="22" class="animate-spin" />
            </div>
        </div>

        <!-- Suggestions -->
        <ul v-if="showDropdown"
            class="absolute top-full mt-1 w-full bg-white rounded-md shadow z-50 max-h-[250px] overflow-auto">
            <li v-if="!loading && results.length === 0 && searched" class="px-4 py-2 text-gray-500 text-sm">
                No users found.
            </li>

            <li v-for="(user, index) in results" :key="user.id" @click="goToProfile(user)" :class="[
                'flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm',
                index === highlightedIndex ? 'bg-gray-100' : ''
            ]">
                <img :src="user.image || '/default-avatar.png'" alt="avatar"
                    class="w-8 h-8 rounded-full mr-3 object-cover" />
                <div>
                    <div class="font-medium">{{ user.username }}</div>
                    <div class="text-xs text-gray-500">{{ user.name }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'

const props = defineProps({
    endpoint: String,
    placeholder: { type: String, default: 'Search accounts' },
})

const { $axios } = useNuxtApp()
const router = useRouter()

const query = ref('')
const results = ref([])
const loading = ref(false)
const searched = ref(false)
const showDropdown = ref(false)
const highlightedIndex = ref(-1)
const searchBoxRef = ref(null)

const handleInput = debounce(async () => {
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
        const res = await $axios.get(props.endpoint, {
            params: { q: trimmed }
        })
        results.value = res.data
    } catch (err) {
        console.error('Search error:', err)
        results.value = []
    } finally {
        loading.value = false
    }
}, 300)

const handleEnter = () => {
    if (highlightedIndex.value >= 0) {
        goToProfile(results.value[highlightedIndex.value])
    } else if (results.value.length === 1) {
        goToProfile(results.value[0])
    }
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

const clearSearch = () => {
    query.value = ''
    results.value = []
    showDropdown.value = false
    searched.value = false
    highlightedIndex.value = -1
}

const goToProfile = (user) => {
    clearSearch()
    router.push(`/profile/${user.id}`)
}

const handleClickOutside = (event) => {
    if (!searchBoxRef.value?.contains(event.target)) {
        showDropdown.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>
