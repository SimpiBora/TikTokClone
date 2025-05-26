<!-- <template>
    <div class="text-center text-[28px] mb-4 font-bold">Log in</div>

    <div class="px-6 pb-1.5 text-[15px]">Email address</div>

    <form @submit.prevent>
        <div class="px-6 pb-2">
            <TextInput placeholder="Email address" v-model:input="email" inputType="email" :autoFocus="true"
                :error="errors && errors.email ? errors.email[0] : ''" />
        </div>
    <div class="px-6 pb-2">
        <TextInput placeholder="Email address" v-model:input="email" inputType="email" :autoFocus="true"
            :error="errors && errors.email ? errors.email[0] : ''" />
    </div>

        <div class="px-6 pb-2">
            <TextInput placeholder="Password" v-model:input="password" inputType="password" />
        </div>
        <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>
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

    <div class="px-6 pb-2 mt-6">
        <button :disabled="(!email || !password)" :class="(!email || !password) ? 'bg-gray-200' : 'bg-[#F02C56]'"
            @click="login()" class="w-full text-[17px] font-semibold text-white py-3 rounded-sm">
            Log in
        </button>
    </div>
</template>

<script setup>
const { $userStore, $generalStore, $profileStore } = useNuxtApp()

import axios from '../plugins/axios'
const $axios = axios().provide.axios
const { $userStore, $generalStore, $profileStore } = useNuxtApp()

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

        // redirect me to profile page
        // $router.push(`/api/profile/${userid}`)
        $profileStore.profile = null // reset profile
        $profileStore.isProfileLoading = true
        await $profileStore.getProfile(1)


        await $userStore.getUser()
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
    console.log('💡 Starting login flow')
    errors.value = null

    try {
        console.log('🔄 1) Fetching CSRF token...')
        const tokenRes = await $userStore.getTokens()
        console.log('✅ CSRF token fetched:', tokenRes)

        console.log('🔄 2) Logging in with', { email: email.value, password: '••••••' })
        const loginRes = await $userStore.login(email.value, password.value)
        console.log('✅ Login response:', loginRes)

        // console.log('🔄 3) Fetching initial profile (no ID passed)...')
        // const initialProfile = await $profileStore.getProfile()
        // console.log('✅ Initial profile result:', initialProfile)

        console.log('🔄 Resetting profile state and setting loading flag')
        $profileStore.profile = null
        $profileStore.isProfileLoading = true

        console.log('🔄 4) Fetching profile for user ID=1 (hardcoded)')
        // error is her 
        // This should be replaced with the actual user ID after login
        await $userStore.getUser() // Ensure user data is fetched first
        console.log('🔄 Fetching profile for user ID=1')
        await $profileStore.getProfile(1) // Assuming user ID 1 for testing
        console.log('✅ Profile data fetched successfully')
        // const profile1 = await $profileStore.getProfile(1)
        // console.log('✅ Profile data for ID=1:', profile1)

        console.log('🔄 5) Fetching suggested users')
        const suggested = await $generalStore.getRandomUsers('suggested')
        console.log('✅ Suggested users:', suggested)

        console.log('🔄 6) Fetching following users')
        const following = await $generalStore.getRandomUsers('following')
        console.log('✅ Following users:', following)

        console.log('🔄 7) Closing login modal')
        $generalStore.isLoginOpen = false

        console.log('🎉 Login flow completed successfully')
        // ✅ REDIRECT TO PROFILE PAGE
        const router = useRouter()
        // router.push(`/api/profile/${$profileStore.id}`)
        // i wanna do redirect with nuxt3 redirect wiht name view
        router.push({ name: 'profile-id', params: { id: $profileStore.id } }) // Redirect to profile with actual ID
        // router.push({ name: 'profile-id', params: { id: 1 } }) // Redirect to profile with hardcoded ID for now
        console.log('🔄 Redirecting to profile page', $profileStore.id)
    }
    catch (error) {
        console.error('❌ Error during login flow:', error)
        errors.value = error.response?.data?.errors || { general: ['Login failed'] }
    }
}


</script>
