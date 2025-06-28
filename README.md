need to merge ( features/accounts with features/profile ) 
  git checkout features/accounts  
    git merge features/profile

## 1. uv venv

## 2. install all requirements.txt data
uv pip install -r requirements.txt 

## To Install From an Existing pyproject.toml
uv pip install -r pyproject.toml

## python manage.py makemigrations
python manage.py makemigrations accounts like
python manage.py migrate

## python manage.py migrate
python manage.py migrate

## python manage.py createsuperuser
python manage.py createsuperuser
admin@gmail.com
admin
admin

## all in one
python manage.py makemigrations accounts like comments postsapi core
python manage.py migrate
python manage.py createsuperuser
Email: admin1@gmail.com
Username: admin1
Password: admin1
Password (again): admin1

## generate fake posts with videos
python manage.py generate_posts

## generate fake user with videos
python manage.py generate_users

## generate fake user with videos
python manage.py generate_likes

<!-- I CREATE MODELS
ACCOUNTS ( FOR USER LOGIN REGISTER LIKE WORK )
LIKE
COMMENTS

I CREATE MODELS
ACCOUNTS ( FOR USER LOGIN REGISTER LIKE WORK )
LIKE
COMMENTS  I MEAN BACKEND IS SOMETHING DONE, BUT I DO NOT KNOW HOW TO GO WITH frontend nuxt3, i wanna use pages, plugins, stores, middlewares, layouts, components, how to start what should i put inside and how and what exectly -->
# Nuxt 3 Frontend Structure for TikTok Clone (with DRF Backend)

This guide explains how to organize and build a full-stack TikTok clone using Django REST Framework (backend) and Nuxt 3 (frontend).

---

## ✅ 1. `pages/` – Your Routes

Nuxt 3 uses file system routing. Create the following pages:

```
pages/
├── index.vue              // Feed Page (Video scroll)
├── login.vue              // Login page
├── register.vue           // Register page
├── upload.vue             // Upload video
├── profile/
│   └── [id].vue           // User profile page
```

### Example: `pages/index.vue`

```vue
<template>
  <div>
    <VideoCard v-for="video in videos" :key="video.id" :video="video" />
  </div>
</template>

<script setup>
const { data: videos } = await useFetch('/api/videos')
</script>
```

---

## ✅ 2. `components/` – Reusable UI Parts

Organize components like this:

```
components/
├── VideoCard.vue
├── LikeButton.vue
├── CommentList.vue
├── UploadForm.vue
├── AuthForm.vue
```

---

## ✅ 3. `plugins/` – Reusable Libraries

Example: Register Axios globally

`plugins/axios.ts`

```ts
export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const axios = $fetch.create({
    baseURL: config.public.apiBase
  })
  nuxtApp.provide('axios', axios)
})
```

Update `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api'
    }
  }
})
```

Usage:

```ts
const { $axios } = useNuxtApp()
await $axios('/videos')
```

---

## ✅ 4. `stores/` – Authentication & User Store

Using Pinia:

```ts
// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  actions: {
    async login(payload) {
      const res = await $fetch('/api/token/', {
        method: 'POST',
        body: payload
      })
      this.token = res.access
      localStorage.setItem('token', res.access)
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
```

---

## ✅ 5. `middlewares/` – Route Protection

```ts
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.token && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }
})
```

---

## ✅ 6. `layouts/` – Shared UI Templates

```
layouts/
├── default.vue       // Navbar, footer, etc.
├── auth.vue          // For login/register
```

Example: `layouts/default.vue`

```vue
<template>
  <div>
    <Navbar />
    <slot />
  </div>
</template>
```

Use in a page:

```ts
definePageMeta({
  layout: 'default'
})
```

---

## ✅ 7. `.env` – Backend URL

`.env`

```
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

Access with:

```ts
useRuntimeConfig().public.apiBase
```

---

## ✅ Suggested Build Flow

1. Create `store/auth.ts`
2. Build `login.vue` and `register.vue`
3. Setup global middleware
4. Build `/feed` page with scroll + `VideoCard.vue`
5. Add `LikeButton.vue` & `CommentList.vue`
6. Build `UploadForm.vue` and `/upload.vue`
7. Build `/profile/[id].vue` to show user videos

---

## ✅ Optional (but important)

* Use `useLazyFetch()` for interaction-based loading
* Add Tailwind CSS for styling
* Use composables if logic is reused

---

This setup is modular, scalable, and aligned with Nuxt 3 best practices to connect with your DRF API backend effectively.



# 1. Switch to master branch
git checkout master

# 2. Replace master content with features
git reset --hard features

# 3. Push the changes to remote (forcefully)
git push origin master --force

# 1. Switch to master branch
git checkout master

# 2. Merge the features branch into master
git merge features

# 3. Push the changes
git push origin master
