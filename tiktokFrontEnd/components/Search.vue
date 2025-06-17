<template>
    <div class="flex items-center bg-[#F1F1F2] p-1 rounded-full max-w-[380px] w-full">
        <input v-model="searchQuery" @keydown.enter="performSearch" type="text"
            class="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
            placeholder="Search accounts" />
        <div class="px-3 py-1 flex items-center border-l border-l-gray-300 cursor-pointer" @click="performSearch">
            <Icon name="ri:search-line" color="#A1A2A7" size="22" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const router = useRouter()
const searchQuery = ref('')

// defineProps({
//     placeholder: {
//         type: String,
//         default: 'Search accounts'
//     }
// })


const performSearch = () => {
    if (!searchQuery.value.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
}
</script>
