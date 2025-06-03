import { useUserStore } from "~/stores/user"

// export default defineNuxtRouteMiddleware((to, from) => {
//     const userStore = useUserStore()

//     if (to !== '/' && !userStore.id) {
//         return navigateTo('/')
//     }
// })


export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore()

    // Wait until Pinia state is hydrated (important if using pinia-plugin-persistedstate)
    if (process.client) {
        await nextTick()
    }
    // Fetch user data if not already available
    // if (!userStore.id) {
    //     await userStore.getUser()
    // }
    // // Check if the user is logged in
    if (userStore.id) {
        // User is logged in, you can perform actions for logged-in users
        console.log('User is logged in:', userStore.id)
    }

    // Now check if the user is not logged in
    if (!userStore.id && to.path !== '/') {
        return navigateTo('/')
    }
})
