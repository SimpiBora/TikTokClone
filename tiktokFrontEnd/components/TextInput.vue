<!-- <template>
    <div>
        <input 
            :id="`input-${placeholder}`"
            :placeholder="placeholder"
            class="
                block
                w-full
                bg-[#F1F1F2]
                text-gray-800
                border
                border-gray-300
                rounded-md
                py-2.5
                px-3
                focus:outline-none
            " 
            :type="inputType"
            v-model="inputComputed"
            autocomplete="off"
            :maxlength="max"
        >
        <span v-if="error" class="text-red-500 text-[14px] font-semibold">
            {{ error }}
        </span>
    </div>
                    
</template>

<script setup>
    const emit = defineEmits(['update:input'])

    const props = defineProps(['input', 'placeholder', 'inputType', 'max', 'autoFocus', 'error'])
    const { input, placeholder, inputType, max, autoFocus, error } = toRefs(props)

    onMounted(() => {
        if (autoFocus.value) {
            document.getElementById(`input-${placeholder.value}`).focus()
        }
    })

    const inputComputed = computed({
        get: () => input.value,
        set: (val) => emit('update:input', val)
    })
</script> -->

<template>
    <div>
        <input :id="inputId" :placeholder="placeholder"
            class="block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"
            :type="inputType" v-model="inputComputed" autocomplete="off" :maxlength="max" />
        <span v-if="error" class="text-red-500 text-[14px] font-semibold">
            {{ error }}
        </span>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['update:input'])

const props = defineProps({
    input: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    inputType: { type: String, default: 'text' },
    max: { type: Number, default: 255 },
    autoFocus: { type: Boolean, default: false },
    error: { type: String, default: '' }
})

// Computed input binding
const inputComputed = computed({
    get: () => props.input,
    set: (val) => emit('update:input', val)
})

// Unique ID for input
const inputId = computed(() => `input-${props.placeholder.replace(/\s+/g, '-')}`)

// Autofocus logic
onMounted(() => {
    if (props.autoFocus) {
        const inputEl = document.getElementById(inputId.value)
        inputEl?.focus()
    }
})
</script>
