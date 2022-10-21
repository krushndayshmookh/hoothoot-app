<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Hoothoot </q-toolbar-title>

        <div>
          <q-btn
            flat
            dense
            round
            icon="lock"
            aria-label="sign out"
            @click="handleSignOut"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Links </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-powder">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const router = useRouter()

    const checkAuth = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        router.push('/auth')
      } else {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      // TODO: implement token validation
    }

    checkAuth()

    const handleSignOut = () => {
      localStorage.removeItem('token')
      api.defaults.headers.common['Authorization'] = null
      router.push('/auth')
    }

    const leftDrawerOpen = ref(false)
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      handleSignOut,
    }
  },
})
</script>
