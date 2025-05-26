<!-- <template>
    <div class="text-center text-[28px] mb-4 font-bold">Log in</div>

    <div class="px-6 pb-1.5 text-[15px]">Email address</div>

    <form @submit.prevent>
        <div class="px-6 pb-2">
            <TextInput placeholder="Email address" v-model:input="email" inputType="email" :autoFocus="true"
                :error="errors && errors.email ? errors.email[0] : ''" />
        </div>

        <div class="px-6 pb-2">
            <TextInput placeholder="Password" v-model:input="password" inputType="password" />
        </div>
        <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

        <div class="px-6 pb-2 mt-6">
            <button :disabled="(!email || !password)" :class="(!email || !password) ? 'bg-gray-200' : 'bg-[#F02C56]'"
                @click="login()" class="w-full text-[17px] font-semibold text-white py-3 rounded-sm">
                Log in
            </button>
        </div>
    </form>

</template>

<script setup>
const { $userStore, $generalStore, $profileStore } = useNuxtApp()

import axios from '../plugins/axios'
const $axios = axios().provide.axios

let email = ref(null)
let password = ref(null)
let errors = ref(null)

const login = async () => {
    errors.value = null

    try {
        await $userStore.getTokens()
        await $userStore.login(email.value, password.value)
        // await $userStore.getUser()
        await $profileStore.getProfile()
        await $generalStore.getRandomUsers('suggested')
        await $generalStore.getRandomUsers('following')
        $generalStore.isLoginOpen = false
    } catch (error) {
        errors.value = error.response.data.errors
    }
}
</script> -->


<template>
    <div class="text-center text-[28px] mb-4 font-bold">Log in</div>

    <form @submit.prevent="login">
        <!-- Email -->
        <div class="px-6 pb-1.5 text-[15px]">Email address</div>
        <div class="px-6 pb-2">
            <div class="relative">
                <input id="input-email" type="email" placeholder="Email address" :value="email" autocomplete="off"
                    autofocus @input="email = $event.target.value"
                    class="block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none" />
                <p v-if="errors?.email" class="text-red-500 text-sm mt-1">
                    {{ errors.email[0] }}
                </p>
            </div>
        </div>

        <!-- Password -->
        <div class="px-6 pb-2">
            <div class="relative">
                <input id="input-password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="Password"
                    :value="password" autocomplete="off" @input="password = $event.target.value"
                    class="block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none pr-16" />
                <button type="button" @click="isPasswordVisible = !isPasswordVisible"
                    class="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600 focus:outline-none">
                    {{ isPasswordVisible ? 'Hide' : 'Show' }}
                </button>
                <p v-if="errors?.password" class="text-red-500 text-sm mt-1">
                    {{ errors.password[0] }}
                </p>
            </div>
        </div>

        <!-- Forgot password -->
        <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

        <!-- Submit -->
        <div class="px-6 pb-2 mt-6">
            <button type="submit" :disabled="!email || !password"
                :class="(!email || !password) ? 'bg-gray-200' : 'bg-[#F02C56]'"
                class="w-full text-[17px] font-semibold text-white py-3 rounded-sm">
                Log in
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'
const { $userStore, $generalStore, $profileStore } = useNuxtApp()

import axios from '../plugins/axios'
const $axios = axios().provide.axios

const email = ref('')
const password = ref('')
const errors = ref(null)
const isPasswordVisible = ref(false)

const login = async () => {
    errors.value = null

    try {
        await $userStore.getTokens()
        await $userStore.login(email.value, password.value)
        // await $userStore.getUser() // if needed

        await $profileStore.getProfile(userId)
        await $generalStore.getRandomUsers('suggested')
        await $generalStore.getRandomUsers('following')

        $generalStore.isLoginOpen = false
    } catch (error) {
        errors.value = error.response?.data?.errors || { general: ['Login failed'] }
    }
}

</script>
