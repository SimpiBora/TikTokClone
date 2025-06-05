import { useUserStore } from "~/stores/user"

// middleware/auth.global.ts or auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore()

    // ⚠️ If no user loaded yet, try to fetch it
    if (!userStore.id) {
        const success = await userStore.getUser()
        if (!success && to.path !== '/account/login') {
            return navigateTo('/')
        }
    }
})
