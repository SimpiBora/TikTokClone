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
import { useRouter } from 'vue-router'

const { $userStore, $generalStore, $profileStore } = useNuxtApp()

const email = ref('')
const password = ref('')
const errors = ref(null)
const isPasswordVisible = ref(false)
const router = useRouter()

const login = async () => {
    errors.value = null
    try {
        console.log('💡 Starting login flow')

        await $userStore.getTokens()
        console.log('✅ CSRF token fetched')

        await $userStore.login(email.value, password.value)
        console.log('✅ User logged in')

        // }
        let userId = await $userStore.getUser()

        console.log('🧠 User ID:', userId)

        // await $userStore.login(email.value, password.value)

        // FIX: Make sure getUser() sets AND returns user data
        // await $userStore.getUser()

        // const userId = $userStore.id
        // console.log('🧠 User ID:', userId)

        // if (!userId) {
        //     console.warn('🔒 User ID is null. Login may have failed or user is not authenticated.')
        //     return
        // }


        const profileData = await $profileStore.getProfile(1)
        if (!profileData || !$profileStore.id) {
            console.warn('⚠️ Profile not loaded, cannot redirect')
            return
        }

        console.log('🔄 Redirecting to profile page:', $profileStore.id)
        router.push({ name: 'profile-id', params: { id: $profileStore.id } })

        console.log('🔐 Login modal closed')
        $generalStore.isLoginOpen = false

    } catch (error) {
        console.error('❌ Error during login flow:', error)
        errors.value = error.response?.data?.errors || { general: ['Login failed'] }
    }
}
</script>


<!-- <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { $userStore, $generalStore, $profileStore } = useNuxtApp()

const email = ref('')
const password = ref('')
const errors = ref(null)
const isPasswordVisible = ref(false)
const router = useRouter()

const login = async () => {
    errors.value = null
    try {
        console.log('💡 Starting login flow')

        await $userStore.getTokens()
        console.log('✅ CSRF token fetched')

        await $userStore.login(email.value, password.value)
        console.log('✅ User logged in')

        let userId = $userStore.id
        if (!userId) {
            const userData = await $userStore.getUser()
            if (!userData || !userData.id) {
                console.warn('🔒 User not authenticated')
                return
            }
            userId = userData.id
        }

        console.log('🧠 User ID:', userId)

        const profileData = await $profileStore.getProfile(userId)
        if (!profileData || !$profileStore.id) {
            console.warn('⚠️ Profile not loaded, cannot redirect')
            return
        }

        console.log('🔄 Redirecting to profile page:', $profileStore.id)
        router.push({ name: 'profile-id', params: { id: $profileStore.id } })

        console.log('🔐 Login modal closed')
        $generalStore.isLoginOpen = false

    } catch (error) {
        console.error('❌ Error during login flow:', error)
        errors.value = error.response?.data?.errors || { general: ['Login failed'] }
    }
}
</script> -->



<!-- 
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { $userStore, $generalStore, $profileStore } = useNuxtApp()

const email = ref('')
const password = ref('')
const errors = ref(null)
const isPasswordVisible = ref(false)
const router = useRouter()




const login = async () => {
    errors.value = null
    try {
        console.log('💡 Starting login flow')
        await $userStore.getTokens()
        console.log('✅ CSRF token fetched')

        await $userStore.login(email.value, password.value)
        console.log('✅ User logged in')

        // await $userStore.getUser()
        // await $profileStore.getProfile(1)
        // let userId = $userStore.id
        let { id: userId } = $userStore

    if (!userId) {
            const success = await $userStore.getUser()
            if (success) {
                userId = $userStore.id
            } else {
                console.warn('🔒 User not authenticated')
                return
            }
        }


        if (!userId) {
            console.warn('⚠️ Profile ID not found, cannot redirect')
            return
        } else {
            console.log('🔄 Redirecting to profile page', $profileStore.id)
            router.push({ name: 'profile-id', params: { id: $profileStore.id } })
        }

        console.log('🔄 Login modal closed')

        $generalStore.isLoginOpen = false

    } catch (error) {
        console.error('❌ Error during login flow:', error)
        errors.value = error.response?.data?.errors || { general: ['Login failed'] }
    }
}

</script> -->
