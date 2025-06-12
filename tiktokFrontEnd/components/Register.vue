<template>
    <form @submit.prevent="register">
        <div class="text-center text-[28px] mb-4 font-bold">Sign up</div>

        <div class="px-6 pb-2">
            <TextInput placeholder="Full name" v-model:input="name" inputType="text" :autoFocus="true"
                :error="errors?.name?.[0] || ''" />
        </div>

        <div class="px-6 pb-2">
            <TextInput placeholder="Full username" v-model:input="username" inputType="text" :autoFocus="true"
                :error="errors?.username?.[0] || ''" />
        </div>

        <div class="px-6 pb-2">
            <TextInput placeholder="Email address" v-model:input="email" inputType="email"
                :error="errors?.email?.[0] || ''" />
        </div>

        <div class="px-6 pb-2">
            <TextInput placeholder="Password" v-model:input="password" inputType="password"
                :error="errors?.password?.[0] || ''" />
        </div>

        <div class="px-6 pb-2">
            <TextInput placeholder="Confirm password" v-model:input="confirmPassword" inputType="password"
                :error="errors?.confirmPassword?.[0] || ''" />
        </div>

        <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

        <div class="px-6 pb-2 mt-6">
            <button type="submit" :disabled="!name || !username || !email || !password || !confirmPassword"
                :class="!name || !username || !email || !password || !confirmPassword ? 'bg-gray-200' : 'bg-[#F02C56]'"
                class="w-full text-[17px] font-semibold text-white py-3 rounded-sm">
                Sign up
            </button>
        </div>
    </form>
    <div>
        <div v-if="errors?.general" class="px-6">
            <p class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative">
                {{ errors.general[0] }}
            </p>
        </div>
        <div v-if="status?.value === '201'" class="px-6">
            <p class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative">
                {{ status.value }}
            </p>
        </div>


    </div>

</template>


<script setup>
const { $userStore, $generalStore } = useNuxtApp()

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref(null)
const status = ref(null)

const register = async () => {
    errors.value = null
    status.value = false

    // made me 
    if (password.value !== confirmPassword.value) {
        errors.value = { confirmPassword: ['Passwords do not match'] }
        return
    }
    if (status.value === '201') {
        return 'registration successful !!'
    }

    try {
        await $userStore.getTokens()
        await $userStore.register(
            // name.value, take is as a optional
            name.value || '',
            username.value,
            email.value,
            password.value,
            confirmPassword.value
        )
        // await $userStore.login(email.value, password.value)
        // await $userStore.getUser()
        // await $generalStore.getRandomUsers('suggested')
        // await $generalStore.getRandomUsers('following')
        console.log('registration successful');
        $generalStore.isLoginOpen = false
        // $generalStore.isLoginOpen = true
    } catch (error) {
        console.error(error)
        errors.value = error.response?.data?.errors || { general: ['Registration failed'] }
    }
    return errors.value
}
</script>
