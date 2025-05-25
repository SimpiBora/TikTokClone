// composables/useUser.ts
export const useLoggedInUser = async () => {
    const user = useState('user', () => null)

    try {
        const res = await $fetch('/api/loggedinuser/', {
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent
            headers: {
                'X-CSRFToken': useCookie('token').value || '', // fallback for SSR
            },
        })

        user.value = res
    } catch (err) {
        console.error('❌ Failed to fetch user:', err)
        user.value = null
    }

    return { user }
}
