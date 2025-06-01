<!-- <template>
    <div class="w-full flex items-center hover:bg-gray-100 p-2.5 rounded-md">
        <div class="flex items-center lg:mx-0 mx-auto">
            <Icon :name="icon" :color="colorString" :size="sizeString" />
            <span 
                :class="`text-[${colorString}]`"
                class="lg:block hidden pl-[9px] mt-0.5 font-semibold text-[17px]"
            >
                {{ iconString }}
            </span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['iconString', 'colorString', 'sizeString'])
const { iconString, colorString, sizeString } = toRefs(props)

let icon = ref('')

if (iconString.value === 'For You') icon.value = 'mdi:home'
if (iconString.value === 'Following') icon.value = 'ci:group'
if (iconString.value === 'LIVE') icon.value = 'ri:live-line'
</script> -->


<template>
    <div class="w-full flex items-center hover:bg-gray-100 p-2.5 rounded-md">
        <div class="flex items-center lg:mx-0 mx-auto">
            <Icon :name="icon" :color="colorString" :size="sizeString" />
            <span :class="`text-[${colorString}]`" class="lg:block hidden pl-[9px] mt-0.5 font-semibold text-[17px]">
                {{ iconString }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    iconString: String,
    colorString: String,
    sizeString: String
})

const icon = computed(() => {
    if (props.iconString === 'For You') return 'mdi:home'
    if (props.iconString === 'Following') return 'ci:group'
    if (props.iconString === 'LIVE') return 'ri:live-line'
    return ''
})
</script>
