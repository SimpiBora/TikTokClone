// stores/utils/observer.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useObserver(callback, options = {}) {
    const target = ref(null)
    let observer = null
    console.log('observer options:', options)

    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6,
        ...options
    }

    const start = () => {
        if (!target.value || typeof IntersectionObserver === 'undefined') return

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) callback(entry)
            })
        }, defaultOptions)

        observer.observe(target.value)
    }

    const stop = () => {
        if (observer && target.value) observer.unobserve(target.value)
        observer = null
    }

    onMounted(start)
    onUnmounted(stop)

    return {
        target,
        start,
        stop,
    }
}
